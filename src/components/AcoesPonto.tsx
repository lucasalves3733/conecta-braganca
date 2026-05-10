'use client'

import { useState } from 'react'
import { Navigation, Share2, Check } from 'lucide-react'

export default function AcoesPonto({ lat, lng, nome }: { lat: number; lng: number; nome: string }) {
  const [copiado, setCopiado] = useState(false)

  function abrirRota() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  async function compartilhar() {
    const url = window.location.href
    const texto = `Ponto de coleta: ${nome}`

    if (navigator.share) {
      try {
        await navigator.share({ title: nome, text: texto, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={abrirRota}
        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-500/20"
      >
        <Navigation className="w-5 h-5" />
        Como chegar
      </button>

      <button
        onClick={compartilhar}
        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition"
      >
        {copiado ? (
          <>
            <Check className="w-5 h-5 text-emerald-400" />
            Copiado!
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            Compartilhar
          </>
        )}
      </button>
    </div>
  )
}
