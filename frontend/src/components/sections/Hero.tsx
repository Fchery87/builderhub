'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Play, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

export default function Hero() {
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (email) {
      window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`
    } else {
      window.location.href = '/auth/signup'
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Website Builder
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Build Your Dream Website
            <span className="block text-blue-600">In Minutes, Not Months</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            Transform your ideas into stunning websites with our AI-powered builder. 
            No coding required. Just describe what you want, and watch it come to life.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex w-full max-w-md gap-2 sm:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/80 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleGetStarted()}
              />
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Free plan available
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Setup in 2 minutes
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Build and deploy in under 5 minutes</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="text-sm text-gray-600">Smart suggestions and automation</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure & Reliable</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security included</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white sm:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to build something amazing?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of creators who trust BuilderHub
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={handleGetStarted}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}