import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, Plus, Trash2, ChevronLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useLanguage } from '../i18n/LanguageContext'

export default function CreatePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  const [previewImg, setPreviewImg] = useState(null)
  const [published, setPublished] = useState(false)

  const addIngredient = () => setIngredients(p => [...p, ''])
  const updateIngredient = (i, v) => setIngredients(p => p.map((x, idx) => idx === i ? v : x))
  const removeIngredient = (i) => setIngredients(p => p.filter((_, idx) => idx !== i))

  const addStep = () => setSteps(p => [...p, ''])
  const updateStep = (i, v) => setSteps(p => p.map((x, idx) => idx === i ? v : x))
  const removeStep = (i) => setSteps(p => p.filter((_, idx) => idx !== i))

  const handlePublish = () => setPublished(true)

  if (published) {
    return (
      <Layout noTopBar noBottomNav>
        <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-zinc-950">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-white text-2xl font-bold mb-3">Recipe Published!</h2>
          <p className="text-zinc-400 mb-8">Your recipe is now live for everyone to discover.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-400 transition-colors"
          >
            Back to Feed
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-bold">{t('newRecipe')}</h1>
        <button
          onClick={handlePublish}
          disabled={!title.trim()}
          className="px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-full disabled:opacity-40 hover:bg-orange-400 transition-colors"
        >
          {t('publish')}
        </button>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Photo upload zone */}
        <div
          className="aspect-4-5 w-full rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 transition-colors bg-zinc-900 overflow-hidden relative"
          style={{ maxHeight: 320 }}
        >
          {previewImg ? (
            <img src={previewImg} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          ) : (
            <>
              <ImagePlus size={36} className="text-zinc-600" />
              <p className="text-zinc-500 text-sm font-medium">{t('addPhoto')}</p>
              <p className="text-zinc-600 text-xs">9:16 · 4:5 recommended</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => {
              const file = e.target.files[0]
              if (file) setPreviewImg(URL.createObjectURL(file))
            }}
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 block">{t('title')}</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Creamy Mushroom Risotto"
            className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 block">{t('description')}</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Share what makes this recipe special…"
            rows={3}
            className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors resize-none"
          />
        </div>

        {/* Quick meta */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Prep time', placeholder: '30 min' },
            { label: 'Servings', placeholder: '4' },
            { label: 'Difficulty', placeholder: 'Easy' },
          ].map(field => (
            <div key={field.label}>
              <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 block">{field.label}</label>
              <input
                placeholder={field.placeholder}
                className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 block">{t('ingredients')}</label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-orange-500 font-bold text-sm w-5 text-center flex-shrink-0">{i + 1}</span>
                <input
                  value={ing}
                  onChange={e => updateIngredient(i, e.target.value)}
                  placeholder={`${t('addIngredient')}…`}
                  className="flex-1 bg-zinc-900 text-white placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors"
                />
                {ingredients.length > 1 && (
                  <button onClick={() => removeIngredient(i)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors mt-1"
            >
              <Plus size={16} /> {t('addIngredient')}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="pb-4">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 block">{t('steps')}</label>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs flex-shrink-0 mt-2">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    value={step}
                    onChange={e => updateStep(i, e.target.value)}
                    placeholder={`${t('addStep')} ${i + 1}…`}
                    rows={2}
                    className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none border border-zinc-800 focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                {steps.length > 1 && (
                  <button onClick={() => removeStep(i)} className="text-zinc-600 hover:text-red-400 transition-colors mt-2.5">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addStep}
              className="flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors mt-1 ml-10"
            >
              <Plus size={16} /> {t('addStep')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
