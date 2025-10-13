import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ParticleBackground from "@/components/ParticleBackground";
import ProjectForm from "@/components/ProjectForm";
import AgentCard from "@/components/AgentCard";
import WorkflowTimeline from "@/components/WorkflowTimeline";
import CodeDisplay from "@/components/CodeDisplay";
import CountdownTimer from "@/components/CountdownTimer";
import ProjectHistory from "@/components/ProjectHistory";
import GitHubPushDialog from "@/components/GitHubPushDialog";
import { agents, type Project } from "@shared/schema";
import { Sparkles, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ProjectFormData = {
  name: string;
  description: string;
  requirements: string;
};

export default function Home() {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ["/api/projects", currentProjectId, "messages"],
    enabled: !!currentProjectId,
    refetchInterval: currentProjectId ? 2000 : false,
  });

  const { data: currentProject } = useQuery<Project>({
    queryKey: ["/api/projects", currentProjectId],
    enabled: !!currentProjectId,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create project");
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentProjectId(data.project.id);
      toast({
        title: "Project Created!",
        description: "AI agents are now working on your project...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProjectSubmit = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  const handleBackToProjects = () => {
    setCurrentProjectId(null);
  };

  const handleDownloadProject = () => {
    if (!currentProjectId) return;
    window.location.href = `/api/projects/${currentProjectId}/download`;
    toast({
      title: "Downloading Project",
      description: "Your project files are being downloaded...",
    });
  };

  // Calculate workflow steps based on messages
  const workflowSteps = agents.map((agent, idx) => {
    const agentMessages = messages.filter((m: any) => m.agentName === agent.name);
    const latestMessage = agentMessages[agentMessages.length - 1];
    
    let status: "pending" | "active" | "complete" = "pending";
    if (latestMessage) {
      if (latestMessage.status === "complete") status = "complete";
      else if (latestMessage.status === "working") status = "active";
    }
    
    return {
      id: idx + 1,
      title: agent.role,
      description: `${agent.name} ${agent.role === "Product Manager" ? "analyzes requirements" : agent.role === "UI/UX Designer" ? "creates design" : agent.role === "Frontend Developer" ? "builds frontend" : agent.role === "Backend Developer" ? "creates backend" : agent.role === "DevOps Engineer" ? "handles deployment" : agent.role === "QA Tester" ? "tests quality" : "coordinates delivery"}`,
      status,
      agent: agent.name,
    };
  });

  // Extract code from messages for display (only completed messages)
  const completedMessages = messages.filter((m: any) => m.status === "complete");
  const codeMessages = completedMessages.filter((m: any) => 
    m.message.includes("```") || m.message.includes("function") || m.message.includes("const")
  );
  const latestCode = codeMessages.length > 0 ? codeMessages[codeMessages.length - 1] : null;

  const extractCodeFromMessage = (message: string) => {
    const codeBlockMatch = message.match(/```[\w]*\n([\s\S]*?)```/);
    if (codeBlockMatch) return codeBlockMatch[1];
    
    // Simple heuristic: if message contains function/const/import, treat as code
    if (message.includes("function") || message.includes("const") || message.includes("import")) {
      return message;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        {!currentProjectId ? (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Powered by Multi-Agent AI</span>
                </div>
                <h1 className="text-6xl font-bold mb-4 font-['Space_Grotesk'] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  VedAppBuilder
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform your ideas into production-ready apps with our futuristic multi-agent AI system
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <ProjectForm onSubmit={handleProjectSubmit} />
                
                <div className="space-y-6">
                  <ProjectHistory onSelectProject={setCurrentProjectId} />
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 font-['Space_Grotesk'] flex items-center gap-2">
                      <Zap className="text-primary" size={20} />
                      How It Works
                    </h3>
                    <ol className="space-y-3">
                      {["Perry analyzes your requirements", "Gemma designs the UI/UX", "Ollie builds the frontend", "Hugo creates the backend", "Milo deploys your app", "Gemma QA ensures quality", "Ava delivers your MVP"].map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handleBackToProjects}
                data-testid="button-back"
              >
                ← Back to Projects
              </Button>
              <div className="flex gap-3">
                <Button 
                  onClick={handleDownloadProject}
                  className="gap-2"
                >
                  <Download size={18} />
                  Download Code
                </Button>
                {currentProject && (
                  <GitHubPushDialog projectName={currentProject.name} />
                )}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2 font-['Space_Grotesk']">Building Your App</h2>
              <p className="text-muted-foreground">Watch AI agents collaborate in real-time</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {agents.slice(0, 3).map((agent) => {
                const agentMessages = messages.filter((m: any) => m.agentName === agent.name);
                const latestMessage = agentMessages[agentMessages.length - 1];
                const completedMessage = agentMessages.find((m: any) => m.status === "complete");
                
                let status: "idle" | "working" | "complete" = "idle";
                if (completedMessage) status = "complete";
                else if (latestMessage?.status === "working") status = "working";
                
                return (
                  <AgentCard
                    key={agent.name}
                    name={agent.name}
                    role={agent.role}
                    model={agent.model}
                    color={agent.color}
                    status={status}
                    tasks={[
                      `Analyzing project requirements`,
                      `Generating ${agent.role.toLowerCase()} output`
                    ]}
                    output={completedMessage ? completedMessage.message.substring(0, 150) + "..." : undefined}
                  />
                );
              })}
            </div>

            <div className="mb-8">
              <CountdownTimer duration={300} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk']">Workflow Progress</h3>
                <WorkflowTimeline steps={workflowSteps as any} />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk']">Agent Outputs</h3>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
                      <p className="text-muted-foreground text-center">Agents are starting work...</p>
                    </div>
                  ) : latestCode && extractCodeFromMessage(latestCode.message) ? (
                    <CodeDisplay
                      code={extractCodeFromMessage(latestCode.message) || ""}
                      language="TypeScript"
                      fileName={`${latestCode.agentName}_output.tsx`}
                    />
                  ) : (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 max-h-96 overflow-y-auto">
                      {completedMessages.slice(-3).map((msg: any, idx: number) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <p className="text-sm font-medium text-primary mb-1">{msg.agentName}</p>
                          <p className="text-sm text-foreground/80">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
