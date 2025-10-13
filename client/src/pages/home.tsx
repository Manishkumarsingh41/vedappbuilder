import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import ProjectForm from "@/components/ProjectForm";
import AgentCard from "@/components/AgentCard";
import WorkflowTimeline from "@/components/WorkflowTimeline";
import CodeDisplay from "@/components/CodeDisplay";
import { agents } from "@shared/schema";
import { Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [projectStarted, setProjectStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Mock workflow steps
  const workflowSteps = [
    { id: 1, title: "Product Definition", description: "Perry analyzes requirements and defines MVP scope", status: currentStep > 0 ? "complete" : currentStep === 0 ? "active" : "pending", agent: "Perry" },
    { id: 2, title: "UI/UX Design", description: "Gemma creates wireframes and design system", status: currentStep > 1 ? "complete" : currentStep === 1 ? "active" : "pending", agent: "Gemma" },
    { id: 3, title: "Frontend Development", description: "Ollie builds React components", status: currentStep > 2 ? "complete" : currentStep === 2 ? "active" : "pending", agent: "Ollie" },
    { id: 4, title: "Backend Development", description: "Hugo creates API and database", status: currentStep > 3 ? "complete" : currentStep === 3 ? "active" : "pending", agent: "Hugo" },
    { id: 5, title: "DevOps & Deployment", description: "Milo handles deployment automation", status: currentStep > 4 ? "complete" : currentStep === 4 ? "active" : "pending", agent: "Milo" },
    { id: 6, title: "Quality Assurance", description: "Gemma QA tests all functionality", status: currentStep > 5 ? "complete" : currentStep === 5 ? "active" : "pending", agent: "Gemma QA" },
    { id: 7, title: "Final Review", description: "Ava coordinates final delivery", status: currentStep > 6 ? "complete" : currentStep === 6 ? "active" : "pending", agent: "Ava" },
  ];

  const handleProjectSubmit = (data: any) => {
    console.log('Starting project:', data);
    setProjectStarted(true);
    // Simulate workflow progression
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const mockCode = `import { useState } from 'react';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };
  
  return (
    <div className="p-6">
      <h1>My Tasks</h1>
      {/* Component UI */}
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        {!projectStarted ? (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Powered by Multi-Agent AI</span>
                </div>
                <h1 className="text-6xl font-bold mb-4 font-['Space_Grotesk'] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  LLM Team App Builder
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform your ideas into production-ready apps with our futuristic multi-agent AI system
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <ProjectForm onSubmit={handleProjectSubmit} />
                
                <div className="space-y-6">
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
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setProjectStarted(false)}
                data-testid="button-back"
              >
                ← Back to Projects
              </Button>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2 font-['Space_Grotesk']">Building Your App</h2>
              <p className="text-muted-foreground">Watch AI agents collaborate in real-time</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {agents.slice(0, 3).map((agent, idx) => (
                <AgentCard
                  key={agent.name}
                  name={agent.name}
                  role={agent.role}
                  model={agent.model}
                  color={agent.color}
                  status={
                    currentStep > idx ? "complete" : 
                    currentStep === idx ? "working" : "idle"
                  }
                  tasks={[
                    `Task 1 for ${agent.name}`,
                    `Task 2 for ${agent.name}`
                  ]}
                  output={currentStep > idx ? `${agent.name} completed their work successfully` : undefined}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk']">Workflow Progress</h3>
                <WorkflowTimeline steps={workflowSteps as any} />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk']">Generated Code</h3>
                <CodeDisplay
                  code={mockCode}
                  language="TypeScript"
                  fileName="TaskManager.tsx"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
