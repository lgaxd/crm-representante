import { useNavigate } from "react-router-dom";

interface Deal {
    stage: string;
    value: number;
    created: string;
}

export const PipelineStats = ({ deals }: { deals: Deal[] }) => {
    const navigate = useNavigate();
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Totais por fase
    const stats = deals.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + (deal.value || 0);
        return acc;
    }, {} as Record<string, number>);

    // Pipeline gerado no mês (todos os deals criados este mês)
    const newPipelineMonth = deals
        .filter(d => new Date(d.created) >= firstDayMonth)
        .reduce((acc, d) => acc + (d.value || 0), 0);

    // Valor fechado no mês (apenas deals em estágio "ganho" criados/fechados este mês)
    const closedThisMonth = deals
        .filter(d => d.stage === "ganho" && new Date(d.created) >= firstDayMonth)
        .reduce((acc, d) => acc + (d.value || 0), 0);

    const format = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const StatCard = ({ title, value, stage, colorClass }: any) => (
        <div
            onClick={() => navigate(`/deals?stage=${stage || ""}`)}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:ring-2 hover:ring-purple-500/20 hover:border-purple-500 cursor-pointer transition-all group"
        >
            <div className="text-[15px] font-black text-slate-600 uppercase mb-2 tracking-wider">
                {title}
            </div>
            <div className={`text-2xl font-black ${colorClass || "text-slate-900"}`}>
                {format(value)}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Clique leva para a lista filtrada por estágio */}
            <StatCard title="Pipeline: Leads" value={stats.lead || 0} stage="lead" />
            <StatCard title="Pipeline: Negociação" value={stats.negociacao || 0} stage="negociacao" colorClass="text-blue-600" />

            {/* Pipeline total gerado no mês */}
            <StatCard title="Pipeline (Mês)" value={newPipelineMonth} stage="" colorClass="text-purple-600" />

            {/* Valor ganho no mês */}
            <StatCard title="Fechado (Mês)" value={closedThisMonth} stage="ganho" colorClass="text-green-600" />
        </div>
    );
};