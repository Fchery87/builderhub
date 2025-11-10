'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Star, Zap, Crown, Rocket } from 'lucide-react'

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: "$0",
    period: "forever",
    icon: Rocket,
    color: "from-gray-600 to-gray-700",
    features: [
      "1 website",
      "Basic templates",
      "Community support",
      "BuilderHub subdomain",
      "100 MB storage",
      "Basic analytics"
    ],
    limitations: [
      "No custom domain",
      "Limited bandwidth",
      "No AI features"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    description: "For growing businesses and professionals",
    price: "$29",
    period: "per month",
    icon: Zap,
    color: "from-blue-600 to-indigo-600",
    features: [
      "10 websites",
      "Premium templates",
      "Priority support",
      "Custom domains",
      "5 GB storage",
      "Advanced analytics",
      "AI-powered suggestions",
      "Team collaboration (3 users)",
      "Custom components",
      "API access"
    ],
    limitations: [
      "Limited AI credits"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large teams and organizations",
    price: "Custom",
    period: "contact us",
    icon: Crown,
    color: "from-purple-600 to-pink-600",
    features: [
      "Unlimited websites",
      "Custom templates",
      "Dedicated support",
      "White-label options",
      "Unlimited storage",
      "Enterprise analytics",
      "Unlimited AI credits",
      "Unlimited team members",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "On-premise deployment"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false
  }
]

const faqs = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise accounts."
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees."
  }
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-0 ${
                plan.popular
                  ? 'ring-2 ring-blue-600 shadow-xl scale-105'
                  : 'shadow-sm'
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`mx-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${plan.color} text-white`}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white sm:p-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold sm:text-3xl">
              30-Day Money Back Guarantee
            </h3>
            <p className="mt-4 text-lg text-gray-300">
              Try BuilderHub risk-free. If you&apos;re not satisfied, we&apos;ll refund your payment.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}