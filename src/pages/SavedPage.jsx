import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Bookmark } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../i18n/LanguageContext'
import { getRecipeById } from '../data/mockRecipes'

export default function SavedPage() {
  const { savedRecipes, collections } = useApp()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [view, setView] = useState('saved') // 'saved' | collectionId
  const [tab, setTab] = useState('all') // 'all' | 'collections'

  const activeCollection = collections.find(c => c.id === view)
  const collectionRecipes = activeCollection
    ? activeCollection.recipeIds.map(id => getRecipeById(id)).filter(Boolean)
    : []

  const displayRecipes = view === 'saved' ? savedRecipes : collectionRecipes
  const displayTitle = view === 'saved' ? t('allSaved') : activeCollection?.name

  return (
    <Layout>
      <div className="px-4 pt-2 pb-4">
        {/* Header */}
        {view !== 'saved' && (
          <button
            onClick={() => setView('saved')}
            className="flex items-center gap-1 text-orange-400 text-sm font-medium mb-3"
          >
            ← {t('back')}
          </button>
        )}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-bold text-xl">{displayTitle}</h1>
          {view === 'saved' && (
            <span className="text-zinc-500 text-sm">{savedRecipes.length} recipes</span>
          )}
        </div>

        {view === 'saved' && (
          <>
            {/* Tabs */}
            <div className="flex gap-0 mb-4 bg-zinc-900 rounded-xl p-1">
              {[
                { id: 'all', label: t('allSaved') },
                { id: 'collections', label: t('myCollections') },
              ].map(t2 => (
                <button
                  key={t2.id}
                  onClick={() => setTab(t2.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    tab === t2.id ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t2.label}
                </button>
              ))}
            </div>

            {tab === 'collections' && (
              <div className="space-y-2 mb-4">
                {collections.map(col => {
                  const first = col.recipeIds[0] ? getRecipeById(col.recipeIds[0]) : null
                  return (
                    <button
                      key={col.id}
                      onClick={() => setView(col.id)}
                      className="w-full flex items-center gap-3 bg-zinc-900 rounded-xl p-3 hover:bg-zinc-800 transition-colors"
                    >
                      {first ? (
                        <img
                          src={first.image}
                          alt={col.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          <Bookmark size={20} className="text-zinc-600" />
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold text-sm">{col.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{col.recipeIds.length} recipes</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600" />
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Recipe grid */}
        {(tab === 'all' || view !== 'saved') && (
          <div className="grid grid-cols-3 gap-0.5">
            {displayRecipes.length === 0 ? (
              <div className="col-span-3 py-20 text-center">
                <Bookmark size={40} className="mx-auto mb-3 text-zinc-700" />
                <p className="text-zinc-500 text-sm">Nothing saved yet</p>
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
        )}
      </div>
    </Layout>
  )
}
