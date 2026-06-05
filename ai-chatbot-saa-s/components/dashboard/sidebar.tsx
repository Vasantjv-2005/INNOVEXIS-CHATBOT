'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquare, Settings, HelpCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const chats = [
    { id: '1', title: 'AI trends 2024' },
    { id: '2', title: 'React best practices' },
    { id: '3', title: 'Machine learning basics' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: isOpen ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40 md:translate-x-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold flex-1">Chats</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            asChild
            className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/dashboard">
              <Plus className="w-4 h-4" />
              New Chat
            </Link>
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-4">
            Recent
          </p>
          {chats.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ x: 4 }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
