import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertAgentMessageSchema } from "@shared/schema";
import { orchestrateAgents } from "./agents";
import { z } from "zod";
import archiver from "archiver";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new project and start agent workflow
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      res.json({ success: true, project });
      
      // Start agent orchestration in background with incremental updates
      const projectPrompt = `Project: ${validatedData.name}\n\nDescription: ${validatedData.description}\n\nRequirements: ${validatedData.requirements}`;
      
      (async () => {
        const { agentConfigs, callAgent } = await import("./agents");
        let context = "";
        
        for (const config of agentConfigs) {
          try {
            // Mark agent as working
            await storage.createAgentMessage({
              projectId: project.id,
              agentName: config.name,
              agentRole: config.role,
              message: "Working...",
              status: "working"
            });
            
            // Call the agent
            const response = await callAgent(config.name, projectPrompt, context);
            
            // Update to completed with actual message
            await storage.createAgentMessage({
              projectId: project.id,
              agentName: config.name,
              agentRole: config.role,
              message: response,
              status: "complete"
            });
            
            context += `\n\n${config.name} (${config.role}):\n${response}`;
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error with agent ${config.name}:`, error);
            // Store error state
            await storage.createAgentMessage({
              projectId: project.id,
              agentName: config.name,
              agentRole: config.role,
              message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              status: "error"
            });
          }
        }
      })();
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Project creation error:", error);
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get all projects error:", error);
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  // Get agent messages for a project
  app.get("/api/projects/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getAgentMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  // Download project code as zip
  app.get("/api/projects/:id/download", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const messages = await storage.getAgentMessages(req.params.id);
      
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      // Set up error handler BEFORE piping
      archive.on('error', (err) => {
        console.error("Archive error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to create archive" });
        } else {
          res.end();
        }
      });

      // Set up finish handler to ensure stream closes properly
      archive.on('end', () => {
        console.log('Archive finalized');
      });

      // Set headers and pipe AFTER error handlers are set
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_')}_code.zip"`);
      
      archive.pipe(res);

      // Add project README
      const readmeContent = `# ${project.name}\n\n${project.description}\n\n## Requirements\n${project.requirements}\n\n## Tech Stack\n${project.techStack || 'Not specified'}\n\n## Generated by VedAppBuilder\nThis project was generated using multi-agent AI system.\n`;
      archive.append(readmeContent, { name: 'README.md' });

      // Add agent outputs
      const completedMessages = messages.filter(m => m.status === 'complete');
      completedMessages.forEach((msg, idx) => {
        const fileName = `agent_outputs/${msg.agentRole.replace(/[^a-z0-9]/gi, '_')}_${msg.agentName}.md`;
        const content = `# ${msg.agentName} - ${msg.agentRole}\n\n${msg.message}\n`;
        archive.append(content, { name: fileName });
      });

      // Extract code blocks from messages and save them
      completedMessages.forEach((msg) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let codeBlockIndex = 0;
        
        while ((match = codeBlockRegex.exec(msg.message)) !== null) {
          const language = match[1] || 'txt';
          const code = match[2];
          const ext = language === 'typescript' || language === 'ts' ? 'ts' : 
                     language === 'javascript' || language === 'js' ? 'js' :
                     language === 'python' ? 'py' :
                     language === 'html' ? 'html' :
                     language === 'css' ? 'css' : 'txt';
          
          const fileName = `code/${msg.agentRole.replace(/[^a-z0-9]/gi, '_')}_${codeBlockIndex}.${ext}`;
          archive.append(code, { name: fileName });
          codeBlockIndex++;
        }
      });

      await archive.finalize();
    } catch (error) {
      console.error("Download error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download project" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
