import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { buildLiquidGlassFilter } from '../../utils/liquidGlass'

const NAV_FILTER_ID = 'lg-nav-filter'
const glassProps = buildLiquidGlassFilter({
  filterId: NAV_FILTER_ID,
  width: 380,
  height: 72,
  radius: 24,
  depth: 10,
  strength: 24,
  chromaticAberration: 3,
})

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
    <>
      {/* Hidden SVG — liquid glass filter definition (Chrome/Edge backdrop-filter) */}
      <svg
        style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={NAV_FILTER_ID}
            x="-10%" y="-10%"
            width="120%" height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={glassProps.mapURI}
              result="map"
              x="0" y="0"
              width="100%" height="100%"
              preserveAspectRatio="none"
            />
            {/* Red channel — highest displacement (chromatic aberration) */}
            <feDisplacementMap
              in="SourceGraphic" in2="map"
              scale={glassProps.rScale}
              xChannelSelector="R" yChannelSelector="G"
              result="rD"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              in="rD" result="rC"
            />
            {/* Green channel */}
            <feDisplacementMap
              in="SourceGraphic" in2="map"
              scale={glassProps.gScale}
              xChannelSelector="R" yChannelSelector="G"
              result="gD"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              in="gD" result="gC"
            />
            {/* Blue channel — lowest displacement */}
            <feDisplacementMap
              in="SourceGraphic" in2="map"
              scale={glassProps.bScale}
              xChannelSelector="R" yChannelSelector="G"
              result="bD"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              in="bD" result="bC"
            />
            {/* Merge R+G+B via screen blend */}
            <feBlend in="rC" in2="gC" mode="screen" result="rg" />
            <feBlend in="rg" in2="bC" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Floating nav panel */}
      <nav
        className="fixed z-40"
        style={{
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 440,
        }}
      >
        {/* Glass shell */}
        <div
          style={{
            borderRadius: 26,
            height: 68,
            position: 'relative',
            overflow: 'hidden',
            // Chrome/Edge: SVG displacement + blur for refraction effect
            backdropFilter: `url('#${NAV_FILTER_ID}') blur(28px) saturate(190%) brightness(1.08)`,
            WebkitBackdropFilter: 'blur(28px) saturate(190%) brightness(1.08)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 60%, rgba(249,115,22,0.07) 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderTop: '1px solid rgba(255,255,255,0.28)',
            boxShadow: [
              '0 8px 40px rgba(0,0,0,0.55)',
              '0 2px 12px rgba(0,0,0,0.35)',
              'inset 0 1px 0 rgba(255,255,255,0.22)',
              'inset 0 -1px 0 rgba(0,0,0,0.12)',
            ].join(', '),
          }}
        >
          {/* Specular highlight — top edge shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 26,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Nav items */}
          <div className="flex items-center justify-around h-full px-1 relative">
            {navItems.map(({ path, icon: Icon, key, accent }) => {
              const isActive =
                location.pathname === path ||
                (path !== '/' && location.pathname.startsWith(path))
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-0.5 flex-1 py-2 transition-all"
                >
                  {/* Active indicator dot */}
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      marginBottom: 2,
                      background: isActive ? '#f97316' : 'transparent',
                      boxShadow: isActive ? '0 0 6px 2px rgba(249,115,22,0.5)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />
                  <Icon
                    size={22}
                    className="transition-all duration-200"
                    style={{
                      color: accent ? '#f97316' : isActive ? '#fb923c' : 'rgba(255,255,255,0.45)',
                      filter: isActive && !accent
                        ? 'drop-shadow(0 0 6px rgba(249,115,22,0.6))'
                        : 'none',
                    }}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.02em',
                      color: accent ? '#f97316' : isActive ? '#fb923c' : 'rgba(255,255,255,0.38)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {t(key)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reflection / ground shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            left: '10%',
            right: '10%',
            height: 12,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.3)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
      </nav>
    </>
  )
}
