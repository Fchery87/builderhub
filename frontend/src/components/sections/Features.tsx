'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Palette, 
  Code, 
  Zap, 
  Globe, 
  Smartphone, 
  Database, 
  Shield, 
  Rocket,
  Layout,
  Sparkles,
  Cpu,
  Cloud
} from 'lucide-react'

const features = [
  {
    icon: Layout,
    title: "Drag & Drop Builder",
    description: "Intuitive visual editor with pre-designed components and templates.",
    badge: "Most Popular"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description: "Smart suggestions for layouts, colors, and content placement.",
    badge: "New"
  },
  {
    icon: Code,
    title: "Custom Code Support",
    description: "Add custom HTML, CSS, and JavaScript for advanced functionality."
  },
  {
    icon: Palette,
    title: "Design System",
    description: "Consistent theming with customizable colors, fonts, and components."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Automatically optimized for desktop, tablet, and mobile devices."
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Build websites in multiple languages with built-in translation tools."
  },
  {
    icon: Database,
    title: "Integrated Database",
    description: "Built-in database for dynamic content and user management."
  },
  {
    icon: Cloud,
    title: "Cloud Hosting",
    description: "Fast, secure hosting with global CDN and SSL certificates."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Advanced security features including DDoS protection and backups."
  },
  {
    icon: Rocket,
    title: "Performance Optimized",
    description: "Lightning-fast load times with automatic optimization."
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time on the same project."
  },
  {
    icon: Cpu,
    title: "API Integrations",
    description: "Connect with popular services and extend functionality."
  }
]

export default function Features() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Build Amazing Websites
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
            From simple landing pages to complex web applications, we&apos;ve got you covered
            with powerful features that make web development accessible to everyone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </Card>
          ))}
        </div>

        <div className="mt-20 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white sm:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">
                Developer-Friendly Tools
              </h3>
              <p className="mt-4 text-lg text-gray-300">
                While we make it easy for beginners, we also provide powerful tools 
                for developers who want more control.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-200">Git integration for version control</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-200">CLI tools for automation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-200">Component library with TypeScript support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-200">Custom domain and SSL management</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl font-bold">10,000+</div>
                  <div className="mt-2 text-gray-300">Active Developers</div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold">50K+</div>
                    <div className="text-sm text-gray-400">Websites Built</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}