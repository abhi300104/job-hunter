import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import JobList from './components/JobList'
import Filters from './components/Filters'
import SortBar from './components/SortBar'
import DetailsPanel from './components/DetailsPanel'

const API_URL = 'http://localhost:8000'
const PAGE_SIZE = 5

// Custom hook for media query
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])
  
  return matches
}

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
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const detailsRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 1023px)')

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

  // 🌐 Fetch jobs from API when debounced search/filters or pagination change
  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchJobs = async () => {
      try {
        setFetching(true)
        setError(null)
        
        // Build query parameters
        const params = new URLSearchParams()
        if (debouncedQuery) params.append('q', debouncedQuery)
        if (debouncedLocation) params.append('location', debouncedLocation)
        if (filters.remote !== 'any') params.append('remote', filters.remote)
        if (filters.type !== 'any') params.append('job_type', filters.type)
        params.append('sort', sort)
        params.append('page', page)
        params.append('page_size', PAGE_SIZE)
        
        const response = await fetch(`${API_URL}/api/jobs?${params.toString()}`, {
          signal: abortController.signal
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setJobs(data.jobs)
        setTotal(data.total)
        setTotalPages(data.total_pages)
      } catch (err) {
        if (err.name === 'AbortError') {
          // Request was cancelled, do nothing
          return
        }
        console.error('Failed to fetch jobs:', err)
        setJobs([])
        setError(err.message)
      } finally {
        setFetching(false)
        setInitialLoading(false)
      }
    }

    fetchJobs()
    
    return () => {
      abortController.abort()
    }
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

  // Handle job selection with mobile panel
  const handleSelectJob = (job) => {
    setSelectedJob(job)
    if (isMobile) {
      setMobileDetailOpen(true)
    }
    detailsRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Close mobile panel
  const closeMobileDetail = () => {
    setMobileDetailOpen(false)
  }

  // 🔄 Initial Loading state (only on first load)
  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <div className="text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="inline-block h-2 w-32 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-slate-700 font-semibold">✨ Loading amazing opportunities...</p>
          </div>
        </div>
      </div>
    )
  }

  // ❌ Error state
  if (error && !jobs.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-slate-50/80 to-blue-50/50 text-slate-900 overflow-x-hidden">
      <Header query={query} setQuery={setQuery} />
      
      {/* FILTER + SORT TOOLBAR */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between overflow-x-hidden">
          <Filters filters={filters} onChange={setFilters} />
          <div className="pr-4 hidden sm:block flex-shrink-0">
            <SortBar sort={sort} onChange={setSort} />
          </div>
        </div>
        {/* Mobile Sort */}
        <div className="sm:hidden px-4 pb-3">
          <SortBar sort={sort} onChange={setSort} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full overflow-hidden">

        {/* LEFT COLUMN – Job List */}
        <aside className={`${isMobile ? 'w-full' : 'w-[45%]'} overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/40`}>
          {/* Pagination Info */}
          {jobs.length > 0 && (
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-xs">
              <span className="text-[13px] font-medium text-slate-700">
                Showing <span className="font-bold text-sky-600">{((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, total)}</span> of <span className="font-semibold">{total}</span> jobs
              </span>
              {fetching && (
                <span className="flex items-center gap-2 text-sky-600 text-[13px] font-medium">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-pulse"></span>
                  Updating...
                </span>
              )}
            </div>
          )}

          <JobList
            jobs={jobs}
            selectedId={selectedJob?.id}
            onOpen={handleSelectJob}
            loading={fetching && jobs.length === 0}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 pb-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                        page === pageNum 
                          ? 'bg-gradient-to-br from-sky-500 to-purple-500 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </aside>

        {/* RIGHT COLUMN – Job Details (Desktop) */}
        {!isMobile && (
          <section
            ref={detailsRef}
            className="w-[55%] overflow-y-auto bg-white custom-scrollbar pl-6"
          >
            {selectedJob ? (
              <DetailsPanel job={selectedJob} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a job to view details</h3>
                <p className="text-slate-500 max-w-xs">Click on any job card from the list to see the full description and apply.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Mobile Detail Panel - Slide Over */}
      {isMobile && (
        <>
          <div 
            className={`mobile-overlay ${mobileDetailOpen ? 'open' : ''}`}
            onClick={closeMobileDetail}
          />
          <div className={`mobile-slide-panel ${mobileDetailOpen ? 'open' : ''}`}>
            {selectedJob && (
              <DetailsPanel 
                job={selectedJob} 
                onClose={closeMobileDetail}
                isMobile={true}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
