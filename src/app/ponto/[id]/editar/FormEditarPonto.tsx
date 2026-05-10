'use client'

import { useState, useTransition } from 'react'
import { editarPonto } from '@/app/cadastrar/actions'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  ponto: any
  categorias: any[]
}

export default function FormEditarPonto({ ponto, categorias }: Props) {
  const [erro, setErro] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setErro('')
    startTransition(async () => {
      const resultado = await editarPonto(ponto.id, formData)
      if (resultado?.error) {
        toast.error(resultado.error)
        setErro(resultado.error)
      } else {
        toast.success('Ponto atualizado com sucesso!')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
        <input
          name="nome"
          type="text"
          required
          defaultValue={ponto.nome}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
        <textarea
          name="descricao"
          rows={3}
          defaultValue={ponto.descricao || ''}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Categoria *</label>
        <select
          name="categoria_id"
          required
          defaultValue={ponto.categoria_id}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
        >
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Endereço *</label>
        <input
          name="endereco"
          type="text"
          required
          defaultValue={ponto.endereco}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Latitude *</label>
          <input
            name="latitude"
            type="number"
            step="any"
            required
            defaultValue={ponto.latitude}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Longitude *</label>
          <input
            name="longitude"
            type="number"
            step="any"
            required
            defaultValue={ponto.longitude}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {erro && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Salvar alterações
          </>
        )}
      </button>
    </form>
  )
}
