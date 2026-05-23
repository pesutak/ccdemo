import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n/LanguageContext'

export default function SaveModal({ recipeId, onClose }) {
  const { collections, saveToCollection, createCollection, saved, toggleSave } = useApp()
  const { t } = useLanguage()
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const handleSaveToCollection = (colId) => {
    saveToCollection(recipeId, colId)
    onClose()
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const id = createCollection(newName.trim())
    saveToCollection(recipeId, id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-zinc-900 rounded-t-2xl p-4 pb-8 border-t border-zinc-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">{t('saveToCollection')}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {collections.map(col => {
            const alreadyIn = col.recipeIds.includes(recipeId)
            return (
              <button
                key={col.id}
                onClick={() => !alreadyIn && handleSaveToCollection(col.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <span className="text-white text-sm">{col.name}</span>
                {alreadyIn && <Check size={16} className="text-orange-400" />}
              </button>
            )
          })}
        </div>

        {showCreate ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder={t('collectionName')}
              className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm outline-none border border-zinc-700 focus:border-orange-500 transition-colors"
            />
            <button
              onClick={handleCreate}
              className="px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-400 transition-colors"
            >
              {t('save')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-orange-500 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm">{t('newCollection')}</span>
          </button>
        )}
      </div>
    </div>
  )
}
