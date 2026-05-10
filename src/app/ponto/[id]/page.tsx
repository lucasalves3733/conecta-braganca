import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Edit, Calendar } from 'lucide-react'
import AcoesPonto from '@/components/AcoesPonto'
import BotaoExcluir from '@/components/BotaoExcluir'
import MiniMapaWrapper from '@/components/MiniMapaWrapper'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: ponto } = await supabase
    .from('pontos_coleta')
    .select('nome, descricao, endereco')
    .eq('id', id)
    .single()

  if (!ponto) return { title: 'Ponto não encontrado' }

  return {
    title: ponto.nome,
    description: ponto.descricao || `Ponto de coleta em ${ponto.endereco}`,
  }
}


export default async function PontoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ponto, error } = await supabase
    .from('pontos_coleta')
    .select('*, categorias!categoria_id(nome, cor, icone)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao carregar detalhes:', error)
  }

  if (!ponto) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const ehDono = user?.id === ponto.user_id

  const dataFormatada = new Date(ponto.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao mapa
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Mini-mapa */}
          <div className="h-64 sm:h-80 w-full relative">
            <MiniMapaWrapper lat={ponto.latitude} lng={ponto.longitude} nome={ponto.nome} />
          </div>

          <div className="p-6 sm:p-8">
            {/* Categoria */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium mb-4"
              style={{
                backgroundColor: `${ponto.categorias?.cor}20`,
                color: ponto.categorias?.cor,
              }}
            >
              {ponto.categorias?.nome || 'Sem categoria'}
            </span>

            {/* Nome */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{ponto.nome}</h1>

            {/* Descrição */}
            {ponto.descricao && (
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">{ponto.descricao}</p>
            )}

            {/* Endereço */}
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
              <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Endereço</p>
                <p className="text-white">{ponto.endereco}</p>
              </div>
            </div>

            {/* Horários */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Dias</p>
                  <p className="text-sm text-white font-medium">{ponto.dias_semana}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 flex items-center justify-center">🕒</div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Horário</p>
                  <p className="text-sm text-white font-medium">
                    {ponto.horario_inicio?.slice(0, 5)} às {ponto.horario_fim?.slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>

            {/* Data de criação */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-6">
              Cadastrado em {dataFormatada}
            </div>

            {/* Ações principais */}
            <AcoesPonto lat={ponto.latitude} lng={ponto.longitude} nome={ponto.nome} />

            {/* Ações do dono */}
            {ehDono && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Ações do proprietário
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/ponto/${ponto.id}/editar`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Link>
                  <BotaoExcluir id={ponto.id} nome={ponto.nome} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
