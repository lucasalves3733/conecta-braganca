import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const type = searchParams.get('type') || 'search'
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    let url = ''
    if (type === 'reverse' && lat && lon) {
      url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    } else if (q) {
      // Garantimos que a busca seja focada em Bragança Paulista
      const cleanQuery = q.replace(', Bragança Paulista', '')
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery + ', Bragança Paulista')}&format=jsonv2&addressdetails=1&limit=5`
    } else {
      return NextResponse.json({ error: 'Parâmetros insuficientes' }, { status: 400 })
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://localhost:3000'
      },
      next: { revalidate: 3600 } // Cache de 1 hora para evitar excesso de requisições
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro Nominatim:', response.status, errorText)
      return NextResponse.json({ error: 'Serviço de mapas indisponível' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro fatal Geocoding:', error)
    return NextResponse.json({ error: 'Erro interno ao buscar endereço' }, { status: 500 })
  }
}
