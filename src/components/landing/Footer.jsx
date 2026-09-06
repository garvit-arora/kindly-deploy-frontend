import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import GithubMark from '../GithubMark'

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function Logo({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {PETAL_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180

        return (
          <circle
            key={angle}
            cx={16 + 10 * Math.cos(radians)}
            cy={16 + 10 * Math.sin(radians)}
            r={3.5}
            fill="#ef4d23"
          />
        )
      })}
      <circle cx={16} cy={16} r={3.5} fill="#ef4d23" />
    </svg>
  )
}

const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', to: '/dashboard/overview' },
      { label: 'Projects', to: '/dashboard/projects' },
      { label: 'Domains', to: '/dashboard/domains' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Settings', to: '/dashboard/settings' },
      { label: 'Profile', to: '/dashboard/profile' },
    ],
  },
]

function Watermark() {
  const svgRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    const text = textRef.current

    if (!svg || !text) {
      return undefined
    }

    function fit() {
      const box = text.getBBox()

      if (!box.width || !box.height) {
        return
      }

      svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
    }

    fit()
    window.addEventListener('resize', fit)

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(() => {})
    }

    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <svg
      ref={svgRef}
      className="w-full block select-none pointer-events-none"
      viewBox="0 0 1000 200"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <text
        ref={textRef}
        x="0"
        y="150"
        fill="#ffffff"
        fillOpacity="0.06"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 200,
          fontWeight: 600,
          letterSpacing: '-0.04em',
        }}
      >
        KindlyDeploy
      </text>
    </svg>
  )
}

function Footer() {
  return (
    <footer className="-mx-3 sm:-mx-4 -mb-3 sm:-mb-4 bg-[#0b0f1a] overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span
                className="text-white"
                style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                KindlyDeploy
              </span>
            </div>

            <h2
              className="mt-7 text-white"
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                lineHeight: 1.12,
                fontWeight: 500,
                letterSpacing: '-0.04em',
              }}
            >
              Ready to ship your{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                next
              </span>{' '}
              commit?
            </h2>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-3 bg-[#ef4d23] text-white rounded-full pl-6 pr-2 py-2"
                style={{ fontSize: 14 }}
              >
                Start Deploying
                <span className="w-7 h-7 rounded-full bg-white/20 grid place-items-center">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <a
                href="https://github.com/garvit-arora"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-white/70 hover:text-white hover:border-white/40 transition"
                style={{ fontSize: 14 }}
              >
                <GithubMark className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:pt-2">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
                  {group.title}
                </p>

                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="text-white/55 hover:text-white transition"
                          style={{ fontSize: 14 }}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-white/55 hover:text-white transition"
                          style={{ fontSize: 14 }}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/45" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} KindlyDeploy. Built as a learning platform.
          </p>

          <a
            href="#top"
            className="text-white/45 hover:text-white transition"
            style={{ fontSize: 13 }}
          >
            Back to top
          </a>
        </div>

        <div className="mt-8 -mb-[3%]">
          <Watermark />
        </div>
      </div>
    </footer>
  )
}

export default Footer
