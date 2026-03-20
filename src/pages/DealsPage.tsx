import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { pb } from "../lib/pocketbase";
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function DealsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const stageFilter = searchParams.get("stage");

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    useEffect(() => {
        async function loadDeals() {
            setLoading(true);
            const [year, month] = selectedMonth.split("-");
            // Filtro robusto para o PocketBase
            const startDate = `${year}-${month}-01 00:00:00`;
            const endDate = `${year}-${month}-31 23:59:59`;

            let filter = `created >= "${startDate}" && created <= "${endDate}"`;
            if (stageFilter) filter += ` && stage = "${stageFilter}"`;

            try {
                const data = await pb.collection("deals").getFullList({
                    filter,
                    expand: "client",
                    sort: "-created",
                });
                setDeals(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadDeals();
    }, [stageFilter, selectedMonth]);

    const totalValue = deals.reduce((acc, curr) => acc + (curr.value || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header com Botão Voltar e Título */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 bg-white border rounded-full hover:bg-gray-100 cursor-pointer shadow-sm"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {stageFilter ? `Deals: ${stageFilter.toUpperCase()}` : "Todos os Deals"}
                    </h1>
                </div>

                {/* BARRA DE FERRAMENTAS: Seletor e Métricas Lado a Lado */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-stretch">

                    {/* Seletor de Mês - Agora com área de clique expandida */}
                    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-400 transition-all">
                        <div className="pl-4 pr-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full h-full py-4 pr-4 bg-transparent outline-none text-sm font-bold text-gray-700 cursor-pointer"
                            style={{ colorScheme: 'light' }} // Melhora visual do seletor em alguns browsers
                        />
                    </div>

                    {/* Card Total */}
                    <div className="md:col-span-2 bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total no Período</span>
                        <div className="text-xl font-black text-purple-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                        </div>
                    </div>

                    {/* Card Quantidade */}
                    <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantidade</span>
                        <div className="text-xl font-black text-gray-900">{deals.length} itens</div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Valor</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {deals.map(deal => (
                                <tr
                                    key={deal.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/clients/${deal.client}`)}
                                >
                                    <td className="px-6 py-4 font-bold text-purple-800">
                                        {deal.expand?.client?.name}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(deal.created).toLocaleDateString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                            {!loading && deals.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">
                                        Nenhum registro encontrado para este período.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}