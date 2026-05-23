import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { mockRecipes, categories } from '../data/mockRecipes'
import { useLanguage } from '../i18n/LanguageContext'

export default function ExplorePage() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(() => {
    let list = mockRecipes
    if (activeCategory !== 'all') {
      list = list.filter(r => r.categories.includes(activeCategory))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.titleSk?.toLowerCase().includes(q) ||
        r.categories.some(c => c.includes(q))
      )
    }
    return list
  }, [query, activeCategory])

  return (
    <Layout>
      {/* Search bar */}
      <div className="sticky top-14 z-30 bg-zinc-950/95 backdrop-blur-sm px-4 py-3 border-b border-zinc-800/50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => {
            const label = lang === 'sk' ? cat.labelSk : cat.label
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results grid */}
      <div className="p-1">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {filtered.map((recipe, i) => {
              const isLarge = i % 7 === 0
              return (
                <button
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className={`relative overflow-hidden bg-zinc-900 ${isLarge ? 'col-span-2 row-span-2' : ''}`}
                  style={{ aspectRatio: isLarge ? '1' : '1' }}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isLarge && (
                    <div className="absolute inset-x-0 bottom-0 gradient-overlay px-2 pb-2 pt-8">
                      <p className="text-white text-xs font-semibold line-clamp-2">
                        {lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title}
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Trending section when no search */}
      {!query && activeCategory === 'all' && (
        <div className="px-4 py-4">
          <h2 className="text-white font-bold text-base mb-3">🔥 {t('trending')}</h2>
          <div className="space-y-3">
            {mockRecipes.filter(r => r.isTrending).slice(0, 4).map(recipe => (
              <button
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="w-full flex gap-3 items-center bg-zinc-900 rounded-xl p-2 hover:bg-zinc-800 transition-colors"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-semibold line-clamp-2">
                    {lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">{recipe.prepTime} {t('min')} · {recipe.likes.toLocaleString()} {t('likes')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
