"use client"
import React from "react"

interface DomainFiltersProps {
  filters: {
    domain: string
    isActive: string
    status: string
  }
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
}

const DomainFilters = ({ filters, onFilterChange }: DomainFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        name="domain"
        placeholder="Search by domain..."
        value={filters.domain}
        onChange={onFilterChange}
        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <select
        name="isActive"
        value={filters.isActive}
        onChange={onFilterChange}
        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">All active states</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
      <select
        name="status"
        value={filters.status}
        onChange={onFilterChange}
        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">All statuses</option>
        <option value="1">Pending</option>ّ
        <option value="2">Verified</option>
        <option value="3">Rejected</option>
      </select>
    </div>
  )
}

export default DomainFilters
