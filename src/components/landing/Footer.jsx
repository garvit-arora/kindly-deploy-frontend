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

function Footer() {
  return (
    <footer className="px-4 sm:px-6 pb-4">
      <div className="bg-[#0b0f1a] rounded-3xl p-6 sm:p-10 lg:p-14 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-md">
            <Logo className="w-9 h-9" />

            <h2
              className="mt-5 text-white"
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                lineHeight: 1.15,
                fontWeight: 500,
                letterSpacing: '-0.02em',
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
              className="mt-6 inline-flex items-center gap-3 bg-[#ef4d23] text-white rounded-full pl-6 pr-2 py-2"
              style={{ fontSize: 14 }}
            >
              Start Deploying
              <span className="w-7 h-7 rounded-full bg-white/20 grid place-items-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>
                  {group.title}
                </p>

                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="text-white/60 hover:text-white transition"
                          style={{ fontSize: 14 }}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-white/60 hover:text-white transition"
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

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} KindlyDeploy. Built as a learning platform.
          </p>

          <a
            href="https://github.com/garvit-arora"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition"
            style={{ fontSize: 13 }}
          >
            <GithubMark className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
