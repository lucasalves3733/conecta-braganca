'use client'

import React from 'react'

export default function Footer() {
  return (
    <footer className="py-10 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <p className="text-slate-400 text-sm leading-tight mb-1">
            Desenvolvido por <span className="text-cyan-400 font-bold italic">Lucas Alves</span>
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            Aluno UNIASSELVI
          </p>
        </div>
        <p className="text-[9px] text-slate-700 italic border-t border-white/5 pt-4 w-full text-center max-w-xs">
          © {new Date().getFullYear()} Conecta Bragança Paulista — Projeto Acadêmico
        </p>
      </div>
    </footer>
  )
}
