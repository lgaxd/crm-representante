interface Props {
  client: any;
  onStatusChange: (status: string) => void;
}

export const ClientInfoCards = ({ client, onStatusChange }: Props) => (
  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Localização</h2>
      <p className="text-gray-700">{client.city}, {client.state}</p>
    </div>
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Status</h2>
      <select
        value={client.status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-purple-500"
      >
        {["discovery", "prospect", "lead", "negociacao", "ativo", "perdido"].map(s => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
    </div>
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Site</h2>
      <a href={client.site} target="_blank" className="text-purple-600 hover:underline cursor-pointer break-all">
        {client.site || "Não informado"}
      </a>
    </div>
  </div>
);