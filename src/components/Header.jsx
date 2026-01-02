import React from 'react'

export default function Header({query, setQuery}){
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Job Hunter</h1>
          <p className="text-slate-500 text-sm hidden sm:block">Discover your next opportunity</p>
        </div>

        <div className="flex-1 max-w-3xl ml-6">
          <input
            aria-label="Search jobs"
            className="input-modern w-full text-base"
            placeholder="Search by title, company, or tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="hidden md:block">
          <button className="btn-secondary">Profile</button>
        </div>
      </div>
    </header>
  )
}

