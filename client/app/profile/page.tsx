'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Settings, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
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

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['100 generations per month', 'Basic AI models', 'Standard support', 'Community access', 'Basic analytics'],
      icon: <User className="h-6 w-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29,
      features: ['1,000 generations per month', 'Advanced AI models (GPT-4, DALL-E 3)', 'Priority generation', 'Email support', 'Advanced analytics'],
      popular: true,
      icon: <Crown className="h-6 w-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      features: ['10,000+ generations per month', 'All AI models', 'Priority support', 'API access', 'Custom models'],
      icon: <Star className="h-6 w-6" />
    }
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('User data received:', data.user)
        console.log('Subscription data:', data.user.subscription)
        setUserData(data.user)
        setSubscription(data.user.subscription) // Set subscription from user data
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planName: string) => {
    if (planName.toLowerCase() === 'free') {
      toast.error('You are already on the Free plan')
      return
    }
    
    // Redirect to payment page
    router.push(`/payment?plan=${planName.toUpperCase()}&planName=${planName}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUsagePercentage = () => {
    if (!subscription) return 0
    return Math.round((subscription.currentUsage / subscription.monthlyLimit) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                                       <div>
                         <h2 className="text-xl font-semibold text-gray-900">{userData?.firstName} {userData?.lastName}</h2>
                         <p className="text-gray-600">{userData?.email}</p>
                       </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{userData?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Member since {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700 capitalize">{userData?.role}</span>
                </div>
              </div>
            </motion.div>

            {/* Current Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">
                    {subscription?.plan || 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    subscription?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subscription?.status || 'Active'}
                  </span>
                </div>
                                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-gray-600">Usage</span>
                   <span className="font-semibold text-gray-900">
                     {subscription?.currentUsage || 0} / {subscription?.monthlyLimit || 100}
                   </span>
                 </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Monthly Usage</span>
                  <span>{getUsagePercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getUsagePercentage() > 80 ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  ></div>
                </div>
              </div>

              {subscription?.plan === 'FREE' && (
                <button 
                  onClick={() => router.push('/subscription')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Upgrade Plan
                </button>
              )}
            </motion.div>
          </div>

          {/* Plans Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`relative bg-white border rounded-xl p-6 ${
                        plan.popular ? 'ring-2 ring-indigo-500' : 'border-gray-200'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}

                      {subscription?.plan === plan.name.toUpperCase() && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Current Plan
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-indigo-600">
                          {plan.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {subscription?.plan === plan.name.toUpperCase() ? (
                        <button 
                          disabled
                          className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpgrade(plan.name)}
                          disabled={upgrading}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {upgrading ? 'Upgrading...' : `Upgrade to ${plan.name}`}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
