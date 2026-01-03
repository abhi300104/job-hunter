import React from 'react'

// Icon components
const Icons = {
  Location: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
}

export default function Filters({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch })

  // Count active filters
  const activeCount = [
    filters.location,
    filters.remote !== 'any',
    filters.type !== 'any'
  ].filter(Boolean).length

  const clearFilters = () => {
    onChange({ location: '', remote: 'any', type: 'any' })
  }

  return (
    <div className="bg-slate-50/50 px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Label */}
        <div className="flex items-center gap-2.5 text-slate-700 mr-2">
          <Icons.Filter />
          <span className="text-[13px] font-semibold hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>

        {/* Location Input with Icon */}
        <div className="input-with-icon flex-1 min-w-[200px] max-w-[280px]">
          <span className="icon">
            <Icons.Location />
          </span>
          <input
            className="input-modern w-full"
            placeholder="City or region..."
            value={filters.location}
            onChange={e => set({ location: e.target.value })}
          />
        </div>

        {/* Work Mode Select */}
        <div className="relative">
          <select
            className="select-modern min-w-[140px]"
            value={filters.remote}
            onChange={e => set({ remote: e.target.value })}
          >
            <option value="any">All work modes</option>
            <option value="yes">Remote</option>
            <option value="no">On-site</option>
          </select>
        </div>

        {/* Job Type Select */}
        <div className="relative">
          <select
            className="select-modern min-w-[140px]"
            value={filters.type}
            onChange={e => set({ type: e.target.value })}
          >
            <option value="any">All job types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="btn-icon text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear all filters"
          >
            <Icons.X />
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 animate-slide-up">
          {filters.location && (
            <span className="filter-chip active">
              <Icons.Location />
              {filters.location}
              <button 
                onClick={() => set({ location: '' })}
                className="remove"
              >
                <Icons.X />
              </button>
            </span>
          )}
          {filters.remote !== 'any' && (
            <span className="filter-chip active">
              <Icons.Home />
              {filters.remote === 'yes' ? 'Remote' : 'On-site'}
              <button 
                onClick={() => set({ remote: 'any' })}
                className="remove"
              >
                <Icons.X />
              </button>
            </span>
          )}
          {filters.type !== 'any' && (
            <span className="filter-chip active">
              <Icons.Briefcase />
              {filters.type}
              <button 
                onClick={() => set({ type: 'any' })}
                className="remove"
              >
                <Icons.X />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
