// src/app/page.tsx

"use client"

import { useMemo, useState } from "react"
import DomainsTable from "@/components/DomainsTable"
import DomainModal from "@/components/DomainModal"
import { useQuery } from "@tanstack/react-query"
import { getDomains } from "@/services/api"
import DomainFilters from "@/components/DomainFilters"
import { Domain } from "@/types/domain"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ۱. وضعیت برای نگهداری مقادیر فیلترها
  const [filters, setFilters] = useState({
    domain: "",
    isActive: "", // 'true', 'false', or ''
    status: "", // '1', '2', '3', or ''
  })

  // ۲. Fetch کردن کل داده‌ها در کامپوننت والد
  const {
    data: domains,
    isLoading,
    isError,
  } = useQuery({
    // ✅ تغییر ۱: حذف مقدار پیش‌فرض [] برای شفافیت
    queryKey: ["domains"],
    queryFn: getDomains,
  })

  // ۳. تابع برای مدیریت تغییرات فیلترها
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  // ۴. منطق فیلتر کردن داده‌ها
  const filteredDomains = useMemo(() => {
    // ✅ تغییر ۲ (اصلی): قبل از فیلتر کردن، مطمئن می‌شویم که domains یک آرایه است
    const domainsArray = Array.isArray(domains) ? domains : []

    return domainsArray.filter((domain: Domain) => {
      // فیلتر بر اساس نام دامنه
      const domainMatch = domain.domain
        .toLowerCase()
        .includes(filters.domain.toLowerCase())

      // فیلتر بر اساس وضعیت Active
      const isActiveMatch =
        filters.isActive === "" || String(domain.isActive) === filters.isActive

      // فیلتر بر اساس Status
      const statusMatch =
        filters.status === "" || String(domain.status) === filters.status

      return domainMatch && isActiveMatch && statusMatch
    })
  }, [domains, filters]) // این تابع فقط زمانی دوباره اجرا می‌شود که domains یا filters تغییر کنند

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Domains</h1>
          <p className="text-slate-400">CRUD + Search & Filter</p>
        </div>
        <button
          onClick={openModal}
          className="bg-slate-50 text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-slate-200"
        >
          + Add Domain
        </button>
      </div>

      {/* کامپوننت فیلترها */}
      <DomainFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* مدیریت وضعیت لودینگ و خطا */}
      {isLoading && <div className="text-center p-8">Loading domains...</div>}
      {isError && (
        <div className="text-center p-8 text-red-500">Error loading data.</div>
      )}

      {/* پاس دادن داده‌های فیلتر شده به جدول */}
      {!isLoading && !isError && <DomainsTable data={filteredDomains} />}

      <DomainModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  )
}
