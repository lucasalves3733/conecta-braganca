import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FormEditarPonto from './FormEditarPonto'

export default async function EditarPontoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirect=/ponto/${id}/editar`)

  const { data: ponto } = await supabase
    .from('pontos_coleta')
    .select('*')
    .eq('id', id)
    .single()

  if (!ponto) notFound()
  if (ponto.user_id !== user.id) redirect(`/ponto/${id}`)

  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/ponto/${id}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Editar Ponto</h1>
          <p className="text-slate-400 mb-6">Atualize as informações do ponto de coleta.</p>

          <FormEditarPonto ponto={ponto} categorias={categorias || []} />
        </div>
      </div>
    </div>
  )
}
