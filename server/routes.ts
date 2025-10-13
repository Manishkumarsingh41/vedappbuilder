import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertAgentMessageSchema } from "@shared/schema";
import { orchestrateAgents } from "./agents";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
