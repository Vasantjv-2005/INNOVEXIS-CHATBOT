'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Send, Menu, Settings, LogOut, MessageSquare, HelpCircle, X, Sparkles, Image as ImageIcon, Pen, Globe, Mic, Trash2, MoreVertical, Download, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/contexts/AuthContext'
import { useTheme } from 'next-themes'
import api from '@/lib/api'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/mode-toggle'

interface Chat {
  _id: string
  user: string
  createdAt: string
  updatedAt: string
  title: string
}

interface Message {
  _id: string
  chat: string
  sender: 'user' | 'ai'
  message: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChats()
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const fetchChats = async () => {
    try {
      const res = await api.get('/api/chat')
      if (res.data.success && res.data.chats.length > 0) {
        setChats(res.data.chats)
        setCurrentChatId(res.data.chats[0]._id)
        fetchMessages(res.data.chats[0]._id)
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const createNewChat = async () => {
    try {
      const res = await api.post('/api/chat/create')
      if (res.data.success) {
        const newChat = res.data.chat
        setChats([newChat, ...chats])
        setCurrentChatId(newChat._id)
        setMessages([])
        setStreamingContent('')
        setSelectedFiles([])
      }
    } catch (error) {
      toast.error('Failed to create new chat')
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      await api.delete(`/api/chat/${chatId}`)
      const updatedChats = chats.filter(c => c._id !== chatId)
      setChats(updatedChats)
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0]._id)
          fetchMessages(updatedChats[0]._id)
        } else {
          setCurrentChatId(null)
          setMessages([])
        }
      }
      toast.success('Chat deleted successfully')
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await api.get(`/api/chat/messages/${chatId}`)
      if (res.data.success) {
        setMessages(res.data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleCopyMessage = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*(.*?)\*\*/g, '$1')).then(() => {
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeIndex(index)
      setTimeout(() => setCopiedCodeIndex(null), 2000)
    }).catch(() => {
      toast.error('Failed to copy code')
    })
  }

  const formatMessageWithBold = (text: string) => {
    // First, split into code blocks, images, and regular text
    const parts = text.split(/(```[\s\S]*?```)|(!\[.*?\]\(.*?\))/g).filter(Boolean)
    let codeBlockCount = 0
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Handle code block
        const codeMatch = part.match(/^```(\w*)\n([\s\S]*)\n```$/)
        if (codeMatch) {
          const language = codeMatch[1] || 'text'
          const code = codeMatch[2]
          const currentCodeIndex = codeBlockCount++
          
          return (
            <div key={index} className="code-block">
              <div className="code-header">
                <span className="code-language">{language}</span>
                <button
                  onClick={() => handleCopyCode(code, currentCodeIndex)}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedCodeIndex === currentCodeIndex ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="code-content">
                <pre><code>{code}</code></pre>
              </div>
            </div>
          )
        }
      }

      // Check for image markdown ![alt](url)
      const imageMatch = part.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (imageMatch) {
        const imageUrl = imageMatch[2]
        
        return (
          <div key={index} className="my-4">
            <img
              src={imageUrl}
              alt={imageMatch[1] || 'Generated Image'}
              className="max-w-full rounded-xl shadow-lg"
            />
            <div className="mt-2">
              <Button
                onClick={() => handleDownloadImage(imageUrl, `generated-image-${Date.now()}.png`)}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Download Image
              </Button>
            </div>
          </div>
        )
      }
      
