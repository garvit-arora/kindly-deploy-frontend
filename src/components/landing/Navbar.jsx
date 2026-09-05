import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Menu } from 'lucide-react'
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

const NAV_ITEMS = [
  { label: 'Home', href: '#top', dot: true },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Testimonials', href: '#testimonials', accent: true },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
      <div className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[760px] relative">
        <div className="flex items-center gap-6">
          <Link to="/" className="shrink-0" aria-label="KindlyDeploy home">
            <Logo className="w-7 h-7 sm:w-8 sm:h-8" />
          </Link>

          <nav className="hidden md:flex items-center gap-6" style={{ fontSize: 14 }}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-1.5 ${
                  item.accent ? 'text-[#ef4d23]' : 'text-neutral-800'
                }`}
              >
                {item.dot ? (
                  <span className="inline-block w-[1.5px] h-[1.5px] rounded-full bg-black" />
                ) : null}
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <a
              href="https://github.com/garvit-arora"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:block text-neutral-700 hover:text-neutral-900 transition"
              aria-label="GitHub"
            >
              <GithubMark className="w-5 h-5" />
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#ef4d23] text-white rounded-full pl-4 pr-1.5 py-1.5"
              style={{ fontSize: 14 }}
            >
              <span className="hidden sm:inline">Start deploying</span>
              <span className="sm:hidden">Get started</span>
              <span className="w-6 h-6 rounded-full bg-white/20 grid place-items-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            <button
              type="button"
              className="md:hidden grid place-items-center w-9 h-9 rounded-full text-neutral-800"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((previous) => !previous)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {open ? (
          <div className="md:hidden absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-3 z-20">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${
                  item.accent ? 'text-[#ef4d23]' : 'text-neutral-800'
                }`}
                style={{ fontSize: 14 }}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Navbar
