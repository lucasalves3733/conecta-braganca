'use client'

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type Props = {
  onLocationSelect: (lat: number, lng: number) => void
  initialPos?: [number, number]
}

// Componente para atualizar o centro do mapa quando a prop muda
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  return null
}

function LocationMarker({ onLocationSelect, initialPos }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPos ? L.latLng(initialPos[0], initialPos[1]) : null
  )

  useEffect(() => {
    if (initialPos) {
      setPosition(L.latLng(initialPos[0], initialPos[1]))
    }
  }, [initialPos])

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon} />
  )
}

export default function SeletorMapa({ onLocationSelect, initialPos }: Props) {
  const centroBraganca: [number, number] = [-22.9526, -46.5419]
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialPos || centroBraganca)

  useEffect(() => {
    if (initialPos) {
      setMapCenter(initialPos)
    }
  }, [initialPos])

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 relative">
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} />
        <LocationMarker onLocationSelect={onLocationSelect} initialPos={initialPos} />
      </MapContainer>
      <div className="absolute top-2 right-2 z-[1000] bg-black/80 px-3 py-1 rounded-full text-[10px] text-white/60 pointer-events-none">
        Clique no mapa para marcar a posição
      </div>
    </div>
  )
}
