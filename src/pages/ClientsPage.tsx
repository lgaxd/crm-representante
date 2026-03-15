import { useEffect, useState, useMemo } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"
import type { Client } from "../types/client"

import ClientsSidebar from "../components/clients/ClientsSidebar"
import ClientSearch from "../components/clients/ClientSearch"
import ClientsTable from "../components/clients/ClientsTable"

export default function ClientsPage() {

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    async function loadClients() {
      const records = await pb.collection("clients").getFullList({ sort: "name" })
      setClients(records as unknown as Client[])
      setLoading(false)
    }
    loadClients()
  }, [])

  const typeStats = useMemo(() => {
    const stats = new Map<string, number>()

    clients.forEach(client => {
      const type = client.type || "sem tipo"
      stats.set(type, (stats.get(type) || 0) + 1)
    })

    return Array.from(stats.entries()).sort((a,b)=>a[0].localeCompare(b[0]))
  }, [clients])

  const filteredClients = useMemo(() => {
    return clients.filter(client => {

      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        selectedType ? client.type === selectedType : true

      return matchesSearch && matchesType

    })
  }, [clients, search, selectedType])

  if (loading) {
    return <div className="p-8 text-center">Carregando clientes...</div>
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

        <ClientsTable
          clients={filteredClients}
          onRowClick={(id)=>navigate(`/clients/${id}`)}
        />

      </main>

    </div>
  )
}