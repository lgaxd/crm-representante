import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import BigButton from "../components/BigButton"

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

  const [clients,setClients] = useState<Client[]>([])
  const navigate = useNavigate()

  useEffect(()=>{

    async function load(){

      const records = await pb.collection("clients").getFullList()

      setClients(records as unknown as Client[])

    }

    load()

  },[])

  const stats = STATUSES.map(status => ({
    status,
    count: clients.filter(c => c.status === status).length
  }))

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        {stats.map(s => (

          <button
            key={s.status}
            onClick={()=>navigate(`/clients?status=${s.status}`)}
            className="p-6 bg-white border rounded-xl shadow hover:border-purple-500 cursor-pointer"
          >

            <div className="text-sm text-gray-500 capitalize">
              {s.status === "nao_atender" ? "Não atender" : s.status === "negociacao" ? "Negociação" : s.status}
            </div>

            <div className="text-3xl font-bold">
              {s.count}
            </div>

          </button>

        ))}

      </div>

      <BigButton text="Ver todos os clientes" to="/clients" />

    </div>
  )
}