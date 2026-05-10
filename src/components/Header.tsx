import Link from 'next/link'
import HeaderUser from './HeaderUser'
import { Recycle, PlusCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Verifica se o usuário é doador
  const isDoador = user?.user_metadata?.tipo === 'doador'

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Recycle className="text-white w-6 h-6" />
        </div>
        <div>
            <span className="text-xl font-black tracking-tighter text-white">
              CONECTA <span className="text-cyan-400">BRAGANÇA</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold block -mt-1">
              Pontos de Doação
            </span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
        <HeaderUser />
        
        {/* Só mostra o botão de cadastrar se for Doador */}
        {isDoador && (
          <Link
            href="/cadastrar"
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] text-sm text-center flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Novo Ponto
          </Link>
        )}
      </div>
    </header>
  )
}
