import React, { useState, useMemo, useEffect, useRef } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'
import Filters from './components/Filters'
import SortBar from './components/SortBar'
import DetailsPanel from './components/DetailsPanel'

const API_URL = 'http://localhost:8000'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ location: '', remote: 'any', type: 'any' })
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const detailsRef = useRef(null)

  // 🌐 Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_URL}/api/jobs`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setJobs(data)
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

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

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Jobs</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
