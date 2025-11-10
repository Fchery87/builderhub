import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Calendar, Circle, MoreHorizontal } from "lucide-react";

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

interface TaskListProps {
  tasks: Task[];
  onCreateTask: () => void;
  onSelectTask: (taskId: string) => void;
  projectTitle?: string;
  isLoading?: boolean;
}

const statusTabs = [
  { id: "all", label: "All" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

const getStatusText = (status: string) => {
  switch (status) {
    case "done":
      return "Completed";
    case "in_progress":
      return "In progress";
    default:
      return "To do";
  }
};

const getBadgeClass = (status: string) => {
  switch (status) {
    case "done":
      return "bg-emerald-100 text-emerald-700";
    case "in_progress":
      return "bg-cyan-100 text-cyan-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function TaskList({
  tasks,
  onCreateTask,
  onSelectTask,
  projectTitle,
  isLoading = false,
}: TaskListProps) {
  const [activeTab, setActiveTab] = useState("all");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredTasks =
    activeTab === "all" ? tasks : tasks.filter((task) => task.status === activeTab);

  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/70"
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {task.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {task.description}
            </CardDescription>
          </div>
          <Badge className={`text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${getBadgeClass(task.status)}`}>
            {task.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.4em]">
          <span>
            <Calendar className="inline-block h-3 w-3 align-middle" />
            <span className="ml-1">{formatDate(task.updated_at)}</span>
          </span>
          <span>{getStatusText(task.status)}</span>
        </div>
        <div className="flex items-center justify-between text-[0.7rem]">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                {task.assignee_name
                  ? task.assignee_name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()
                  : "US"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-[0.65rem] text-slate-600 dark:text-slate-300">
              {task.assignee_name || "Unassigned"}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSelectTask(task.id)}>Open task</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg dark:border-slate-800/60 dark:bg-slate-900/80">
          <CardContent className="space-y-3 p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {projectTitle ? `${projectTitle} Tasks` : "All Tasks"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-full border border-slate-200/80 bg-white/80 p-1 dark:border-slate-800/80 dark:bg-slate-900/60">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:text-slate-900 dark:text-slate-300"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button
            onClick={onCreateTask}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-lg dark:border-slate-800/80 dark:bg-slate-900/70">
        {isLoading ? (
          renderSkeletons()
        ) : filteredTasks.length === 0 ? (
          <div className="space-y-4 rounded-2xl border border-dashed border-slate-300/60 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
            <Circle className="mx-auto mb-3 h-6 w-6 text-slate-400" />
            <p>No tasks for {activeTab.replace("_", " ")}</p>
            <p className="text-xs text-slate-400">Switch tabs or create a new task to populate this list.</p>
          </div>
        ) : (
          <div className="space-y-4">{filteredTasks.map(renderTaskCard)}</div>
        )}
      </div>
    </div>
  );
}
