'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder at TechStart",
    avatar: "SC",
    content: "BuilderHub transformed how we build our landing pages. What used to take weeks now takes hours. The AI suggestions are incredibly helpful!",
    rating: 5,
    company: "TechStart"
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Director",
    avatar: "MR",
    content: "As someone with no coding experience, I was able to create a professional website for our campaign. The drag-and-drop interface is intuitive and powerful.",
    rating: 5,
    company: "Growth Labs"
  },
  {
    name: "Emily Johnson",
    role: "Freelance Designer",
    avatar: "EJ",
    content: "The design system and component library have streamlined my workflow. I can now focus on creativity instead of repetitive coding tasks.",
    rating: 5,
    company: "Creative Studio"
  },
  {
    name: "David Kim",
    role: "CTO at StartupX",
    avatar: "DK",
    content: "We migrated our entire product landing pages to BuilderHub. The performance improvements and ease of use have been game-changing for our team.",
    rating: 5,
    company: "StartupX"
  },
  {
    name: "Lisa Thompson",
    role: "E-commerce Manager",
    avatar: "LT",
    content: "The integration capabilities are fantastic. We connected our store, CRM, and analytics tools seamlessly. Highly recommended!",
    rating: 5,
    company: "Retail Pro"
  },
  {
    name: "James Wilson",
    role: "Digital Agency Owner",
    avatar: "JW",
    content: "We use BuilderHub for all our client projects. The collaboration features and white-label options make it perfect for agencies.",
    rating: 5,
    company: "Digital First"
  }
]

const stats = [
  { value: "4.9/5", label: "Average Rating" },
  { value: "10,000+", label: "Happy Customers" },
  { value: "50K+", label: "Websites Built" },
  { value: "99%", label: "Customer Satisfaction" }
]

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Thousands of Creators
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
            See what our customers have to say about their experience with BuilderHub
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="absolute right-6 top-6 text-blue-100">
                  <Quote className="h-8 w-8" />
                </div>
                
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="mb-6 text-gray-700 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white sm:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Join Our Community of Happy Builders
            </h3>
            <p className="mt-4 text-lg text-blue-100">
              Start building today and see why thousands of creators choose BuilderHub
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-100">
                  10,000+ active users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}