'use client'

import { useState } from 'react'
import type { Categoria, PontoColeta } from '@/lib/types'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BannerBemVindo from './BannerBemVindo'
import type { User } from '@supabase/supabase-js'
import { Clock } from 'lucide-react'

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false })

const iconMap: Record<string, string> = {
  'HeartPulse': '🏥',
  'Shirt': '👕',
  'Utensils': '🍴',
  'Recycle': '♻️',
  'Battery': '🔋',
  'Trash2': '🗑️',
  'ShoppingBag': '🛍️',
  'Apple': '🍎',
}

type Props = {
  categorias: Categoria[]
  pontosIniciais: PontoColeta[]
  user: User | null
}

export default function FiltrosHome(props: Props) {
  const { categorias, pontosIniciais, user } = props
  const [filtro, setFiltro] = useState<string | null>(null)

  const pontosFiltrados = filtro
    ? pontosIniciais.filter((p) => p.categoria_id === filtro)
    : pontosIniciais

  return (
    <>
      {user && (
        <BannerBemVindo 
          tipo={user.user_metadata?.tipo || null} 
          nome={user.user_metadata?.nome || user.email?.split('@')[0] || ''} 
        />
      )}
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltro(null)}
          className={`px-4 py-2 rounded-full border transition-all ${
            !filtro 
              ? 'bg-white text-black font-semibold' 
              : 'border-white/10 hover:border-white/30 text-white/70'
          }`}
        >
          Todos ({pontosIniciais.length})
        </button>
        {categorias.map((c) => {
          const total = pontosIniciais.filter((p) => p.categoria_id === c.id).length
          const ativo = filtro === c.id
          const emoji = iconMap[c.icone] || '📍'
          
          return (
            <button
              key={c.id}
              onClick={() => setFiltro(c.id)}
              style={ativo ? { background: c.cor, color: '#000' } : { borderColor: c.cor + '44', color: c.cor }}
              className={`px-4 py-2 rounded-full border transition-all font-medium ${
                ativo ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/5'
              }`}
            >
              {emoji} {c.nome} ({total})
            </button>
          )
        })}
      </div>

      {/* Mapa */}
      <div className="h-[50vh] md:h-[60vh] w-full rounded-2xl overflow-hidden border border-white/10 mb-8 shadow-2xl relative">
        <Mapa pontos={pontosFiltrados} />
      </div>

      {/* Listagem */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filtro ? 'Locais filtrados' : 'Recém adicionados'}
          </h2>
          <span className="text-white/40 text-sm">{pontosFiltrados.length} resultados</span>
        </div>
        
        {pontosFiltrados.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl text-white/40">
            Nenhum ponto encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pontosFiltrados.map((p) => {
              const emoji = iconMap[p.categorias?.icone ?? ''] || '📍'
              return (
                <Link key={p.id} href={`/ponto/${p.id}`}>
                  <article
                    className="p-5 h-full rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: (p.categorias?.cor ?? '#fff') + '22', color: p.categorias?.cor ?? '#fff' }}
                      >
                        {emoji} {p.categorias?.nome}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">{p.nome}</h3>
                    <p className="text-sm text-white/50 mb-3 flex items-start gap-1">
                      <span className="shrink-0">📍</span>
                      {p.endereco}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-white/30 border-t border-white/5 pt-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {p.horario_inicio?.slice(0, 5)} - {p.horario_fim?.slice(0, 5)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🗓️</span>
                        {p.dias_semana}
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
