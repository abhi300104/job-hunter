import React from 'react'
import JobCard from './JobCard'

// Skeleton loader component
const SkeletonCard = () => (
  <div className="skeleton-card animate-fade-in">
    <div className="flex items-start gap-4">
      <div className="skeleton skeleton-avatar"></div>
      <div className="flex-1 space-y-3">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text w-3/4"></div>
        <div className="skeleton skeleton-text w-full"></div>
        <div className="flex gap-2 mt-2">
          <div className="skeleton w-16 h-6 rounded-full"></div>
          <div className="skeleton w-20 h-6 rounded-full"></div>
          <div className="skeleton w-14 h-6 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
)

// Empty state illustration
const EmptyState = () => (
  <div className="empty-state animate-scale-in">
    <div className="empty-state-icon">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
    <p className="text-slate-500 max-w-sm mx-auto">
      We couldn't find any jobs matching your criteria. Try adjusting your filters or search term.
    </p>
  </div>
)

export default function JobList({ jobs, onOpen, selectedId, loading }) {
  // Show skeleton loaders while loading
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className="card-modern">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job, index) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onOpen={() => onOpen(job)} 
          selected={job.id === selectedId}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  )
}
