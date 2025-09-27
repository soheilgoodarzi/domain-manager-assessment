"use client"
import { ChangeEvent, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getDomains, deleteDomain } from "@/services/api"
import { Domain } from "@/types/domain"
import DomainsTable from "@/components/DomainsTable"
import DomainModal from "@/components/DomainModal"
import DomainFilters from "@/components/DomainFilters"
import toast from "react-hot-toast"
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [domainToEdit, setDomainToEdit] = useState<Domain | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [domainToDeleteId, setDomainToDeleteId] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    domain: "",
    isActive: "all",
    status: "all",
  })

  const queryClient = useQueryClient()

  const {
    data: domains,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["domains"],
    queryFn: getDomains,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDomain,
    onSuccess: () => {
      toast.success("Domain deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["domains"] })
      setIsDeleteModalOpen(false)
      setDomainToDeleteId(null)
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete domain: ${error.message}`)
    },
  })

  const filteredDomains = useMemo(() => {
    const domainsArray = Array.isArray(domains) ? domains : []
    return domainsArray.filter((domain) => {
      const domainMatch = domain.domain
        .toLowerCase()
        .includes(filters.domain.toLowerCase())
      const activeMatch =
        filters.isActive === "all" ||
        String(domain.isActive) === filters.isActive
      const statusMatch =
        filters.status === "all" || String(domain.status) === filters.status
      return domainMatch && activeMatch && statusMatch
    })
  }, [domains, filters])

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleEdit = (domain: Domain) => {
    setDomainToEdit(domain)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setDomainToEdit(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setDomainToEdit(null)
  }

  const handleDelete = (id: string) => {
    setDomainToDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (domainToDeleteId) {
      deleteMutation.mutate(domainToDeleteId)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Domains</h1>
          <p className="text-slate-400">CRUD + Search & Filter</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-slate-50 text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-slate-200"
        >
          + Add Domain
        </button>
      </div>

      <DomainFilters filters={filters} onFilterChange={handleFilterChange} />

      {isLoading && <div className="text-center p-8">Loading domains...</div>}
      {isError && (
        <div className="text-center p-8 text-red-500">Error loading data.</div>
      )}

      {!isLoading && !isError && (
        <DomainsTable
          domains={filteredDomains}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DomainModal
        isOpen={isModalOpen}
        onClose={closeModal}
        domainToEdit={domainToEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  )
}
