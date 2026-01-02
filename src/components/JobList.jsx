import React from 'react'
import JobCard from './JobCard'

export default function JobList({jobs, onOpen, selectedId}) {
  if (!jobs.length) {
    return (
      <div className="card-modern p-12 text-center">
        <p className="text-lg text-slate-600 mb-2">😔 No jobs found</p>
        <p className="text-sm text-slate-500">Try adjusting your filters or search term</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} onOpen={() => onOpen(job)} selected={job.id === selectedId} />
      ))}
    </div>
  )
}
