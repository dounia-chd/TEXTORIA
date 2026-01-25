'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Wand2, 
  ArrowLeft,
  Linkedin,
  Mail,
  Tag,
  Copy,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface GenerationForm {
  linkedin: {
    sujetPrincipal: string
    tonMessage: string
    publicCible: string
    motsCles: string
  }
  email: {
    objectifEmail: string
    audience: string
    offreProduit: string
    callToAction: string
  }
  slogan: {
    nomMarque: string
    secteurActivite: string
    valeursCles: string
    publicCible: string
  }
}

interface GeneratedContent {
  id: string
  type: 'linkedin' | 'email' | 'slogan'
  content: string
  prompt: string
  createdAt: string
  isFavorite: boolean
}

export default function TextGenerationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'linkedin' | 'email' | 'slogan'>('linkedin')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [lastGenerated, setLastGenerated] = useState<GeneratedContent | null>(null)
  
  const [formData, setFormData] = useState<GenerationForm>({
    linkedin: {
      sujetPrincipal: '',
      tonMessage: '',
      publicCible: '',
      motsCles: ''
    },
    email: {
      objectifEmail: '',
      audience: '',
      offreProduit: '',
      callToAction: ''
    },
    slogan: {
      nomMarque: '',
      secteurActivite: '',
      valeursCles: '',
      publicCible: ''
    }
  })

  const generationTypes = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      description: 'Posts professionnels pour LinkedIn',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Emails marketing et commerciaux',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'slogan',
      label: 'Slogan',
      icon: Tag,
      description: 'Slogans de marque et entreprise',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const handleInputChange = (type: keyof GenerationForm, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  const validateForm = (): boolean => {
    const currentForm = formData[selectedType]
    const requiredFields = Object.keys(currentForm)
    
    for (const field of requiredFields) {
      if (!currentForm[field as keyof typeof currentForm].trim()) {
        toast.error(`Le champ "${field}" est requis`)
        return false
      }
    }
    return true
  }

  const buildPrompt = (): string => {
    const currentForm = formData[selectedType]
    
    switch (selectedType) {
      case 'linkedin':
        return `Génère un post LinkedIn professionnel avec les critères suivants :
- Sujet principal : ${currentForm.sujetPrincipal}
- Ton du message : ${currentForm.tonMessage}
- Public cible : ${currentForm.publicCible}
- Mots-clés : ${currentForm.motsCles}

Le post doit être engageant, professionnel et optimisé pour LinkedIn.`
      
      case 'email':
        return `Génère un email marketing avec les critères suivants :
- Objectif de l'email : ${currentForm.objectifEmail}
- Audience : ${currentForm.audience}
- Offre/Produit : ${currentForm.offreProduit}
- Call-to-action souhaité : ${currentForm.callToAction}

L'email doit être persuasif, personnalisé et orienté vers l'action.`
      
      case 'slogan':
        return `Génère un slogan de marque avec les critères suivants :
- Nom de la marque/entreprise : ${currentForm.nomMarque}
- Secteur d'activité : ${currentForm.secteurActivite}
- Valeurs clés : ${currentForm.valeursCles}
- Public cible : ${currentForm.publicCible}

Le slogan doit être mémorable, court et refléter l'identité de la marque.`
      
      default:
        return ''
    }
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setLastGenerated(null)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 500)
    
    try {
      const prompt = buildPrompt()
      
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'TEXT',
          category: selectedType,
          prompt: prompt
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Contenu généré avec succès !')
        
        setLastGenerated({
          id: result.generation.id,
          type: selectedType,
          content: result.generation.content,
          prompt: prompt,
          createdAt: result.generation.createdAt,
          isFavorite: false
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Échec de la génération')
      }
    } catch (error) {
      toast.error('Une erreur inattendue s\'est produite')
    } finally {
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 500)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copié dans le presse-papiers !')
  }

  const renderForm = () => {
    switch (selectedType) {
      case 'linkedin':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet principal *
              </label>
              <input
                type="text"
                value={formData.linkedin.sujetPrincipal}
                onChange={(e) => handleInputChange('linkedin', 'sujetPrincipal', e.target.value)}
                placeholder="Ex: Lancement d'un nouveau produit, conseils professionnels..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ton du message *
              </label>
              <select
                value={formData.linkedin.tonMessage}
                onChange={(e) => handleInputChange('linkedin', 'tonMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un ton</option>
                <option value="professionnel">Professionnel</option>
                <option value="amical">Amical</option>
                <option value="inspirant">Inspirant</option>
                <option value="informatif">Informatif</option>
                <option value="persuasif">Persuasif</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public cible *
              </label>
              <input
                type="text"
                value={formData.linkedin.publicCible}
                onChange={(e) => handleInputChange('linkedin', 'publicCible', e.target.value)}
                placeholder="Ex: Professionnels du marketing, entrepreneurs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés *
              </label>
              <input
                type="text"
                value={formData.linkedin.motsCles}
                onChange={(e) => handleInputChange('linkedin', 'motsCles', e.target.value)}
                placeholder="Ex: innovation, digital, transformation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif de l'email *
              </label>
              <select
                value={formData.email.objectifEmail}
                onChange={(e) => handleInputChange('email', 'objectifEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sélectionnez un objectif</option>
                <option value="vente">Vente</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotion">Promotion</option>
                <option value="onboarding">Onboarding</option>
                <option value="relance">Relance</option>
                <option value="information">Information</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audience *
              </label>
              <input
                type="text"
                value={formData.email.audience}
                onChange={(e) => handleInputChange('email', 'audience', e.target.value)}
                placeholder="Ex: Clients existants, prospects qualifiés..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offre/Produit *
              </label>
              <input
                type="text"
                value={formData.email.offreProduit}
                onChange={(e) => handleInputChange('email', 'offreProduit', e.target.value)}
                placeholder="Ex: Formation en ligne, service de conseil..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call-to-action souhaité *
              </label>
              <input
                type="text"
                value={formData.email.callToAction}
                onChange={(e) => handleInputChange('email', 'callToAction', e.target.value)}
                placeholder="Ex: Réserver un appel, télécharger l'ebook..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        )

      case 'slogan':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la marque/entreprise *
              </label>
              <input
                type="text"
                value={formData.slogan.nomMarque}
                onChange={(e) => handleInputChange('slogan', 'nomMarque', e.target.value)}
                placeholder="Ex: TechCorp, GreenSolutions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité *
              </label>
              <input
                type="text"
                value={formData.slogan.secteurActivite}
                onChange={(e) => handleInputChange('slogan', 'secteurActivite', e.target.value)}
                placeholder="Ex: Technologie, alimentation, services..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeurs clés *
              </label>
              <input
                type="text"
                value={formData.slogan.valeursCles}
                onChange={(e) => handleInputChange('slogan', 'valeursCles', e.target.value)}
                placeholder="Ex: Innovation, durabilité, qualité..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public cible *
              </label>
              <input
                type="text"
                value={formData.slogan.publicCible}
                onChange={(e) => handleInputChange('slogan', 'publicCible', e.target.value)}
                placeholder="Ex: Jeunes professionnels, familles..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour au Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black gradient-text-epic">TEXTORIA</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Génération de Texte</h1>
          <p className="text-gray-600">Choisissez le type de contenu que vous souhaitez générer</p>
        </div>

        {/* Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {generationTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id as 'linkedin' | 'email' | 'slogan')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedType === type.id
                  ? `border-${type.color.split('-')[1]}-500 bg-${type.bgColor}`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Generation Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {generationTypes.find(t => t.id === selectedType)?.label} - Formulaire
            </h2>
            <p className="text-gray-600">
              Remplissez les informations ci-dessous pour générer votre contenu
            </p>
          </div>

          {renderForm()}

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Génération en cours...
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(generationProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Génération en cours...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wand2 className="h-5 w-5 mr-2" />
                Générer le contenu
              </div>
            )}
          </button>
        </div>

        {/* Generated Content */}
        {lastGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Contenu généré
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(lastGenerated.content)}
                  className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-100 transition-colors"
                  title="Copier"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLastGenerated(null)}
                  className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-100 transition-colors"
                  title="Fermer"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Contenu généré :</div>
              <div className="text-gray-900 whitespace-pre-wrap">{lastGenerated.content}</div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>Type: {generationTypes.find(t => t.id === lastGenerated.type)?.label}</span>
              <span>{new Date(lastGenerated.createdAt).toLocaleString()}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
