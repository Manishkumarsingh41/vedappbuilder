import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  duration?: number; // Duration in seconds, default 300 (5 minutes)
  onComplete?: () => void;
}

export default function CountdownTimer({ 
  duration = 300, 
  onComplete 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setIsActive(false);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-primary" size={24} />
        <h3 className="text-xl font-semibold font-['Space_Grotesk']">
          Build Time Estimate
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold font-['Space_Grotesk'] text-primary">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Time remaining
          </p>
        </div>

        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Started</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
