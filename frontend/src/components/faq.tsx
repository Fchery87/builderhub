'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = [
    {
      question: "How does BuilderHub's AI-powered development work?",
      answer: "BuilderHub uses advanced machine learning models trained on millions of code repositories to provide intelligent code suggestions, automated testing, and performance optimization recommendations. Our AI learns from your team's coding patterns to provide increasingly accurate and context-aware assistance."
    },
    {
      question: "Can I integrate BuilderHub with my existing tools?",
      answer: "Yes! BuilderHub offers seamless integrations with popular development tools including GitHub, GitLab, Jira, Slack, Microsoft Teams, and many more. Our API-first approach allows you to connect with virtually any tool in your development workflow."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer tiered support based on your plan. Starter plans get email support, Professional plans include priority email and chat support, while Enterprise plans receive 24/7 dedicated support with a guaranteed response time and a dedicated account manager."
    },
    {
      question: "Is my data secure with BuilderHub?",
      answer: "Absolutely. We use bank-level encryption for data at rest and in transit, are SOC 2 Type II certified, and comply with GDPR, CCPA, and other major data protection regulations. Your data is yours, and we never use it to train our models without your explicit consent."
    },
    {
      question: "Can I change plans or cancel anytime?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle, and we provide full data export capabilities if you decide to leave."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We&apos;ve got answers
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible
              key={index}
              open={openFaq === `faq-${index}`}
              onOpenChange={(open) => setOpenFaq(open ? `faq-${index}` : null)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-6 text-left hover:bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {openFaq === `faq-${index}` ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 text-gray-600 border border-gray-200 border-t-0 rounded-b-lg">
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}