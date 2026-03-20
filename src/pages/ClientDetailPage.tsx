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

import { ArrowLeftIcon } from "@heroicons/react/24/outline"

import ContactModal from "../components/ContactModal"
import InteractionModal from "../components/InteractionModal"
import DealModal from "../components/DealModal"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [client, setClient] = useState<Client | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modais de Contato e Interação
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [interactionModalOpen, setInteractionModalOpen] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null)

  // Estados do novo DealModal
  const [dealModalOpen, setDealModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null)
  const [pendingStage, setPendingStage] = useState<string | null>(null)

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

  // REGRA 1: Ao salvar interação, se for a primeira e status for Discovery -> Prospect
  async function handleInteractionSaved() {
    if (client?.status === "discovery" && interactions.length === 0) {
      await pb.collection("clients").update(client.id, { status: "prospect" })
    }
    loadData()
    setInteractionModalOpen(false)
    setEditingInteraction(null)
  }

  // REGRA 2: Alterar status manualmente + Gerar deal automático se mudar para Lead pela 1ª vez
  async function handleStatusChange(newStatus: string) {
    if (!client) return
    const oldStatus = client.status
    try {
      await pb.collection("clients").update(client.id, { status: newStatus })
      setClient({ ...client, status: newStatus })

      if (newStatus === "lead" && oldStatus !== "lead") {
        const existingDeals = await pb.collection("deals").getFullList({ filter: `client="${client.id}"` })
        if (existingDeals.length === 0) {
          // Abre o modal automaticamente para definir o valor do deal de lead
          handleOpenCreateDeal("lead")
        }
      }
    } catch {
      alert("Erro ao atualizar status")
    }
  }

  // --- LÓGICA DO DEAL MODAL ---

  function handleOpenCreateDeal(stage: string) {
    setPendingStage(stage)
    setSelectedDeal(null)
    setDealModalOpen(true)
  }

  function handleOpenEditDeal(deal: any) {
    setSelectedDeal(deal)
    setPendingStage(null)
    setDealModalOpen(true)
  }

  async function handleSaveDeal(value: number) {
    if (!client) return

    try {
      if (selectedDeal) {
        // MODO EDIÇÃO
        await pb.collection("deals").update(selectedDeal.id, { value })
      } else if (pendingStage) {
        // MODO CRIAÇÃO (REGRA 3: Impacto do Deal no status do Cliente)
        await pb.collection("deals").create({
          client: client.id,
          stage: pendingStage,
          value: value
        })

        let newStatus = client.status
        if (pendingStage === "lead") newStatus = "lead"
        if (pendingStage === "negociacao" || pendingStage === "pedido") newStatus = "negociacao"
        if (pendingStage === "ganho") newStatus = "ativo"
        if (pendingStage === "perdido") newStatus = "lead"

        if (newStatus !== client.status) {
          await pb.collection("clients").update(client.id, { status: newStatus })
        }
      }
      loadData()
      setDealModalOpen(false)
    } catch (error) {
      alert("Erro ao salvar deal")
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

  // --- FIM LÓGICA DEAL ---

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
        <header className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </header>

        {/* 1. Cards de Informação (Status e Localização) */}
        <ClientInfoCards client={client} onStatusChange={handleStatusChange} />

        {/* 2. Seção de Deals (Componentizada) */}
        <DealSection
          deals={deals}
          onCreateDeal={handleOpenCreateDeal}
          onEditDeal={handleOpenEditDeal}
          onDeleteDeal={deleteDeal}
        />

        {/* 3. Tabela de Contatos (Componentizada) */}
        <ContactTable
          contacts={contacts}
          onEdit={(c) => { setEditingContact(c); setContactModalOpen(true); }}
          onDelete={handleDeleteContact}
          onAdd={() => { setEditingContact(null); setContactModalOpen(true); }}
        />

        {/* 4. Lista de Interações (Componentizada) */}
        <InteractionList
          interactions={interactions}
          onEdit={(i) => { setEditingInteraction(i); setInteractionModalOpen(true); }}
          onDelete={deleteInteraction}
          onAdd={() => { setEditingInteraction(null); setInteractionModalOpen(true); }}
        />
      </div>

      {/* MODAIS */}
      
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

      <DealModal 
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSave={handleSaveDeal}
        initialValue={selectedDeal?.value}
        stage={pendingStage || selectedDeal?.stage}
      />
    </div>
  )
}