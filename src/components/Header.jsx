import React from 'react'

// Custom Logo Component
const JobHunterLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Letter J */}
    <path d="M14 8 C14 6 16 6 16 8 L16 24 C16 28 12 28 12 24" stroke="url(#logoGradient)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    {/* Letter H */}
    <path d="M22 8 L22 32 M22 20 L30 20 M30 8 L30 32" stroke="url(#logoGradient)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    {/* Target circle accent */}
    <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.2" fill="none"/>
  </svg>
)

// Icon components
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
}

export default function Header({ query, setQuery }) {
  return (
    <header className="bg-white/95 backdrop-blur-xl sticky top-0 z-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2 sm:gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-purple-400 to-cyan-400 rounded-xl blur-md opacity-40"></div>
            <div className="relative bg-white rounded-xl p-1 shadow-sm">
              <JobHunterLogo />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">JobHunter</h1>
            <p className="text-xs text-slate-500">🚀 Find your dream job</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md sm:max-w-xl lg:max-w-2xl min-w-0">
          <div className="input-with-icon">
            <span className="icon">
              <Icons.Search />
            </span>
            <input
              aria-label="Search jobs"
              className="input-modern w-full text-sm sm:text-base"
              placeholder="Search jobs..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="p-2.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-700 transition-all hidden sm:flex" aria-label="Notifications">
            <Icons.Bell />
          </button>
          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-700 transition-all font-medium text-sm" aria-label="Profile">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <span>Profile</span>
          </button>
          {/* Mobile profile button */}
          <button className="md:hidden p-2.5 rounded-lg hover:bg-slate-50 transition-all" aria-label="Profile">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

