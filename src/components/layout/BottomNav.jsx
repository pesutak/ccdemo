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
            <feDisplacementMap in="SourceGraphic" in2="map" scale={glassProps.rScale} xChannelSelector="R" yChannelSelector="G" result="rD" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="rD" result="rC" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={glassProps.gScale} xChannelSelector="R" yChannelSelector="G" result="gD" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="gD" result="gC" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={glassProps.bScale} xChannelSelector="R" yChannelSelector="G" result="bD" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="bD" result="bC" />
            <feBlend in="rC" in2="gC" mode="screen" result="rg" />
            <feBlend in="rg" in2="bC" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Floating nav */}
      <nav
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 440,
          zIndex: 40,
          // Outer shadow + floating glow — NOT clipped by border-radius
          filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
        }}
      >
        {/*
          Two-layer structure for reliable rounded corners with backdrop-filter:
          - Outer div: border-radius + overflow:hidden → clips the backdrop to rounded shape
          - Inner backdrop div: absolute fill, applies the glass blur + SVG filter
          - Content div: relative, sits above the backdrop layer
        */}
        <div
          style={{
            borderRadius: 26,
            overflow: 'hidden',
            height: 68,
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.18)',
            borderTop: '1px solid rgba(255,255,255,0.28)',
          }}
        >
          {/* Backdrop layer — glass blur + refraction */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 26,
              backdropFilter: `url('#${NAV_FILTER_ID}') blur(28px) saturate(190%) brightness(1.08)`,
              WebkitBackdropFilter: 'blur(28px) saturate(190%) brightness(1.08)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 60%, rgba(249,115,22,0.06) 100%)',
            }}
          />

          {/* Specular highlight — top shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 26,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 35%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />

          {/* Nav items — above glass layers */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              height: '100%',
              padding: '0 4px',
            }}
          >
            {navItems.map(({ path, icon: Icon, key, accent }) => {
              const isActive =
                location.pathname === path ||
                (path !== '/' && location.pathname.startsWith(path))
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: '8px 0',
                    transition: 'all 0.2s',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* Glowing active dot */}
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      marginBottom: 1,
                      background: isActive ? '#f97316' : 'transparent',
                      boxShadow: isActive ? '0 0 8px 3px rgba(249,115,22,0.55)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: accent ? '#f97316' : isActive ? '#fb923c' : 'rgba(255,255,255,0.42)',
                      filter: isActive && !accent
                        ? 'drop-shadow(0 0 5px rgba(249,115,22,0.55))'
                        : 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.03em',
                      color: accent ? '#f97316' : isActive ? '#fb923c' : 'rgba(255,255,255,0.36)',
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
      </nav>
    </>
  )
}
