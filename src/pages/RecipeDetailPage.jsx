import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Clock, Users, ChefHat, Bookmark, Share2, MessageCircle, Send } from 'lucide-react'
import LikeButton from '../components/shared/LikeButton'
import SaveModal from '../components/shared/SaveModal'
import Avatar from '../components/shared/Avatar'
import { getRecipeById } from '../data/mockRecipes'
import { getUserById } from '../data/mockUsers'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../i18n/LanguageContext'

const mockComments = [
  { id: 'c1', userId: 'u3', text: 'This looks absolutely amazing! 😍', time: '2h' },
  { id: 'c2', userId: 'u6', text: 'Made this last night, the family loved it!', time: '5h' },
  { id: 'c3', userId: 'u4', text: 'Adding this to my weekend list 🔥', time: '1d' },
]

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { saved, toggleSave } = useApp()
  const { t, lang } = useLanguage()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [comment, setComment] = useState('')
  const [activeStep, setActiveStep] = useState(null)

  const recipe = getRecipeById(id)
  if (!recipe) return null

  const author = getUserById(recipe.authorId)
  const isSaved = saved.has(recipe.id)
  const title = lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title
  const description = lang === 'sk' && recipe.descriptionSk ? recipe.descriptionSk : recipe.description

  const difficultyColor = {
    easy: 'text-green-400',
    medium: 'text-amber-400',
    hard: 'text-red-400',
  }[recipe.difficulty]

  return (
    <>
      <div className="min-h-svh bg-zinc-950 max-w-lg mx-auto">
        {/* Hero image */}
        <div className="relative aspect-4-5 w-full bg-zinc-900" style={{ maxHeight: '70vw', minHeight: 260 }}>
          <img src={recipe.image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-overlay" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
            >
              <Bookmark
                size={18}
                className={isSaved ? 'fill-orange-400 text-orange-400' : 'text-white'}
              />
            </button>
            <button className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
              <Share2 size={18} />
            </button>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            {recipe.categories.map(cat => (
              <span
                key={cat}
                className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/30 border border-orange-500/50 text-orange-300 mr-1 mb-2 capitalize"
              >
                {cat}
              </span>
            ))}
            <h1 className="text-white text-2xl font-bold leading-tight">{title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-5">
          {/* Author row */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/profile/${author.id}`)}>
              <Avatar src={author.avatar} alt={author.displayName} size={40} />
            </button>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{author.displayName}</p>
              <p className="text-zinc-500 text-xs">@{author.username}</p>
            </div>
            <LikeButton recipeId={recipe.id} count={recipe.likes} />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: t('prepTime'), value: `${recipe.prepTime} ${t('min')}` },
              { icon: Users, label: t('servings'), value: recipe.servings },
              { icon: ChefHat, label: t('difficulty'), value: t(recipe.difficulty) },
            ].map(item => (
              <div key={item.label} className="bg-zinc-900 rounded-xl p-3 text-center">
                <item.icon size={18} className="mx-auto mb-1 text-orange-400" />
                <p className="text-white font-semibold text-sm">{item.value}</p>
                <p className="text-zinc-500 text-[10px]">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Diet tags */}
          {recipe.diet.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.diet.map(d => (
                <span
                  key={d}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize"
                >
                  {d === 'vegan' ? t('vegan') : d === 'vegetarian' ? t('vegetarian') : d === 'gluten-free' ? t('glutenFree') : d}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>

          {/* Ingredients */}
          <div>
            <h2 className="text-white font-bold text-base mb-3">{t('ingredients')}</h2>
            <div className="bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-800">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-orange-400 font-bold text-sm min-w-[60px]">{ing.amount}</span>
                  <span className="text-zinc-200 text-sm">{ing.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-white font-bold text-base mb-3">{t('steps')}</h2>
            <div className="space-y-3">
              {recipe.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={`w-full flex gap-4 items-start text-left p-4 rounded-2xl transition-colors ${
                    activeStep === i ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-zinc-900'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    activeStep === i ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {i + 1}
                  </div>
                  <p className="text-zinc-200 text-sm leading-relaxed">{step}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <MessageCircle size={18} className="text-zinc-400" />
              {t('comments')} ({recipe.comments})
            </h2>
            <div className="space-y-3 mb-4">
              {mockComments.map(c => {
                const u = getUserById(c.userId)
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar src={u.avatar} alt={u.displayName} size={32} />
                    <div className="flex-1">
                      <div className="bg-zinc-900 rounded-2xl rounded-tl-sm px-3 py-2">
                        <p className="text-orange-400 text-xs font-semibold mb-0.5">{u.username}</p>
                        <p className="text-zinc-200 text-sm">{c.text}</p>
                      </div>
                      <p className="text-zinc-600 text-[10px] mt-1 ml-2">{c.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Comment input */}
            <div className="flex gap-2 items-center">
              <Avatar
                src={getUserById('me').avatar}
                alt="Me"
                size={32}
              />
              <div className="flex-1 relative">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment…"
                  className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-full px-4 py-2 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors pr-10"
                />
                {comment && (
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="h-16" />
        </div>
      </div>

      {showSaveModal && (
        <SaveModal recipeId={recipe.id} onClose={() => setShowSaveModal(false)} />
      )}
    </>
  )
}
