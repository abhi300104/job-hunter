import React from 'react'

export default function SortBar({ sort, onChange }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span>Sort by</span>
      <select
        className="select-modern text-sm px-2 py-1"
        value={sort}
        onChange={e => onChange(e.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  )
}

