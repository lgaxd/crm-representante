import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import BigButton from "../components/BigButton"
import { PipelineStats } from "../components/dashboard/PipelineStats" // Certifique-se de criar este arquivo

const STATUSES = [
  "discovery",
  "prospect",
  "lead",
  "negociacao",
  "ativo",
  "perdido",
  "nao_atender"
]

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [deals, setDeals] = useState<any[]>([]) // Estado para os negócios
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        // Busca clientes e deals simultaneamente
        const [clientRecords, dealRecords] = await Promise.all([
          pb.collection("clients").getFullList(),
          pb.collection("deals").getFullList()
        ])

        setClients(clientRecords as unknown as Client[])
        setDeals(dealRecords)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      }
    }

    load()
  }, [])

  const clientStats = STATUSES.map(status => ({
    status,
    count: clients.filter(c => c.status === status).length
  }))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-left">Dashboard Comercial</h1>

      {/* 1. SEÇÃO DE MÉTRICAS FINANCEIRAS (DEALS) */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 text-left tracking-wider">
          Performance de Vendas (Deals)
        </h2>
        <PipelineStats deals={deals} />
      </div>

      {/* 2. SEÇÃO DE STATUS DOS CLIENTES */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 text-left tracking-wider">
          Volume de Clientes por Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {clientStats.map(s => (
            <button
              key={s.status}
              onClick={() => navigate(`/clients?status=${s.status}`)}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-500 cursor-pointer transition-all text-left"
            >
              <div className="text-xs text-gray-500 capitalize mb-1 truncate">
                {s.status === "nao_atender" ? "Não atender" : 
                 s.status === "negociacao" ? "Negociação" : s.status}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {s.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <BigButton text="Ver todos os clientes" to="/clients" />
      </div>
    </div>
  )
}