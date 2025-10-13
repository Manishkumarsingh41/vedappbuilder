import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export default function GlassCard({ children, className, hover = false, glow = false, glowColor = "180 100% 50%" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg",
        hover && "transition-all duration-300 hover-elevate hover:border-white/20",
        glow && `shadow-[0_0_30px_hsl(${glowColor}/0.2)]`,
        className
      )}
    >
      {children}
    </div>
  );
}
