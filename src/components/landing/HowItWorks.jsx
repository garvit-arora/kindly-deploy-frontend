const STEPS = [
  {
    step: '01',
    title: 'Connect a repository',
    body: 'Install the KindlyDeploy GitHub App on the account or organisation that owns your code, then pick a repository and a branch.',
    pill: 'GitHub App',
  },
  {
    step: '02',
    title: 'Push a commit',
    body: 'The webhook fires, a deployment row is created, and a build job lands on the queue with the exact commit SHA.',
    pill: 'Queued',
  },
  {
    step: '03',
    title: 'Build and run',
    body: 'A worker downloads that commit, builds your Dockerfile into an image, and starts a container on a free host port.',
    pill: 'Building',
  },
  {
    step: '04',
    title: 'Route and verify',
    body: 'Traefik picks up the container, the health check confirms it answers, and the deployment is promoted to live.',
    pill: 'Live',
    live: true,
  },
]

function StepCard({ item }) {
  return (
    <article className="rounded-2xl bg-white border border-neutral-200/70 p-5 sm:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <span
          className="text-[#ef4d23]"
          style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 600 }}
        >
          {item.step}
        </span>

        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-500"
          style={{ fontSize: 10.5, fontWeight: 500 }}
        >
          {item.live ? (
            <i className="kd-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ) : null}
          {item.pill}
        </span>
      </div>

      <span className="mt-5 block h-px w-full bg-neutral-200" aria-hidden="true" />

      <h3
        className="mt-5 text-neutral-900"
        style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em' }}
      >
        {item.title}
      </h3>

      <p
        className="mt-2 text-neutral-600"
        style={{ fontSize: 13, lineHeight: 1.65 }}
      >
        {item.body}
      </p>
    </article>
  )
}

function HowItWorks() {
  return (
    <section
      id="how"
      className="px-4 sm:px-6 pt-6 pb-16 sm:pb-24 max-w-6xl mx-auto"
    >
      <div className="text-center">
        <span
          className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-neutral-900"
          style={{ fontSize: 13 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
          How it works
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
          From a git push to a live URL in{' '}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            four
          </span>{' '}
          steps
        </h2>
      </div>

      <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STEPS.map((item) => (
          <StepCard key={item.step} item={item} />
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
