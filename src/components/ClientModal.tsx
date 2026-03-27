import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { pb } from "../lib/pocketbase"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function ClientModal({ isOpen, onClose, onSave }: Props) {

  const [form, setForm] = useState({
    name: "",
    type: "",
    city: "",
    state: "",
    address: "",
    site: "",
    status: "discovery"
  })

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {

      await pb.collection("clients").create(form)

      onSave()
      onClose()

      setForm({
        name: "",
        type: "",
        city: "",
        state: "",
        address: "",
        site: "",
        status: "discovery"
      })

    } catch (error) {
      alert("Erro ao cadastrar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">

        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <Dialog.Title className="text-lg font-semibold">
              Novo Cliente
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">

              <input
                placeholder="Nome"
                required
                value={form.name}
                onChange={(e)=>setForm({...form, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={form.type}
                onChange={(e)=>setForm({...form, type: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Tipo</option>
                <option value="supermercado">Supermercado</option>
                <option value="drogaria">Drogaria</option>
                <option value="baby_shop">Baby Shop</option>
                <option value="livraria">Livraria</option>
                <option value="papelaria">Papelaria</option>
                <option value="outro">Outro</option>
              </select>

              <input
                placeholder="Cidade"
                value={form.city}
                onChange={(e)=>setForm({...form, city: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Estado"
                value={form.state}
                onChange={(e)=>setForm({...form, state: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Endereço"
                value={form.address}
                onChange={(e)=>setForm({...form, address: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Site"
                value={form.site}
                onChange={(e)=>setForm({...form, site: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={form.status}
                onChange={(e)=>setForm({...form, status: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="discovery">Discovery</option>
                <option value="prospect">Prospect</option>
                <option value="lead">Lead</option>
                <option value="negociacao">Negociação</option>
                <option value="ativo">Ativo</option>
                <option value="perdido">Perdido</option>
                <option value="nao_atender">Não atender</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>

            </form>
          </Dialog.Panel>
        </div>

      </Dialog>
    </Transition>
  )
}