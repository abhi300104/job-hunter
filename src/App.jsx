import React, { useState, useMemo, useEffect, useRef } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'
import Filters from './components/Filters'
import SortBar from './components/SortBar'
import DetailsPanel from './components/DetailsPanel'
import jobsData from './data/jobs.json'

export default function App() {
  const [jobs] = useState(jobsData)
  const [filters, setFilters] = useState({ location: '', remote: 'any', type: 'any' })
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const detailsRef = useRef(null)

  // 🔍 Filter + sort jobs
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()

    let result = jobs.filter(j => {
      if (
        q &&
        !(
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.tags || []).join(' ').toLowerCase().includes(q)
        )
      ) return false

      if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.remote === 'yes' && !j.remote) return false
      if (filters.remote === 'no' && j.remote) return false
      if (filters.type !== 'any' && j.type !== filters.type) return false

      return true
    })

    result.sort((a, b) =>
      sort === 'newest'
        ? new Date(b.postedDate) - new Date(a.postedDate)
        : new Date(a.postedDate) - new Date(b.postedDate)
    )

    return result
  }, [jobs, query, filters, sort])

  // ✅ Auto-select first job (LinkedIn behavior)
  useEffect(() => {
    if (!filteredJobs.length) {
      setSelectedJob(null)
      return
    }
    if (!selectedJob || !filteredJobs.some(j => j.id === selectedJob.id)) {
      setSelectedJob(filteredJobs[0])
    }
  }, [filteredJobs, selectedJob])

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header query={query} setQuery={setQuery} />
      {/* FILTER + SORT TOOLBAR */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between">
          <Filters filters={filters} onChange={setFilters} />
          <div className="pr-4">
            <SortBar sort={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full overflow-hidden">

        {/* LEFT COLUMN – Job List */}
        <aside className="w-[45%] border-r border-slate-200 overflow-y-auto p-4 space-y-4">


          <JobList
            jobs={filteredJobs}
            selectedId={selectedJob?.id}
            onOpen={(job) => {
              setSelectedJob(job)
              detailsRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </aside>

        {/* RIGHT COLUMN – Job Details */}
        <section
          ref={detailsRef}
          className="w-[55%] overflow-y-auto p-6 bg-white"
        >
          {selectedJob ? (
            <DetailsPanel job={selectedJob} />
          ) : (
            <div className="text-center text-slate-500 mt-24">
              Select a job to view details
            </div>
          )}
        </section>
      </div>


    </div>
  )
}
