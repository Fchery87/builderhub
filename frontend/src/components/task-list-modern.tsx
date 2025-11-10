"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Plus, Trash2, Edit2 } from "lucide-react";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  tags?: string[];
}

interface TaskListModernProps {
  items: TaskItem[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
  done: { label: "Done", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" },
};

const priorityConfig = {
  low: { label: "Low", color: "text-slate-600 dark:text-slate-400" },
  medium: { label: "Medium", color: "text-orange-600 dark:text-orange-400" },
  high: { label: "High", color: "text-red-600 dark:text-red-400" },
};

export function TaskListModern({
  items,
  loading = false,
  onEdit,
  onDelete,
}: TaskListModernProps) {
  if (loading) {
    return (
      <Card className="dark:border-slate-800">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>{items.length} total tasks</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">
            <p>No tasks yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </h3>
                    <Badge className={statusConfig[task.status].color}>
                      {statusConfig[task.status].label}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {task.priority && (
                      <span className={priorityConfig[task.priority].color}>
                        {priorityConfig[task.priority].label} Priority
                      </span>
                    )}
                    {task.dueDate && (
                      <span>Due {task.dueDate}</span>
                    )}
                    {task.assignee && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(task.id)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
