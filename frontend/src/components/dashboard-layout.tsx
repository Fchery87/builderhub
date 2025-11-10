"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  Plus,
  Menu,
  X,
  Sparkles,
  Bell,
  ChevronDown,
} from "lucide-react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Toaster } from "./ui/toaster";
import { ThemeToggle } from "./theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", name: "Tasks", icon: ListTodo },
    { id: "board", name: "Board", icon: ListTodo },
    { id: "projects", name: "Projects", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:bg-gradient-to-b lg:from-slate-900 lg:via-slate-950 lg:to-slate-950 lg:p-6 lg:shadow-2xl lg:text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-500/20 p-2 text-amber-200 shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
                BuilderHub
              </p>
              <p className="text-xs text-slate-300">Command center</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-200 border-0 text-[11px]">
            Stable
          </Badge>
        </div>
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>BH</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Frant Team</p>
              <p className="text-xs text-slate-300">Product Squad</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          className={`fixed inset-0 z-40 bg-slate-900/70 transition duration-300 lg:hidden ${
            sidebarOpen ? "block" : "pointer-events-none hidden"
          }`}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-amber-500" />
              BuilderHub
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={`mobile-${item.id}`}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                    isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3 pt-4">
            <ThemeToggle />
          </div>
        </div>

        <header className="flex items-center justify-between border-b border-slate-200 bg-white py-3 px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard
            </div>
            <Badge className="hidden rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-500 sm:block">
              Live Sync
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View notifications</DropdownMenuItem>
                <DropdownMenuItem>Mute alerts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3 py-1 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>FR</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Frant</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 p-4 dark:bg-slate-900/80 md:p-6 lg:p-8">
          <div className="space-y-6">{children}</div>
        </main>
        <Toaster />
      </div>
    </div>
  );
}
