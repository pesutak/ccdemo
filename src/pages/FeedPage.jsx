import Layout from '../components/layout/Layout'
import StoryBar from '../components/feed/StoryBar'
import RecipeCard from '../components/feed/RecipeCard'
import { mockRecipes } from '../data/mockRecipes'

const feedRecipes = mockRecipes.slice(0, 12)

export default function FeedPage() {
  return (
    <Layout>
      <StoryBar />
      <div className="divide-y divide-zinc-800/30">
        {feedRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Layout>
  )
}
