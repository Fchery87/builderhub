"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./theme-toggle";
import {
  ArrowRight,
  BarChart3,
  Zap,
  Users,
  Sparkles,
  Shield,
  Target,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "AI-First Task Planning",
    description:
      "Generate acceptance criteria, status updates, and sprint plans on the fly.",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Live Collaboration",
    description:
      "See every teammate's progress in real time with instant synchronisation.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Insightful Analytics",
    description:
      "Track velocity, blockers, and risk paths with built-in dashboards.",
    gradient: "from-emerald-500 to-lime-500",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Sprint Control",
    description:
      "Define milestones, guardrails, and review checklists in a unified view.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Enterprise Ready",
    description:
      "RBAC, compliance logging, and SOC-2 ready infrastructure built in.",
    gradient: "from-slate-600 to-slate-800",
  },
];

const stats = [
  { label: "Tasks Completed", value: "10K+" },
  { label: "Teams Active", value: "500+" },
  { label: "Hours Saved", value: "50K+" },
  { label: "Satisfaction", value: "98%" },
];

const timeline = [
  { label: "Today", value: 78 },
  { label: "Tomorrow", value: 65 },
  { label: "This Week", value: 92 },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-slate-900/70 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2 shadow-lg shadow-cyan-500/30">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                BuilderHub
              </p>
              <p className="text-xs text-slate-400">Ship with AI confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
              🚀 AI Operations
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Build smarter roadmaps with a brainy task hub.
            </h1>
            <p className="text-lg text-slate-300">
              BuilderHub blends AI-generated acceptance criteria with live task
              boards, so your team knows exactly what to ship next without
              context switching.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600">
                  Launch Workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  See Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              {timeline.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-lg shadow-black/40"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-lg font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Team pulse</h2>
              <Badge className="rounded-full bg-emerald-500/20 text-emerald-200">
                Live
              </Badge>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-400">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span>{stat.label}</span>
                  <strong className="text-white">{stat.value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-6 h-[180px] w-full rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/50 to-transparent p-4">
              <div className="relative h-full">
                <div className="absolute inset-0 opacity-70">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.6),_transparent_55%)]" />
                </div>
                <div className="relative w-full">
                  <svg viewBox="0 0 260 120" className="h-full w-full">
                    <defs>
                      <linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      strokeLinecap="round"
                      points="0,90 50,70 100,55 150,40 200,60 250,30"
                    />
                    <polygon
                      fill="url(#heroChart)"
                      points="0,90 50,70 100,55 150,40 200,60 250,30 260,120 0,120"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Features
              </p>
              <h3 className="text-3xl font-bold text-white">Everything your team needs</h3>
            </div>
            <Badge className="border border-slate-800 bg-white/5 text-slate-200">
              Modern stack
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-slate-800/50 bg-slate-900/70 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
              >
                <CardHeader className="space-y-2">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Trusted by teams
              </p>
              <h3 className="text-3xl font-bold text-white">
                Scale sprints without losing the human touch.
              </h3>
            </div>
            <div className="flex gap-3 text-sm text-slate-300">
              <Badge className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                SOC 2
              </Badge>
              <Badge className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                Enterprise
              </Badge>
            </div>
          </div>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 rounded-full border border-white/10 bg-slate-900/60 p-1">
              <TabsTrigger value="overview" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Insights
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-6 text-sm text-slate-300">
              <p>
                BuilderHub keeps every stakeholder aligned with sprint-ready plans, deep context, and AI-boosted criteria.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 shadow">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="insights" className="space-y-6 pt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Velocity</span>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Past 7 days</span>
              </div>
              <div className="h-40 w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-4 shadow-inner">
                <svg viewBox="0 0 260 120" className="h-full w-full">
                  <defs>
                    <linearGradient id="insightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="0,80 35,60 70,45 105,55 140,35 175,45 210,30 245,40"
                  />
                  <polygon
                    fill="url(#insightGradient)"
                    points="0,80 35,60 70,45 105,55 140,35 175,45 210,30 245,40 260,120 0,120"
                  />
                </svg>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="border-t border-slate-900/70 bg-slate-950/60 px-4 py-6 text-center text-sm text-slate-400">
        <p>© 2024 BuilderHub. Built for modern development teams.</p>
      </footer>
    </div>
  );
}
