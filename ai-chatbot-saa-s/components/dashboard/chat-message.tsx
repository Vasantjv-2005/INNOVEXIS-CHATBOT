'use client'

import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex gap-3 max-w-2xl ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
            isUser
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {isUser ? 'You' : 'AI'}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`inline-block px-4 py-2 rounded-lg ${
              isUser
                ? 'bg-accent text-accent-foreground rounded-br-none'
                : 'glass-card rounded-bl-none'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </motion.div>

          {/* Actions */}
          {!isUser && (
            <div className="mt-2 flex gap-2 opacity-0 hover:opacity-100 transition">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
