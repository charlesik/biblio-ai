import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import Header from "@/components/header"

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Biblio - Book Discovery',
  description: 'Discover and explore books powered by AI recommendations',
  icons: { icon: "/favicon.png",  },
}

export const viewport: Viewport = {
  themeColor: '#d4a574',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <Header/>
        {children}
      </body>
    </html>
  )
}
