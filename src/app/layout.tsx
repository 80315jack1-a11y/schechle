import type { Metadata, Viewport } from 'next'
import RegisterSW from '@/components/RegisterSW'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#1e40af',
}

export const metadata: Metadata = {
  title: 'Timeline - 週時間軸',
  description: '視覺化每週流程規劃工具',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  )
}
