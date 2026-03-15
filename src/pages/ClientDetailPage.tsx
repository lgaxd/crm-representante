import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useParams, useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import type { Contact } from "../types/contact"
import type { Interaction } from "../types/interaction"
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import ContactModal from "../components/ContactModal"
import InteractionModal from "../components/InteractionModal"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)

  // Modais
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [interactionModalOpen, setInteractionModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    loadData()
  }, [id])

  async function loadData() {
    if (!id) return
    try {
      const [clientData, contactsData, interactionsData] = await Promise.all([
        pb.collection("clients").getOne(id),
        pb.collection("contacts").getFullList({ filter: `client="${id}"` }),
        pb.collection("interactions").getFullList({
          filter: `client="${id}"`,
          sort: "-date",
        }),
      ])
      setClient(clientData as unknown as Client)
      setContacts(contactsData as unknown as Contact[])
      setInteractions(interactionsData as unknown as Interaction[])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Contatos
  async function handleDeleteContact(contactId: string) {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return
    try {
      await pb.collection("contacts").delete(contactId)
      setContacts(contacts.filter((c) => c.id !== contactId))
    } catch (error) {
      alert("Erro ao excluir contato.")
    }
  }

  // Interações
  async function handleAddInteraction(data: any) {
    try {
      await pb.collection("interactions").create({
        ...data,
        client: id,
      })
      loadData() // recarrega
    } catch (error) {
      alert("Erro ao salvar interação.")
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>
  }

  if (!client) {
    return <div className="p-8 text-center">Cliente não encontrado.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="rounded-full p-2 hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 capitalize">
            {client.type?.replace("_", " ")}
          </span>
        </div>

        {/* Informações do cliente */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Localização
            </h2>
            <p className="text-gray-700">
              {client.city}, {client.state}
            </p>
            {client.address && (
              <p className="mt-1 text-sm text-gray-600">{client.address}</p>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Status
            </h2>
            <p className="capitalize text-gray-700">
              {client.status?.replace("_", " ")}
            </p>
          </div>
          {client.site && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Site
              </h2>
              <a
                href={client.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {client.site}
              </a>
            </div>
          )}
        </div>

        {/* Seção Contatos */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Contatos ({contacts.length})
            </h2>
            <button
              onClick={() => {
                setEditingContact(null)
                setContactModalOpen(true)
              }}
              className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              Novo contato
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Cargo</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">WhatsApp</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.role || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.phone || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.email || "—"}</td>
                  <td className="px-6 py-4 text-gray-700">{contact.whatsapp || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingContact(contact)
                          setContactModalOpen(true)
                        }}
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum contato cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Seção Interações */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Interações ({interactions.length})
            </h2>
            <button
              onClick={() => setInteractionModalOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              Adicionar interação
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interactions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="px-6 py-4 capitalize text-gray-700">
                    {interaction.type}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{interaction.description}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(interaction.date).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {interactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma interação registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Contato */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        clientId={id!}
        contact={editingContact}
        onSave={() => {
          loadData()
          setContactModalOpen(false)
          setEditingContact(null)
        }}
      />

      {/* Modal de Interação */}
      <InteractionModal
        isOpen={interactionModalOpen}
        onClose={() => setInteractionModalOpen(false)}
        clientId={id!}
        contacts={contacts}
        onSave={() => {
          loadData()
          setInteractionModalOpen(false)
        }}
      />
    </div>
  )
}