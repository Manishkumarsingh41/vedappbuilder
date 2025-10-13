import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";
import AgentAvatar from "./AgentAvatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  model: string;
  color: string;
  status: "idle" | "working" | "complete";
  tasks?: string[];
  output?: string;
}

export default function AgentCard({ name, role, model, color, status, tasks = [], output }: AgentCardProps) {
  const statusIcons = {
    idle: <Clock size={16} className="text-muted-foreground" />,
    working: <Loader2 size={16} className="text-primary animate-spin" />,
    complete: <CheckCircle size={16} className="text-chart-3" />
  };

  return (
    <GlassCard 
      hover 
      glow={status === "working"} 
      glowColor={color}
      className={cn(
        "border-l-4 transition-all duration-300",
        status === "working" && "border-l-[hsl(var(--primary))]",
        status === "complete" && "border-l-[hsl(var(--chart-3))]",
        status === "idle" && "border-l-border"
      )}
    >
      <div className="p-6" data-testid={`card-agent-${name.toLowerCase().replace(' ', '-')}`}>
        <div className="flex items-start gap-4 mb-4">
          <AgentAvatar name={name} color={color} size="md" isActive={status === "working"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold font-['Space_Grotesk'] truncate" data-testid={`text-agent-name-${name.toLowerCase().replace(' ', '-')}`}>
                {name}
              </h3>
              {statusIcons[status]}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{role}</p>
            <Badge variant="outline" className="text-xs">
              {model}
            </Badge>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tasks</p>
            <ul className="space-y-1">
              {tasks.map((task, idx) => (
                <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {output && (
          <div className="mt-4 p-3 rounded-md bg-accent/30 border border-accent">
            <p className="text-xs font-medium text-accent-foreground mb-2">Output</p>
            <p className="text-sm font-mono text-foreground/90 line-clamp-3">{output}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
