import { HashRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { AppProvider } from './context/AppContext'
import FeedPage from './pages/FeedPage'
import ExplorePage from './pages/ExplorePage'
import CreatePage from './pages/CreatePage'
import SavedPage from './pages/SavedPage'
import ProfilePage from './pages/ProfilePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import StoryViewer from './components/feed/StoryViewer'

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/stories/:userId" element={<StoryViewer />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </LanguageProvider>
  )
}
