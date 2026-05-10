'use client'

import dynamic from 'next/dynamic'

const MiniMapa = dynamic(() => import('./MiniMapa'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 text-sm">Carregando mapa...</div>
})

interface MiniMapaWrapperProps {
  lat: number
  lng: number
  nome: string
}

export default function MiniMapaWrapper({ lat, lng, nome }: MiniMapaWrapperProps) {
  return <MiniMapa lat={lat} lng={lng} nome={nome} />
}
