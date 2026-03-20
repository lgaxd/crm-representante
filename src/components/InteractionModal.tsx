import { useEffect, useState } from "react"
import { pb } from "../lib/pocketbase"
import type { Contact } from "../types/contact"
import type { Interaction } from "../types/interaction"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  clientId: string
  contacts: Contact[]
  interaction?: Interaction | null
}

export default function InteractionModal({
  isOpen,
  onClose,
  onSave,
  clientId,
  contacts,
  interaction
}: Props) {

  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [contactId, setContactId] = useState("")

  useEffect(() => {

    if (interaction) {

      setType(interaction.type)
      setDescription(interaction.description)

      setDate(
        interaction.date
          ? interaction.date.substring(0, 10)
          : ""
      )

      setContactId((interaction as any).contact || "")

    } else {

      setType("")
      setDescription("")
      setDate(new Date().toISOString().substring(0, 10))
      setContactId("")

    }

  }, [interaction, isOpen])

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    const data: any = {
      type,
      description,
      date,
      client: clientId
    }

    if (contactId) {
      data.contact = contactId
    }

    try {

      let isNew = !interaction

      if (interaction) {

        await pb.collection("interactions").update(
          interaction.id,
          data
        )

      } else {

        await pb.collection("interactions").create(data)

      }

      // REGRA 1: primeira interação → virar prospect
      if (isNew) {

        const existing = await pb.collection("interactions").getFullList({
          filter: `client="${clientId}"`
        })

        if (existing.length === 1) {

          const client = await pb.collection("clients").getOne(clientId)

          if (client.status === "discovery") {

            await pb.collection("clients").update(clientId, {
              status: "prospect"
            })

          }

        }

      }

      onSave()

    } catch (error) {

      console.error(error)
      alert("Erro ao salvar interação")

    }

  }

  if (!isOpen) return null

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-lg font-semibold text-gray-900">

          {interaction ? "Editar interação" : "Nova interação"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            required
            className="border rounded-lg px-3 py-2"
          >

            <option value="">Tipo de interação</option>
            <option value="ligacao">Ligação</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="reuniao">Reunião</option>
            <option value="nota">Nota</option>

          </select>

          <select
            value={contactId}
            onChange={e => setContactId(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >

            <option value="">Contato relacionado</option>

            {contacts.map(contact => (

              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>

            ))}

          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="border rounded-lg px-3 py-2"
          />

          <textarea
            placeholder="Descrição da interação"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={4}
            className="border rounded-lg px-3 py-2"
          />

          <div className="flex justify-end gap-2 mt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            >
              Salvar
            </button>

          </div>

        </form>

      </div>

    </div>

  )

}