import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'I stopped SSH-ing into a box to restart things. A push goes out, the health check passes, and the old container is still there if I need it back.',
    name: 'Aarav Mehta',
    role: 'Indie developer',
    initials: 'AM',
  },
  {
    quote:
      'The build logs and runtime logs living in the same place is the part I did not know I wanted. Debugging a failed release takes minutes now.',
    name: 'Sara Lindqvist',
    role: 'Backend engineer',
    initials: 'SL',
  },
  {
    quote:
      'We run three side projects on it. Same Dockerfile we already had, no new config language to learn, and rollback actually works.',
    name: 'Daniel Okoye',
    role: 'Founding engineer',
    initials: 'DO',
  },
]

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
            letterSpacing: '-0.02em',
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

      <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((item) => (
          <figure key={item.name} className="bg-white rounded-2xl p-6 flex flex-col">
            <Quote className="w-6 h-6 text-[#ef4d23]" />

            <blockquote
              className="mt-4 text-neutral-800 flex-1"
              style={{ fontSize: 15, lineHeight: 1.65 }}
            >
              {item.quote}
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3">
              <span
                className="grid place-items-center w-10 h-10 rounded-full bg-[#0b0f1a] text-white"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                {item.initials}
              </span>

              <span>
                <span
                  className="block text-neutral-900"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {item.name}
                </span>
                <span className="block text-neutral-500" style={{ fontSize: 12 }}>
                  {item.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
