import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "complete";
  agent: string;
}

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
}

export default function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="relative" data-testid="workflow-timeline">
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary to-chart-3" />
      
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative flex gap-6 items-start" data-testid={`workflow-step-${step.id}`}>
            <div className={cn(
              "relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              step.status === "complete" && "bg-chart-3 shadow-[0_0_20px_hsl(var(--chart-3)/0.5)]",
              step.status === "active" && "bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)] animate-pulse",
              step.status === "pending" && "bg-muted border-2 border-border"
            )}>
              {step.status === "complete" && <CheckCircle size={18} className="text-background" />}
              {step.status === "active" && <Loader2 size={18} className="text-primary-foreground animate-spin" />}
              {step.status === "pending" && <Circle size={14} className="text-muted-foreground" />}
            </div>

            <div className="flex-1 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-4 hover-elevate">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{step.title}</h4>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-accent/30">
                  {step.agent}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
