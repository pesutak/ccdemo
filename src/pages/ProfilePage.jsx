import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Grid, Bookmark } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ProfileHeader from '../components/profile/ProfileHeader'
import { getUserById } from '../data/mockUsers'
import { getRecipesByUser } from '../data/mockRecipes'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../i18n/LanguageContext'

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { savedRecipes } = useApp()
  const { t, lang } = useLanguage()
  const [tab, setTab] = useState('posts')

  const user = getUserById(id)
  if (!user) return null

  const isOwnProfile = id === 'me'
  const userRecipes = getRecipesByUser(id)
  const displayRecipes = tab === 'posts' ? userRecipes : savedRecipes

  return (
    <Layout>
      {!isOwnProfile && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-4 py-3 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">{t('back')}</span>
        </button>
      )}

      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mt-2">
        <button
          onClick={() => setTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors border-b-2 ${
            tab === 'posts'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid size={16} />
          {t('posts')}
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'saved'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Bookmark size={16} />
            {t('saved')}
          </button>
        )}
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {displayRecipes.length === 0 ? (
          <div className="col-span-3 py-20 text-center">
            <Grid size={40} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500 text-sm">No recipes yet</p>
          </div>
        ) : (
          displayRecipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="relative aspect-square overflow-hidden bg-zinc-900"
            >
              <img
                src={recipe.image}
                alt={lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))
        )}
      </div>
    </Layout>
  )
}
