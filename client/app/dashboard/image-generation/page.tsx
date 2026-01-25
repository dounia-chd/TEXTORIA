'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Wand2, 
  ArrowLeft,
  Image,
  Copy,
  Download,
  CheckCircle,
  Palette,
  Crop,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageGenerationForm {
  description: string
  styleArtistique: string
  format: string
  qualite: string
}

interface GeneratedImage {
  id: string
  imageUrl: string
  prompt: string
  createdAt: string
  isFavorite: boolean
}

export default function ImageGenerationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [lastGenerated, setLastGenerated] = useState<GeneratedImage | null>(null)
  
  const [formData, setFormData] = useState<ImageGenerationForm>({
    description: '',
    styleArtistique: '',
    format: '',
    qualite: ''
  })

  const styleOptions = [
    { value: 'realiste', label: 'Réaliste' },
    { value: 'abstrait', label: 'Abstrait' },
    { value: 'impressionniste', label: 'Impressionniste' },
    { value: 'surrealiste', label: 'Surréaliste' },
    { value: 'minimaliste', label: 'Minimaliste' },
    { value: 'pop-art', label: 'Pop Art' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'moderne', label: 'Moderne' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'watercolor', label: 'Aquarelle' },
    { value: 'oil-painting', label: 'Peinture à l\'huile' },
    { value: 'digital-art', label: 'Art numérique' },
    { value: 'photography', label: 'Photographie' },
    { value: 'cartoon', label: 'Dessin animé' },
    { value: 'anime', label: 'Anime/Manga' }
  ]

  const formatOptions = [
    { value: 'square', label: 'Carré (1:1)', dimensions: '1024x1024' },
    { value: 'portrait', label: 'Portrait (3:4)', dimensions: '768x1024' },
    { value: 'landscape', label: 'Paysage (4:3)', dimensions: '1024x768' },
    { value: 'wide', label: 'Large (16:9)', dimensions: '1024x576' },
    { value: 'ultrawide', label: 'Ultra-large (21:9)', dimensions: '1024x438' }
  ]

  const qualiteOptions = [
    { value: 'standard', label: 'Standard', description: 'Équilibré entre qualité et vitesse' },
    { value: 'hd', label: 'Haute définition', description: 'Qualité supérieure, génération plus lente' },
    { value: 'ultra-hd', label: 'Ultra HD', description: 'Qualité maximale, génération plus lente' }
  ]

  const handleInputChange = (field: keyof ImageGenerationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.description.trim()) {
      toast.error('La description de l\'image est requise')
      return false
    }
    if (!formData.styleArtistique) {
      toast.error('Le style artistique est requis')
      return false
    }
    if (!formData.format) {
      toast.error('Le format est requis')
      return false
    }
    if (!formData.qualite) {
      toast.error('La qualité est requise')
      return false
    }
    return true
  }

  const buildPrompt = (): string => {
    const selectedFormat = formatOptions.find(f => f.value === formData.format)
    const selectedStyle = styleOptions.find(s => s.value === formData.styleArtistique)
    const selectedQualite = qualiteOptions.find(q => q.value === formData.qualite)
    
    // Build a more direct and specific prompt
    let prompt = `Description : ${formData.description.trim()}`;
    
    // Add specific context to avoid nature bias
    if (!formData.description.toLowerCase().includes('nature') && 
        !formData.description.toLowerCase().includes('paysage') &&
        !formData.description.toLowerCase().includes('montagne') &&
        !formData.description.toLowerCase().includes('forêt')) {
      prompt += ` (indoor scene, studio setting, urban environment)`;
    }
    
    if (selectedStyle && selectedStyle.value !== 'realiste') {
      prompt += `\n- Style artistique : ${selectedStyle.label}`;
    }
    
    prompt += `\n- Format : ${selectedFormat?.label || formData.format} (${selectedFormat?.dimensions || ''})`;
    prompt += `\n- Qualité : ${selectedQualite?.label || formData.qualite}`;
    
    return prompt;
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
          type: 'IMAGE',
          category: 'custom',
          prompt: prompt,
          format: formData.format,
          quality: formData.qualite
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Réponse du serveur:', result);
        
        if (result.generation && result.generation.imageUrl) {
          toast.success('Image générée avec succès !')
          
          setLastGenerated({
            id: result.generation.id,
            imageUrl: result.generation.imageUrl,
            prompt: prompt,
            createdAt: result.generation.createdAt,
            isFavorite: false
          })
        } else {
          console.error('Pas d\'URL d\'image dans la réponse:', result);
          toast.error('Image générée mais URL manquante')
        }
      } else {
        const error = await response.json()
        console.error('Erreur de génération:', error);
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
    toast.success('Prompt copié dans le presse-papiers !')
  }

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Image téléchargée !')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Génération d'Images</h1>
          <p className="text-gray-600">Créez des images uniques avec l'intelligence artificielle</p>
        </div>

        {/* Generation Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Image className="h-6 w-6 mr-2 text-purple-600" />
              Formulaire de génération d'image
            </h2>
            <p className="text-gray-600">
              Remplissez les informations ci-dessous pour générer votre image
            </p>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'image *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez l'image que vous souhaitez générer... Ex: Un chat noir assis sur un fauteuil rouge dans une pièce moderne avec de grandes fenêtres"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            </div>

            {/* Style Artistique */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style artistique *
              </label>
              <select
                value={formData.styleArtistique}
                onChange={(e) => handleInputChange('styleArtistique', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Sélectionnez un style</option>
                {styleOptions.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format *
              </label>
              <select
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Sélectionnez un format</option>
                {formatOptions.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} ({format.dimensions})
                  </option>
                ))}
              </select>
            </div>

            {/* Qualité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualité *
              </label>
              <select
                value={formData.qualite}
                onChange={(e) => handleInputChange('qualite', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Sélectionnez une qualité</option>
                {qualiteOptions.map((qualite) => (
                  <option key={qualite.value} value={qualite.value}>
                    {qualite.label} - {qualite.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Génération de l'image en cours...
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(generationProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                <span className="text-xs text-gray-500">
                  {generationProgress < 30 ? 'Analyse de votre demande...' :
                   generationProgress < 60 ? 'Création de l\'image...' :
                   generationProgress < 90 ? 'Finalisation...' : 'Presque terminé...'}
                </span>
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
                Génération de l'image...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Image className="h-5 w-5 mr-2" />
                Générer l'image
              </div>
            )}
          </button>
        </div>

        {/* Generated Image */}
        {lastGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Image générée
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(lastGenerated.prompt)}
                  className="p-2 text-purple-600 hover:text-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Copier le prompt"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => downloadImage(lastGenerated.imageUrl)}
                  className="p-2 text-purple-600 hover:text-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLastGenerated(null)}
                  className="p-2 text-purple-600 hover:text-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Fermer"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Image générée :</div>
              <div className="flex justify-center">
                {lastGenerated.imageUrl ? (
                  <img 
                    src={lastGenerated.imageUrl} 
                    alt="Generated" 
                    className="max-w-full h-auto rounded-lg border border-purple-200 shadow-lg"
                                         onError={(e) => {
                       console.error('Erreur de chargement de l\'image:', lastGenerated.imageUrl);
                       e.target.onerror = null;
                       e.target.src = `https://picsum.photos/1024/1024?random=${Date.now()}`;
                     }}
                    onLoad={() => {
                      console.log('Image chargée avec succès:', lastGenerated.imageUrl);
                    }}
                  />
                                 ) : (
                   <div className="w-96 h-96 bg-gray-100 rounded-lg border border-purple-200 flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <Image className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                       <p>Aucune image disponible</p>
                       <p className="text-sm">L'URL de l'image est vide</p>
                       <button 
                         onClick={() => {
                           setLastGenerated({
                             ...lastGenerated,
                             imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}`
                           });
                         }}
                         className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                       >
                         Charger une image de test
                       </button>
                     </div>
                   </div>
                 )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-purple-600">
              <span>Généré le {new Date(lastGenerated.createdAt).toLocaleString()}</span>
              <span>Type: Image</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
