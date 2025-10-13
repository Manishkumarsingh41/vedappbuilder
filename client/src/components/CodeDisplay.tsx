import { useState } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "./GlassCard";
import { Copy, Check, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CodeDisplayProps {
  code: string;
  language: string;
  fileName?: string;
}

export default function CodeDisplay({ code, language, fileName }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="overflow-hidden" data-testid="code-display">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {fileName && <span className="text-sm font-mono text-foreground">{fileName}</span>}
          <Badge variant="outline" className="text-xs">{language}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            data-testid="button-copy-code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-expand-code"
          >
            <Maximize2 size={16} />
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground/90">
          <code>{code}</code>
        </pre>
      </div>
    </GlassCard>
  );
}
