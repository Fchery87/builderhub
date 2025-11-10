"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-slate-500 dark:text-slate-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <Badge
              variant="outline"
              className={
                trend.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {trend.isPositive ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>
        {description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardCardsProps {
  stats: StatCardProps[];
  loading?: boolean;
}

export function DashboardCards({ stats, loading = false }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  );
}

interface TaskCounterProps {
  total: number;
  completed: number;
  loading?: boolean;
}

export function TaskCounter({ total, completed, loading }: TaskCounterProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Tasks Progress</CardTitle>
        <CardDescription>
          {completed} of {total} completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-2xl font-bold">{percentage}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
