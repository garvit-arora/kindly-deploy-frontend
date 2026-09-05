import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/landing/Footer'
import '../styles/fonts.css'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4'

const HERO_POSTER =
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60'

function Landing() {
  return (
    <div
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        id="top"
        className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl"
      >
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          webkit-playsinline="true"
          x5-playsinline="true"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-white/10" />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
            <span
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-neutral-900"
              style={{ fontSize: 13 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
              KindlyDeploy
            </span>

            <h1
              className="mt-5 sm:mt-6 max-w-4xl text-neutral-900"
              style={{
                fontSize: 'clamp(36px, 8vw, 72px)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              Deploy with{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                confidence
              </span>
              <br />
              on every push
            </h1>

            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
            >
              From your repository to a live application, in one dependable pipeline
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5"
                style={{ fontSize: 14 }}
              >
                Start Deploying
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 grid place-items-center">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <a
                href="#how"
                className="inline-flex items-center gap-2 bg-white text-neutral-900 rounded-full px-6 py-2 sm:py-2.5 shadow-sm"
                style={{ fontSize: 14 }}
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>

      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Landing
