import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "system" | "agent";
  content: string;
  timestamp: Date;
  agentName?: string;
}

interface ProjectChatProps {
  projectId: string;
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  // Fetch agent messages for this project
  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ["/api/projects", projectId, "messages"],
    refetchInterval: 2000,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: "👋 Welcome! You can provide additional instructions or request changes at any time. I'll relay your messages to the AI agents.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Add agent messages to chat as they complete
  useEffect(() => {
    const completedMessages = messages.filter((m: any) => m.status === "complete");
    
    completedMessages.forEach((msg: any) => {
      const alreadyAdded = chatMessages.some(
        (cm) => cm.role === "agent" && cm.agentName === msg.agentName
      );
      
      if (!alreadyAdded) {
        const newMsg: ChatMessage = {
          id: msg.id,
          role: "agent",
          content: msg.message, // Show full message
          timestamp: new Date(msg.createdAt),
          agentName: msg.agentName,
        };
        
        setChatMessages((prev) => [...prev, newMsg]);
      }
    });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (instruction: string) => {
      const response = await fetch(`/api/projects/${projectId}/instructions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      if (!response.ok) throw new Error("Failed to send instruction");
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Instruction Sent!",
        description: "AI agents are processing your request...",
      });
      // Add system confirmation message
      setChatMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "system",
          content: "✅ Your instruction has been sent to the AI agents. Watch for their responses above!",
          timestamp: new Date(),
        }
      ]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send instruction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    
    // Send to backend
    sendMessageMutation.mutate(inputValue);
    
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg gap-2 z-50"
          size="icon"
        >
          <MessageSquare size={24} />
          {messages.some((m: any) => m.status === "working") && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col backdrop-blur-xl bg-background/95 border-2 shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              <h3 className="font-semibold">Project Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : msg.role === "system"
                        ? "bg-muted text-muted-foreground text-sm italic"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {msg.agentName && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {msg.agentName}
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add instructions or request changes..."
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sendMessageMutation.isPending}
                className="self-end"
                size="icon"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
