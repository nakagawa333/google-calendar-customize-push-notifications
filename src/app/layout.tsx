import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegist from './common/client/serviceWorkerRegist'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="./manifest.json" />
      </head>
      <body className={inter.className}>
        <div>
          {children}
        </div>
        <ServiceWorkerRegist />
      </body>
    </html>
  )
}
