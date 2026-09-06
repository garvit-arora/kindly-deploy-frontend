import { Container, GitBranch, History } from 'lucide-react'

function PushVisual() {
  const commits = [
    { sha: 'a66707a', branch: 'main', state: 'Ready', tone: 'bg-emerald-500' },
    { sha: '391075c', branch: 'main', state: 'Building', tone: 'bg-[#ef4d23]' },
    { sha: '7e23bc0', branch: 'main', state: 'Queued', tone: 'bg-neutral-300' },
  ]

  return (
    <div className="flex flex-col gap-2">
      {commits.map((commit, index) => (
        <div
          key={commit.sha}
          className="flex items-center gap-2.5 rounded-lg bg-white border border-neutral-200/80 px-3 py-2.5"
          style={{ opacity: 1 - index * 0.22 }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${commit.tone}`} />

          <span
            className="text-neutral-600"
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}
          >
            {commit.sha}
          </span>

          <span
            className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-500"
            style={{ fontSize: 10 }}
          >
            {commit.branch}
          </span>

          <span className="ml-auto text-neutral-400" style={{ fontSize: 10 }}>
            {commit.state}
          </span>
        </div>
      ))}
    </div>
  )
}

function ContainerVisual() {
  const containers = [
    { name: 'web', port: ':3000', live: true },
    { name: 'api', port: ':4310', live: true },
    { name: 'web', port: ':3000', live: false },
  ]

  return (
    <div className="rounded-xl border border-dashed border-neutral-300 p-2.5 flex flex-col gap-2">
      {containers.map((item, index) => (
        <div
          key={`${item.name}-${item.port}-${index}`}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 border ${
            item.live
              ? 'bg-white border-neutral-200/80'
              : 'bg-neutral-100/70 border-transparent'
          }`}
        >
          <span
            className={`grid place-items-center w-5 h-5 rounded ${
              item.live ? 'bg-[#ef4d23]/10 text-[#ef4d23]' : 'bg-neutral-200 text-neutral-400'
            }`}
          >
            <Container className="w-3 h-3" />
          </span>

          <span
            className={item.live ? 'text-neutral-700' : 'text-neutral-400'}
            style={{ fontSize: 11.5, fontWeight: 500 }}
          >
            {item.name}
          </span>

          <span
            className="ml-auto text-neutral-400"
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}
          >
            {item.port}
          </span>
        </div>
      ))}
    </div>
  )
}

function RollbackVisual() {
  const releases = [
    { label: 'Live now', meta: 'just now', current: true },
    { label: 'Previous', meta: '52m ago', current: false },
  ]

  return (
    <div className="flex flex-col gap-2">
      {releases.map((release) => (
        <div
          key={release.label}
          className={`flex items-center gap-3 rounded-lg px-3 py-3 border ${
            release.current
              ? 'bg-white border-neutral-200/80'
              : 'bg-white/60 border-neutral-200/60'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              release.current ? 'bg-emerald-500' : 'bg-neutral-300'
            }`}
          />

          <span className="text-neutral-700" style={{ fontSize: 11.5, fontWeight: 500 }}>
            {release.label}
          </span>

          <span className="text-neutral-400" style={{ fontSize: 10.5 }}>
            {release.meta}
          </span>

          {release.current ? null : (
            <span
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#0b0f1a] text-white px-2.5 py-1"
              style={{ fontSize: 10 }}
            >
              <History className="w-3 h-3" />
              Rollback
            </span>
          )}
        </div>
      ))}

      <div className="mt-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
        <span className="block h-full w-1/3 rounded-full bg-[#ef4d23]/70" />
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Push to deploy',
    body: 'A webhook on every push queues a build for the exact commit you pushed. No CLI, no manual trigger.',
    Visual: PushVisual,
  },
  {
    icon: Container,
    title: 'Real containers',
    body: 'Your Dockerfile is built into an image and run as a container on a dedicated host port, routed by Traefik.',
    Visual: ContainerVisual,
  },
  {
    icon: History,
    title: 'Instant rollback',
    body: 'The previous container stays alive for an hour after a new release, so rolling back is a single click.',
    Visual: RollbackVisual,
  },
]

function FeatureCard({ feature }) {
  const Icon = feature.icon
  const Visual = feature.Visual

  return (
    <article className="rounded-2xl bg-white border border-neutral-200/70 p-4 sm:p-5 flex flex-col">
      <div className="rounded-xl bg-[#f4f4f4] p-4 sm:p-5">
        <Visual />
      </div>

      <div className="px-1.5 pt-6 pb-2 flex flex-col flex-1">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#ef4d23]/10 text-[#ef4d23]">
          <Icon className="w-4.5 h-4.5" />
        </span>

        <h3
          className="mt-4 text-neutral-900"
          style={{ fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          {feature.title}
        </h3>

        <p
          className="mt-2 text-neutral-600"
          style={{ fontSize: 13.5, lineHeight: 1.65 }}
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
      className="px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export default Features
