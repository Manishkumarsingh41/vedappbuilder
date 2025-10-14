import { type Project, type InsertProject, type AgentMessage, type InsertAgentMessage, type ProjectInstruction, type InsertProjectInstruction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  getAgentMessages(projectId: string): Promise<AgentMessage[]>;
  createAgentMessage(message: InsertAgentMessage): Promise<AgentMessage>;
  getProjectInstructions(projectId: string): Promise<ProjectInstruction[]>;
  createProjectInstruction(instruction: InsertProjectInstruction): Promise<ProjectInstruction>;
  updateProjectInstruction(id: string, updates: Partial<ProjectInstruction>): Promise<ProjectInstruction | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private messages: Map<string, AgentMessage>;
  private instructions: Map<string, ProjectInstruction>;

  constructor() {
    this.projects = new Map();
    this.messages = new Map();
    this.instructions = new Map();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject,
      techStack: insertProject.techStack ?? null,
      status: insertProject.status || "pending",
      id,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async getAgentMessages(projectId: string): Promise<AgentMessage[]> {
    return Array.from(this.messages.values()).filter(
      (msg) => msg.projectId === projectId
    );
  }

  async createAgentMessage(insertMessage: InsertAgentMessage): Promise<AgentMessage> {
    const id = randomUUID();
    const message: AgentMessage = {
      ...insertMessage,
      status: insertMessage.status || "pending",
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getProjectInstructions(projectId: string): Promise<ProjectInstruction[]> {
    return Array.from(this.instructions.values())
      .filter((inst) => inst.projectId === projectId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createProjectInstruction(insertInstruction: InsertProjectInstruction): Promise<ProjectInstruction> {
    const id = randomUUID();
    const instruction: ProjectInstruction = {
      ...insertInstruction,
      response: insertInstruction.response ?? null,
      status: insertInstruction.status || "pending",
      id,
      createdAt: new Date()
    };
    this.instructions.set(id, instruction);
    return instruction;
  }

  async updateProjectInstruction(id: string, updates: Partial<ProjectInstruction>): Promise<ProjectInstruction | undefined> {
    const instruction = this.instructions.get(id);
    if (!instruction) return undefined;
    
    const updated = { ...instruction, ...updates };
    this.instructions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
