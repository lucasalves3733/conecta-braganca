'use client'

import { Info, PlusCircle, Map as MapIcon, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BannerProps {
  tipo: 'doador' | 'recebedor' | null
  nome: string
}

export default function BannerBemVindo({ tipo, nome }: BannerProps) {
  const [visivel, setVisivel] = useState(true)

  if (!visivel) return null

  const isDoador = tipo === 'doador'

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-2xl">
      {/* Detalhes de brilho no fundo */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
          isDoador ? 'bg-cyan-500 shadow-cyan-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
        }`}>
          {isDoador ? <PlusCircle className="text-white w-8 h-8" /> : <MapIcon className="text-white w-8 h-8" />}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">
            Olá, {nome}! Bem-vindo ao Conecta Bragança
          </h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl">
            {isDoador 
              ? 'Sua atitude transforma vidas. Para ajudar, basta clicar em "Novo Ponto" no topo, marcar o local no mapa e informar o que você deseja doar ou distribuir e os horários.' 
              : 'Estamos aqui para ajudar você a encontrar o que precisa. Navegue pelo mapa abaixo para ver pontos de doação de roupas, alimentos e remédios em toda a cidade.'}
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
              <Info className="w-3 h-3" />
              {isDoador ? 'Você é um Doador' : 'Você é um Recebedor'}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setVisivel(false)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
