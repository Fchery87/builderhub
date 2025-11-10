import { Zap, Shield, Users, Code2, Rocket, Globe } from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Generation',
    description: 'Transform ideas into code with our advanced AI that understands your requirements and generates production-ready applications.',
    icon: Zap,
  },
  {
    name: 'Enterprise Security',
    description: 'Built with security-first architecture. SOC 2 compliant, end-to-end encryption, and comprehensive audit trails.',
    icon: Shield,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together seamlessly with your team. Live updates, shared workspaces, and instant synchronization across all devices.',
    icon: Users,
  },
  {
    name: 'Multi-framework Support',
    description: 'Generate code for React, Vue, Angular, Node.js, and more. Always up-to-date with the latest frameworks and best practices.',
    icon: Code2,
  },
  {
    name: 'Instant Deployment',
    description: 'Go from idea to production in minutes. One-click deployment to AWS, Vercel, Netlify, and other major platforms.',
    icon: Rocket,
  },
  {
    name: 'Global Scale',
    description: 'Built to scale from startup to enterprise. Auto-scaling, CDN integration, and global infrastructure ready.',
    icon: Globe,
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build faster
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            BuilderHub provides all the tools and capabilities you need to transform your ideas into production-ready applications.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}