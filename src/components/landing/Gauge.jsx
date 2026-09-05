const TICK_COUNT = 40

function Gauge({ value, color = '#ef4d23', showLabels = false, min, max }) {
  const activeCount = Math.round((value / 100) * TICK_COUNT)

  const ticks = Array.from({ length: TICK_COUNT }, (_, index) => {
    const angle = Math.PI + (index / (TICK_COUNT - 1)) * Math.PI
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    return {
      key: index,
      x1: 100 + 70 * cos,
      y1: 100 + 70 * sin,
      x2: 100 + 80 * cos,
      y2: 100 + 80 * sin,
      stroke: index < activeCount ? color : '#d4d4d8',
    }
  })

  return (
    <div className="w-full" style={{ maxWidth: 260, margin: '0 auto' }}>
      <svg viewBox="0 0 200 120" className="w-full">
        {ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.stroke}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
        <text
          x={100}
          y={105}
          textAnchor="middle"
          fontSize={22}
          fontWeight={600}
          fill="#0b0f1a"
        >
          {value}%
        </text>
      </svg>

      {showLabels ? (
        <div className="flex justify-between text-neutral-500" style={{ fontSize: 11 }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : null}
    </div>
  )
}

export default Gauge
