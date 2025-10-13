import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "./GlassCard";
import { Rocket } from "lucide-react";

const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormValues) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      requirements: "",
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
