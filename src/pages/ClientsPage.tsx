import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useNavigate } from "react-router-dom"

export default function ClientsPage() {

  const [clients, setClients] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {

    async function load() {

      const result = await pb.collection("clients").getFullList({
        sort: "name"
      })

      setClients(result)

    }

    load()

  }, [])

  return (

    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Clientes
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Cidade</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Status</th>
          </tr>

        </thead>

        <tbody>

          {clients.map(c => (

            <tr
              key={c.id}
              className="border-t cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/clients/${c.id}`)}
            >

              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.city}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}