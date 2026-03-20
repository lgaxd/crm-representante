import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import { useParams, useNavigate } from "react-router-dom"
import type { Client } from "../types/client"
import type { Contact } from "../types/contact"
import type { Interaction } from "../types/interaction"
import { ClientInfoCards } from "../components/client-detail/ClientInfoCards"
import { DealSection } from "../components/client-detail/DealSection"
import { ContactTable } from "../components/client-detail/ContactTable"
import { InteractionList } from "../components/client-detail/InteractionList"

import {
  ArrowLeftIcon
} from "@heroicons/react/24/outline"

import ContactModal from "../components/ContactModal"
import InteractionModal from "../components/InteractionModal"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [client, setClient] = useState<Client | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [interactionModalOpen, setInteractionModalOpen] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null)

  useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    if (!id) return
    try {
      setLoading(true)
      const [clientData, contactsData, interactionsData, dealsData] = await Promise.all([
        pb.collection("clients").getOne(id),
        pb.collection("contacts").getFullList({ filter: `client="${id}"` }),
        pb.collection("interactions").getFullList({ filter: `client="${id}"`, sort: "-date" }),
        pb.collection("deals").getFullList({ filter: `client="${id}"`, sort: "-created" })
      ])

      setClient(clientData as unknown as Client)
      setContacts(contactsData as unknown as Contact[])
      setInteractions(interactionsData as unknown as Interaction[])
      setDeals(dealsData)
    } catch (error) {
      console.error("Erro ao carregar:", error)
    } finally {
      setLoading(false)
    }
  }

  // REGRA 1: Ao salvar interação, verificar se muda para Prospect
  async function handleInteractionSaved() {
    if (client?.status === "discovery" && interactions.length === 0) {
      await pb.collection("clients").update(client.id, { status: "prospect" })
    }
    loadData()
    setInteractionModalOpen(false)
    setEditingInteraction(null)
  }

  // REGRA 2: Alterar status manualmente
  async function handleStatusChange(newStatus: string) {
    if (!client) return
    const oldStatus = client.status
    try {
      await pb.collection("clients").update(client.id, { status: newStatus })
      setClient({ ...client, status: newStatus })

      if (newStatus === "lead" && oldStatus !== "lead") {
        const existingDeals = await pb.collection("deals").getFullList({ filter: `client="${client.id}"` })
        if (existingDeals.length === 0) await createDeal("lead")
      }
    } catch {
      alert("Erro ao atualizar status")
    }
  }

  // REGRA 3: Lógica de criação de Deal e impacto no Status
  async function createDeal(stage: string) {
    if (!client) return
    try {
      const valStr = prompt("Valor do deal (opcional):", "0")
      const value = parseFloat(valStr || "0")

      await pb.collection("deals").create({
        client: client.id,
        stage: stage,
        value: value
      })

      let newStatus = client.status
      if (stage === "lead") newStatus = "lead"
      if (stage === "negociacao" || stage === "pedido") newStatus = "negociacao"
      if (stage === "ganho") newStatus = "ativo"
      if (stage === "perdido") newStatus = "lead"

      if (newStatus !== client.status) {
        await pb.collection("clients").update(client.id, { status: newStatus })
      }
      loadData()
    } catch {
      alert("Erro ao criar deal")
    }
  }

  async function deleteDeal(dealId: string) {
    if (!confirm("Excluir este deal?")) return
    try {
      await pb.collection("deals").delete(dealId)
      setDeals(deals.filter(d => d.id !== dealId))
    } catch {
      alert("Erro ao excluir deal")
    }
  }

  async function editDeal(deal: any) {
    const newValue = prompt("Novo valor:", deal.value)
    if (newValue === null) return
    try {
      await pb.collection("deals").update(deal.id, { value: parseFloat(newValue) })
      loadData()
    } catch {
      alert("Erro ao editar deal")
    }
  }

  async function handleDeleteContact(contactId: string) {
    if (!confirm("Excluir contato?")) return
    try {
      await pb.collection("contacts").delete(contactId)
      setContacts(contacts.filter(c => c.id !== contactId))
    } catch {
      alert("Erro ao excluir contato")
    }
  }

  async function deleteInteraction(id: string) {
    if (!confirm("Excluir interação?")) return
    try {
      await pb.collection("interactions").delete(id)
      setInteractions(interactions.filter(i => i.id !== id))
    } catch {
      alert("Erro ao excluir")
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (!client) return <div className="p-8 text-center">Cliente não encontrado.</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header estático ou também componentizado */}
        <header className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </header>

        {/* 1. Cards de Informação */}
        <ClientInfoCards client={client} onStatusChange={handleStatusChange} />

        {/* 2. Seção de Deals */}
        <DealSection
          deals={deals}
          onCreateDeal={createDeal}
          onEditDeal={editDeal}
          onDeleteDeal={deleteDeal}
        />

        {/* 3. Tabela de Contatos */}
        <ContactTable
          contacts={contacts}
          onEdit={(c) => { setEditingContact(c); setContactModalOpen(true); }}
          onDelete={handleDeleteContact}
          onAdd={() => { setEditingContact(null); setContactModalOpen(true); }}
        />

        {/* 4. Lista de Interações */}
        <InteractionList
          interactions={interactions}
          onEdit={(i) => { setEditingInteraction(i); setInteractionModalOpen(true); }}
          onDelete={deleteInteraction}
          onAdd={() => { setEditingInteraction(null); setInteractionModalOpen(true); }}
        />
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        clientId={id!}
        contact={editingContact}
        onSave={loadData}
      />

      <InteractionModal
        isOpen={interactionModalOpen}
        onClose={() => setInteractionModalOpen(false)}
        clientId={id!}
        contacts={contacts}
        interaction={editingInteraction}
        onSave={handleInteractionSaved}
      />
    </div>
  )
}