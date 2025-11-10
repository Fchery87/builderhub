# Integration Examples

Quick examples of how to use the modernized Shadcn components together.

## Example 1: Dashboard Overview Page

```tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardCards, TaskCounter } from "@/components/dashboard-cards";
import { TaskListModern, TaskFormModern } from "@/components/task-list-modern";
import { TaskFormModern as TaskForm } from "@/components/task-form-modern";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();

  const stats = [
    {
      title: "Total Tasks",
      value: 48,
      icon: <BarChart3 className="h-5 w-5" />,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Completed",
      value: 32,
      icon: <CheckCircle className="h-5 w-5" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "In Progress",
      value: 12,
      icon: <Clock className="h-5 w-5" />,
      trend: { value: 2, isPositive: false },
    },
    {
      title: "Blocked",
      value: 4,
      icon: <AlertCircle className="h-5 w-5" />,
      trend: { value: 1, isPositive: false },
    },
  ];

  const tasks = [
    {
      id: "1",
      title: "Design landing page",
      description: "Create mockups and prototypes for the new landing page",
      status: "in_progress" as const,
      priority: "high" as const,
      assignee: { name: "Sarah Chen" },
      dueDate: "2024-12-25",
      tags: ["design", "frontend"],
    },
    {
      id: "2",
      title: "Setup database",
      description: "Configure PostgreSQL and create initial schema",
      status: "todo" as const,
      priority: "high" as const,
      assignee: { name: "Mike Johnson" },
      dueDate: "2024-12-20",
      tags: ["backend", "database"],
    },
  ];

  const handleCreateTask = async (data: any) => {
    try {
      // Call your API
      console.log("Creating task:", data);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  return (
    <AppShell currentPath="/dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's your project overview.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardCards stats={stats} />

        {/* Task Progress & Create Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TaskListModern items={tasks} />
          </div>
          <div className="space-y-4">
            <TaskCounter total={48} completed={32} />
            <TaskFormModern
              onSubmit={handleCreateTask}
              trigger={
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
```

---

## Example 2: Landing Page Integration

```tsx
"use client";

import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return <LandingPage />;
}
```

---

## Example 3: Task Management View

```tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { TaskListModern } from "@/components/task-list-modern";
import { TaskFormModern } from "@/components/task-form-modern";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Fix login bug",
      description: "Users cannot reset password",
      status: "todo" as const,
      priority: "high" as const,
    },
    {
      id: "2",
      title: "Update documentation",
      description: "Add new API endpoints to docs",
      status: "done" as const,
      priority: "low" as const,
    },
  ]);

  const handleEdit = (id: string) => {
    console.log("Edit task:", id);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleCreate = async (data: any) => {
    const newTask = {
      id: Date.now().toString(),
      ...data,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <AppShell currentPath="/dashboard/tasks">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <TaskFormModern
              onSubmit={handleCreate}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              }
            />
          </div>
        </div>

        <TaskListModern
          items={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AppShell>
  );
}
```

---

## Example 4: Using Components with Loading States

```tsx
import { DashboardCards, TaskCounter } from "@/components/dashboard-cards";
import { TaskListModern } from "@/components/task-list-modern";
import { useEffect, useState } from "react";

export default function DashboardWithLoading() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats([
        { title: "Total Tasks", value: 48 },
        { title: "Completed", value: 32 },
      ]);
      setTasks([
        {
          id: "1",
          title: "Sample task",
          status: "todo" as const,
          priority: "medium" as const,
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Shows skeleton loaders while loading */}
      <DashboardCards stats={stats} loading={loading} />

      {/* Shows skeleton while loading */}
      <TaskCounter total={48} completed={32} loading={loading} />

      {/* Shows skeleton while loading */}
      <TaskListModern items={tasks} loading={loading} />
    </div>
  );
}
```

---

## Example 5: Form with Validation

```tsx
import { TaskFormModern } from "@/components/task-form-modern";
import { useToast } from "@/hooks/use-toast";

export default function TaskCreation() {
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Validate
      if (!data.title.trim()) {
        throw new Error("Title is required");
      }

      // Call API
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create task");

      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <TaskFormModern
      onSubmit={handleSubmit}
      initialData={{
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
      }}
    />
  );
}
```

---

## Example 6: Combining Stat Cards for Analytics

```tsx
import { StatCard } from "@/components/dashboard-cards";
import { TrendingUp, Users, BarChart3, Clock } from "lucide-react";

export default function AnalyticsDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Revenue"
        value="$45,231.89"
        description="+20.1% from last month"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 20, isPositive: true }}
      />
      <StatCard
        title="Users"
        value="+2,350"
        description="+15% from last month"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        title="Sales"
        value="+12,234"
        description="+5.2% from last month"
        icon={<BarChart3 className="h-5 w-5" />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Hours"
        value="2,400"
        description="Total team hours"
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: 3, isPositive: false }}
      />
    </div>
  );
}
```

---

## Tips & Best Practices

1. **Always handle loading states** - Use the `loading` prop on components
2. **Use toast for feedback** - Import and use `useToast` from hooks
3. **Consistent error handling** - Show user-friendly error messages
4. **Wrap in AppShell** - Keep consistent layout across dashboard pages
5. **Dark mode support** - All components support it automatically
6. **Mobile responsive** - Components handle all screen sizes
7. **Validation** - Forms validate on blur and submit
8. **Accessibility** - All components follow WCAG standards

---

## Common Patterns

### Async Form Submission
```tsx
const handleSubmit = async (data: any) => {
  try {
    await api.createTask(data);
    toast({ title: "Success" });
  } catch (error) {
    toast({ title: "Error", variant: "destructive" });
  }
};
```

### Loading State Pattern
```tsx
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetchData().then(() => setLoading(false));
}, []);
return <Component loading={loading} />;
```

### Filter & Sort Pattern
```tsx
const [filter, setFilter] = useState("all");
const filtered = items.filter(item =>
  filter === "all" ? true : item.status === filter
);
```
