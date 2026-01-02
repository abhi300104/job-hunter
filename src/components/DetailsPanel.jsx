import React from 'react'

export default function DetailsPanel({ job }) {
  if (!job) return null

  return (
    <div className="p-6 bg-white space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {job.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {job.company} • {job.location}
              {job.remote && ' • Remote'}
            </p>
          </div>
        </div>

        {/* SINGLE CTA */}
        <div className="flex gap-2">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-5 py-2 font-medium"
          >
            Apply
          </a>
          <button className="btn-secondary">
            Save
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="px-2 py-1 bg-slate-100 rounded-full">
          {job.type}
        </span>
        {job.remote && (
          <span className="px-2 py-1 bg-slate-100 rounded-full">
            Remote
          </span>
        )}
        {job.salary && (
          <span className="px-2 py-1 bg-slate-100 rounded-full">
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="max-w-2xl text-sm text-slate-700 leading-relaxed">
        {job.description}
      </div>
    </div>
  )
}
