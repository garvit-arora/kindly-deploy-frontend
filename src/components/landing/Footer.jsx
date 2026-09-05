import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import GithubMark from '../GithubMark'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4'

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

      svg.setAttribute(
        'viewBox',
        `${box.x} ${box.y} ${box.width} ${box.height}`,
      )
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
    <footer className="px-4 sm:px-6 pb-4">
      <div className="bg-[#0b0f1a] rounded-3xl p-3 sm:p-4 max-w-6xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-3 sm:gap-4">
          <div className="relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-between p-6">
            <video
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={FOOTER_VIDEO} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-[#0b0f1a]/70" />

            <div className="relative z-10 flex items-center gap-3">
              <Logo className="w-9 h-9" />
              <span
                className="text-white"
                style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                KindlyDeploy
              </span>
            </div>

            <div className="relative z-10">
              <a
                href="https://github.com/garvit-arora"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-md transition"
                style={{ fontSize: 13 }}
              >
                <GithubMark className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl bg-white p-6 sm:p-10 overflow-hidden">
            <span
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#ef4d23] blur-3xl opacity-[0.13]"
              aria-hidden="true"
            />

            <span
              className="hidden sm:grid absolute top-8 right-8 w-16 h-16 rounded-2xl bg-[#0b0f1a] place-items-center rotate-12 shadow-lg"
              aria-hidden="true"
            >
              <Logo className="w-8 h-8" />
            </span>

            <div className="relative z-10">
              <h2
                className="text-neutral-900 max-w-md"
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  lineHeight: 1.15,
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

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 pr-2 py-2"
                style={{ fontSize: 14 }}
              >
                Start Deploying
                <span className="w-7 h-7 rounded-full bg-white/20 grid place-items-center">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-3 gap-8">
                {LINK_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p
                      className="text-neutral-900"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      {group.title}
                    </p>

                    <ul className="mt-3 flex flex-col gap-2">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          {link.to ? (
                            <Link
                              to={link.to}
                              className="text-neutral-500 hover:text-neutral-900 transition"
                              style={{ fontSize: 14 }}
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              className="text-neutral-500 hover:text-neutral-900 transition"
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
          </div>
        </div>

        <div className="mt-6 px-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} KindlyDeploy. Built as a learning platform.
          </p>

          <a
            href="#top"
            className="text-white/50 hover:text-white transition"
            style={{ fontSize: 13 }}
          >
            Back to top
          </a>
        </div>

        <div className="mt-2 -mb-2">
          <Watermark />
        </div>
      </div>
    </footer>
  )
}

export default Footer
