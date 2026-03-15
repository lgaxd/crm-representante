import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useParams } from "react-router-dom"

export default function ClientDetailPage() {

  const { id } = useParams()

  const [client, setClient] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      const c = await pb.collection("clients").getOne(id!)

      const cons = await pb.collection("contacts").getFullList({
        filter: `client="${id}"`
      })

      setClient(c)
      setContacts(cons)

    }

    load()

  }, [id])

  if (!client) {
    return <div className="p-6">Carregando...</div>
  }

  return (

    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        {client.name}
      </h1>

      <div className="mb-6">

        <p>Cidade: {client.city}</p>
        <p>Estado: {client.state}</p>
        <p>Status: {client.status}</p>
        <p>Site: {client.site}</p>

      </div>

      <h2 className="text-xl font-semibold mb-3">
        Contatos
      </h2>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Telefone</th>
            <th className="p-2 text-left">Email</th>
          </tr>

        </thead>

        <tbody>

          {contacts.map(c => (

            <tr key={c.id} className="border-t">

              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone}</td>
              <td className="p-2">{c.email}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}