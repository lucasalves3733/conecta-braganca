export type Categoria = {
  id: string
  nome: string
  descricao?: string
  icone: string
  cor: string
  slug: string
  created_at: string
}

export type PontoColeta = {
  id: string
  nome: string
  descricao: string | null
  endereco: string
  latitude: number
  longitude: number
  categoria_id: string
  user_id: string
  horario_inicio: string
  horario_fim: string
  dias_semana: string
  created_at: string
  categorias?: Categoria
}
