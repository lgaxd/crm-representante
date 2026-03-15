export interface Interaction {
  id: string
  client: string
  contact?: string
  type: 'whatsapp' | 'ligacao' | 'visita' | 'outro'
  description: string
  date: string
}