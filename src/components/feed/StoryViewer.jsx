import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, ChevronRight } from 'lucide-react'
import { mockStories } from '../../data/mockStories'
import { mockUsers } from '../../data/mockUsers'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Avatar from '../shared/Avatar'

const STORY_DURATION = 5000

export default function StoryViewer() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { markStoryViewed } = useApp()
  const { t, lang } = useLanguage()

  const userStories = mockStories.filter(s => s.userId === userId)
  const user = mockUsers.find(u => u.id === userId)
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)

  const story = userStories[current]

  const goNext = useCallback(() => {
    if (current < userStories.length - 1) {
      setCurrent(c => c + 1)
      setProgress(0)
    } else {
      navigate(-1)
    }
  }, [current, userStories.length, navigate])

  const goPrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1)
      setProgress(0)
    }
  }

  useEffect(() => {
    if (!story) return
    markStoryViewed(story.id)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          goNext()
          return 100
        }
        return p + (100 / (STORY_DURATION / 50))
      })
    }, 50)
    return () => clearInterval(interval)
  }, [current, story?.id])

  if (!story || !user) return null

  const teaser = lang === 'sk' && story.teaserSk ? story.teaserSk : story.teaser

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center max-w-lg mx-auto">
      {/* Background image */}
      <div className="relative w-full h-full">
        <img
          src={story.image}
          alt={teaser}
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {userStories.map((s, i) => (
            <div key={s.id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{ width: i < current ? '100%' : i === current ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Author + close */}
        <div className="absolute top-8 left-3 right-3 flex items-center gap-3">
          <Avatar src={user.avatar} alt={user.displayName} size={36} />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{user.username}</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-white p-1">
            <X size={22} />
          </button>
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={goPrev} />
          <div className="flex-1" onClick={goNext} />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-8 left-4 right-4">
          <p className="text-white text-xl font-bold mb-4">{teaser}</p>
          <button
            onClick={() => navigate(`/recipe/${story.recipeId}`)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-3 rounded-full transition-colors"
          >
            {t('seeRecipe')}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
