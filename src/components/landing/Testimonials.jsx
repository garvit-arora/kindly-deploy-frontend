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
  {
    quote:
      'The health check is the whole thing for me. A broken build simply never becomes the live container, so a bad merge is boring instead of scary.',
    name: 'Priya Nair',
    role: 'Platform engineer',
    initials: 'PN',
  },
  {
    quote:
      'Builds run on a separate worker, so the dashboard stays responsive while a heavy image is compiling. That detail is easy to miss and hard to live without.',
    name: 'Tomas Berg',
    role: 'Infrastructure lead',
    initials: 'TB',
  },
  {
    quote:
      'Setting it up took one screen: install the app, pick the repo, pick the branch. I had a live URL before my coffee finished.',
    name: 'Meera Raghavan',
    role: 'Full-stack developer',
    initials: 'MR',
  },
  {
    quote:
      'Every status change is written down, so when something goes wrong I can read exactly what happened instead of guessing from memory.',
    name: 'Luca Ferrari',
    role: 'Site reliability engineer',
    initials: 'LF',
  },
  {
    quote:
      'It builds the commit I pushed, not whatever happens to be on the branch when the worker gets around to it. That alone removed a class of bugs.',
    name: 'Hannah Cole',
    role: 'Senior engineer',
    initials: 'HC',
  },
  {
    quote:
      'Our demo environments used to drift. Now every branch is just another deployment with its own hostname and nobody argues about ports.',
    name: 'Kwame Asante',
    role: 'Engineering manager',
    initials: 'KA',
  },
  {
    quote:
      'I teach a systems course and use this to show what a deploy pipeline actually does. Nothing is hidden behind a black box.',
    name: 'Nadia Rahman',
    role: 'Lecturer',
    initials: 'NR',
  },
]

const ROW_ONE = TESTIMONIALS.slice(0, 5)
const ROW_TWO = TESTIMONIALS.slice(5)

function TestimonialCard({ item }) {
  return (
    <figure className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-white border border-neutral-200/70 p-5 sm:p-6 flex flex-col">
      <span
        className="text-[#ef4d23]/35"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 44,
          lineHeight: 0.7,
        }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <blockquote
        className="mt-4 flex-1 text-neutral-700"
        style={{ fontSize: 14, lineHeight: 1.7 }}
      >
        {item.quote}
      </blockquote>

      <figcaption className="mt-6 pt-5 border-t border-neutral-200 flex items-center gap-3">
        <span
          className="grid place-items-center w-9 h-9 rounded-full bg-[#0b0f1a] text-white shrink-0"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          {item.initials}
        </span>

        <span>
          <span
            className="block text-neutral-900"
            style={{ fontSize: 13.5, fontWeight: 600 }}
          >
            {item.name}
          </span>
          <span className="block text-neutral-500" style={{ fontSize: 12 }}>
            {item.role}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

function MarqueeRow({ items, direction, duration }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex w-max gap-3 sm:gap-4 kd-marquee ${
          direction === 'ltr' ? 'kd-marquee-ltr' : 'kd-marquee-rtl'
        }`}
        style={{ animationDuration: duration }}
      >
        {[...items, ...items].map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>

      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#ededed] to-transparent"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#ededed] to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

function Testimonials() {
  return (
    <section id="testimonials" className="pb-16 sm:pb-24">
      <div className="px-4 sm:px-6 max-w-6xl mx-auto text-center">
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

      <div className="mt-10 sm:mt-14 flex flex-col gap-3 sm:gap-4">
        <MarqueeRow items={ROW_ONE} direction="ltr" duration="55s" />
        <MarqueeRow items={ROW_TWO} direction="rtl" duration="65s" />
      </div>
    </section>
  )
}

export default Testimonials
