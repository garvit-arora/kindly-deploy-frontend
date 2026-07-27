import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const Spline = lazy(() => import('@splinetool/react-spline'))

const navigation = ['Services', 'About Us', 'Projects', 'Team', 'Contacts']

function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a className="landing-logo" href="#top" aria-label="KindlyDeploy home">
          KINDLYDEPLOY
        </a>

        <nav className="landing-links" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>
              {item}
            </a>
          ))}
        </nav>

        <Link className="nav-cta" to="/login">
          Get Started
        </Link>
      </header>

      <main>
        <section className="landing-hero" id="top" aria-labelledby="hero-title">
          <div className="spline-background" aria-hidden="true">
            <Suspense fallback={<div className="spline-fallback" />}>
              <Spline
                scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
                className="spline-scene"
              />
            </Suspense>
          </div>
          <div className="hero-overlay" />

          <div className="hero-content">
            <h1 className="hero-title reveal" id="hero-title" style={{ animationDelay: '0.2s' }}>
              KINDLY<span>DEPLOY</span>
            </h1>
            <p className="hero-subtitle reveal" style={{ animationDelay: '0.4s' }}>
              Deploy with confidence.
            </p>
            <p className="hero-description reveal" style={{ animationDelay: '0.55s' }}>
              From your repository to a live application, KindlyDeploy gives your team a clear,
              dependable path to shipping. Build, monitor, and manage every deployment in one place.
            </p>
            <div className="hero-actions reveal" style={{ animationDelay: '0.7s' }}>
              <Link className="button-primary" to="/login">
                Start Deploying
              </Link>
              <button className="button-secondary" type="button">
                Explore Platform
              </button>
            </div>
            <p className="hero-trust reveal" style={{ animationDelay: '0.85s' }}>
              Built for teams that value simple, reliable infrastructure.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing
