import { useQuery } from "@tanstack/react-query";
import { History, Calendar, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

interface ProjectHistoryProps {
  onSelectProject: (projectId: string) => void;
}

export default function ProjectHistory({ onSelectProject }: ProjectHistoryProps) {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    refetchInterval: 5000,
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="text-primary" size={24} />
        <h3 className="text-xl font-semibold font-['Space_Grotesk']">
          Project History
        </h3>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FileCode className="mx-auto mb-3 text-muted-foreground" size={40} />
            <p className="text-muted-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first project to get started
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {project.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'complete' 
                      ? 'bg-green-500/20 text-green-400' 
                      : project.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
