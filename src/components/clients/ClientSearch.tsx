import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface Props {
  search: string
  setSearch: (value: string) => void
}

export default function ClientSearch({ search, setSearch }: Props) {

  return (
    <div className="mb-6 flex items-center justify-between">

      <div className="relative w-80">

        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none"
        />

      </div>

    </div>
  )
}