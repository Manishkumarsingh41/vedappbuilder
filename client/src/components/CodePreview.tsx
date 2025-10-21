import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Eye, Download, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeFile {
  fileName: string;
  code: string;
  language: string;
  agentName: string;
}

interface CodePreviewProps {
  messages: any[];
}

export default function CodePreview({ messages }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("code");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Extract all code blocks from messages
  const codeFiles = useMemo(() => {
    const files: CodeFile[] = [];
    const completedMessages = messages.filter((m: any) => m.status === "complete");

    completedMessages.forEach((msg: any) => {
      let fileIndex = 0;

      // Try to parse as JSON array first (some agents return [{name: ..., content: ...}] format)
      try {
        const jsonMatch = msg.message.match(/\[{[\s\S]*?}\]/);
        if (jsonMatch) {
          const jsonArray = JSON.parse(jsonMatch[0]);
          if (Array.isArray(jsonArray)) {
            jsonArray.forEach((item: any) => {
              if (item.name && typeof item === 'object') {
                // Extract all string properties as potential code
                Object.keys(item).forEach((key) => {
                  if (typeof item[key] === 'string' && item[key].length > 20) {
                    const content = item[key];
                    let fileName = item.name || key;
                    
                    // Detect language from content or filename
                    let language = "text";
                    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) language = "yaml";
                    else if (fileName.endsWith('.json')) language = "json";
                    else if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) language = "javascript";
                    else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) language = "typescript";
                    else if (fileName.endsWith('.html')) language = "html";
                    else if (fileName.endsWith('.css')) language = "css";
                    else if (content.includes('module.exports') || content.includes('extends')) language = "javascript";
                    else if (content.includes('runs-on:') || content.includes('steps:')) language = "yaml";
                    
                    files.push({
                      fileName: fileName.includes('.') ? fileName : `${fileName}.txt`,
                      code: content,
                      language,
                      agentName: msg.agentName,
                    });
                  }
                });
              }
            });
            return; // Skip markdown parsing if JSON worked
          }
        }
      } catch (e) {
        // Not valid JSON, continue with markdown parsing
      }

      // Match code blocks with language tags (markdown format)
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let match;

      while ((match = codeBlockRegex.exec(msg.message)) !== null) {
        const language = match[1] || "text";
        let code = match[2].trim();
        
        if (code.length > 10) { // Ignore very small code blocks
          // Try to extract filename from first line comment
          let fileName = "";
          const firstLine = code.split('\n')[0];
          
          // Check for filename in comment (e.g., // src/App.jsx or # config.yml)
          const filePathMatch = firstLine.match(/^(?:\/\/|#)\s*(.+\.\w+)/);
          if (filePathMatch) {
            fileName = filePathMatch[1].trim();
            // Remove the filename comment from code
            code = code.split('\n').slice(1).join('\n').trim();
          }
          
          // If no filename found in comment, generate one
          if (!fileName) {
            const extension = 
              language === "typescript" || language === "tsx" ? "tsx" :
              language === "javascript" || language === "jsx" ? "jsx" :
              language === "python" ? "py" :
              language === "html" ? "html" :
              language === "css" ? "css" :
              language === "yaml" || language === "yml" ? "yml" :
              language === "json" ? "json" : "txt";
            
            fileName = `${msg.agentRole.replace(/\s+/g, "_")}_${fileIndex}.${extension}`;
          }
          
          files.push({
            fileName,
            code,
            language,
            agentName: msg.agentName,
          });
          fileIndex++;
        }
      }
    });

    return files;
  }, [messages]);

  const currentFile = codeFiles[activeFileIndex];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadFile = (fileName: string, code: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate preview HTML for supported file types
  const generatePreview = (file: CodeFile) => {
    if (file.language === "html") {
      return file.code;
    }
    
    if (file.language === "jsx" || file.language === "tsx") {
      // Simple preview for React components
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${file.code}
              
              // Try to render if there's a default export
              const root = ReactDOM.createRoot(document.getElementById('root'));
              try {
                root.render(<div>Preview not available for this component</div>);
              } catch (e) {
                root.render(<div>Unable to preview: {e.message}</div>);
              }
            </script>
          </body>
        </html>
      `;
    }
    
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 20px; font-family: monospace;">
          <pre>${file.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `;
  };

  if (codeFiles.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8">
        <div className="text-center text-muted-foreground">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No code generated yet...</p>
          <p className="text-sm mt-2">Code will appear here as agents complete their work</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
          <TabsList className="bg-transparent">
            <TabsTrigger value="code" className="gap-2">
              <Code size={16} />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye size={16} />
              Preview
            </TabsTrigger>
          </TabsList>
          
          {currentFile && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => handleCopyCode(currentFile.code, activeFileIndex)}
              >
                {copiedIndex === activeFileIndex ? (
                  <><Check size={14} /> Copied</>
                ) : (
                  <><Copy size={14} /> Copy</>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => handleDownloadFile(currentFile.fileName, currentFile.code)}
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          )}
        </div>

        {/* File tabs */}
        {codeFiles.length > 1 && (
          <ScrollArea className="w-full border-b border-white/10">
            <div className="flex gap-1 px-4 py-2 bg-white/5">
              {codeFiles.map((file, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={activeFileIndex === index ? "secondary" : "ghost"}
                  className="text-xs"
                  onClick={() => setActiveFileIndex(index)}
                >
                  <span className="truncate max-w-[150px]">{file.fileName}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}

        <TabsContent value="code" className="m-0 p-0">
          {currentFile && (
            <div className="relative">
              <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/50 rounded text-white/80">
                {currentFile.language} • by {currentFile.agentName}
              </div>
              <ScrollArea className="h-[500px]">
                <pre className="p-4 text-sm">
                  <code className="text-foreground/90 font-mono">
                    {currentFile.code}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-0">
          {currentFile && (
            <div className="h-[500px] bg-white">
              <iframe
                srcDoc={generatePreview(currentFile)}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
