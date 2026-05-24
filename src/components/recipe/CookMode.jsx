import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, Check } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function CookMode({ recipe, onClose }) {
  const { t, lang } = useLanguage()
  const [step, setStep] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [touchStart, setTouchStart] = useState(null)

  const title = lang === 'sk' && recipe.titleSk ? recipe.titleSk : recipe.title
  const steps = recipe.steps
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  // Keep screen awake
  useEffect(() => {
    let wakeLock = null
    const acquire = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch {}
    }
    acquire()
    return () => { wakeLock?.release() }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step])

  const next = useCallback(() => {
    if (!isLast) setStep(s => s + 1)
  }, [isLast])

  const prev = useCallback(() => {
    if (!isFirst) setStep(s => s - 1)
  }, [isFirst])

  // Swipe support
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  const toggleIngredient = (i) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col max-w-lg mx-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b border-zinc-800/60 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Cook Mode</p>
          <p className="text-white font-bold text-sm truncate">{title}</p>
        </div>
        <div className="flex items-center gap-3 ml-3">
          <button
            onClick={() => setShowIngredients(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              showIngredients
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed size={13} />
            {t('ingredients')}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Ingredients panel */}
      {showIngredients && (
        <div className="flex-shrink-0 border-b border-zinc-800/60 bg-zinc-900/80">
          <div className="px-4 py-3 max-h-48 overflow-y-auto">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">{t('ingredients')}</p>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <button
                  key={i}
                  onClick={() => toggleIngredient(i)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    checkedIngredients.has(i)
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-zinc-600'
                  }`}>
                    {checkedIngredients.has(i) && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm transition-colors ${
                    checkedIngredients.has(i) ? 'text-zinc-600 line-through' : 'text-zinc-200'
                  }`}>
                    <span className="text-orange-400 font-semibold">{ing.amount}</span>
                    {' '}{ing.item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex gap-1 px-4 pt-4 flex-shrink-0">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < step ? 'bg-orange-500' : i === step ? 'bg-orange-400' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* Step counter */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <span className="text-zinc-500 text-sm font-medium">
          {t('steps')} {step + 1} / {steps.length}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center px-6 overflow-hidden">
        <div className="w-full">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-6">
            <span className="text-orange-400 font-black text-2xl">{step + 1}</span>
          </div>
          <p className="text-white text-2xl font-semibold leading-relaxed">
            {steps[step]}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 px-4 pb-safe pb-8 pt-4 flex-shrink-0">
        <button
          onClick={prev}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-zinc-800 text-white text-sm font-semibold disabled:opacity-30 hover:bg-zinc-900 transition-colors"
        >
          <ChevronLeft size={20} />
          {t('back')}
        </button>

        {isLast ? (
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors"
          >
            <Check size={20} />
            Done! 🎉
          </button>
        ) : (
          <button
            onClick={next}
            className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors"
          >
            Next Step
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
