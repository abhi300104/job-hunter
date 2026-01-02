import React from 'react'

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
      aria-selected={selected ? 'true' : 'false'}
      onKeyDown={handleKey}
      onClick={onOpen}
      className={`
        card-modern cursor-pointer p-3 transition
        ${selected
          ? 'border-l-2 border-blue-600 bg-blue-50/40'
          : 'hover:bg-slate-50'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        <img
          src={job.logoUrl}
          alt={`${job.company} logo`}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-slate-900 leading-tight truncate">
            {job.title}
          </h3>

          <div className="text-xs text-slate-500 mt-1 truncate">
            <span className="font-medium">{job.company}</span>
            <span className="mx-1">•</span>
            <span>{job.location}</span>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {job.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge-modern text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Meta */}
        <div className="flex-shrink-0 text-right ml-2">
          <div className="text-[11px] text-slate-400 mb-2">
            {job.postedDate
              ? new Date(job.postedDate).toLocaleDateString()
              : ''}
          </div>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary text-xs px-3 py-1"
          >
            Easy Apply
          </a>
        </div>
      </div>
    </article>
  )
}
