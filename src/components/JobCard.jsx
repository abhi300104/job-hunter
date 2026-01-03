import React from 'react'

// Badge color variants based on tag content
const getBadgeVariant = (tag) => {
  const tagLower = tag.toLowerCase()
  if (tagLower.includes('react') || tagLower.includes('vue') || tagLower.includes('angular')) return 'badge-blue'
  if (tagLower.includes('python') || tagLower.includes('django') || tagLower.includes('flask')) return 'badge-teal'
  if (tagLower.includes('node') || tagLower.includes('express') || tagLower.includes('javascript')) return 'badge-amber'
  if (tagLower.includes('aws') || tagLower.includes('cloud') || tagLower.includes('devops')) return 'badge-purple'
  if (tagLower.includes('sql') || tagLower.includes('database') || tagLower.includes('postgres')) return 'badge-emerald'
  if (tagLower.includes('design') || tagLower.includes('ui') || tagLower.includes('ux')) return 'badge-rose'
  return 'badge-slate'
}

// Format relative date
const getRelativeDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function JobCard({ job, onOpen, selected }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={handleKey}
      onClick={onOpen}
      className={`
        card-modern cursor-pointer p-5 transition-all duration-200 stagger-item
        ${selected
          ? 'selected'
          : 'hover:shadow-md hover:border-slate-300'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
            <img
              src={job.logoUrl}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain"
            />
          </div>
          {job.remote && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white" title="Remote">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2">
              {job.title}
            </h3>
            <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0 mt-1">
              {getRelativeDate(job.postedDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-[13px] text-slate-600">
            <span className="font-medium text-slate-700">{job.company}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1 text-slate-500">
              <svg className="icon-sm-13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {job.location}
            </span>
          </div>

          {/* Salary & Type Row */}
          <div className="flex items-center gap-2 mt-2.5">
            {job.salary && (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 px-2.5 py-1 rounded-lg shadow-sm">
                <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </span>
            )}
            {job.type && (
              <span className="text-[12px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                {job.type}
              </span>
            )}
          </div>

          <p className="text-[13px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.tags.slice(0, 4).map(tag => (
              <span key={tag} className={`badge text-[11px] py-1 px-2.5 font-medium ${getBadgeVariant(tag)}`}>
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="badge badge-slate text-[11px] py-1 px-2.5 font-medium">
                +{job.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
