"use client"

import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { Domain } from "@/types/domain"

const statusMap = {
  1: { text: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  2: { text: "Verified", color: "bg-green-500/20 text-green-400" },
  3: { text: "Rejected", color: "bg-red-500/20 text-red-400" },
}

const columns: ColumnDef<Domain>[] = [
  { accessorKey: "domain", header: "Domain" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusInfo = statusMap[row.original.status]
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
        >
          {statusInfo.text}
        </span>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  {
    accessorKey: "createdDate",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdDate).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-sm">
          Edit
        </button>
        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
          Delete
        </button>
      </div>
    ),
  },
]

interface DomainsTableProps {
  data: Domain[]
}

const DomainsTable = ({ data }: DomainsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 rounded-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-700">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 text-left text-sm font-semibold text-slate-300"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-8">
                No domains found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DomainsTable
