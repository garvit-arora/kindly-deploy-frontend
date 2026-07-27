import { Link } from 'react-router-dom'
import './Login.css'

const backgroundVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4'

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.06-.62.06-.62 1.01.07 1.54 1.07 1.54 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.04-2.78-.1-.26-.45-1.32.1-2.75 0 0 .85-.28 2.75 1.06A9.3 9.3 0 0 1 12 6.86a9.3 9.3 0 0 1 2.5.35c1.9-1.34 2.75-1.06 2.75-1.06.55 1.43.2 2.49.1 2.75.65.73 1.04 1.65 1.04 2.78 0 3.96-2.34 4.83-4.57 5.09.36.32.68.93.68 1.88 0 1.36-.01 2.45-.01 2.78 0 .27.18.59.69.49A10.23 10.23 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  )
}

function Login() {
  return (
    <main className="login-page">
      <video className="login-video" autoPlay loop muted playsInline aria-hidden="true">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="login-scrim" />

      <header className="login-header">
        <Link className="login-logo" to="/">
          KINDLY<span>DEPLOY</span>
        </Link>
        <Link className="login-home-link" to="/">
          Back to home
        </Link>
      </header>

      <section className="login-card" aria-labelledby="login-title">
        <div className="card-glow" />
        <div className="login-card-content">
          <p className="login-eyebrow">Secure access</p>
          <h1 id="login-title">Connect your workspace</h1>
          <p className="login-intro">
            Sign in with GitHub to connect repositories and start your first deployment.
          </p>

          <form className="github-form">
            <label htmlFor="github-identity">GitHub account</label>
            <div className="github-input-wrap">
              <span>@</span>
              <input id="github-identity" name="github-identity" placeholder="your-github-handle" />
            </div>
            <button className="github-button" type="button">
              <GitHubMark />
              Continue with GitHub
            </button>
          </form>

          <p className="login-note">
            By continuing, you agree to connect your GitHub account to KindlyDeploy.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
