import Link from 'next/link'
import { MapPinOff, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 text-white">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-6">
          <MapPinOff className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-200 mb-3">Página não encontrada</h2>
        <p className="text-slate-400 mb-8">
          O ponto de coleta que você procura não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition"
        >
          <Home className="w-5 h-5" />
          Voltar ao mapa
        </Link>
      </div>
    </div>
  )
}
