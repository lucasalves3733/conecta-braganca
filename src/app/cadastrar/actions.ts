'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { pontoSchema } from '@/lib/schemas/ponto'

function parseForm(formData: FormData) {
  return {
    nome: (formData.get('nome') as string)?.trim(),
    descricao: ((formData.get('descricao') as string) || '').trim(),
    endereco: (formData.get('endereco') as string)?.trim(),
    latitude: parseFloat(formData.get('latitude') as string),
    longitude: parseFloat(formData.get('longitude') as string),
     categoria_id: formData.get('categoria_id') as string,
    horario_inicio: formData.get('horario_inicio') as string,
    horario_fim: formData.get('horario_fim') as string,
    dias_semana: formData.get('dias_semana') as string,
  }
}

export async function cadastrarPonto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar logado.' }

  const parsed = pontoSchema.safeParse(parseForm(formData))
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('pontos_coleta')
    .insert({ ...parsed.data, user_id: user.id })

  if (error) return { error: 'Erro ao cadastrar: ' + error.message }

  revalidatePath('/')
  revalidatePath('/meus-pontos')
  redirect('/meus-pontos')
}

export async function editarPonto(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar logado.' }

  const parsed = pontoSchema.safeParse(parseForm(formData))
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase
    .from('pontos_coleta')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao editar: ' + error.message }

  revalidatePath('/')
  revalidatePath('/meus-pontos')
  revalidatePath(`/ponto/${id}`)
  redirect(`/ponto/${id}`)
}

export async function excluirPonto(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar logado.' }

  const { error } = await supabase
    .from('pontos_coleta')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao excluir: ' + error.message }

  revalidatePath('/')
  revalidatePath('/meus-pontos')
  redirect('/meus-pontos')
}
