'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Wand2, 
  Image, 
  History, 
  Settings, 
  LogOut, 
  Plus,
  BarChart3,
  Zap,
  Crown,
  User,
  Calendar,
  TrendingUp,
  Star,
  Download,
  Share2,
  Edit3,
  Trash2,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Generation {
  id: string
  type: 'TEXT' | 'IMAGE'
  category: string
  prompt: string
  content: string
  imageUrl?: string
  model: string
  createdAt: string
  isFavorite: boolean
}

interface UserStats {
  totalGenerations: number
  textGenerations: number
  imageGenerations: number
  monthlyUsage: number
  monthlyLimit: number
  totalTokens: number
  totalCost: number
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

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('generate')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationType, setGenerationType] = useState<'TEXT' | 'IMAGE'>('TEXT')
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('general')
  const [generations, setGenerations] = useState<Generation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'TEXT' | 'IMAGE'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [lastGenerated, setLastGenerated] = useState<Generation | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    totalGenerations: 0,
    textGenerations: 0,
    imageGenerations: 0,
    monthlyUsage: 0,
    monthlyLimit: 100,
    totalTokens: 0,
    totalCost: 0
  })

  useEffect(() => {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search)
    const oauthToken = urlParams.get('token')
    
    if (oauthToken) {
      // Store the OAuth token
      localStorage.setItem('token', oauthToken)
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname)
      // Reload the page to trigger auth context
      window.location.reload()
      return
    }
    
    if (!user) {
      router.push('/login')
      return
    }
    
    // Load user data, subscription, and generations
    Promise.all([loadUserData(), loadSubscription(), loadGenerations()]).finally(() => {
      setIsLoading(false)
    })
  }, [user, router])

  const loadUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const stats = await response.json()
        setUserStats(stats)
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const loadSubscription = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const loadGenerations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setGenerations(data.generations || [])
      }
    } catch (error) {
      console.error('Error loading generations:', error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    if (userStats.monthlyUsage >= userStats.monthlyLimit) {
      toast.error('You have reached your monthly limit. Upgrade to continue generating.')
      return
    }

    // Clear previous response when starting new generation
    setLastGenerated(null)
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 500)
    
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: generationType,
          category,
          prompt: prompt.trim()
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${generationType === 'TEXT' ? 'Text' : 'Image'} generation completed!`)
        
        // Add to generations list
        setGenerations(prev => [result.generation, ...prev])
        
        // Set the last generated content to show in the form
        setLastGenerated(result.generation)
        
        // Refresh generations to ensure latest data
        loadGenerations()
        
        // Update stats
        setUserStats(prev => ({
          ...prev,
          totalGenerations: prev.totalGenerations + 1,
          monthlyUsage: prev.monthlyUsage + 1,
          [generationType === 'TEXT' ? 'textGenerations' : 'imageGenerations']: 
            prev[generationType === 'TEXT' ? 'textGenerations' : 'imageGenerations'] + 1
        }))
        
        // Clear form
        setPrompt('')
        setCategory('general')
        setGenerationType('TEXT')
        // Don't clear lastGenerated - keep it visible
      } else {
        const error = await response.json()
        toast.error(error.error || 'Generation failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 500)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleFavorite = async (generationId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/generations/${generationId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        setGenerations(prev => 
          prev.map(gen => 
            gen.id === generationId 
              ? { ...gen, isFavorite: !gen.isFavorite }
              : gen
          )
        )
        toast.success('Favorite updated!')
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const categories = [
    { value: 'linkedin', label: 'LinkedIn Posts' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'slogan', label: 'Brand Slogans' },
    { value: 'social-media', label: 'Social Media Content' },
    { value: 'marketing-campaign', label: 'Marketing Campaigns' },
    { value: 'business-communication', label: 'Business Communication' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'content-strategy', label: 'Content Strategy' }
  ]

  const usagePercentage = (userStats.monthlyUsage / userStats.monthlyLimit) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black gradient-text-epic">TEXTORIA</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Admin Dashboard"
                >
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              )}
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Generations</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalGenerations}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wand2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.monthlyUsage} / {userStats.monthlyLimit}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Text Generations</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.textGenerations}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Edit3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Image Generations</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.imageGenerations}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Image className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Generation Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'generate', label: 'Generate', icon: Wand2 },
                    { id: 'history', label: 'History', icon: History },
                    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'generate' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Génération de Contenu</h2>
                      <p className="text-gray-600 mb-6">Choisissez le type de contenu que vous souhaitez générer avec nos outils avancés d'IA.</p>
                      
                      {/* Generate Buttons */}
                      <div className="space-y-4">
                          <button
                          onClick={() => router.push('/dashboard/text-generation')}
                          className="w-full btn btn-primary text-lg py-6"
                        >
                          <div className="flex items-center justify-center">
                            <Wand2 className="h-6 w-6 mr-3" />
                            Génération de Texte Avancée
                              </div>
                          <div className="text-sm mt-2 opacity-90">
                            Posts LinkedIn, Emails marketing, Slogans de marque
                            </div>
                          </button>
                          
                          <button
                          onClick={() => router.push('/dashboard/image-generation')}
                          className="w-full btn btn-primary text-lg py-6"
                        >
                           <div className="flex items-center justify-center">
                            <Image className="h-6 w-6 mr-3" />
                            Génération d'Images Avancée
                           </div>
                          <div className="text-sm mt-2 opacity-90">
                            Images haute qualité, styles artistiques, formats multiples
                           </div>
                             </button>
                           </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Generation History</h2>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search generations..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as 'ALL' | 'TEXT' | 'IMAGE')}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="ALL">All Types</option>
                          <option value="TEXT">Text Only</option>
                          <option value="IMAGE">Image Only</option>
                        </select>
                      </div>
                    </div>

                    {generations.length === 0 ? (
                      <div className="text-center py-12">
                        <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No generations yet</h3>
                        <p className="text-gray-500">Start creating content to see your history here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {generations
                          .filter(gen => 
                            (filterType === 'ALL' || gen.type === filterType) &&
                            (searchQuery === '' || 
                              gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              gen.category.toLowerCase().includes(searchQuery.toLowerCase()))
                          )
                          .map((generation) => (
                          <div
                            key={generation.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  generation.type === 'TEXT' 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : 'bg-pink-100 text-pink-600'
                                }`}>
                                  {generation.type === 'TEXT' ? <Edit3 className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{generation.category}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(generation.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleFavorite(generation.id)}
                                  className={`p-1 rounded ${
                                    generation.isFavorite 
                                      ? 'text-yellow-500 hover:text-yellow-600' 
                                      : 'text-gray-400 hover:text-yellow-500'
                                  }`}
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                  <Share2 className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">Prompt:</div>
                              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {generation.prompt}
                              </div>
                            </div>

                            {generation.type === 'TEXT' ? (
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-1">Generated Content:</div>
                                <div className="text-sm text-gray-900 bg-white border border-gray-200 p-3 rounded max-h-32 overflow-y-auto">
                                  {generation.content}
                                </div>
                              </div>
                                                         ) : (
                               <div>
                                 <div className="text-sm font-medium text-gray-700 mb-1">Generated Image:</div>
                                 {generation.imageUrl && (
                                   <img 
                                     src={generation.imageUrl} 
                                     alt="Generated" 
                                     className="w-full h-32 object-cover rounded border border-gray-200"
                                     onError={(e) => {
                                       e.target.onerror = null;
                                       e.target.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Generated+Image';
                                     }}
                                   />
                                 )}
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Usage Analytics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Monthly Usage</h3>
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Text Generations</span>
                            <span className="font-semibold text-gray-900">{userStats.textGenerations}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Image Generations</span>
                            <span className="font-semibold text-gray-900">{userStats.imageGenerations}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Tokens</span>
                            <span className="font-semibold text-gray-900">{userStats.totalTokens.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
                          <Crown className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Plan</span>
                            <span className="font-semibold text-gray-900">
                              {subscription?.plan || 'Free'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`font-semibold ${
                              subscription?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {subscription?.status || 'Active'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Usage</span>
                            <span className="font-semibold text-gray-900">
                              {userStats.monthlyUsage} / {userStats.monthlyLimit}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Remaining</span>
                            <span className="font-semibold text-gray-900">
                              {Math.max(0, userStats.monthlyLimit - userStats.monthlyUsage)}
                            </span>
                          </div>
                          {subscription?.plan === 'FREE' && (
                            <button 
                              onClick={() => router.push('/subscription')}
                              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                              Upgrade Plan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/dashboard/text-generation')}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Wand2 className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-700">Génération de Texte Avancée</span>
                </button>
                <button 
                  onClick={() => router.push('/dashboard/image-generation')}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Image className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Génération d'Images Avancée</span>
                </button>
                <button 
                  onClick={() => setActiveTab('generate')}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-700">New Generation</span>
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('history')
                    setFilterType('ALL')
                    setSearchQuery('')
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-700">View Favorites</span>
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Analytics</span>
                </button>
                <button 
                  onClick={() => router.push('/subscription')}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-700">Manage Subscription</span>
                </button>
              </div>
            </div>

            {/* Usage Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Usage Status</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {userStats.monthlyUsage} / {userStats.monthlyLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usagePercentage > 80 
                          ? 'bg-red-500' 
                          : usagePercentage > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {usagePercentage > 80 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {usagePercentage >= 100 ? 'Limit reached!' : 'Approaching limit'}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      {usagePercentage >= 100 
                        ? 'Upgrade your plan to continue generating content.'
                        : 'Consider upgrading to avoid interruptions.'
                      }
                    </p>
                    {usagePercentage >= 100 && (
                      <button 
                        onClick={() => router.push('/subscription')}
                        className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific in your prompts for better results</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use categories to organize your content</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Favorite your best generations for quick access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
