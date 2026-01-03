import React, { useState, useMemo, useEffect, useRef } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'
import Filters from './components/Filters'
import SortBar from './components/SortBar'
import DetailsPanel from './components/DetailsPanel'

const API_URL = 'http://localhost:8000'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ location: '', remote: 'any', type: 'any' })
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const detailsRef = useRef(null)

  // Debounced search term - only updates after user stops typing
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location)

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  // Debounce location filter (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(filters.location)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.location])

  // 🌐 Fetch jobs from API with search, filters, and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setFetching(true)
        setError(null)
        
        // Build query parameters
        const params = new URLSearchParams()
        if (debouncedQuery) params.append('q', debouncedQuery)
        if (debouncedLocation) params.append('location', debouncedLocation)
        if (filters.remote !== 'any') params.append('remote', filters.remote)
        if (filters.type !== 'any') params.append('type', filters.type)
        params.append('sort', sort)
        params.append('page', page)
        params.append('page_size', 5)
        
        const response = await fetch(`${API_URL}/api/jobs?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setJobs(data.jobs)
        setTotal(data.total)
        setTotalPages(data.total_pages)
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError(err.message)
      } finally {
        setFetching(false)
        setInitialLoading(false)
      }
    }

    fetchJobs()
  }, [debouncedQuery, debouncedLocation, filters.remote, filters.type, sort, page])

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, debouncedLocation, filters.remote, filters.type, sort])

  // ✅ Auto-select first job (LinkedIn behavior)
  useEffect(() => {
    if (!jobs.length) {
      setSelectedJob(null)
      return
    }
    if (!selectedJob || !jobs.some(j => j.id === selectedJob.id)) {
      setSelectedJob(jobs[0])
    }
  }, [jobs, selectedJob])

  // 🔄 Initial Loading state (only on first load)
  if (initialLoading) {
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
  if (error && !jobs.length) {
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
          {/* Pagination Info */}
          {jobs.length > 0 && (
            <div className="text-sm text-slate-600 mb-2 flex items-center justify-between">
              <span>Showing {jobs.length} of {total} jobs (Page {page} of {totalPages})</span>
              {fetching && <span className="text-blue-600 text-xs">Updating...</span>}
            </div>
          )}

          <JobList
            jobs={jobs}
            selectedId={selectedJob?.id}
            onOpen={(job) => {
              setSelectedJob(job)
              detailsRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 pb-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
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
