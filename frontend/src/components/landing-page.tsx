"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Shield,
  Sparkles,
  Check,
  LogIn,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with optimized performance and instant synchronization.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration features keep your team in sync.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Comprehensive dashboards to track progress and identify bottlenecks.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards.",
  },
];

const benefits = [
  "Automated task assignment",
  "AI-powered planning",
  "Real-time notifications",
  "Custom workflows",
  "API integrations",
  "Advanced analytics",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Lead",
    content: "BuilderHub transformed how our team manages projects. We ship faster now.",
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    role: "Engineering Manager",
    content: "The AI features save us hours every week. Highly recommended.",
    avatar: "MC",
  },
  {
    name: "Emma Davis",
    role: "CEO, TechCorp",
    content: "Best investment we've made in team productivity tools.",
    avatar: "ED",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
              <Sparkles className="h-4 w-4 text-white dark:text-slate-900" />
            </div>
            <span>BuilderHub</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950" />

        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <Sparkles className="mr-1 h-3 w-3" />
            The Future of Project Management
          </Badge>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl text-slate-900 dark:text-slate-100">
            Manage Projects with AI
          </h1>

          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
            BuilderHub combines intelligent task management with real-time collaboration.
            Ship faster with AI-powered insights and automated workflows.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 px-4 py-20 dark:border-slate-800 sm:py-32 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to manage projects efficiently
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="dark:border-slate-800">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Icon className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 dark:border-slate-800 dark:bg-slate-900/50 sm:py-32 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Why Choose BuilderHub?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="dark:border-slate-800">
              <CardHeader>
                <CardTitle>Ready to Elevate Your Workflow?</CardTitle>
                <CardDescription>
                  Join thousands of teams already using BuilderHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  Start with a 14-day free trial. No credit card required.
                </p>
                <Link href="/auth/signup">
                  <Button className="w-full">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-slate-200 px-4 py-20 dark:border-slate-800 sm:py-32 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              Loved by Teams Worldwide
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold dark:bg-slate-800">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">
                    &quot;{testimonial.content}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 bg-slate-900 px-4 py-20 dark:border-slate-800 dark:bg-slate-950 sm:py-32 lg:px-6">
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mb-8 text-lg text-slate-400">
            Start your 14-day free trial today. Experience the power of intelligent project management.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-slate-700 text-white hover:bg-slate-800 sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 dark:border-slate-800 dark:bg-slate-950 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Features</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">About</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Follow</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Twitter</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">GitHub</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <p>&copy; 2024 BuilderHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
