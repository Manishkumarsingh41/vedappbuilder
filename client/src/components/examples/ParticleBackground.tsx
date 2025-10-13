import ParticleBackground from '../ParticleBackground';

export default function ParticleBackgroundExample() {
  return (
    <div className="relative min-h-screen bg-background">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 font-['Space_Grotesk']">Futuristic Particle System</h1>
          <p className="text-muted-foreground">Animated background with connected particles</p>
        </div>
      </div>
    </div>
  );
}
