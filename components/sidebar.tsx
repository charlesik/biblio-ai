'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import { MessageCircle, BookOpen, ShoppingCart, Settings } from 'lucide-react'

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const categories = ['All', 'Romance', 'Fiction', 'Non-Fiction', 'Mystery', 'Poetry']

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent rounded-full" />
          <span className="font-semibold text-lg">Biblio</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<BookOpen className="w-5 h-5" />} label="Dashboard" active />
        <NavItem icon={<MessageCircle className="w-5 h-5" />} label="Chat" />
        <NavItem icon={<ShoppingCart className="w-5 h-5" />} label="Orders" />
        <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
      </nav>

      {/* Categories */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <p className="text-xs font-semibold text-sidebar-foreground/70 px-2 py-2">GENRES</p>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full" />
          <span className="text-sm font-medium">Vera Adeniji</span>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
