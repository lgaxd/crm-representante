import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import type { Contact } from "../../types/contact"

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ContactTable = ({ contacts, onEdit, onDelete, onAdd }: ContactTableProps) => {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Contatos ({contacts.length})</h2>
        <button 
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 cursor-pointer transition-colors"
        >
          <PlusIcon className="h-4 w-4" /> Novo contato
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Cargo</th>
              <th className="px-6 py-3">Telefone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">WhatsApp</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                <td className="px-6 py-4 text-gray-700">{contact.role || "—"}</td>
                <td className="px-6 py-4 text-gray-700">{contact.phone || "—"}</td>
                <td className="px-6 py-4 text-gray-700">{contact.email || "—"}</td>
                <td className="px-6 py-4 text-gray-700">{contact.whatsapp || "—"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEdit(contact)} className="text-gray-400 hover:text-purple-600 cursor-pointer transition-colors">
                      <PencilIcon className="h-4 w-4"/>
                    </button>
                    <button onClick={() => onDelete(contact.id)} className="text-gray-400 hover:text-red-600 cursor-pointer transition-colors">
                      <TrashIcon className="h-4 w-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum contato cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};