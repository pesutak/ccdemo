import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Bookmark, Share2, Clock, ChefHat } from 'lucide-react'
import LikeButton from '../shared/LikeButton'
import SaveModal from '../shared/SaveModal'
import Avatar from '../shared/Avatar'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getUserById } from '../../data/mockUsers'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()
  const { saved, toggleSave } = useApp()
  const { t, lang } = useLanguage()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const author = getUserById(recipe.authorId)
  const isSaved = saved.has(recipe.id)
  const title = lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title

  return (
    <>
      <article className="mb-1">
        {/* Author header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(`/profile/${recipe.authorId}`)}>
            <Avatar src={author.avatar} alt={author.displayName} size={36} hasStory={author.hasStory} />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate(`/profile/${recipe.authorId}`)}
              className="text-white text-sm font-semibold hover:text-orange-400 transition-colors"
            >
              {author.username}
            </button>
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Clock size={10} />
              <span>{recipe.prepTime} {t('min')}</span>
              <span>·</span>
              <ChefHat size={10} />
              <span className="capitalize">{t(recipe.difficulty)}</span>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white text-xl leading-none">···</button>
        </div>

        {/* Image */}
        <button
          className="w-full block relative bg-zinc-900"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          <div className="aspect-4-5 w-full overflow-hidden">
            <img
              src={recipe.image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Category tags overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {recipe.categories.slice(0, 2).map(cat => (
              <span
                key={cat}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
          {/* Gradient + title */}
          <div className="absolute inset-x-0 bottom-0 gradient-overlay px-4 pt-16 pb-4">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{title}</h3>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4 px-4 pt-3 pb-1">
          <LikeButton recipeId={recipe.id} count={recipe.likes} />
          <button
            className="flex flex-col items-center gap-0.5"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            <MessageCircle size={22} className="text-zinc-300" />
            <span className="text-xs text-zinc-400">{recipe.comments}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5">
            <Share2 size={22} className="text-zinc-300" />
          </button>
          <button
            className="ml-auto flex flex-col items-center gap-0.5"
            onClick={() => setShowSaveModal(true)}
          >
            <Bookmark
              size={22}
              className={isSaved ? 'fill-orange-400 text-orange-400' : 'text-zinc-300'}
            />
          </button>
        </div>

        {/* Diet tags */}
        {recipe.diet.length > 0 && (
          <div className="flex gap-2 px-4 pb-3">
            {recipe.diet.map(d => (
              <span
                key={d}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 capitalize"
              >
                {d === 'vegan' ? t('vegan') : d === 'vegetarian' ? t('vegetarian') : d === 'gluten-free' ? t('glutenFree') : d}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-zinc-800/50 mx-4" />
      </article>

      {showSaveModal && (
        <SaveModal recipeId={recipe.id} onClose={() => setShowSaveModal(false)} />
      )}
    </>
  )
}
