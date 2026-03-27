import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import BigButton from "../components/BigButton"
import { PipelineStats } from "../components/dashboard/PipelineStats"
import ClientModal from "../components/ClientModal"

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
  const [modalOpen, setModalOpen] = useState(false)

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
        <h2 className="text-sm font-black text-slate-700 uppercase mb-4 text-left tracking-wider">
          Volume de Clientes por Status
        </h2>

        {/* Mudança: grid-cols-2 no mobile, 4 no tablet e auto-fit no desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-auto-fit gap-4 lg:flex lg:flex-wrap">
          {clientStats.map(s => (
            <button
              key={s.status}
              onClick={() => navigate(`/clients?status=${s.status}`)}
              className="flex-1 min-w-[140px] p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-purple-600 hover:shadow-md cursor-pointer transition-all text-left group"
            >
              <div className="text-[15px] font-black text-slate-500 uppercase mb-1 tracking-tight truncate group-hover:text-purple-600">
                {s.status === "nao_atender" ? "Não atender" :
                  s.status === "negociacao" ? "Negociação" : s.status}
              </div>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
                {s.count}
                <span className="text-[10px] font-medium text-slate-400 uppercase">qtd</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-10">
        <BigButton text="Ver todos os clientes" to="/clients" />
        <BigButton text="Ver todos os pedidos" to="/deals" />
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer"
        >
          Cadastrar Cliente
        </button>
      </div>
      <ClientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => window.location.reload()}
      />
    </div>
  )
}