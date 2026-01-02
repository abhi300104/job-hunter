import React, { useState, useMemo, useEffect, useRef } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'
import Filters from './components/Filters'
import SortBar from './components/SortBar'
import DetailsPanel from './components/DetailsPanel'
import jobsData from './data/jobs.json'

export default function App(){
  const [jobs] = useState(jobsData)
  const [filters, setFilters] = useState({ location: '', remote: 'any', type: 'any' })
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedJob(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeBtnRef = useRef(null)
  useEffect(() => { if (selectedJob) closeBtnRef.current?.focus() }, [selectedJob])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = jobs.filter(j => {
      if (q && !(
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.tags || []).join(' ').toLowerCase().includes(q)
      )) return false
      if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.remote === 'yes' && !j.remote) return false
      if (filters.remote === 'no' && j.remote) return false
      if (filters.type && filters.type !== 'any' && j.type !== filters.type) return false
      return true
    })

    out.sort((a,b) => {
      if (sort === 'newest') return new Date(b.postedDate) - new Date(a.postedDate)
      return new Date(a.postedDate) - new Date(b.postedDate)
    })

    return out
  }, [jobs, query, filters, sort])

  // Ensure there is a selected job by default (first visible) and keep selection in sync with filtered results
  useEffect(() => {
    if (!filtered || filtered.length === 0) {
      setSelectedJob(null)
      return
    }

    if (!selectedJob) {
      setSelectedJob(filtered[0])
      return
    }

    const exists = filtered.some(j => j.id === selectedJob.id)
    if (!exists) setSelectedJob(filtered[0])
  }, [filtered, selectedJob])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900">
      <Header query={query} setQuery={setQuery} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full lg:w-1/2">
            <div className="mb-4 md:hidden">
              <Filters filters={filters} onChange={setFilters} />
            </div>

            <div className="mb-4 md:hidden">
              <SortBar sort={sort} onChange={setSort} />
            </div>

            <div className="job-list mt-3 md:hidden">
              <JobList jobs={filtered} onOpen={setSelectedJob} selectedId={selectedJob?.id} />
            </div>

            <div className="card-modern p-6 mt-6 md:mt-8">
              {selectedJob ? (
                <DetailsPanel job={selectedJob} closeRef={closeBtnRef} onClose={() => setSelectedJob(null)} />
              ) : (
                <div className="text-center text-sm text-slate-600">Select a job to see details</div>
              )}
            </div>
          </div>

        </div>
      </main>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:hidden">
          <div role="dialog" aria-modal="true" aria-label={`Job details for ${selectedJob.title}`} className="bg-white max-w-2xl w-50 p-6 rounded-xl shadow-2xl">
            <DetailsPanel job={selectedJob} closeRef={closeBtnRef} onClose={() => setSelectedJob(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
