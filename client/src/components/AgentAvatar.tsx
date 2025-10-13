import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface AgentAvatarProps {
  name: string;
  color: string;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AgentAvatar({ name, color, isActive = false, size = "md" }: AgentAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-card to-accent/20",
          "border-2 transition-all duration-300",
          sizeClasses[size],
          isActive ? `border-[hsl(${color})] shadow-[0_0_20px_hsl(${color}/0.5)]` : "border-border"
        )}
        style={isActive ? { borderColor: `hsl(${color})` } : undefined}
      >
        <User className="text-foreground" size={iconSizes[size]} />
      </div>
      {isActive && (
        <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
          <Sparkles size={12} className="text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
