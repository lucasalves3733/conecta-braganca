import { z } from 'zod'

export const pontoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional().nullable(),
  endereco: z.string().min(5, 'Endereço muito curto'),
  latitude: z.number({ message: 'Selecione um ponto no mapa' }),
  longitude: z.number({ message: 'Selecione um ponto no mapa' }),
  categoria_id: z.string().uuid('Selecione uma categoria válida'),
  horario_inicio: z.string(),
  horario_fim: z.string(),
  dias_semana: z.string().min(3, 'Informe os dias de funcionamento'),
})

export type PontoInput = z.infer<typeof pontoSchema>
