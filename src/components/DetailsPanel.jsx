import React, { useState } from 'react'

// SVG Icons as components - using consistent visible sizes with CSS classes
const Icons = {
  Briefcase: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Location: () => (
    <svg className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Money: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Home: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Check: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Star: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Building: () => (
    <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg className="icon-md" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Users: () => (
    <svg className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

// Badge color variants based on content
const getBadgeVariant = (tag) => {
  if (!tag) return 'badge-slate'
  
  const tagLower = tag.toLowerCase()
  if (tagLower.includes('react') || tagLower.includes('vue') || tagLower.includes('angular')) return 'badge-blue'
  if (tagLower.includes('python') || tagLower.includes('django') || tagLower.includes('flask')) return 'badge-teal'
  if (tagLower.includes('node') || tagLower.includes('express') || tagLower.includes('javascript')) return 'badge-amber'
  if (tagLower.includes('aws') || tagLower.includes('cloud') || tagLower.includes('devops')) return 'badge-purple'
  if (tagLower.includes('sql') || tagLower.includes('database') || tagLower.includes('postgres')) return 'badge-emerald'
  if (tagLower.includes('design') || tagLower.includes('ui') || tagLower.includes('ux')) return 'badge-rose'
  return 'badge-slate'
}

export default function DetailsPanel({ job, onClose, isMobile = false }) {
  const [saved, setSaved] = useState(false)
  const [companyInfo, setCompanyInfo] = useState(null)

  if (!job) return null

  const handleSave = () => {
    setSaved(!saved)
  }

  // Fetch company metadata from backend when job changes
  React.useEffect(() => {
    let mounted = true
    async function fetchCompany() {
      setCompanyInfo(null)
      try {
        const res = await fetch(`/api/companies/${encodeURIComponent(job.company)}`)
        if (!res.ok) {
          throw new Error(`Company lookup failed with status ${res.status}`)
        }
        const contentType = res.headers && res.headers.get
          ? res.headers.get('content-type') || ''
          : ''
        if (!contentType.toLowerCase().includes('application/json')) {
          throw new Error(`Unexpected content type for company lookup: ${contentType}`)
        }
        const data = await res.json()
        if (mounted) setCompanyInfo(data)
      } catch (e) {
        // If company endpoint not available or fails, keep fallback behavior
        console.error('Failed to fetch company info for', job.company, e)
        if (mounted) setCompanyInfo(null)
      }
    }
    fetchCompany()
    return () => { mounted = false }
  }, [job.company])

  // Parse description into sections (simulated rich content)
  const descriptionSections = [
    {
      title: 'About the Role',
      icon: <Icons.Briefcase />,
      content: job.description
    }
  ]

  return (
    <div className={`bg-white animate-fade-in ${isMobile ? 'h-full flex flex-col' : ''}`}>
      {/* Mobile Header with Close */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <span className="font-semibold text-slate-900">Job Details</span>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={`p-6 space-y-6 ${isMobile ? 'flex-1 overflow-y-auto custom-scrollbar' : ''}`}>
        {/* Company Card Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center p-3">
            <img
              src={job.logoUrl}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1.5">
              {job.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-slate-700">{job.company}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[13px] text-slate-500 flex items-center gap-1.5">
                <Icons.Location />
                {job.location}
              </span>
            </div>
            {job.postedDate && (
              <p className="text-[12px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Icons.Clock />
                Posted {new Date(job.postedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary flex-1 justify-center gap-2 h-11"
          >
            Apply Now
            <Icons.ExternalLink />
          </a>
          <button 
            onClick={handleSave}
            className={`btn-secondary px-4 h-11 ${saved ? 'saved animate-heart' : ''}`}
          >
            <Icons.Heart filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 rounded-xl bg-slate-50 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-1.5">
              <Icons.Briefcase />
              <span className="text-[12px] font-medium">Job Type</span>
            </div>
            <p className="font-semibold text-[14px] text-slate-900">{job.type || 'Full-time'}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-1.5">
              <Icons.Home />
              <span className="text-[12px] font-medium">Work Mode</span>
            </div>
            <p className="font-semibold text-[14px] text-slate-900">{job.remote ? 'Remote' : 'On-site'}</p>
          </div>
          
          {job.salary && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-emerald-50/80 shadow-sm col-span-2">
              <div className="flex items-center gap-2 text-emerald-700 mb-1.5">
                <Icons.Money />
                <span className="text-[12px] font-semibold">Salary Range</span>
              </div>
              <p className="font-bold text-emerald-700 text-[15px]">{job.salary}</p>
            </div>
          )}
        </div>

        {/* Skills/Tags */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-900 mb-3 flex items-center gap-2.5">
            <span className="w-1 h-3.5 bg-sky-500 rounded-full"></span>
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag, index) => (
              <span key={tag} className={`badge text-[11px] px-2.5 py-1 font-medium ${getBadgeVariant(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {descriptionSections.map((section, idx) => (
          <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <h3 className="text-[13px] font-bold text-slate-900 mb-3 flex items-center gap-2.5">
              <span className="w-1 h-3.5 bg-sky-500 rounded-full"></span>
              {section.title}
            </h3>
            
            {section.content ? (
              <p className="text-slate-600 leading-relaxed text-[14px]">
                {section.content}
              </p>
            ) : (
              <ul className="space-y-2">
                {section.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                    <span className="w-4.5 h-4.5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Company Info Card */}
        {companyInfo && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 via-blue-50/60 to-sky-50/80 shadow-sm">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm flex items-center justify-center text-white">
                <Icons.Building />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-slate-900">About {job.company}</h4>
                <p className="text-[12px] text-slate-500">Company Overview</p>
              </div>
            </div>
            <p className="text-slate-600 text-[13px] leading-relaxed">{companyInfo.overview}</p>
            <div className="flex items-center gap-4 mt-3 text-[12px] text-slate-500">
              {companyInfo.employees && (
                <span className="flex items-center gap-1.5">
                  <Icons.Users />
                  {companyInfo.employees}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Icons.Location />
                {job.location}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
