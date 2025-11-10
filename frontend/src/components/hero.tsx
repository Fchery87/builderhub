'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Globe,
  Shield,
  Sparkles,
  Code,
  Palette,
  Database
} from 'lucide-react'

export default function Hero() {
  const [email, setEmail] = useState('')

  const features = [
    { icon: Zap, text: 'AI-powered code generation' },
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: Globe, text: 'Global CDN deployment' }
  ]

  const techIcons = [
    { icon: Code, label: 'React' },
    { icon: Database, label: 'Backend' },
    { icon: Palette, label: 'Design' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Development Platform
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Lightning Fast</span>
            <br />
            Web Applications
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into production-ready applications with our AI-powered platform. 
            Generate code, deploy instantly, and scale globally—all in one seamless workflow.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <feature.icon className="w-4 h-4 mr-2 text-blue-600" />
                {feature.text}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex w-full sm:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-64 px-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" className="px-6 py-3 border-gray-300 hover:bg-gray-50 font-medium flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Tech Stack Icons */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-8 opacity-60">
            {techIcons.map((tech, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                  <tech.icon className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-xs text-gray-500">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}