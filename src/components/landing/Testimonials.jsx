const TESTIMONIALS = [
  {
    quote:
      'I stopped SSH-ing into a box to restart things. A push goes out, the health check passes, and the old container is still there if I need it back.',
    name: 'Aarav Mehta',
    role: 'Indie developer',
    initials: 'AM',
    blob: '-top-24 -left-20',
  },
  {
    quote:
      'The build logs and runtime logs living in the same place is the part I did not know I wanted. Debugging a failed release takes minutes now.',
    name: 'Sara Lindqvist',
    role: 'Backend engineer',
    initials: 'SL',
    featured: true,
    blob: '-bottom-28 left-1/2 -translate-x-1/2',
  },
  {
    quote:
      'We run three side projects on it. Same Dockerfile we already had, no new config language to learn, and rollback actually works.',
    name: 'Daniel Okoye',
    role: 'Founding engineer',
    initials: 'DO',
    blob: '-bottom-24 -right-20',
  },
]

function TestimonialCard({ item }) {
  const featured = Boolean(item.featured)

  return (
    <figure
      className={`kd-step group relative rounded-2xl overflow-hidden p-6 sm:p-7 flex flex-col ${
        featured
          ? 'bg-[#0b0f1a] md:-mt-6 md:mb-6 border border-white/10'
          : 'bg-white'
      }`}
    >
      <span
        className={`kd-step-surface absolute h-56 w-56 rounded-full bg-[#ef4d23] blur-3xl ${
          featured ? 'opacity-[0.28]' : 'opacity-[0.13]'
        } ${item.blob}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full">
        <span
          className={featured ? 'text-white/35' : 'text-[#ef4d23]/40'}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 56,
            lineHeight: 0.7,
          }}
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <blockquote
          className={`mt-5 flex-1 ${featured ? 'text-white/85' : 'text-neutral-800'}`}
          style={{ fontSize: 15, lineHeight: 1.7 }}
        >
          {item.quote}
        </blockquote>

        <figcaption
          className={`mt-7 pt-5 flex items-center gap-3 border-t ${
            featured ? 'border-white/15' : 'border-neutral-200'
          }`}
        >
          <span
            className={`grid place-items-center w-10 h-10 rounded-full ${
              featured ? 'bg-white text-[#0b0f1a]' : 'bg-[#0b0f1a] text-white'
            }`}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {item.initials}
          </span>

          <span>
            <span
              className={`block ${featured ? 'text-white' : 'text-neutral-900'}`}
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {item.name}
            </span>
            <span
              className={`block ${featured ? 'text-white/55' : 'text-neutral-500'}`}
              style={{ fontSize: 12 }}
            >
              {item.role}
            </span>
          </span>
        </figcaption>
      </div>
    </figure>
  )
}

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-6xl mx-auto"
    >
      <div className="text-center">
        <span
          className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-neutral-900"
          style={{ fontSize: 13 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
          Testimonials
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
          Teams that ship{' '}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            calmly
          </span>
        </h2>
      </div>

      <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-start">
        {TESTIMONIALS.map((item) => (
          <TestimonialCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
