import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Deal {
  id: string;
  stage: "lead" | "negociacao" | "pedido" | "ganho" | "perdido";
  value: number;
  created: string;
}

interface DealSectionProps {
  deals: Deal[];
  onCreateDeal: (stage: string) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
}

export const DealSection = ({ 
  deals, 
  onCreateDeal, 
  onEditDeal, 
  onDeleteDeal 
}: DealSectionProps) => {

  // Função auxiliar para cores das badges de stage
  const getStageBadge = (stage: string) => {
    const styles: Record<string, string> = {
      lead: "bg-gray-100 text-gray-700",
      negociacao: "bg-blue-100 text-blue-700",
      pedido: "bg-yellow-100 text-yellow-700",
      ganho: "bg-green-100 text-green-700",
      perdido: "bg-red-100 text-red-700",
    };
    return styles[stage] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header com botões de criação rápida */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Deals / Negócios ({deals.length})</h2>
          <p className="text-xs text-gray-500 font-medium">Gerencie oportunidades de venda</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onCreateDeal("lead")} 
            className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer hover:bg-purple-700 transition-colors shadow-sm"
          >
            + Lead
          </button>
          <button 
            onClick={() => onCreateDeal("negociacao")} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Negociação
          </button>
          <button 
            onClick={() => onCreateDeal("ganho")} 
            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer hover:bg-green-700 transition-colors shadow-sm"
          >
            + Ganho
          </button>
        </div>
      </div>

      {/* Tabela de Deals */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4">Estágio</th>
              <th className="px-6 py-4">Valor Estimado</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${getStageBadge(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(deal.value || 0)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(deal.created).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEditDeal(deal)} 
                      className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors p-1"
                      title="Editar Valor"
                    >
                      <PencilIcon className="h-4 w-4"/>
                    </button>
                    <button 
                      onClick={() => onDeleteDeal(deal.id)} 
                      className="text-gray-400 hover:text-red-600 cursor-pointer transition-colors p-1"
                      title="Excluir Deal"
                    >
                      <TrashIcon className="h-4 w-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {deals.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-gray-300 text-sm">Nenhum negócio em aberto para este cliente.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Rodapé do card com resumo */}
      {deals.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-right">
          <span className="text-xs text-gray-500 font-medium mr-2">Total em pipeline:</span>
          <span className="text-sm font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              deals.reduce((acc, curr) => acc + (curr.value || 0), 0)
            )}
          </span>
        </div>
      )}
    </div>
  );
};