"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  CheckCircle,
  Clock,
  Circle,
  Plus,
  MoreHorizontal,
  Calendar,
} from "lucide-react";

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  acceptance_criteria: string;
  assignee_id: string;
  created_at: number;
  updated_at: number;
  assignee_name?: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskSelect: (taskId: string) => void;
  onCreateTask: () => void;
  projectTitle?: string;
  isLoading?: boolean;
}

const columns = [
  { id: "todo", title: "To Do", icon: Circle, accent: "from-slate-200 to-slate-100" },
  { id: "in_progress", title: "In Progress", icon: Clock, accent: "from-cyan-400 to-blue-500" },
  { id: "done", title: "Done", icon: CheckCircle, accent: "from-emerald-400 to-teal-500" },
];

export function TaskBoard({
  tasks,
  onTaskUpdate,
  onTaskSelect,
  onCreateTask,
  projectTitle,
  isLoading = false,
}: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const tasksByStatus = useMemo(
    () =>
      columns.reduce<Record<string, Task[]>>((acc, column) => {
        acc[column.id] = tasks.filter((task) => task.status === column.id);
        return acc;
      }, {}),
    [tasks]
  );

  const handleDragStart = (event: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent, status: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleDrop = (event: React.DragEvent, status: string) => {
    event.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onTaskUpdate(draggedTask.id, status);
    }
    setDragOverStatus(null);
    setDraggedTask(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      draggable
      onDragStart={(event) => handleDragStart(event, task)}
      onClick={() => onTaskSelect(task.id)}
      className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <CardHeader className="gap-3 p-0">
        <div className="flex-1">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">{task.title}</p>
          {task.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <Badge className="rounded-full bg-slate-100 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
          {task.status.replace("_", " ")}
        </Badge>
      </CardHeader>
      {task.acceptance_criteria && (
        <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[0.7rem] text-slate-500 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-300">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Acceptance criteria</p>
          <p className="text-sm line-clamp-3">{task.acceptance_criteria}</p>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(task.updated_at)}
        </div>
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {task.assignee_name
                ? task.assignee_name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "??"}
            </AvatarFallback>
          </Avatar>
          {task.assignee_name ?? "Unassigned"}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onTaskSelect(task.id)}>Open task</DropdownMenuItem>
          <DropdownMenuItem>Copy share link</DropdownMenuItem>
          <DropdownMenuItem>Move to backlog</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {projectTitle ? `${projectTitle} Board` : "Task Board"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag tasks between columns to instantly update their status.
          </p>
        </div>
        <Button
          onClick={onCreateTask}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnTasks = tasksByStatus[column.id] || [];
          const isDragOver = dragOverStatus === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(event) => handleDragOver(event, column.id)}
              onDragLeave={() => setDragOverStatus(null)}
              onDrop={(event) => handleDrop(event, column.id)}
              className={`space-y-4 rounded-3xl border border-slate-200/60 bg-white/70 p-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800/70 dark:bg-slate-900/70 ${
                isDragOver
                  ? "ring-2 ring-cyan-400/70 bg-gradient-to-b from-cyan-500/10 to-white/30 dark:from-cyan-500/10 dark:to-transparent"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${column.accent} text-white`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {column.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      {columnTasks.length} tasks
                    </p>
                  </div>
                </div>
                <Badge className="rounded-full bg-slate-100 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                  Drag
                </Badge>
              </div>
              <div className="space-y-4 min-h-[250px]">
                {isLoading ? (
                  <Skeleton className="h-40 w-full rounded-3xl" />
                ) : columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300/60 bg-slate-50/70 p-6 text-center text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-400">
                    <Calendar className="h-6 w-6 text-slate-400" />
                    <p>No tasks</p>
                    <p className="text-xs text-slate-400">Drag one here to assign a status.</p>
                  </div>
                ) : (
                  columnTasks.map((task) => renderTaskCard(task))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
