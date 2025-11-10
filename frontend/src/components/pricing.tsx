'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    price: '$0',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 3 projects',
      'Basic AI code generation',
      'Community support',
      'Public repositories only',
      'Basic templates',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: '$49',
    description: 'For professional developers and teams',
    features: [
      'Unlimited projects',
      'Advanced AI generation',
      'Priority support',
      'Private repositories',
      'Premium templates',
      'Team collaboration',
      'Custom integrations',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Dedicated support',
      'On-premise deployment',
      'Custom AI models',
      'SLA guarantee',
      'Advanced security features',
      'Custom training data',
    ],
    mostPopular: false,
  },
];

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you&apos;re an individual developer or a large enterprise, we have a plan that fits your needs.
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`text-sm font-semibold leading-6 ${
                billingInterval === 'monthly'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`text-sm font-semibold leading-6 ${
                billingInterval === 'yearly'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Annual billing (Save 20%)
            </button>
          </div>
        </div>
        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 ${
                tier.mostPopular
                  ? 'bg-blue-600 text-white ring-blue-600'
                  : 'bg-white text-gray-900 ring-gray-200'
              }`}
            >
              <div>
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tier.name}
                </h3>
                <p className="mt-4 text-sm leading-6">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-sm font-semibold leading-6">
                      /{billingInterval === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          tier.mostPopular ? 'text-white' : 'text-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant={tier.mostPopular ? 'secondary' : 'default'}
                className="mt-8"
                disabled={tier.price === 'Custom'}
              >
                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}