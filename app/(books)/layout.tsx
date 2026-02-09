import React from "react"
import { Suspense } from 'react'

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      {children}
    </Suspense>
  )
}
