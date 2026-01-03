import React from 'react'

const Icons = {
  Sort: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  )
}

export default function SortBar({ sort, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 flex items-center gap-1.5">
        <Icons.Sort />
        <span className="hidden sm:inline">Sort:</span>
      </span>
      <select
        className="select-modern text-sm py-2 px-3 min-w-[130px]"
        value={sort}
        onChange={e => onChange(e.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  )
}

