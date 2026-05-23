import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Avatar from '../shared/Avatar'
import { mockStories } from '../../data/mockStories'
import { mockUsers } from '../../data/mockUsers'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n/LanguageContext'

export default function StoryBar() {
  const navigate = useNavigate()
  const { viewedStories } = useApp()
  const { t } = useLanguage()

  const storiesWithUsers = mockStories.map(s => ({
    ...s,
    user: mockUsers.find(u => u.id === s.userId),
  }))

  return (
    <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
      {/* Add story button */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="relative w-16 h-16">
          <img
            src={mockUsers.find(u => u.id === 'me').avatar}
            alt="Your story"
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-zinc-950">
            <Plus size={10} className="text-white" />
          </div>
        </div>
        <span className="text-[11px] text-zinc-400 text-center w-16 truncate">{t('yourStory')}</span>
      </div>

      {storiesWithUsers.map(story => (
        <button
          key={story.id}
          onClick={() => navigate(`/stories/${story.userId}`)}
          className="flex flex-col items-center gap-1 flex-shrink-0"
        >
          <Avatar
            src={story.user.avatar}
            alt={story.user.displayName}
            size={56}
            hasStory
            viewed={viewedStories.has(story.id)}
          />
          <span className="text-[11px] text-zinc-400 text-center w-16 truncate">
            {story.user.username}
          </span>
        </button>
      ))}
    </div>
  )
}
