import { useState } from "react";
import { Github, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface GitHubPushDialogProps {
  projectName: string;
}

export default function GitHubPushDialog({ projectName }: GitHubPushDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const repoName = projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const commands = [
    {
      id: 'init',
      title: 'Initialize Git repository',
      command: `git init`,
    },
    {
      id: 'add',
      title: 'Add all files',
      command: `git add .`,
    },
    {
      id: 'commit',
      title: 'Create initial commit',
      command: `git commit -m "Initial commit from VedAppBuilder"`,
    },
    {
      id: 'remote',
      title: 'Add GitHub remote (replace USERNAME with your GitHub username)',
      command: `git remote add origin https://github.com/USERNAME/${repoName}.git`,
    },
    {
      id: 'push',
      title: 'Push to GitHub',
      command: `git branch -M main\ngit push -u origin main`,
    },
  ];

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied!",
      description: "Command copied to clipboard",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Github size={18} />
          Push to GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="text-primary" size={24} />
            Push Your Code to GitHub
          </DialogTitle>
          <DialogDescription>
            Follow these steps to push your generated code to a GitHub repository
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Before you start:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Download your project code first</li>
              <li>Create a new repository on GitHub named: <code className="bg-white/10 px-1 rounded">{repoName}</code></li>
              <li>Extract the downloaded zip file to a folder</li>
              <li>Open terminal/command prompt in that folder</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Run these commands in order:</h4>
            {commands.map((cmd, idx) => (
              <div key={cmd.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium">{cmd.title}</p>
                </div>
                <div className="ml-8 relative">
                  <pre className="bg-black/40 border border-white/10 rounded-lg p-3 pr-12 overflow-x-auto">
                    <code className="text-sm text-green-400">{cmd.command}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(cmd.command, cmd.id)}
                  >
                    {copied === cmd.id ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-400 mb-2">Quick tip:</h4>
            <p className="text-sm text-muted-foreground">
              You can also use GitHub Desktop or VS Code's Git integration to push your code instead of using the command line.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
