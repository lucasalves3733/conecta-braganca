'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo, useState, useEffect } from 'react'
import type { PontoColeta } from '@/lib/types'

// Ícone para a localização do usuário
const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div style="background:#3b82f6;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(59,130,246,0.8);animation:pulse 2s infinite;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const iconMap: Record<string, string> = {
  'HeartPulse': '🏥',
  'Shirt': '👕',
  'Utensils': '🍴',
  'Recycle': '♻️',
  'Battery': '🔋',
  'Trash2': '🗑️',
  'ShoppingBag': '🛍️',
  'Apple': '🍎',
}

function criarIcone(cor: string, iconeName: string) {
  const emoji = iconMap[iconeName] || '📍'
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${cor};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.35);border:2px solid #0a0a0a;"><span style="transform:rotate(45deg);font-size:18px;">${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

// Botão de localização dentro do mapa
function UserLocationButton() {
  const map = useMap()
  const [userPos, setUserPos] = useState<[number, number] | null>(null)

  const findMe = () => {
    map.locate({ setView: true, maxZoom: 16 })
  }

  useEffect(() => {
    map.on('locationfound', (e) => {
      setUserPos([e.latlng.lat, e.latlng.lng])
    })
  }, [map])

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          findMe()
        }}
        className="absolute bottom-6 right-6 z-[1000] bg-white text-black p-3 rounded-full shadow-2xl hover:bg-zinc-100 transition-all active:scale-95"
        title="Minha Localização"
      >
        📍
      </button>
      {userPos && <Marker position={userPos} icon={userIcon} />}
    </>
  )
}

type Props = {
  pontos: PontoColeta[]
  centro?: [number, number]
  zoom?: number
}

export default function Mapa({
  pontos,
  centro = [-22.9526, -46.5419],
  zoom = 13,
}: Props) {
  const markers = useMemo(
    () =>
      pontos
        .filter((p) => p.latitude && p.longitude)
        .map((p) => ({
          ...p,
          markerIcon: criarIcone(p.categorias?.cor ?? '#22d3ee', p.categorias?.icone ?? ''),
        })),
    [pontos]
  )

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={centro}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((p) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]} icon={p.markerIcon}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[150px]">
                <strong className="block text-base text-white">{p.nome}</strong>
                <p className="text-xs text-slate-400 mt-1">{p.endereco}</p>
                <div className="mt-3 pt-2 border-t border-white/10">
                  <a 
                    href={`/ponto/${p.id}`} 
                    className="text-xs text-cyan-400 font-bold hover:underline"
                  >
                    Ver detalhes →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <UserLocationButton />
      </MapContainer>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: white !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-container {
          background: #0a0a0a !important;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
