import { ChevronDown, TrendingDown, TrendingUp, X } from 'lucide-react'
import Gauge from './Gauge'

function TogglePill({ activeLabel, inactiveLabel }) {
  return (
    <div className="bg-neutral-100 rounded-full p-1 flex mt-4" style={{ fontSize: 12 }}>
      <span className="flex-1 text-center bg-white shadow-sm rounded-full py-1.5 text-neutral-900">
        {activeLabel}
      </span>
      <span className="flex-1 text-center py-1.5 text-neutral-500">{inactiveLabel}</span>
    </div>
  )
}

function SelectField({ label, value }) {
  return (
    <div>
      <label className="block text-neutral-700 mb-1" style={{ fontSize: 12 }}>
        {label}
      </label>
      <button
        type="button"
        className="w-full flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900"
        style={{ fontSize: 13 }}
      >
        {value}
        <ChevronDown className="w-4 h-4 text-neutral-500" />
      </button>
    </div>
  )
}

function NumberField({ label, value }) {
  return (
    <div>
      <label className="block text-neutral-700 mb-1" style={{ fontSize: 12 }}>
        {label}
      </label>
      <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2">
        <span className="text-neutral-400 mr-1" style={{ fontSize: 13 }}>
          #
        </span>
        <input
          readOnly
          value={value}
          className="w-full outline-none text-neutral-900 bg-transparent"
          style={{ fontSize: 13 }}
        />
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
            <span className="text-[#ef4d23]">Deployments</span>
            <span className="text-neutral-500">This month</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span style={{ fontSize: 28, fontWeight: 600 }} className="text-neutral-900">
              6,896
            </span>
            <span
              className="inline-flex items-center gap-1 bg-red-50 text-red-600 rounded-full px-2 py-0.5"
              style={{ fontSize: 11 }}
            >
              <TrendingDown className="w-3 h-3" />
              -3,382 (33%)
            </span>
          </div>

          <p className="text-neutral-500 mt-1" style={{ fontSize: 11 }}>
            Compared to last month
          </p>

          <p className="text-center text-neutral-600 mt-4" style={{ fontSize: 12 }}>
            Build success rate
          </p>

          <Gauge value={92} showLabels min="389K" max="425K" />

          <TogglePill activeLabel="Builds" inactiveLabel="Deploys" />
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <SelectField label="Show figures for" value="This month" />
          <SelectField label="Compare period by" value="Month-to-date (MTD)" />
          <NumberField label="Set targets (This month)" value="10" />
          <NumberField label="Set targets (This year)" value="100" />

          <div className="flex items-center gap-4 mt-1" style={{ fontSize: 13 }}>
            <button
              type="button"
              className="bg-[#ef4d23] text-white rounded-lg px-5 py-2"
            >
              Save
            </button>
            <button type="button" className="underline text-neutral-700">
              Cancel
            </button>
            <X className="w-4 h-4 text-neutral-400 ml-auto" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
            <span className="text-[#ef4d23]">Failed builds</span>
            <span className="text-neutral-500">today</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span style={{ fontSize: 28, fontWeight: 600 }} className="text-neutral-900">
              0
            </span>
            <span
              className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5"
              style={{ fontSize: 11 }}
            >
              <TrendingUp className="w-3 h-3" />0
            </span>
          </div>

          <p className="text-neutral-500 mt-1" style={{ fontSize: 11 }}>
            Compared to yesterday
          </p>

          <Gauge value={68} color="#9ca3af" />

          <TogglePill activeLabel="Health checks" inactiveLabel="Failed builds" />
        </div>
      </div>
    </div>
  )
}

export default DashboardPreview
