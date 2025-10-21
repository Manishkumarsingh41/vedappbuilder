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
      
      // Extract API keys from request (not stored in DB)
      const { openaiApiKey, geminiApiKey, perplexityApiKey, ...projectData } = validatedData;
      
      const project = await storage.createProject(projectData);
      
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
            
            // Call the agent with user-provided API keys
            const response = await callAgent(config.name, projectPrompt, context, {
              openaiApiKey,
              geminiApiKey,
              perplexityApiKey,
            });
            
            // Update to completed with actual message
            await storage.createAgentMessage({
              projectId: project.id,
              agentName: config.name,
              agentRole: config.role,
              message: response,
              status: "complete"
            });
            
            context += `\n\n${config.name} (${config.role}):\n${response}`;
            
            // Delay between agents to avoid rate limits (increased from 500ms to 1500ms)
            await new Promise(resolve => setTimeout(resolve, 1500));
          } catch (error) {
            console.error(`Error with agent ${config.name}:`, error);
            
            // Create user-friendly error message
            let errorMessage = 'Unknown error occurred';
            if (error instanceof Error) {
              if (error.message.includes('API key not provided')) {
                errorMessage = `❌ ${config.model.charAt(0).toUpperCase() + config.model.slice(1)} API key is required for this agent. Please provide it in the form.`;
              } else if (error.message.includes('rate limit') || error.message.includes('429')) {
                errorMessage = `⏳ Rate limit reached. Please wait a moment and try again.`;
              } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
                errorMessage = `🔑 Invalid API key. Please check your ${config.model} API key.`;
              } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = `🌐 Network error. Please check your internet connection.`;
              } else {
                errorMessage = `Error: ${error.message}`;
              }
            }
            
            // Store error state
            await storage.createAgentMessage({
              projectId: project.id,
              agentName: config.name,
              agentRole: config.role,
              message: errorMessage,
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

  // Add user instruction to project (mid-workflow)
  app.post("/api/projects/:id/instructions", async (req, res) => {
    try {
      const { instruction } = req.body;
      if (!instruction) {
        return res.status(400).json({ error: "Instruction is required" });
      }

      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Store the instruction
      const projectInstruction = await storage.createProjectInstruction({
        projectId: req.params.id,
        instruction,
        status: "pending",
      });

      res.json({ success: true, instruction: projectInstruction });

      // Process instruction in background with agents
      (async () => {
        const { agentConfigs, callAgent } = await import("./agents");
        
        // Get existing messages for context
        const existingMessages = await storage.getAgentMessages(req.params.id);
        let context = existingMessages
          .filter((m: any) => m.status === "complete")
          .map((m: any) => `${m.agentName} (${m.agentRole}): ${m.message}`)
          .join("\n\n");

        const modificationPrompt = `
Previous work context:
${context}

NEW USER INSTRUCTION:
${instruction}

Please analyze this new instruction and provide an updated implementation that incorporates the requested changes.
`;

        // Run relevant agents based on the instruction
        // For simplicity, we'll run all agents, but in production you could
        // intelligently select which agents to run based on the instruction
        for (const config of agentConfigs) {
          try {
            await storage.createAgentMessage({
              projectId: req.params.id,
              agentName: config.name,
              agentRole: config.role,
              message: "Processing your new instruction...",
              status: "working"
            });

            const response = await callAgent(config.name, modificationPrompt, context, {
              // Use API keys from .env as fallback
            });

            await storage.createAgentMessage({
              projectId: req.params.id,
              agentName: config.name,
              agentRole: config.role,
              message: response,
              status: "complete"
            });

            context += `\n\n${config.name} (${config.role}):\n${response}`;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
          } catch (error) {
            console.error(`Error with agent ${config.name}:`, error);
            await storage.createAgentMessage({
              projectId: req.params.id,
              agentName: config.name,
              agentRole: config.role,
              message: `Error processing instruction: ${error instanceof Error ? error.message : 'Unknown error'}`,
              status: "error"
            });
          }
        }

        // Update instruction status
        await storage.updateProjectInstruction(projectInstruction.id, {
          status: "complete",
          response: "Agents have processed your instruction. Check the updated outputs above."
        });
      })();

    } catch (error) {
      console.error("Instruction error:", error);
      res.status(500).json({ error: "Failed to process instruction" });
    }
  });

  // Get project instructions
  app.get("/api/projects/:id/instructions", async (req, res) => {
    try {
      const instructions = await storage.getProjectInstructions(req.params.id);
      res.json(instructions);
    } catch (error) {
      console.error("Get instructions error:", error);
      res.status(500).json({ error: "Failed to get instructions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
