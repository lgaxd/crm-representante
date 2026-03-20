import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import type { Interaction } from "../../types/interaction"

interface InteractionListProps {
  interactions: Interaction[];
  onEdit: (interaction: Interaction) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const InteractionList = ({ interactions, onEdit, onDelete, onAdd }: InteractionListProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Interações ({interactions.length})</h2>
        <button 
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 cursor-pointer transition-colors"
        >
          <PlusIcon className="h-4 w-4" /> Adicionar interação
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {interactions.map(i => (
          <div key={i.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  {i.type}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(i.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {i.description}
              </p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => onEdit(i)} 
                className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer transition-colors"
                title="Editar Interação"
              >
                <PencilIcon className="h-4 w-4"/>
              </button>
              <button 
                onClick={() => onDelete(i.id)} 
                className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                title="Excluir Interação"
              >
                <TrashIcon className="h-4 w-4"/>
              </button>
            </div>
          </div>
        ))}

        {interactions.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-sm italic">
            Nenhuma interação registrada para este cliente.
          </div>
        )}
      </div>
    </div>
  );
};