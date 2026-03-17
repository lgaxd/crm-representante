import type { Client } from "../../types/client"
import BigButton from "../BigButton"

interface Props {
  clients: Client[]
  typeStats: [string, number][]
  selectedType: string | null
  setSelectedType: (type: string | null) => void
}

export default function ClientsSidebar({
  clients,
  typeStats,
  selectedType,
  setSelectedType
}: Props) {

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black">
        Tipos de cliente
      </h2>

      <button
        onClick={() => setSelectedType(null)}
        className={`mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer ${
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
          className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm capitalize cursor-pointer ${
            selectedType === type
              ? "bg-purple-50 text-purple-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>{type.replace("_"," ")}</span>

          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
            {count}
          </span>

        </button>

      ))}

      <BigButton text="Voltar ao dashboard" to="/" />

    </aside>
  )
}