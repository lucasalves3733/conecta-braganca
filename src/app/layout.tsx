import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Conecta Bragança — Pontos de Doação',
    template: '%s | Conecta Bragança',
  },
  description: 'Mapa colaborativo de pontos de doação em Bragança Paulista. Encontre onde retirar roupas, alimentos, remédios e mais.',
  keywords: ['doação', 'pontos de doação', 'Bragança Paulista', 'ajuda humanitária', 'sustentabilidade'],
  authors: [{ name: 'Moderniza' }],
  creator: 'Moderniza',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://conecta-braganca.vercel.app',
    title: 'Conecta Bragança — Pontos de Doação',
    description: 'Mapa colaborativo de pontos de doação em Bragança Paulista.',
    siteName: 'Conecta Bragança',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conecta Bragança',
    description: 'Mapa colaborativo de pontos de coleta.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0a0a0a] text-white selection:bg-cyan-500/30`}>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          
          <Footer />
        </div>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'rgb(15 23 42 / 0.95)',
              border: '1px solid rgb(51 65 85)',
              color: 'rgb(226 232 240)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </body>
    </html>
  )
}
