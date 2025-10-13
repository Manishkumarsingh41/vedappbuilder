import GlassCard from '../GlassCard';

export default function GlassCardExample() {
  return (
    <div className="p-8 bg-gradient-to-br from-background to-accent/20 min-h-[300px]">
      <GlassCard hover glow className="p-6 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Glass Morphism Card</h3>
        <p className="text-muted-foreground">
          This is a futuristic glassmorphism card with backdrop blur, subtle borders, and optional glow effects.
        </p>
      </GlassCard>
    </div>
  );
}