      // Now handle bold, inline code, newlines, and links
      const inlineParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*|\n)/g)
      
      return (
        <span key={index}>
          {inlineParts.map((inlinePart, inlineIndex) => {
            if (inlinePart === '\n') {
              // Newline
              return <br key={inlineIndex} />
            }
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              // Inline code
              return (
                <code key={inlineIndex} className="inline-code">
                  {inlinePart.slice(1, -1)}
                </code>
              )
            }
            if (inlinePart.startsWith('**') && inlinePart.endsWith('**')) {
              // Bold text
              return <strong key={inlineIndex}>{inlinePart.slice(2, -2)}</strong>
            }
            // Regular text
            return <span key={inlineIndex}>{inlinePart}</span>
          })}
        </span>
      )
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('audio', audioBlob, 'audio.wav')
        
        try {
          // For now, let's use SpeechRecognition API directly for simpler approach
          toast.info('Processing voice...')
        } catch (error) {
          toast.error('Failed to process audio')
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      toast.error('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      toast.success('Recording stopped')
    }
  }

  // Use Speech Recognition API directly for simplicity
  const toggleSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
        toast.info('Listening...')
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsRecording(false)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        toast.error('Speech recognition error')
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      if (isRecording) {
        recognition.stop()
      } else {
        recognition.start()
      }
    } else {
      toast.error('Speech recognition not supported in this browser')
    }
  }

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && selectedFiles.length === 0) return

    const userMessageContent = input
    setInput('')

    const tempUserMessage: Message = {
      _id: Date.now().toString(),
      chat: currentChatId || 'temp',
      sender: 'user',
      message: userMessageContent + (selectedFiles.length > 0 ? `\n[Attached ${selectedFiles.length} file(s)]` : ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    setStreamingContent('')
    setIsLoading(true)

    try {
      if (!currentChatId) {
        const res = await api.post('/api/chat/create')
        if (res.data.success) {
          const newChat = res.data.chat
          setChats([newChat, ...chats])
          setCurrentChatId(newChat._id)
        }
      }

      const formData = new FormData()
      formData.append('chatId', currentChatId!)
      if (input.trim()) {
        formData.append('message', userMessageContent)
      }
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const res = await api.post('/api/chat/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data.success) {
        setSelectedFiles([])
        setMessages(prev => [
          ...prev.filter(m => m._id !== tempUserMessage._id),
          res.data.userMessage,
          res.data.aiMessage,
        ])
        // Update chat in list
        if (res.data.chat) {
          setChats(prev => {
            const chatIndex = prev.findIndex(c => c._id === res.data.chat._id)
            if (chatIndex !== -1) {
              const updatedChats = [...prev]
              updatedChats[chatIndex] = res.data.chat
              return updatedChats
            }
            return prev
          })
        }
      }
    } catch (error) {
      toast.error('Failed to send message')
      setMessages(prev => prev.filter(m => m._id !== tempUserMessage._id))
    } finally {
      setIsLoading(false)
      setStreamingContent('')
    }
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    fetchMessages(chatId)
    setSidebarOpen(false)
    setStreamingContent('')
    setSelectedFiles([])
  }

  const suggestions = [
    { icon: ImageIcon, text: 'Create an image' },
    { icon: Pen, text: 'Write or edit' },
    { icon: Globe, text: 'Look something up' }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden perspective-1000">
      {/* Background gradient orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          rotate: [0, 5, 0],
          x: [0, 20, 0],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-float-3d" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          rotate: [0, -5, 0],
          x: [0, -20, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -100 : 0) }}
        transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
        className="fixed md:relative left-0 top-0 h-screen w-72 bg-card/80 backdrop-blur-2xl border-r border-border/50 flex flex-col z-40 preserve-3d"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center animate-glow-pulse shadow-glow"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold gradient-text">Mindflux</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden hover:bg-secondary/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <motion.div whileHover={{ scale: 1.02, rotateX: 2 }} className="preserve-3d">
            <Button
              onClick={createNewChat}
              className="w-full gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white shadow-lg hover:shadow-glow-lg transition-all duration-300 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </motion.div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
            Recent
          </p>
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} className="relative group">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4, rotateY: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectChat(chat._id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 pr-12 ${
                    currentChatId === chat._id 
                      ? 'bg-gradient-to-r from-fuchsia-500/20 to-violet-600/20 text-accent border border-accent/30' 
                      : 'hover:bg-secondary/50 border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentChatId === chat._id ? 'bg-accent/20' : 'bg-secondary group-hover:bg-secondary/80'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="truncate font-medium">
                    {chat.title}
                  </span>
                </motion.button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary/50 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat._id)
                      }}
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 p-4 space-y-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="justify-start gap-2 hover:bg-secondary/50 rounded-xl" asChild>
              <Link href="/profile">
                <HelpCircle className="w-4 h-4" />
                Profile
              </Link>
            </Button>
            <ModeToggle />
          </div>
          <Button
            variant="ghost"
            className="justify-start gap-2 hover:bg-destructive/10 hover:text-destructive rounded-xl"
            onClick={() => {
              logout()
              router.push('/')
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-secondary/50 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hover:bg-secondary/50 rounded-xl">
              <Link href="/profile">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </motion.header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 && !streamingContent ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
              >
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl font-semibold gradient-text"
                >
                  Good to see you, {user?.name || 'there'}
                </motion.h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: 2, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput(suggestion.text)}
                    className="flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 hover:border-accent/50 hover:bg-secondary/30 transition-all duration-300 box-3d"
                  >
                    <suggestion.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{suggestion.text}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-8">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-4 max-w-[80%] ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white'
                          : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? 'You' : 'AI'}
                    </motion.div>

                    {/* Message Content */}
                    <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: msg.sender === 'user' ? -5 : 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`px-6 py-4 rounded-2xl shadow-lg ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-tr-sm'
                            : 'glass-card rounded-tl-sm border border-white/10'
                        }`}
                      >
                        <div className="text-base leading-relaxed whitespace-pre-wrap">
                          {formatMessageWithBold(msg.message)}
                        </div>
                      </motion.div>

                      {/* Actions */}
                      {msg.sender === 'ai' && (
                        <div className="mt-3 flex gap-2 transition-all duration-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 hover:bg-secondary/50 rounded-lg"
                            onClick={() => handleCopyMessage(msg._id, msg.message)}
                          >
                            <Copy className="w-3 h-3" />
                            {copiedMessageId === msg._id ? '✓ Copied' : 'Copy'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Streaming Content */}
              {streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-4 max-w-[80%] flex-row">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold shadow-lg text-white">
                      AI
                    </div>
                    <div className="flex-1 text-left">
                      <div className="px-6 py-4 rounded-2xl shadow-lg glass-card rounded-tl-sm border border-white/10">
                        <div className="text-base leading-relaxed whitespace-pre-wrap">
                          {formatMessageWithBold(streamingContent)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3"
          >
            <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="glass-card px-3 py-2 rounded-full flex items-center gap-2 border border-white/10"
                >
                  <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-6 pb-8 pt-4"
        >
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="glass-card p-3 flex gap-3 border border-white/10 shadow-2xl rounded-full">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full hover:bg-secondary/50"
              >
                <Plus className="w-5 h-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="application/pdf,image/*,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
              />
              <Input
                type="text"
                placeholder="Ask anything or attach files..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-4 py-3 text-base placeholder:text-muted-foreground/50"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleSpeechRecognition}
                className={`rounded-full hover:bg-secondary/50 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white rounded-full shadow-lg hover:shadow-glow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
