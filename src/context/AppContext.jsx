import { createContext, useContext, useState } from 'react'
import { mockRecipes } from '../data/mockRecipes'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [liked, setLiked] = useState(new Set(['r5', 'r10']))
  const [saved, setSaved] = useState(new Set(['r5', 'r10', 'r1']))
  const [following, setFollowing] = useState(new Set(['u1', 'u2', 'u3', 'u7']))
  const [collections, setCollections] = useState([
    { id: 'c1', name: 'Weekend ideas', recipeIds: ['r1', 'r5'] },
    { id: 'c2', name: 'Healthy', recipeIds: ['r2', 'r6', 'r8'] },
  ])
  const [viewedStories, setViewedStories] = useState(new Set(['s3']))

  const toggleLike = (recipeId) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId)
      return next
    })
  }

  const toggleSave = (recipeId) => {
    setSaved(prev => {
      const next = new Set(prev)
      next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId)
      return next
    })
  }

  const saveToCollection = (recipeId, collectionId) => {
    setCollections(prev => prev.map(c =>
      c.id === collectionId
        ? { ...c, recipeIds: [...new Set([...c.recipeIds, recipeId])] }
        : c
    ))
    setSaved(prev => new Set([...prev, recipeId]))
  }

  const createCollection = (name) => {
    const id = 'c' + Date.now()
    setCollections(prev => [...prev, { id, name, recipeIds: [] }])
    return id
  }

  const toggleFollow = (userId) => {
    setFollowing(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  const markStoryViewed = (storyId) => {
    setViewedStories(prev => new Set([...prev, storyId]))
  }

  const savedRecipes = mockRecipes.filter(r => saved.has(r.id))

  return (
    <AppContext.Provider value={{
      liked, saved, following, collections, viewedStories,
      toggleLike, toggleSave, saveToCollection, createCollection,
      toggleFollow, markStoryViewed, savedRecipes,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
