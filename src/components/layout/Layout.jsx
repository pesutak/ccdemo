import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function Layout({ children, noTopBar, noBottomNav }) {
  return (
    <div className="min-h-svh bg-zinc-950 max-w-lg mx-auto relative">
      {!noTopBar && <TopBar />}
      <main className={`${!noTopBar ? 'pt-14' : ''} ${!noBottomNav ? 'pb-16' : ''}`}>
        {children}
      </main>
      {!noBottomNav && <BottomNav />}
    </div>
  )
}
