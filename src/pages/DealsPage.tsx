import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { pb } from "../lib/pocketbase";
import { ArrowLeftIcon, CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

export default function DealsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [deals, setDeals] = useState<any[]>([]);
    const [brands, setBrands] = useState<string[]>([]); // Lista de marcas para o select
    const [loading, setLoading] = useState(true);

    const dateInputRef = useRef<HTMLInputElement>(null);

    const stageFilter = searchParams.get("stage");

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Estados dos Filtros
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedBrand, setSelectedBrand] = useState("");

    // 1. Carregar lista de marcas únicas disponíveis
    useEffect(() => {
        async function loadBrands() {
            try {
                const records = await pb.collection("deals").getFullList({
                    fields: 'brand',
                });
                // Filtra marcas únicas e remove vazias
                const uniqueBrands = Array.from(new Set(records.map(r => r.brand).filter(Boolean)));
                setBrands(uniqueBrands as string[]);
            } catch (error) {
                console.error("Erro ao carregar marcas:", error);
            }
        }
        loadBrands();
    }, []);

    // 2. Carregar Deals com base nos filtros
    useEffect(() => {
        async function loadDeals() {
            setLoading(true);
            const [year, month] = selectedMonth.split("-");
            const startDate = `${year}-${month}-01 00:00:00`;
            const endDate = `${year}-${month}-31 23:59:59`;

            let filterParts = [
                `created >= "${startDate}"`,
                `created <= "${endDate}"`
            ];

            if (stageFilter) filterParts.push(`stage = "${stageFilter}"`);
            if (selectedBrand) filterParts.push(`brand = "${selectedBrand}"`);

            const filterString = filterParts.join(" && ");

            try {
                const data = await pb.collection("deals").getFullList({
                    filter: filterString,
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
    }, [stageFilter, selectedMonth, selectedBrand]);

    const totalValue = deals.reduce((acc, curr) => acc + (curr.value || 0), 0);

    const handleDivClick = () => {
        if (dateInputRef.current) {
            if ('showPicker' in HTMLInputElement.prototype) {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.click();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">

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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-stretch">

                    {/* SELETOR DE MÊS */}
                    <div
                        onClick={handleDivClick}
                        className="relative flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-400 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="flex items-center pl-4 py-4 pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-bold text-gray-700">{selectedMonth}</span>
                        </div>
                        <input
                            ref={dateInputRef}
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    {/* NOVO FILTRO DE REPRESENTADA (BRAND) */}
                    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-400 transition-all px-4">
                        <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full py-4 bg-transparent outline-none text-sm font-bold text-gray-700 cursor-pointer appearance-none"
                        >
                            <option value="">Todas as Marcas</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Card Total */}
                    <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
                        <div className="text-xl font-black text-purple-600 truncate">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                        </div>
                    </div>

                    {/* Card Quantidade */}
                    <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantidade</span>
                        <div className="text-xl font-black text-gray-900">{deals.length} itens</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-20 text-center text-gray-500">Carregando dados...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest">Cliente / Marca</th>
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
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-purple-800 leading-tight">
                                                {deal.expand?.client?.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                {deal.brand || "Sem Marca"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(deal.created).toLocaleDateString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                                {deals.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">
                                            Nenhum registro encontrado para este período ou marca.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}