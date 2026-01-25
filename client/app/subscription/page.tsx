'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Lock,
  Headphones,
  Code,
  Palette
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Plan {
  id: string
  name: string
  price: number
  monthlyLimit: number
  features: string[]
  popular: boolean
  color: string
  icon: any
}

interface Subscription {
  id: string
  plan: 'FREE' | 'PREMIUM' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED'
  currentUsage: number
  monthlyLimit: number
  startDate: string
  endDate?: string
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const plans: Plan[] = [
    {
      id: 'FREE',
      name: 'Free',
      price: 0,
      monthlyLimit: 100,
      features: [
        '100 generations per month',
        'Basic AI models',
        'Standard support',
        'Community access',
        'Basic analytics'
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600',
      icon: Sparkles
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: 29,
      monthlyLimit: 1000,
      features: [
        '1,000 generations per month',
        'Advanced AI models (GPT-4, DALL-E 3)',
        'Priority generation',
        'Email support',
        'Advanced analytics',
        'Export capabilities',
        'Custom categories',
        'Favorites system'
      ],
      popular: true,
      color: 'from-indigo-500 to-purple-600',
      icon: Crown
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 99,
      monthlyLimit: 10000,
      features: [
        '10,000+ generations per month',
        'All AI models',
        'Priority support',
        'API access',
        'Custom models',
        'Dedicated account manager',
        'White-label options',
        'Advanced security',
        'Team collaboration',
        'Custom integrations'
      ],
      popular: false,
      color: 'from-emerald-500 to-teal-600',
      icon: TrendingUp
    }
  ]

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadCurrentSubscription()
  }, [user, router])

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (currentSubscription?.plan === planId) {
      toast.error('You are already on this plan!')
      return
    }

    if (planId === 'FREE') {
      toast.error('You are already on the Free plan')
      return
    }

    // Redirect to payment page
    router.push(`/payment?plan=${planId}&planName=${planId}`)
  }

  const getPlanIcon = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    return plan?.icon || Sparkles
  }

  const getPlanColor = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    return plan?.color || 'from-gray-500 to-gray-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="h-6 w-6 rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
            </div>
            {currentSubscription && (
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor(currentSubscription.plan)}`}>
                  {React.createElement(getPlanIcon(currentSubscription.plan), { 
                    className: "h-5 w-5 text-white" 
                  })}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-semibold text-gray-900">{currentSubscription.plan}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Choose Your 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of AI generation with our flexible subscription plans. 
              Scale as you grow and never worry about limits again.
            </p>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentSubscription?.plan === plan.id
            const IconComponent = plan.icon
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}
                
                <div className={`bg-white rounded-2xl shadow-lg border-2 ${
                  plan.popular ? 'border-indigo-200' : 'border-gray-200'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''} p-8 h-full`}>
                  
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-gray-600">{plan.monthlyLimit.toLocaleString()} generations/month</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {isCurrentPlan ? (
                      <div className="text-center">
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
                          <Check className="h-4 w-4 mr-2" />
                          Current Plan
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={upgrading === plan.id}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {upgrading === plan.id ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Upgrading...</span>
                          </div>
                        ) : (
                          `Upgrade to ${plan.name}`
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Monthly Generations</td>
                  <td className="py-4 px-6 text-center">100</td>
                  <td className="py-4 px-6 text-center">1,000</td>
                  <td className="py-4 px-6 text-center">10,000+</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">AI Models</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">All Models</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Support</td>
                  <td className="py-4 px-6 text-center">Community</td>
                  <td className="py-4 px-6 text-center">Email</td>
                  <td className="py-4 px-6 text-center">Priority + Manager</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Analytics</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">API Access</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h4>
              <p className="text-gray-600">You'll be notified when you're close to your limit. You can upgrade your plan to continue generating.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">Yes, you can try our Free plan with 100 generations per month at no cost.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Absolutely! You can cancel your subscription at any time with no cancellation fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
