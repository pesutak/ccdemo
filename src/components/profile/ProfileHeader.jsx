import { CheckCircle } from 'lucide-react'
import Avatar from '../shared/Avatar'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n/LanguageContext'

const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n

export default function ProfileHeader({ user, isOwnProfile }) {
  const { following, toggleFollow } = useApp()
  const { t } = useLanguage()
  const isFollowing = following.has(user.id)

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-start gap-4 mb-4">
        <Avatar src={user.avatar} alt={user.displayName} size={80} hasStory={user.hasStory} />
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: t('posts'), value: user.recipes },
              { label: t('followers'), value: fmt(user.followers + (isFollowing ? 1 : 0)) },
              { label: t('following'), value: user.following },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-zinc-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-white font-semibold text-sm">{user.displayName}</span>
          {user.isVerified && (
            <CheckCircle size={14} className="text-orange-400 fill-orange-400" />
          )}
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{user.bio}</p>
      </div>

      {isOwnProfile ? (
        <button className="w-full py-2 rounded-xl border border-zinc-700 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors">
          {t('editProfile')}
        </button>
      ) : (
        <button
          onClick={() => toggleFollow(user.id)}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
            isFollowing
              ? 'border border-zinc-700 text-white hover:bg-zinc-800'
              : 'bg-orange-500 text-white hover:bg-orange-400'
          }`}
        >
          {isFollowing ? t('unfollow') : t('follow')}
        </button>
      )}
    </div>
  )
}
