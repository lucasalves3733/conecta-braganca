import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/login/actions'
import Link from 'next/link'
import { LogIn, LogOut, User, MapPin } from 'lucide-react'

export default async function HeaderUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 transition"
      >
        <LogIn className="w-4 h-4" />
        Entrar
      </Link>
    )
  }

  const nome = user.user_metadata?.nome || user.email?.split('@')[0]
  const isDoador = user.user_metadata?.tipo === 'doador'

  return (
    <div className="flex items-center gap-3">
      {isDoador && (
        <Link
          href="/meus-pontos"
          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 transition"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="hidden lg:inline">Meus Pontos</span>
        </Link>
      )}

      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg group relative">
        <User className="w-4 h-4 text-cyan-400" />
        <div className="flex flex-col items-start leading-none">
          <span className="text-[13px] text-slate-200 font-medium hidden md:inline">{nome}</span>
          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
            {isDoador ? 'Doador' : 'Recebedor'}
          </span>
        </div>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
