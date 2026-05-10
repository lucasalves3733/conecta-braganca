'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Categoria } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pontoSchema, type PontoInput } from '@/lib/schemas/ponto'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { cadastrarPonto, editarPonto } from './actions'
import { ArrowLeft, MapPin, Search, Loader2, Navigation } from 'lucide-react'

const SeletorMapa = dynamic(() => import('@/components/SeletorMapa'), { ssr: false })

export default function CadastrarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const supabase = createClient()
  
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isPending, startTransition] = useTransition()
  const [buscandoEndereco, setBuscandoEndereco] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PontoInput>({
    resolver: zodResolver(pontoSchema),
  })

  const lat = watch('latitude')
  const lon = watch('longitude')

  useEffect(() => {
    // Buscar categorias
    supabase
      .from('categorias')
      .select('*')
      .order('nome')
      .then(({ data }) => {
        if (data) setCategorias(data as Categoria[])
      })

    // Se estiver editando, carregar dados
    if (editId) {
      supabase
        .from('pontos_coleta')
        .select('*')
        .eq('id', editId)
        .single()
        .then(({ data }) => {
          if (data) {
            reset({
              nome: data.nome,
              descricao: data.descricao || '',
              endereco: data.endereco,
              latitude: data.latitude,
              longitude: data.longitude,
              categoria_id: data.categoria_id,
              horario_inicio: data.horario_inicio || '08:00',
              horario_fim: data.horario_fim || '18:00',
              dias_semana: data.dias_semana || 'Segunda a Sexta',
            })
            setSearchQuery(data.endereco)
          }
        })
    }
  }, [editId, reset, supabase])

  async function pesquisarEndereco(query: string) {
    if (query.length < 3) return
    setBuscandoEndereco(true)
    try {
      const res = await fetch(
        `/api/geocoding?type=search&q=${encodeURIComponent(query + ', Bragança Paulista')}`
      )
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setBuscandoEndereco(false)
    }
  }

  function selecionarResultado(res: any) {
    setValue('endereco', res.display_name)
    setValue('latitude', parseFloat(res.lat))
    setValue('longitude', parseFloat(res.lon))
    setSearchResults([])
    setSearchQuery(res.display_name)
  }

  async function buscarEnderecoPorCoords(lat: number, lon: number) {
    setBuscandoEndereco(true)
    try {
      const res = await fetch(`/api/geocoding?type=reverse&lat=${lat}&lon=${lon}`)
      const data = await res.json()
      if (data.display_name) {
        setValue('endereco', data.display_name)
        setSearchQuery(data.display_name)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBuscandoEndereco(false)
    }
  }

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada.')
      return
    }

    setBuscandoEndereco(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lt = pos.coords.latitude
        const ln = pos.coords.longitude
        setValue('latitude', lt)
        setValue('longitude', ln)
        buscarEnderecoPorCoords(lt, ln)
      },
      () => {
        toast.error('Não foi possível obter sua localização.')
        setBuscandoEndereco(false)
      },
      { enableHighAccuracy: true }
    )
  }

  function onSubmit(values: PontoInput) {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '')
    })

    startTransition(async () => {
      const res = editId 
        ? await editarPonto(editId, formData)
        : await cadastrarPonto(formData)

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(editId ? 'Ponto atualizado!' : 'Ponto cadastrado!')
      }
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Lado Esquerdo: Formulário */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h1 className="text-3xl font-bold mb-2">
                {editId ? 'Editar Ponto de Doação' : 'Novo Ponto de Doação'}
              </h1>
              <p className="text-slate-400 mb-8">
                Preencha os dados abaixo para {editId ? 'atualizar' : 'cadastrar'} um local de coleta.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Local *</label>
                    <input
                      {...register('nome')}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                      placeholder="Ex: Ecoponto Central"
                    />
                    {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Categoria *</label>
                    <select
                      {...register('categoria_id')}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900">{c.nome}</option>
                      ))}
                    </select>
                    {errors.categoria_id && <p className="text-red-400 text-xs mt-1">{errors.categoria_id.message}</p>}
                  </div>

                  <div className="sm:col-span-2 relative">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Buscar Endereço *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value)
                            pesquisarEndereco(e.target.value)
                          }}
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                          placeholder="Rua, bairro ou lugar..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={usarMinhaLocalizacao}
                        className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition"
                        title="Minha Localização"
                      >
                        <Navigation className="w-5 h-5" />
                      </button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="absolute z-[2000] left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                        {searchResults.map((res) => (
                          <button
                            key={res.place_id}
                            type="button"
                            onClick={() => selecionarResultado(res)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-slate-800 border-b border-slate-800 last:border-0 transition"
                          >
                            {res.display_name}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.endereco && <p className="text-red-400 text-xs mt-1">{errors.endereco.message}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Horário Início</label>
                      <input
                        {...register('horario_inicio')}
                        type="time"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Horário Término</label>
                      <input
                        {...register('horario_fim')}
                        type="time"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Dias de Funcionamento *</label>
                    <input
                      {...register('dias_semana')}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition"
                      placeholder="Ex: Segunda a Sexta, ou Sábados e Domingos"
                    />
                    {errors.dias_semana && <p className="text-red-400 text-xs mt-1">{errors.dias_semana.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
                    <textarea
                      {...register('descricao')}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none transition resize-none"
                      placeholder="Alguma observação adicional?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {editId ? 'Salvar Alterações' : 'Cadastrar Ponto'}
                </button>
              </form>
            </div>
          </div>

          {/* Lado Direito: Mapa */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden h-[400px] lg:h-[600px] shadow-2xl relative">
              <SeletorMapa
                onLocationSelect={(lt, ln) => {
                  setValue('latitude', lt)
                  setValue('longitude', ln)
                  buscarEnderecoPorCoords(lt, ln)
                }}
                initialPos={lat && lon ? [lat, lon] : undefined}
              />
              {buscandoEndereco && (
                <div className="absolute inset-0 z-[1000] bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    <span className="text-sm">Buscando endereço...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Navigation className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Localização Precisa</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                O marcador no mapa garante que as pessoas encontrem o local exato. Você pode arrastar o mapa ou clicar para ajustar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
