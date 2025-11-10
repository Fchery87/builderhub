'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown, ChevronUp, Star, Check, ArrowRight, Bot, Zap, Code, BarChart3, Bug, Users, Rocket, Shield, Globe } from 'lucide-react'
import './globals.css'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">BuilderHub</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#faq" className="block px-3 py-2 text-gray-600 hover:text-gray-900">FAQ</a>
              <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Build Smarter with AI
            <span className="block text-blue-600">Powered by BuilderHub</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The AI-powered platform for developers to create, collaborate, and deploy intelligent projects with cutting-edge code generation and smart automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              Try AI Assistant
              <Bot className="ml-2" size={20} />
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              Generate Code
              <Code className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Features</h3>
            <p className="text-xl text-gray-600">Cutting-edge tools to accelerate your development workflow</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">Optimized performance with cutting-edge technology stack and instant deployments.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Easy Collaboration</h4>
              <p className="text-gray-600">Work together seamlessly with real-time collaboration and version control.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-purple-600 transform rotate-45"></div>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Scalable Infrastructure</h4>
              <p className="text-gray-600">Built to grow with your needs from small projects to enterprise applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600">Get started in four simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Sign Up</h4>
              <p className="text-gray-600">Create your free account and get instant access to all features.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Create Project</h4>
              <p className="text-gray-600">Start a new project with our AI-powered templates or from scratch.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Collaborate</h4>
              <p className="text-gray-600">Invite your team and work together in real-time with smart tools.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">4. Deploy</h4>
              <p className="text-gray-600">Launch your project with one-click deployment to any platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h3>
            <p className="text-xl text-gray-600">Join thousands of satisfied developers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"BuilderHub transformed our development workflow. We've never been more productive!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600">Senior Developer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"The best platform for team collaboration. Our projects ship twice as fast now."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-gray-600">Tech Lead</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"Incredible features and amazing support. BuilderHub is a game-changer!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Davis</p>
                  <p className="text-gray-600">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
            <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Starter</h4>
              <p className="text-gray-600 mb-6">Perfect for individuals</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">$9<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">5 Projects</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">Basic Support</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">1GB Storage</span>
                </li>
              </ul>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-blue-600 p-8 rounded-xl text-white transform scale-105">
              <div className="bg-yellow-400 text-blue-900 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
              <h4 className="text-xl font-semibold mb-2">Professional</h4>
              <p className="text-blue-100 mb-6">For growing teams</p>
              <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-blue-100">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={20} className="text-white mr-3" />
                  <span>Unlimited Projects</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-white mr-3" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-white mr-3" />
                  <span>10GB Storage</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-white mr-3" />
                  <span>Team Collaboration</span>
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h4>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">$99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited Everything</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">Dedicated Support</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">Unlimited Storage</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-green-500 mr-3" />
                  <span className="text-gray-700">Custom Integrations</span>
                </li>
              </ul>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-xl text-gray-600">Got questions? We've got answers</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "How does BuilderHub compare to other platforms?",
                answer: "BuilderHub offers a unique combination of speed, collaboration features, and scalability that sets it apart from competitors. Our platform is designed by developers, for developers."
              },
              {
                question: "Can I change my plan later?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
              },
              {
                question: "Is there a free trial available?",
                answer: "We offer a 14-day free trial for all new users. No credit card required, and you get access to all Professional features during the trial."
              },
              {
                question: "What kind of support do you provide?",
                answer: "We offer email support for all plans, with priority support for Professional and dedicated account managers for Enterprise customers."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access will continue until the end of your billing period."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">BuilderHub</h4>
              <p className="text-gray-400">The ultimate platform for developers to build amazing projects.</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BuilderHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}