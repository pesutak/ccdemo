import { Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function LikeButton({ recipeId, count, size = 22 }) {
  const { liked, toggleLike } = useApp()
  const isLiked = liked.has(recipeId)

  return (
    <button
      onClick={() => toggleLike(recipeId)}
      className="flex flex-col items-center gap-0.5 group"
    >
      <Heart
        size={size}
        className={`transition-all duration-200 ${
          isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-300 group-active:scale-90'
        }`}
      />
      {count !== undefined && (
        <span className="text-xs text-zinc-400">
          {isLiked ? count + 1 : count}
        </span>
      )}
    </button>
  )
}
