import { useEffect, useState, useMemo } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadClients() {
      try {
        const records = await pb.collection("clients").getFullList({
          sort: "name",
        })
        setClients(records as unknown as Client[])
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadClients()
  }, [])

  // Estatísticas por tipo
  const typeStats = useMemo(() => {
    const stats = new Map<string, number>()
    clients.forEach((client) => {
      const type = client.type || "sem tipo"
      stats.set(type, (stats.get(type) || 0) + 1)
    })
    return Array.from(stats.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [clients])

  // Filtro
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase())
      const matchesType = selectedType ? client.type === selectedType : true
      return matchesSearch && matchesType
    })
  }, [clients, search, selectedType])

  if (loading) {
    return <div className="p-8 text-center">Carregando clientes...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-4">
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tipos de cliente
          </h2>
          <button
            onClick={() => setSelectedType(null)}
            className={`mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
              selectedType === null
                ? "bg-purple-50 text-purple-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>Todos</span>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
              {clients.length}
            </span>
          </button>
          {typeStats.map(([type, count]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm capitalize ${
                selectedType === type
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{type.replace("_", " ")}</span>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                {count}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        {/* Barra de pesquisa */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabela de clientes */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Cidade</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 capitalize">
                      {client.type?.replace("_", " ") || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{client.city || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{client.state || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-600">
                      {client.status?.replace("_", " ") || "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}