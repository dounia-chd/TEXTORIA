'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Type, 
  Image, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: Type,
      title: 'LinkedIn Content Generation',
      description: 'Create engaging LinkedIn posts, thought leadership content, and professional networking materials with AI-powered insights.',
      items: ['LinkedIn Posts', 'Professional Articles', 'Industry Insights', 'Thought Leadership', 'Networking Content']
    },
    {
      icon: Image,
      title: 'Marketing Visuals',
      description: 'Generate professional logos, marketing posters, social media graphics, and business visuals using DALL-E technology.',
      items: ['Brand Logos', 'Marketing Posters', 'Social Media Graphics', 'Business Presentations', 'Digital Marketing Assets']
    },
    {
      icon: Zap,
      title: 'Email Marketing & Slogans',
      description: 'Create compelling email campaigns, brand slogans, and marketing copy that drives engagement and conversions.',
      items: ['Email Campaigns', 'Brand Slogans', 'Marketing Copy', 'Call-to-Actions', 'Brand Messaging']
    },
    {
      icon: Shield,
      title: 'Digital Marketing Specialized',
      description: 'TEXTORIA is specifically designed for marketing agencies, communication companies, and digital marketing professionals.',
      items: ['Agency Tools', 'Client Management', 'Campaign Creation', 'Brand Development', 'Marketing Strategy']
    }
  ]

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        '100 generations/month',
        'Basic AI models',
        'Standard support',
        'Community access'
      ],
      popular: false
    },
    {
      name: 'Premium',
      price: 29,
      features: [
        '1,000 generations/month',
        'Advanced AI models (GPT-4, DALL-E 3)',
        'Priority generation',
        'Email support',
        'Analytics dashboard',
        'Export capabilities'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      features: [
        '10,000+ generations/month',
        'All AI models',
        'Priority support',
        'API access',
        'Custom models',
        'Dedicated account manager'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 nav-glass sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-black gradient-text-epic">TEXTORIA</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                href="/dashboard" 
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="btn btn-ghost"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="mb-8">
              <span className="badge badge-primary text-sm px-4 py-2 mb-6 inline-block">
                ✨ Next-Generation AI Platform
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="gradient-text-epic">AI-Powered</span>
              <br />
              <span className="text-gray-900">Content Creation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create stunning text and images with advanced AI models. 
              Transform your content creation workflow with the most powerful AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {user ? (
                <Link 
                  href="/dashboard" 
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  Start Creating
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="btn btn-primary text-lg px-8 py-4"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                  <Link 
                    href="#features" 
                    className="btn btn-outline text-lg px-8 py-4"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">10M+</div>
                <div className="text-gray-600">Content Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-32 section-gradient relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="badge badge-secondary mb-4">Features</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Everything you need to create 
              <span className="gradient-text"> amazing content</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful AI tools designed for marketers, creators, and businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="feature-card text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-32 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="badge badge-secondary mb-4">Pricing</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Simple, transparent 
              <span className="gradient-text"> pricing</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs and scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${plan.popular ? 'pricing-card-popular' : 'pricing-card'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="badge badge-success text-sm px-6 py-2">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black mb-4">{plan.name}</h3>
                  <div className="text-6xl font-black mb-2">
                    ${plan.price}
                    <span className="text-xl text-gray-500 font-normal">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={user ? "/dashboard" : "/register"}
                  className={`btn w-full text-lg py-4 ${plan.popular ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'btn-outline'}`}
                >
                  {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/50 via-purple-600/50 to-pink-600/50"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge badge-secondary mb-6">Ready to Start?</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to transform your 
              <span className="block">content creation?</span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of creators and businesses using TEXTORIA to create amazing content
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href={user ? "/dashboard" : "/register"}
                className="btn bg-white text-indigo-600 hover:bg-gray-100 text-xl px-10 py-5"
              >
                Start Creating Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link 
                href="#features"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-indigo-600 text-xl px-10 py-5"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black gradient-text">TEXTORIA</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                AI-powered content generation platform for creators and businesses. Transform your workflow with cutting-edge AI technology.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-white font-bold">T</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-white font-bold">L</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300">
                  <span className="text-white font-bold">G</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#features" className="hover:text-white transition-colors duration-300">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors duration-300">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors duration-300">API</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors duration-300">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors duration-300">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors duration-300">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors duration-300">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors duration-300">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/help" className="hover:text-white transition-colors duration-300">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors duration-300">Status</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors duration-300">Documentation</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 TEXTORIA. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
