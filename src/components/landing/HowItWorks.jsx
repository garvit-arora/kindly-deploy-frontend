const STEPS = [
  {
    step: '01',
    title: 'Connect a repository',
    body: 'Install the KindlyDeploy GitHub App on the account or organisation that owns your code, then pick a repository and a branch.',
    pill: 'GitHub App',
    surface:
      'radial-gradient(ellipse 220px 180px at 18% 12%, rgba(239,77,35,.55) 0%, rgba(239,77,35,.18) 45%, transparent 72%), linear-gradient(180deg, #16203a 0%, #111a30 45%, #0b1120 100%)',
    ring: true,
  },
  {
    step: '02',
    title: 'Push a commit',
    body: 'The webhook fires, a deployment row is created, and a build job lands on the queue with the exact commit SHA.',
    pill: 'Queued',
    surface:
      'radial-gradient(ellipse 240px 200px at 88% 22%, rgba(96,132,255,.45) 0%, rgba(96,132,255,.14) 48%, transparent 74%), linear-gradient(180deg, #12203f 0%, #0e1930 48%, #0a1020 100%)',
  },
  {
    step: '03',
    title: 'Build and run',
    body: 'A worker downloads that commit, builds your Dockerfile into an image, and starts a container on a free host port.',
    pill: 'Building',
    surface:
      'radial-gradient(ellipse 260px 200px at 50% 108%, rgba(239,77,35,.42) 0%, rgba(239,77,35,.12) 52%, transparent 78%), linear-gradient(180deg, #1a1830 0%, #14162a 50%, #0b0e1c 100%)',
  },
  {
    step: '04',
    title: 'Route and verify',
    body: 'Traefik picks up the container, the health check confirms it answers, and the deployment is promoted to live.',
    pill: 'Live',
    live: true,
    surface:
      'radial-gradient(ellipse 240px 200px at 78% 82%, rgba(45,200,140,.40) 0%, rgba(45,200,140,.12) 50%, transparent 76%), linear-gradient(180deg, #0e2233 0%, #0c1a2a 50%, #080f1c 100%)',
  },
]

function StepCard({ item }) {
  return (
    <article className="kd-step group relative h-[300px] sm:h-[330px] rounded-2xl overflow-hidden border border-white/10">
      <span
        className="kd-step-surface absolute inset-0"
        style={{ background: item.surface }}
        aria-hidden="true"
      />

      {item.ring ? (
        <span
          className="kd-orbit absolute -right-16 -top-16 w-52 h-52 rounded-full border border-dashed border-white/20"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span
            className="text-[#ef4d23]"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {item.step}
          </span>

          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/80 backdrop-blur-md"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            {item.live ? (
              <i className="kd-pulse w-[5px] h-[5px] rounded-full bg-emerald-400" />
            ) : null}
            {item.pill}
          </span>
        </div>

        <h3
          className="mt-auto text-white"
          style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {item.title}
        </h3>

        <p
          className="mt-2 text-white/60"
          style={{ fontSize: 13, lineHeight: 1.6 }}
        >
          {item.body}
        </p>
      </div>
    </article>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto">
      <div className="bg-[#0b0f1a] rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden">
        <span
          className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-white"
          style={{ fontSize: 13 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
          How it works
        </span>

        <h2
          className="mt-5 text-white max-w-2xl"
          style={{
            fontSize: 'clamp(26px, 4.5vw, 42px)',
            lineHeight: 1.12,
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((item) => (
            <StepCard key={item.step} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
