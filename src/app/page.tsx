import { createClient } from '@/lib/supabase/server'
import type { Categoria, PontoColeta } from '@/lib/types'
import Header from '@/components/Header'
import FiltrosHome from '@/components/FiltrosHome'

export default async function Home() {
  const supabase = await createClient()

  const [cat, pts] = await Promise.all([
    supabase.from('categorias').select('*').order('nome'),
    supabase
      .from('pontos_coleta')
      .select('*, categorias!categoria_id(*)')
      .order('created_at', { ascending: false }),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const categorias = (cat.data as Categoria[]) || []
  const pontos = (pts.data as PontoColeta[]) || []

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <Header />

      {/* Componente de filtros (precisa ser client) */}
      <FiltrosHome 
        categorias={categorias} 
        pontosIniciais={pontos} 
        user={user}
      />
    </main>
  )
}
