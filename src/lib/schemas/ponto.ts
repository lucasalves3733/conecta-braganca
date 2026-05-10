import { z } from 'zod'

export const pontoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional().nullable(),
  endereco: z.string().min(5, 'Endereço muito curto'),
  latitude: z.number({ required_error: 'Selecione um ponto no mapa' }),
  longitude: z.number({ required_error: 'Selecione um ponto no mapa' }),
  categoria_id: z.string().uuid('Selecione uma categoria válida'),
  horario_inicio: z.string().default('08:00'),
  horario_fim: z.string().default('18:00'),
  dias_semana: z.string().min(3, 'Informe os dias de funcionamento'),
})

export type PontoInput = z.infer<typeof pontoSchema>
