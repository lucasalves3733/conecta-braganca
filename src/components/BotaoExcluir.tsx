'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner'
import { excluirPonto } from '@/app/cadastrar/actions'

export default function BotaoExcluir({ id, nome, isIconOnly = false }: { id: string; nome: string; isIconOnly?: boolean }) {
  const [aberto, setAberto] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleExcluir() {
    startTransition(async () => {
      const resultado = await excluirPonto(id)
      if (resultado?.error) {
        toast.error(resultado.error)
      } else {
        toast.success('Ponto excluído com sucesso!')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className={`inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition ${
          isIconOnly ? 'p-2' : 'px-4 py-2'
        }`}
        title={isIconOnly ? 'Excluir' : undefined}
      >
        <Trash2 className="w-4 h-4" />
        {!isIconOnly && 'Excluir'}
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="text-lg font-bold mb-1">Excluir ponto</h3>
                <p className="text-sm text-slate-400">
                  Tem certeza que deseja excluir <strong className="text-white">{nome}</strong>? Essa ação não pode ser desfeita.
                </p>
              </div>
              <button
                onClick={() => setAberto(false)}
                className="text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAberto(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluir}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
