import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue?: number;
  stage?: string;
}

export default function DealModal({ isOpen, onClose, onSave, initialValue, stage }: DealModalProps) {
  const [value, setValue] = useState<string>("0");

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue?.toString() || "0");
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(parseFloat(value) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">
            {initialValue !== undefined ? "Editar Valor do Deal" : `Novo Deal: ${stage?.toUpperCase()}`}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 cursor-pointer">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor do Negócio (R$)
            </label>
            <input
              autoFocus
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg font-bold"
              placeholder="0,00"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-6 py-2 text-sm font-bold text-white hover:bg-purple-700 cursor-pointer transition-colors"
            >
              Salvar Alteração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}