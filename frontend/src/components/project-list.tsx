import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Plus, Calendar, ArrowRight, MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: number;
  task_count?: number;
}

interface ProjectListProps {
  projects: Project[];
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  isLoading?: boolean;
}

export function ProjectList({
  projects,
  onCreateProject,
  onSelectProject,
  isLoading = false,
}: ProjectListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Button onClick={onCreateProject} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h2>
        <Button
          onClick={onCreateProject}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 mb-4">Create your first project to get started</p>
              <Button onClick={onCreateProject} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress = Math.min((project.task_count || 0) * 7, 100);
            return (
              <Card
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800/70 dark:bg-slate-900/70"
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                        {project.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectProject(project.id)}>
                          View board
                        </DropdownMenuItem>
                        <DropdownMenuItem>Share project</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge className="w-fit rounded-full bg-cyan-500/10 text-xs uppercase tracking-[0.3em] text-cyan-300">
                    {project.task_count || 0} tasks
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {project.owner_id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Owner: {project.owner_id}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-800/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => onSelectProject(project.id)}
                    className="w-full justify-between text-sm font-semibold"
                    variant="outline"
                  >
                    Go to board
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
