import { useNavigate } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function TopBar() {
  const navigate = useNavigate()
  const { lang, toggle } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 max-w-lg mx-auto">
      <div className="flex items-center justify-between px-4 h-14">
        <span
          className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          RecipeFlow
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            {lang === 'en' ? 'SK' : 'EN'}
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="text-zinc-300 hover:text-white transition-colors p-1"
          >
            <Search size={20} />
          </button>
          <button className="text-zinc-300 hover:text-white transition-colors p-1 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
