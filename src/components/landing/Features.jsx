import {
  Container,
  GitBranch,
  History,
  ScrollText,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const FEATURE_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4'

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Push to deploy',
    body: 'A webhook on every push queues a build for the exact commit you pushed. No CLI, no manual trigger.',
    blob: '-left-40 top-1/2 -translate-y-1/2',
  },
  {
    icon: Container,
    title: 'Real containers',
    body: 'Your Dockerfile is built into an image and run as a container on a dedicated host port, routed by Traefik.',
    video: true,
  },
  {
    icon: ShieldCheck,
    title: 'Health checked',
    body: 'A deployment is only marked ready once it answers HTTP on its own hostname. Broken builds never take traffic.',
    blob: '-top-28 -right-28',
  },
  {
    icon: History,
    title: 'Instant rollback',
    body: 'The previous container stays alive for an hour after a new release, so rolling back is a single click.',
    blob: '-bottom-32 -left-24',
  },
  {
    icon: ScrollText,
    title: 'Live logs',
    body: 'Build output and runtime container logs are streamed and stored, so you can read them long after the build ends.',
    blob: '-top-32 left-1/2 -translate-x-1/2',
  },
  {
    icon: Zap,
    title: 'Queued builds',
    body: 'The API and the build workers are separate processes talking over Redis, so heavy builds never slow the dashboard.',
    blob: '-bottom-28 -right-24',
  },
]

function FeatureCard({ feature }) {
  const Icon = feature.icon

  if (feature.video) {
    return (
      <article className="relative h-[380px] sm:h-[440px] rounded-2xl bg-white overflow-hidden flex flex-col">
        <div className="relative w-full overflow-hidden" style={{ height: '52%' }}>
          <video
            className="w-full h-full object-cover block"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={FEATURE_VIDEO} type="video/mp4" />
          </video>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="flex-1 flex flex-col justify-end p-6 sm:p-7">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#ef4d23]/10 text-[#ef4d23]">
            <Icon className="w-5 h-5" />
          </span>

          <h3
            className="mt-4 text-neutral-900"
            style={{ fontSize: 17, fontWeight: 600 }}
          >
            {feature.title}
          </h3>

          <p
            className="mt-2 text-neutral-600"
            style={{ fontSize: 13.5, lineHeight: 1.6 }}
          >
            {feature.body}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="relative h-[380px] sm:h-[440px] rounded-2xl bg-white overflow-hidden p-6 sm:p-8">
      <span
        className={`absolute h-64 w-64 rounded-full bg-[#ef4d23] blur-3xl opacity-[0.13] ${feature.blob}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#ef4d23]/10 text-[#ef4d23]">
          <Icon className="w-5 h-5" />
        </span>

        <h3
          className="mt-5 text-neutral-900"
          style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.25, letterSpacing: '-0.02em' }}
        >
          {feature.title}
        </h3>

        <p
          className="mt-auto text-neutral-600 max-w-[300px]"
          style={{ fontSize: 13.5, lineHeight: 1.7 }}
        >
          {feature.body}
        </p>
      </div>
    </article>
  )
}

function Features() {
  return (
    <section
      id="features"
      className="px-4 sm:px-6 py-16 sm:py-24 max-w-6xl mx-auto"
    >
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
            letterSpacing: '-0.04em',
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

      <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export default Features
