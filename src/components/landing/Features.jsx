import {
  Container,
  GitBranch,
  History,
  ScrollText,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Push to deploy',
    body: 'A webhook on every push queues a build for the exact commit you pushed. No CLI, no manual trigger.',
  },
  {
    icon: Container,
    title: 'Real containers',
    body: 'Your Dockerfile is built into an image and run as a container on a dedicated host port, routed by Traefik.',
  },
  {
    icon: ShieldCheck,
    title: 'Health checked',
    body: 'A deployment is only marked ready once it answers HTTP on its own hostname. Broken builds never take traffic.',
  },
  {
    icon: History,
    title: 'Instant rollback',
    body: 'The previous container stays alive for an hour after a new release, so rolling back is a single click.',
  },
  {
    icon: ScrollText,
    title: 'Live logs',
    body: 'Build output and runtime container logs are streamed and stored, so you can read them long after the build ends.',
  },
  {
    icon: Zap,
    title: 'Queued builds',
    body: 'The API and the build workers are separate processes talking over Redis, so heavy builds never slow the dashboard.',
  },
]

function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto">
      <div className="text-center">
        <span
          className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-neutral-900"
          style={{ fontSize: 13 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
          Features
        </span>

        <h2
          className="mt-5 text-neutral-900"
          style={{
            fontSize: 'clamp(28px, 5vw, 46px)',
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          Everything a deploy{' '}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            actually
          </span>{' '}
          needs
        </h2>

        <p className="mt-4 text-neutral-600 max-w-xl mx-auto" style={{ fontSize: 15 }}>
          Built from first principles — webhooks, a job queue, image builds, container
          routing and health checks, with nothing hidden behind magic.
        </p>
      </div>

      <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon

          return (
            <div key={feature.title} className="bg-white rounded-2xl p-6">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#ef4d23]/10 text-[#ef4d23]">
                <Icon className="w-5 h-5" />
              </span>

              <h3
                className="mt-4 text-neutral-900"
                style={{ fontSize: 17, fontWeight: 600 }}
              >
                {feature.title}
              </h3>

              <p className="mt-2 text-neutral-600" style={{ fontSize: 14, lineHeight: 1.6 }}>
                {feature.body}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Features
