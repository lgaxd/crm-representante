import { useEffect, useState, useMemo } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate, useSearchParams } from "react-router-dom"
import type { Client } from "../types/client"

import ClientsSidebar from "../components/clients/ClientsSidebar"
import ClientSearch from "../components/clients/ClientSearch"
import ClientsTable from "../components/clients/ClientsTable"

export default function ClientsPage() {

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [cityFilter, setCityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  )

  const [page, setPage] = useState(1)

  const PAGE_SIZE = 50

  const navigate = useNavigate()

  useEffect(() => {

    async function loadClients() {

      const records = await pb
        .collection("clients")
        .getFullList({ sort: "name" })

      setClients(records as unknown as Client[])
      setLoading(false)

    }

    loadClients()

  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, cityFilter, statusFilter, selectedType])

  const typeStats = useMemo(() => {

    const stats = new Map<string, number>()

    clients.forEach(client => {

      const type = client.type || "sem tipo"

      stats.set(type, (stats.get(type) || 0) + 1)

    })

    return Array.from(stats.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))

  }, [clients])

  const filteredClients = useMemo(() => {

    return clients.filter(client => {

      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        selectedType ? client.type === selectedType : true

      const matchesCity =
        cityFilter
          ? client.city?.toLowerCase().includes(cityFilter.toLowerCase())
          : true

      const matchesStatus =
        statusFilter ? client.status === statusFilter : true

      return (
        matchesSearch &&
        matchesType &&
        matchesCity &&
        matchesStatus
      )

    })

  }, [clients, search, selectedType, cityFilter, statusFilter])

  const paginatedClients = useMemo(() => {

    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    return filteredClients.slice(start, end)

  }, [filteredClients, page])

  const totalPages =
    Math.ceil(filteredClients.length / PAGE_SIZE)

  function getPagination(current: number, total: number) {

    const pages: number[] = []

    if (total <= 10) {

      for (let i = 1; i <= total; i++) pages.push(i)
      return pages

    }

    const start = Math.max(1, current - 4)
    const end = Math.min(total, current + 4)

    for (let i = start; i <= end; i++) pages.push(i)

    if (start > 1) {

      pages.unshift(-1)
      pages.unshift(1)

    }

    if (end < total) {

      pages.push(-1)
      pages.push(total)

    }

    return pages

  }

  const pages = getPagination(page, totalPages)

  if (loading) {

    return (
      <div className="p-8 text-center">
        Carregando clientes...
      </div>
    )

  }

  return (

    <div className="flex min-h-screen bg-gray-50">

      <ClientsSidebar
        clients={clients}
        typeStats={typeStats}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <main className="flex-1 p-6">

        <ClientSearch
          search={search}
          setSearch={setSearch}
        />

        <div className="flex gap-4 mb-4">

          <input
            placeholder="Cidade"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >

            <option value="">Todos status</option>
            <option value="discovery">Discovery</option>
            <option value="prospect">Prospect</option>
            <option value="lead">Lead</option>
            <option value="negociacao">Negociação</option>
            <option value="ativo">Ativo</option>
            <option value="perdido">Perdido</option>
            <option value="nao_atender">Não atender</option>

          </select>
        </div>

        <ClientsTable
          clients={paginatedClients}
          onRowClick={(id) =>
            navigate(`/clients/${id}`)
          }
        />

        <div className="flex gap-2 mt-6 flex-wrap">

          {pages.map((p, i) => {

            if (p === -1) {

              return (
                <span key={i} className="px-2">
                  ...
                </span>
              )

            }

            return (

              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 cursor-pointer hover:bg-gray-300"
                }`}
              >
                {p}
              </button>

            )

          })}

        </div>

      </main>

    </div>

  )

}