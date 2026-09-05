const STEPS = [
  {
    step: '01',
    title: 'Connect a repository',
    body: 'Install the KindlyDeploy GitHub App on the account or organisation that owns your code, then pick a repository and a branch.',
  },
  {
    step: '02',
    title: 'Push a commit',
    body: 'The webhook fires, a deployment row is created, and a build job lands on the queue with the exact commit SHA.',
  },
  {
    step: '03',
    title: 'Build and run',
    body: 'A worker downloads that commit, builds your Dockerfile into an image, and starts a container on a free host port.',
  },
  {
    step: '04',
    title: 'Route and verify',
    body: 'Traefik picks up the container, the health check confirms it answers, and the deployment is promoted to live.',
  },
]

function HowItWorks() {
  return (
    <section id="how" className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto">
      <div className="bg-[#0b0f1a] rounded-3xl p-6 sm:p-10 lg:p-14">
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
            letterSpacing: '-0.02em',
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STEPS.map((item) => (
            <div key={item.step} className="border-t border-white/15 pt-5">
              <span className="text-[#ef4d23]" style={{ fontSize: 13, fontWeight: 600 }}>
                {item.step}
              </span>

              <h3 className="mt-2 text-white" style={{ fontSize: 17, fontWeight: 600 }}>
                {item.title}
              </h3>

              <p
                className="mt-2 text-white/60"
                style={{ fontSize: 14, lineHeight: 1.6 }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
