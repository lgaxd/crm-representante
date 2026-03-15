import type { Client } from "../../types/client"
import ClientRow from "./ClientRow"

interface Props {
  clients: Client[]
  onRowClick: (id:string)=>void
}

export default function ClientsTable({ clients, onRowClick }: Props) {

  return (
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

          {clients.map(client => (
            <ClientRow
              key={client.id}
              client={client}
              onClick={onRowClick}
            />
          ))}

          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  )
}