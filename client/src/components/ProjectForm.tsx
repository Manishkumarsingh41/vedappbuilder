import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "./GlassCard";
import { Rocket, Key } from "lucide-react";
import { useState } from "react";

const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  openaiApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  perplexityApiKey: z.string().optional(),
}).refine(
  (data) => {
    // At least one API key must be provided
    return !!(data.openaiApiKey || data.geminiApiKey || data.perplexityApiKey);
  },
  {
    message: "At least one API key is required to run the AI agents",
    path: ["openaiApiKey"], // Show error on first field
  }
);

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormValues) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [showApiKeys, setShowApiKeys] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      requirements: "",
      openaiApiKey: "",
      geminiApiKey: "",
      perplexityApiKey: "",
    },
  });

  return (
    <GlassCard className="p-8" glow data-testid="project-form">
      <div className="mb-6">
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-2">Start New Project</h2>
        <p className="text-muted-foreground">Describe your app idea and let AI agents build it for you</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Task Manager Pro" 
                    {...field} 
                    data-testid="input-project-name"
                    className="bg-accent/30 border-accent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What does your app do? Who is it for?"
                    className="resize-none h-24 bg-accent/30 border-accent"
                    {...field}
                    data-testid="input-project-description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List the main features and functionality you need..."
                    className="resize-none h-32 bg-accent/30 border-accent"
                    {...field}
                    data-testid="input-project-requirements"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t border-accent/50 pt-6 mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 mb-4"
              onClick={() => setShowApiKeys(!showApiKeys)}
            >
              <Key size={18} />
              {showApiKeys ? "Hide" : "Show"} API Keys Configuration
            </Button>

            {showApiKeys && (
              <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-accent/50">
                <div className="text-sm text-muted-foreground mb-4">
                  <p className="font-semibold mb-2">Configure your API keys to enable AI agents:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>OpenAI API Key</strong> - Powers Ollie (Frontend), Hugo (Backend), and Ava (PM)</li>
                    <li><strong>Gemini API Key</strong> - Powers Gemma (UI/UX), Milo (DevOps), and Gemma QA</li>
                    <li><strong>Perplexity API Key</strong> - Powers Perry (Product Manager)</li>
                  </ul>
                  <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    ⚠️ Your API keys are sent directly to the agents and are not stored on our servers.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="openaiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenAI API Key (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="sk-proj-..."
                          {...field}
                          className="bg-accent/30 border-accent font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="geminiApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemini API Key (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="AIza..."
                          {...field}
                          className="bg-accent/30 border-accent font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Get your key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perplexityApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perplexity API Key (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="pplx-..."
                          {...field}
                          className="bg-accent/30 border-accent font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Get your key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Perplexity Settings</a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2" 
            size="lg"
            data-testid="button-start-build"
          >
            <Rocket size={20} />
            Start Building with AI
          </Button>
        </form>
      </Form>
    </GlassCard>
  );
}
