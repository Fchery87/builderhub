import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import {
  CheckCircle,
  Clock,
  Circle,
  TrendingUp,
  Users,
  ListTodo,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalProjects: number;
  recentActivity: Array<{
    id: string;
    type: "task_created" | "task_completed" | "task_updated";
    description: string;
    timestamp: number;
  }>;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  onViewTasks: () => void;
  onViewProjects: () => void;
  isLoading?: boolean;
}

const trendData = [
  { label: "Mon", value: 36 },
  { label: "Tue", value: 52 },
  { label: "Wed", value: 60 },
  { label: "Thu", value: 48 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 64 },
  { label: "Sun", value: 59 },
];

export function DashboardOverview({
  stats,
  onViewTasks,
  onViewProjects,
  isLoading = false,
}: DashboardOverviewProps) {
  const completionRate =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "task_updated":
        return <Clock className="h-4 w-4 text-cyan-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const chartMax = Math.max(...trendData.map((point) => point.value), 1);
  const chartPoints = trendData
    .map((point, index) => {
      const x = (index / (trendData.length - 1)) * 260;
      const y = 100 - (point.value / chartMax) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here is a polished overview of your projects and tasks.
          </p>
        </div>
        <Badge className="hidden items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 sm:flex">
          <Activity className="h-3 w-3" />
          Live
        </Badge>
      </div>

      <Tabs defaultValue="pulse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full border border-slate-200/60 bg-slate-100/70 p-1 dark:border-slate-800/60 dark:bg-slate-900/60">
          <TabsTrigger value="pulse" className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            Pulse
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pulse">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            { [
              { label: "Total Tasks", value: stats.totalTasks, icon: <ListTodo className="h-4 w-4 text-muted-foreground" /> },
              { label: "Completed", value: stats.completedTasks, icon: <CheckCircle className="h-4 w-4 text-muted-foreground" /> },
              { label: "In Progress", value: stats.inProgressTasks, icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
              { label: "Projects", value: stats.totalProjects, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
            ].map((card) => (
              <Card
                key={card.label}
                className="border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-200/80 transition hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/70"
              >
                <CardHeader className="flex items-center justify-between pb-2 text-sm">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {card.label}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent className="pt-0 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {!isLoading ? (
                    card.value
                  ) : (
                    <Skeleton className="h-8 w-16" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-slate-200/60 bg-white/80 shadow-lg transition hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-4 w-4 text-cyan-500" />
                Progress Overview
              </CardTitle>
              <CardDescription>
                Task completion breakdown across every project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              { isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ) : (
                ["todo", "in_progress", "completed"].map((status) => {
                  const value =
                    status === "todo"
                      ? stats.todoTasks
                      : status === "in_progress"
                        ? stats.inProgressTasks
                        : stats.completedTasks;

                  const bg =
                    status === "completed"
                      ? "bg-emerald-500"
                      : status === "in_progress"
                        ? "bg-cyan-500"
                        : "bg-slate-400";

                  return (
                    <div key={status} className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-slate-500">
                          {status.replace("_", " ")} ({value})
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {stats.totalTasks > 0 ? Math.round((value / stats.totalTasks) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200/80">
                        <div
                          className={`${bg} h-2 rounded-full transition-all`}
                          style={{
                            width: `${stats.totalTasks > 0 ? Math.round((value / stats.totalTasks) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="border border-slate-200/60 bg-white/80 shadow-lg transition hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-4 w-4 text-cyan-500" />
                Velocity Trends
              </CardTitle>
              <CardDescription>
                Last seven days of delivery patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full rounded-2xl border border-slate-200/60 bg-gradient-to-b from-slate-950/50 to-transparent p-4 dark:border-slate-800/60">
                <svg viewBox="0 0 260 120" className="h-full w-full">
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={chartPoints}
                  />
                  <polygon
                    fill="url(#trendFill)"
                    points={`${chartPoints} 260,120 0,120`}
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded-2xl" />
                ))}
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100/60 bg-slate-50/70 px-4 py-3 dark:border-slate-800/60 dark:bg-slate-900/60"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate faster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between border-slate-200/80 font-semibold"
              onClick={onViewTasks}
            >
              View All Tasks
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between border-slate-200/80 font-semibold"
              onClick={onViewProjects}
            >
              Manage Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
