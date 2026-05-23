import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

const navItems = [
  { path: '/', icon: Home, key: 'home' },
  { path: '/explore', icon: Search, key: 'explore' },
  { path: '/create', icon: PlusSquare, key: 'create', accent: true },
  { path: '/saved', icon: Bookmark, key: 'saved' },
  { path: '/profile/me', icon: User, key: 'profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/60 max-w-lg mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, key, accent }) => {
          const isActive = location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path))
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-2 transition-all"
            >
              <Icon
                size={22}
                className={
                  accent
                    ? 'text-orange-500'
                    : isActive
                    ? 'text-orange-400'
                    : 'text-zinc-500'
                }
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] ${
                accent ? 'text-orange-500' : isActive ? 'text-orange-400' : 'text-zinc-500'
              }`}>
                {t(key)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
