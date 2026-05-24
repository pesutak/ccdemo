import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { buildLiquidGlassFilter } from '../../utils/liquidGlass'

const NAV_FILTER_ID = 'lg-nav-filter'
const glassProps = buildLiquidGlassFilter({
  filterId: NAV_FILTER_ID,
  width: 420,
  height: 76,
  radius: 26,
  depth: 12,
  strength: 40,
  chromaticAberration: 5,
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
      {/* Inline SVG filter — referenced by backdrop-filter in Chrome/Edge */}
      <svg
        style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={NAV_FILTER_ID}
            x="-15%" y="-15%"
            width="130%" height="130%"
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
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 28px)',
          maxWidth: 448,
          zIndex: 40,
        }}
      >
        {/* Outer shadow ring — rendered outside the clip boundary */}
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 28,
            boxShadow: [
              '0 12px 48px rgba(0,0,0,0.65)',
              '0 4px 16px rgba(0,0,0,0.45)',
              '0 0 0 1px rgba(255,255,255,0.12)',
            ].join(', '),
            pointerEvents: 'none',
          }}
        />

        {/* Glass pill — overflow:hidden clips backdrop to border-radius */}
        <div
          style={{
            borderRadius: 27,
            overflow: 'hidden',
            height: 72,
            position: 'relative',
            isolation: 'isolate',
          }}
        >
          {/* ── Layer 1: Backdrop with SVG refraction + blur ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: `url('#${NAV_FILTER_ID}') blur(40px) saturate(220%) brightness(1.15)`,
              WebkitBackdropFilter: 'blur(40px) saturate(220%) brightness(1.15)',
            }}
          />

          {/* ── Layer 2: Glass tint — light enough to be clearly visible ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(170deg,',
                '  rgba(255,255,255,0.22) 0%,',
                '  rgba(255,255,255,0.10) 40%,',
                '  rgba(30,30,35,0.55) 100%)',
              ].join(''),
            }}
          />

          {/* ── Layer 3: Specular highlight — bright top shimmer ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '42%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 70%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Layer 4: Bottom inner shadow for depth ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: [
                'inset 0 1px 0 rgba(255,255,255,0.35)',
                'inset 0 -1px 0 rgba(0,0,0,0.25)',
                'inset 1px 0 0 rgba(255,255,255,0.08)',
                'inset -1px 0 0 rgba(255,255,255,0.08)',
              ].join(', '),
              pointerEvents: 'none',
            }}
          />

          {/* ── Layer 5: Nav items ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              height: '100%',
              padding: '0 6px',
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
                    gap: 3,
                    paddingTop: 10,
                    paddingBottom: 8,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {/* Active glow dot */}
                  <div
                    style={{
                      width: isActive ? 5 : 4,
                      height: isActive ? 5 : 4,
                      borderRadius: '50%',
                      background: isActive ? '#f97316' : 'transparent',
                      boxShadow: isActive ? '0 0 10px 4px rgba(249,115,22,0.6)' : 'none',
                      transition: 'all 0.3s ease',
                      marginBottom: 1,
                    }}
                  />

                  {/* Icon */}
                  <Icon
                    size={23}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: accent
                        ? '#f97316'
                        : isActive
                        ? '#ff9d4d'
                        : 'rgba(255,255,255,0.55)',
                      filter: isActive && !accent
                        ? 'drop-shadow(0 0 7px rgba(249,115,22,0.7))'
                        : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />

                  {/* Label */}
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.03em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                      color: accent
                        ? '#f97316'
                        : isActive
                        ? '#ff9d4d'
                        : 'rgba(255,255,255,0.45)',
                      transition: 'color 0.25s',
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
