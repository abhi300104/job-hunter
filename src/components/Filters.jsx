import React from 'react'

export default function Filters({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">

        {/* Location */}
        <input
          className="input-modern w-[260px]"
          placeholder="Location"
          value={filters.location}
          onChange={e => set({ location: e.target.value })}
        />

        {/* Work Mode */}
        <select
          className="select-modern w-[160px]"
          value={filters.remote}
          onChange={e => set({ remote: e.target.value })}
        >
          <option value="any">Work mode</option>
          <option value="yes">Remote</option>
          <option value="no">On-site</option>
        </select>

        {/* Job Type */}
        <select
          className="select-modern w-[160px]"
          value={filters.type}
          onChange={e => set({ type: e.target.value })}
        >
          <option value="any">Job type</option>
          <option>Full-time</option>
          <option>Contract</option>
          <option>Part-time</option>
        </select>

      </div>
    </div>
  )
}
