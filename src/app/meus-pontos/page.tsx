import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Edit, Eye, Plus, Inbox, Trash2 } from 'lucide-react'
import BotaoExcluir from '@/components/BotaoExcluir'

export default async function MeusPontosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/meus-pontos')

  const { data: pontos, error: erroPontos } = await supabase
    .from('pontos_coleta')
    .select('*, categorias!categoria_id(nome, cor, icone)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (erroPontos) {
    console.error('❌ Erro Supabase:', erroPontos.message, '| Código:', erroPontos.code)
  } else {
    // Limpa o erro se der sucesso
    console.log('✅ Pontos carregados com sucesso!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Meus Pontos</h1>
            <p className="text-slate-400 mt-1">
              {pontos?.length || 0} {pontos?.length === 1 ? 'ponto cadastrado' : 'pontos cadastrados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition border border-slate-700"
            >
              Voltar ao Mapa
            </Link>
            <Link
              href="/cadastrar"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-5 h-5" />
              Novo Ponto
            </Link>
          </div>
        </div>

        {/* Lista vazia */}
        {(!pontos || pontos.length === 0) && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
            <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum ponto ainda</h3>
            <p className="text-slate-400 mb-6">Comece cadastrando seu primeiro ponto de coleta.</p>
            <Link
              href="/cadastrar"
              className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl transition"
            >
              <Plus className="w-5 h-5" />
              Cadastrar primeiro ponto
            </Link>
          </div>
        )}

        {/* Grid de pontos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pontos?.map((ponto) => (
            <div
              key={ponto.id}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: `${ponto.categorias?.cor}20`,
                    color: ponto.categorias?.cor,
                  }}
                >
                  {ponto.categorias?.nome || 'Sem categoria'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                {ponto.nome}
              </h3>

              <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                {ponto.descricao || 'Sem descrição'}
              </p>

              <div className="flex items-start gap-2 text-xs text-slate-500 mb-4">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{ponto.endereco}</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <Link
                  href={`/ponto/${ponto.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </Link>
                <Link
                  href={`/ponto/${ponto.id}/editar`}
                  className="inline-flex items-center justify-center p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <BotaoExcluir id={ponto.id} nome={ponto.nome} isIconOnly />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
