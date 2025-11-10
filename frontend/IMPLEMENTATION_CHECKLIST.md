# Implementation Checklist

## Step-by-Step: Migrate Your Pages to New Shadcn Components

---

## Phase 1: Setup (10 minutes)

### Step 1.1: Kill Running Processes
```bash
# Windows
taskkill /F /IM node.exe

# Wait 2 seconds
timeout /t 2
```

### Step 1.2: Clean Cache
```bash
cd e:\Dev\builderhub\frontend
rm -rf .next
```

### Step 1.3: Start Dev Server
```bash
npm run dev
# Should start on http://localhost:3000
```

**Checklist:**
- [ ] Dev server started without errors
- [ ] Can navigate to http://localhost:3000
- [ ] No build errors in terminal

---

## Phase 2: Homepage Migration (20 minutes)

### Step 2.1: Update `src/app/page.tsx`

**Before:**
```tsx
// Old implementation
import Hero from "@/components/hero";
import Features from "@/components/features";
// ... etc
```

**After:**
```tsx
"use client";

import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return <LandingPage />;
}
```

### Step 2.2: Verify Lint
```bash
npm run lint
```

**Checklist:**
- [ ] Homepage updated to use LandingPage
- [ ] Lint passes
- [ ] Homepage displays correctly at http://localhost:3000
- [ ] Dark mode toggle works
- [ ] Mobile responsive

---

## Phase 3: Dashboard Layout Migration (30 minutes)

### Step 3.1: Create Dashboard Page

**File:** `src/app/dashboard/page.tsx`

```tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardCards, TaskCounter } from "@/components/dashboard-cards";
import { TaskListModern } from "@/components/task-list-modern";
import { TaskFormModern } from "@/components/task-form-modern";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();

  // Sample data
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
      description: "Create mockups and prototypes",
      status: "in_progress" as const,
      priority: "high" as const,
      assignee: { name: "Sarah Chen" },
      dueDate: "2024-12-25",
      tags: ["design"],
    },
  ];

  const handleCreateTask = async (data: any) => {
    try {
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
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Cards */}
        <DashboardCards stats={stats} />

        {/* Task Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TaskListModern items={tasks} />
          </div>
          <div className="space-y-4">
            <TaskCounter total={48} completed={32} />
            <TaskFormModern onSubmit={handleCreateTask} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
```

**Checklist:**
- [ ] Dashboard page created
- [ ] AppShell wraps content
- [ ] Stats cards display
- [ ] Task list displays
- [ ] Task form opens correctly
- [ ] Dark mode works
- [ ] Mobile layout correct

---

## Phase 4: Root Layout Update (15 minutes)

### Step 4.1: Verify `src/app/layout.tsx`

**Check:**
```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/hooks/use-theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuilderHub - AI-Powered Project Management",
  description: "Manage projects efficiently with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100"
        )}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Checklist:**
- [ ] `./globals.css` imported
- [ ] ThemeProvider wraps children
- [ ] Dark mode classes applied to body

---

## Phase 5: Other Pages Migration (30 minutes)

### Step 5.1: Tasks Page

**File:** `src/app/dashboard/tasks/page.tsx`

```tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { TaskListModern } from "@/components/task-list-modern";
import { TaskFormModern } from "@/components/task-form-modern";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

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
            <TaskFormModern onSubmit={async (data) => {
              setTasks([...tasks, { id: Date.now().toString(), ...data }]);
            }} />
          </div>
        </div>
        <TaskListModern items={tasks} />
      </div>
    </AppShell>
  );
}
```

### Step 5.2: Projects Page

**File:** `src/app/dashboard/projects/page.tsx`

```tsx
"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <AppShell currentPath="/dashboard/projects">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Add your project cards here */}
          <Card className="dark:border-slate-800">
            <CardHeader>
              <CardTitle>Sample Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Project description goes here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
```

**Checklist:**
- [ ] Tasks page created and working
- [ ] Projects page created and working
- [ ] Navigation between pages works
- [ ] currentPath prop set correctly on AppShell

---

## Phase 6: Testing (20 minutes)

### Step 6.1: Lint Check
```bash
npm run lint
```

**Expected:** ✅ No ESLint warnings or errors

### Step 6.2: Functional Testing

**Desktop:**
- [ ] Homepage loads and displays correctly
- [ ] Dark mode toggle works
- [ ] Can navigate to dashboard
- [ ] Dashboard displays stats and tasks
- [ ] Can create new task with form
- [ ] Can edit and delete tasks

**Mobile (Resize browser to 375px):**
- [ ] Sidebar hidden, hamburger menu visible
- [ ] Navigation works
- [ ] Cards stack vertically
- [ ] Form works on mobile
- [ ] Dark mode works

**Accessibility:**
- [ ] Can navigate with keyboard (Tab)
- [ ] Can use dark mode toggle with keyboard
- [ ] All links have proper focus indicators
- [ ] Form validation messages are visible

### Step 6.3: Browser DevTools

**Checks:**
- [ ] No console errors
- [ ] No console warnings (except deprecations)
- [ ] HTML is semantic
- [ ] CSS is properly scoped
- [ ] Dark mode classes applied correctly

---

## Phase 7: Production Build (15 minutes)

### Step 7.1: Test Build
```bash
npm run build
```

**Expected:** ✅ Build succeeds with no errors

### Step 7.2: Verify Build Output
```bash
npm run lint
```

**Expected:** ✅ No linting errors

---

## Completion Checklist

### Code Quality
- [ ] All lint checks pass
- [ ] TypeScript has no errors
- [ ] All imports are correct
- [ ] No unused imports
- [ ] Proper error handling

### Functionality
- [ ] Homepage displays correctly
- [ ] Dashboard displays correctly
- [ ] All navigation works
- [ ] Forms submit without errors
- [ ] Loading states display
- [ ] Error states display

### Design & UX
- [ ] Dark mode works throughout
- [ ] Light mode works throughout
- [ ] Mobile layout is responsive
- [ ] Tablet layout is responsive
- [ ] Desktop layout is responsive
- [ ] Colors are consistent
- [ ] Spacing is consistent

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast is sufficient
- [ ] ARIA labels present where needed
- [ ] Forms are labeled properly

### Performance
- [ ] Dev server starts quickly
- [ ] Pages load fast
- [ ] No layout shift
- [ ] Images are optimized
- [ ] No console errors

---

## Troubleshooting

If you encounter issues, see: **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

---

## Summary

**Total Time:** ~2 hours

**What You'll Have:**
- ✅ Modern Shadcn/ui components
- ✅ Professional dark mode
- ✅ Responsive mobile design
- ✅ Accessible components
- ✅ Full TypeScript support
- ✅ Production-ready code

**Next Steps:**
1. Complete this checklist
2. Deploy to production
3. Monitor for issues
4. Gather user feedback

---

**Version:** 1.0
**Status:** Ready to Implement
**Last Updated:** 2024
