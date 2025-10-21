import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  techStack: text("tech_stack"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentMessages = pgTable("agent_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  agentName: varchar("agent_name", { length: 50 }).notNull(),
  agentRole: varchar("agent_role", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectInstructions = pgTable("project_instructions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  instruction: text("instruction").notNull(),
  response: text("response"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).extend({
  // API keys provided by user (not stored in DB)
  openaiApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  perplexityApiKey: z.string().optional(),
});

export const insertAgentMessageSchema = createInsertSchema(agentMessages).omit({
  id: true,
  createdAt: true,
});

export const insertProjectInstructionSchema = createInsertSchema(projectInstructions).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertAgentMessage = z.infer<typeof insertAgentMessageSchema>;
export type AgentMessage = typeof agentMessages.$inferSelect;
export type InsertProjectInstruction = z.infer<typeof insertProjectInstructionSchema>;
export type ProjectInstruction = typeof projectInstructions.$inferSelect;

export const agents = [
  { name: "Perry", role: "Product Manager", model: "Perplexity", color: "200 80% 55%" },
  { name: "Gemma", role: "UI/UX Designer", model: "Gemini", color: "280 75% 60%" },
  { name: "Ollie", role: "Frontend Developer", model: "OpenAI", color: "340 85% 55%" },
  { name: "Hugo", role: "Backend Developer", model: "OpenAI", color: "120 70% 50%" },
  { name: "Milo", role: "DevOps Engineer", model: "Gemini", color: "30 90% 55%" },
  { name: "Gemma QA", role: "QA Tester", model: "Gemini", color: "260 80% 60%" },
  { name: "Ava", role: "Project Manager", model: "OpenAI", color: "180 100% 50%" },
] as const;
