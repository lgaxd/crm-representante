import type { Client } from "../../types/client"

interface Props {
  client: Client
  onClick: (id:string)=>void
}

export default function ClientRow({ client, onClick }: Props) {

  return (
    <tr
      onClick={()=>onClick(client.id)}
      className="cursor-pointer hover:bg-gray-50"
    >

      <td className="px-6 py-4 font-medium text-gray-900">
        {client.name}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 capitalize">
          {client.type?.replace("_"," ") || "—"}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-700">
        {client.city || "—"}
      </td>

      <td className="px-6 py-4 text-gray-700">
        {client.state || "—"}
      </td>

      <td className="px-6 py-4">
        <span className="capitalize text-gray-600">
          {client.status?.replace("_"," ") || "—"}
        </span>
      </td>

    </tr>
  )
}