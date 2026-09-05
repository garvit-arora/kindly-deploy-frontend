<div align="center">

<img src="https://img.shields.io/badge/KindlyDeploy-Dashboard-ef4d23?style=for-the-badge" alt="KindlyDeploy Dashboard" />

# KindlyDeploy — Frontend

**The dashboard for a Vercel/Render-style PaaS.**

Connect a repository, watch it build, stream the logs, roll back when it breaks.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

[Live site](https://deploy.garvitarora.xyz) · [Backend repository](https://github.com/garvit-arora/kindly-deploy-backend)

</div>

---

## Table of contents

- [Overview](#overview)
- [Pages](#pages)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [How it talks to the API](#how-it-talks-to-the-api)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)

---

## Overview

A React single-page application in two halves:

- **A marketing landing page** — light theme, full-viewport video hero, feature and
  testimonial sections, served at `/`.
- **A dashboard** — dark theme, sidebar navigation, everything behind a session cookie.

There is no server-side rendering and no Next.js. This is a deliberate constraint: the
platform being built *is* the interesting part, so the client stays a plain SPA that talks to
the API over `fetch` with `credentials: "include"`.

---

## Pages

### Public

| Route | Component | Description |
|---|---|---|
| `/` | `Landing.jsx` | Hero, features, how-it-works, testimonials, footer |
| `/login` | `Login.jsx` | Single "Continue with GitHub" entry point |
| `*` | — | Redirects to `/` |

### Dashboard — `/dashboard`

`Dashboard.jsx` is the layout route. On mount it calls `/api/auth/me`; a `401` redirects to
`/login`, so every nested page can assume an authenticated user.

| Route | Component | Description |
|---|---|---|
| `overview` | `Overview.jsx` | Aggregate stats and recent activity, colour-coded by status |
| `projects` | `Projects.jsx` | All projects with their latest deployment |
| `projects/new` | `NewProject.jsx` | Pick an installation → repository → branch, then deploy |
| `projects/:projectId/deployments` | `ProjectDeployments.jsx` | History, redeploy, rollback, stop |
| `deployments` | `Deployments.jsx` | Every deployment across every project |
| `deployments/:deploymentId` | `Preview.jsx` | Detail, activity trail, screenshot, live URL |
| `logs` | `LogStream.jsx` | Live log stream over Server-Sent Events |
| `blueprints` | `Blueprints.jsx` | Pipeline visualised as a graph (`@xyflow/react`) |
| `environment-variables` | `EnvironmentVariables.jsx` | Per-project encrypted variables |
| `domains` | `Domains.jsx` | Live deployment hostnames — copy, visit, inspect |
| `settings` | `Settings.jsx` | GitHub installations, revocation, active sessions |
| `profile` | `Profile.jsx` | Account details, stats, connected GitHub accounts |

**Settings covers three genuinely different levels of GitHub revocation**, which is worth
knowing because they are easy to confuse:

1. **Disconnect** — deletes the link on KindlyDeploy's side only. Projects survive but lose
   repository access.
2. **Uninstall on GitHub** — a per-installation deep link. This is what actually revokes the
   App's access to your code.
3. **Revoke OAuth authorization** — a separate identity from the App, so it must be revoked
   separately.

Because none of these invalidate an existing session cookie, the same page also lists active
sessions and can sign out every other device.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 19 | JSX only — no TypeScript anywhere |
| Build | Vite 8 (Rolldown) | Sub-second production builds |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | No `tailwind.config.js`; configured in CSS |
| Routing | react-router-dom 7 | `BrowserRouter`, nested layout routes |
| Icons | lucide-react 1 | Brand icons were removed in v1 — see `GithubMark.jsx` |
| Graphs | @xyflow/react 12 | Pipeline visualisation on Blueprints |
| Fonts | Inter + Instrument Serif | Loaded in `src/styles/fonts.css` |

---

## Project structure

```
frontend/
├── public/
│   ├── favicon.svg              # Nine-circle KindlyDeploy mark
│   └── logo-wo-bg.png
├── vite.config.js               # React + Tailwind plugins
└── src/
    ├── main.jsx                 # Entry point
    ├── App.jsx                  # Every route definition
    ├── index.css                # Global dark theme (#141414)
    ├── styles/
    │   └── fonts.css            # Google Fonts + smooth scrolling
    ├── components/
    │   ├── Sidebar.jsx          # Dashboard navigation + profile link
    │   ├── GithubMark.jsx       # Inline GitHub logo
    │   ├── PipelineGraph.jsx    # Deployment pipeline as a node graph
    │   └── landing/
    │       ├── Navbar.jsx       # Floating pill nav with mobile menu
    │       ├── Features.jsx     # Six-card feature grid
    │       ├── HowItWorks.jsx   # Four-step dark panel
    │       ├── Testimonials.jsx # Three quote cards
    │       └── Footer.jsx       # CTA, link columns, colophon
    └── pages/                   # One file per route
```

---

## Design system

Two intentionally different palettes.

### Dashboard — dark

| Token | Value | Used for |
|---|---|---|
| Background | `#141414` | Page and sidebar |
| Surface | `#1b1b1b` | Cards and panels |
| Accent | `#48008c` | Active nav, primary buttons, badges |
| Hover | `#403f3f` | Nav and row hover |
| Text | `text-amber-50` | Primary text |
| Muted | `text-gray-400` | Secondary text |
| Border | `border-gray-800` / `border-gray-700` | Cards / controls |

Status colours follow the deployment state machine and are consistent across pages:
`READY` emerald · `BUILDING` violet · `QUEUED` blue · `PENDING` amber · `FAILED` red ·
`CANCELLED` gray.

### Landing — light

| Token | Value | Used for |
|---|---|---|
| Page | `#ededed` | Outer background |
| Card | `#ffffff` | Feature and testimonial cards |
| Ink | `#0b0f1a` | Dark panels, footer, primary button |
| Accent | `#ef4d23` | Logo, badges, highlights |

Headings use Inter at weight 500 with a `clamp()` size, and drop into italic
**Instrument Serif** for the emphasised word. Because `index.css` sets a global dark
background, every landing component sets its text colour explicitly rather than inheriting.

---

## Getting started

### Prerequisites

Node.js 20+ and the [backend](https://github.com/garvit-arora/kindly-deploy-backend)
running locally (API on `:4000`, plus Postgres, Redis and the worker).

```bash
npm install
cp .env.example .env      # then set VITE_API_URL
npm run dev               # http://localhost:5173
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across the project |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Base URL of the API. Falls back to `http://localhost:4000` |

> **Vite inlines this at build time.** Only `VITE_`-prefixed variables are exposed to the
> client, and they are *statically substituted into the bundle during the build* — not read
> at runtime. Changing it on Vercel therefore has no effect until you redeploy, and a stale
> value can survive a normal rebuild, so disable the build cache when it changes.
>
> The value is public. Never put a secret behind a `VITE_` prefix.

---

## How it talks to the API

Every request opts into cookies explicitly:

```js
const response = await fetch(`${API_URL}/api/projects`, {
  credentials: "include",
});

if (response.status === 401) {
  navigate("/login", { replace: true });
  return;
}
```

Three rules hold across the codebase:

1. **`credentials: "include"` on every call** — the session lives in an `httpOnly` cookie, so
   without it the request is anonymous.
2. **Handle `401` before parsing** — redirect to `/login` rather than rendering an error.
3. **The API must allow this exact origin** — `FRONTEND_URL` on the backend has to match with
   **no trailing slash**, because browsers never send one in `Origin`.

Because the frontend and API are on different sites in production, session cookies are
`SameSite=None; Secure` and are therefore third-party cookies, which browsers increasingly
block. The durable fix is to serve the API from a subdomain of the frontend's domain.

---

## Deployment

Deployed on **Vercel**, built automatically on every push to `main`.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment | `VITE_API_URL` |

Because this is an SPA using `BrowserRouter`, all paths must rewrite to `index.html` —
otherwise a hard refresh on `/dashboard/projects` returns a 404. Vercel's Vite preset handles
this automatically.

The frontend and backend deploy **independently**: Vercel finishes in seconds, the API
pipeline takes several minutes. Any change that adds a page depending on a new endpoint will
briefly fail until the API catches up.

---

## Conventions

- **JSX only.** No TypeScript. `.jsx` extensions everywhere, including in imports.
- **One page per route**, in `src/pages/`. Shared UI goes in `src/components/`.
- **Data fetching lives inside `useEffect`.** The ESLint React Hooks rules reject calling a
  function that sets state synchronously from an effect body, so loaders are defined *inside*
  the effect and refreshes are triggered with a `reloadToken` counter in the dependency array
  rather than by calling the loader directly.
- **No `Github` icon from lucide.** Brand icons were removed in lucide-react v1; use the
  local `GithubMark` component.
- **Match the existing palette.** New dashboard pages use the dark tokens above; new landing
  sections use the light ones.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Unexpected token '<', "<!DOCTYPE"... is not valid JSON` | The API returned an HTML error page — usually a route that doesn't exist there yet | Wait for the backend deploy, then hard-refresh |
| Login button points at `localhost:4000` | `VITE_API_URL` missing or a stale build | Set it and rebuild with the cache disabled |
| Stuck on the login page after authorising | Third-party cookie blocking | Serve the API from a subdomain of this domain |
| CORS error in the console | `FRONTEND_URL` mismatch on the backend | Remove any trailing slash |
| Sidebar link goes to the landing page | No route defined for it | Add it to `App.jsx` — unmatched paths fall through to `*` |
| 404 on refresh in production | SPA rewrite missing | Ensure all paths rewrite to `index.html` |

---

<div align="center">

Built as a learning platform — a real deployment pipeline, not a UI clone.

**[Backend repository →](https://github.com/garvit-arora/kindly-deploy-backend)**

</div>
