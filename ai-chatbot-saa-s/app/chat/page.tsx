'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, Send, Menu, Settings, LogOut, MessageSquare, HelpCircle, X, Sparkles, 
  Image as ImageIcon, FileText, Search, BookOpen, Layers, Check, ChevronLeft, ChevronRight,
  Code, Globe, Mic, Trash2, MoreVertical, Download, Copy, Terminal, Cpu, Database, Shield, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/contexts/AuthContext'
import api from '@/lib/api'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/mode-toggle'
import InteractiveParticles from '@/components/InteractiveParticles'

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Live Telemetry states for AI Core (fluctuates to feel "alive")
  const [coreLoad, setCoreLoad] = useState(42.4)
  const [bandwidth, setBandwidth] = useState(84.2)
  const [latency, setLatency] = useState(12)
  
  // Workspace tabs
  const [activeWorkspace, setActiveWorkspace] = useState<'chat' | 'image' | 'doc' | 'code' | 'research'>('chat')

  // Image Gen States
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1')
  const [imageStyle, setImageStyle] = useState('cinematic')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Document Intel States
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docExtractedText, setDocExtractedText] = useState('')
  const [docPrompt, setDocPrompt] = useState('Summarize the key points of this document.')
  const [docResponse, setDocResponse] = useState('')
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false)

  // Code Assistant States
  const [codeQuery, setCodeQuery] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // Research States
  const [researchQuery, setResearchQuery] = useState('')
  const [researchOutput, setResearchOutput] = useState('')
  const [isResearching, setIsResearching] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Telemetry fluctuations
    const interval = setInterval(() => {
      setCoreLoad(prev => +(prev + (Math.random() - 0.5) * 0.8).toFixed(1))
      setBandwidth(prev => +(prev + (Math.random() - 0.5) * 1.5).toFixed(1))
      setLatency(prev => Math.max(8, Math.min(24, Math.floor(prev + (Math.random() - 0.5) * 4))))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChats()
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        setSelectedFiles([])
        setActiveWorkspace('chat')
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

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Speech recognition handler
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

      recognition.onerror = () => {
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

  // Unified Chat Message submission
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
      formData.append('chatId', currentChatId || '')
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
        if (res.data.chat) {
          setChats(prev => {
            const index = prev.findIndex(c => c._id === res.data.chat._id)
            if (index !== -1) {
              const updated = [...prev]
              updated[index] = res.data.chat
              return updated
            }
            return prev
          })
        }
      }
    } catch (error) {
      toast.error('Failed to generate response')
      setMessages(prev => prev.filter(m => m._id !== tempUserMessage._id))
    } finally {
      setIsLoading(false)
    }
  }

  // IMAGE GENERATOR API CALL
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return
    setIsGeneratingImage(true)
    try {
      const res = await api.post('/api/image/generate', {
        prompt: `${imagePrompt} (${imageStyle} style, aspect ratio ${imageAspectRatio})`
      })
      if (res.data.success) {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const fullUrl = `${apiBaseUrl}${res.data.imageUrl}`
        setGeneratedImages(prev => [fullUrl, ...prev])
        toast.success('Image generated successfully!')
      }
    } catch (error) {
      toast.error('Image generation failed.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // DOCUMENT ANALYSIS SIMULATION
  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setDocFile(file)
      setDocExtractedText(`[Document Metadata]\nFilename: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type || 'Unknown'}\n\n[Extracted Sample Content]\nThis is simulated document text for ${file.name}. It contains multiple system logs, project descriptions, and analytical metadata regarding platform design and deployment performance.`)
    }
  }

  const handleAnalyzeDoc = async () => {
    if (!docFile) return
    setIsAnalyzingDoc(true)
    try {
      const response = await api.post('/api/chat/message', {
        chatId: currentChatId || chats[0]?._id,
        message: `${docPrompt}\n\nAnalyze this document text:\n${docExtractedText.substring(0, 1000)}`
      })
      if (response.data.success) {
        setDocResponse(response.data.aiMessage.message)
      }
    } catch (error) {
      toast.error('Analysis failed.')
    } finally {
      setIsAnalyzingDoc(false)
    }
  }

  // CODE ASSISTANT SIMULATION
  const handleGenerateCode = async () => {
    if (!codeQuery.trim()) return
    setIsGeneratingCode(true)
    try {
      const prompt = `Write clean ${codeLanguage} code for the following request: "${codeQuery}". Wrap the code in standard triple backtick code blocks with language identifier. Add brief explanations at the beginning and end.`
      const response = await api.post('/api/chat/message', {
        chatId: currentChatId || chats[0]?._id,
        message: prompt
      })
      if (response.data.success) {
        setGeneratedCode(response.data.aiMessage.message)
      }
    } catch (error) {
      toast.error('Code generation failed.')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  // RESEARCH MODE SIMULATION
  const handleStartResearch = async () => {
    if (!researchQuery.trim()) return
    setIsResearching(true)
    try {
      const prompt = `Research and provide a structured synthesis for: "${researchQuery}". Add list items with numbers. Make sure to include simulated annotations like [1], [2] next to key sentences, and include a "Sources:" list at the bottom with mockup link items.`
      const response = await api.post('/api/chat/message', {
        chatId: currentChatId || chats[0]?._id,
        message: prompt
      })
      if (response.data.success) {
        setResearchOutput(response.data.aiMessage.message)
      }
    } catch (error) {
      toast.error('Research task failed.')
    } finally {
      setIsResearching(false)
    }
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    fetchMessages(chatId)
    setSelectedFiles([])
    setActiveWorkspace('chat')
  }

  const getWorkspaceBorderClass = () => {
    switch (activeWorkspace) {
      case 'chat': return 'border-glow-purple'
      case 'image': return 'border-glow-fuchsia'
      case 'doc': return 'border-glow-cyan'
      case 'code': return 'border-glow-pink'
      case 'research': return 'border-glow-blue'
      default: return 'border-glow-purple'
    }
  }

  const formatMessageWithBold = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)|(!\[.*?\]\(.*?\))/g).filter(Boolean)
    let codeBlockCount = 0
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeMatch = part.match(/^```(\w*)\n([\s\S]*)\n```$/)
        if (codeMatch) {
          const language = codeMatch[1] || 'text'
          const code = codeMatch[2]
          const currentCodeIndex = codeBlockCount++
          
          return (
            <div key={index} className="code-block border border-white/5 shadow-2xl rounded-2xl overflow-hidden my-4 bg-black/40">
              <div className="code-header flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="code-language text-xs font-bold tracking-wider text-emerald-450">{language}</span>
                <button
                  onClick={() => handleCopyCode(code, currentCodeIndex)}
                  className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCodeIndex === currentCodeIndex ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="code-content p-4 overflow-x-auto text-sm font-mono text-white/90">
                <pre><code>{code}</code></pre>
              </div>
            </div>
          )
        }
      }

      // Check for image markdown ![alt](url)
      const imageMatch = part.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (imageMatch) {
        let imageUrl = imageMatch[2]
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          imageUrl = `${apiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
        }
        
        return (
          <div key={index} className="my-4 glass-card-premium p-4 rounded-3xl border border-white/5 shadow-glow inline-block">
            <img
              src={imageUrl}
              alt={imageMatch[1] || 'Generated Image'}
              className="max-w-full rounded-2xl shadow-xl max-h-[300px] object-cover mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownloadImage(imageUrl, `generated-image-${Date.now()}.png`)}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-650 hover:to-cyan-650 text-white rounded-full gap-2 px-6"
              >
                <Download className="w-4 h-4" />
                Download Image
              </Button>
            </div>
          </div>
        )
      }
      
      const inlineParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*|\n)/g)
      
      return (
        <span key={index}>
          {inlineParts.map((inlinePart, inlineIndex) => {
            if (inlinePart === '\n') {
              return <br key={inlineIndex} />
            }
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              return (
                <code key={inlineIndex} className="inline-code bg-white/5 border border-white/10 px-2 py-0.5 rounded text-teal-400 font-mono text-sm mx-1">
                  {inlinePart.slice(1, -1)}
                </code>
              )
            }
            if (inlinePart.startsWith('**') && inlinePart.endsWith('**')) {
              return <strong key={inlineIndex} className="text-white font-extrabold">{inlinePart.slice(2, -2)}</strong>
            }
            return <span key={inlineIndex} className="text-white/80">{inlinePart}</span>
          })}
        </span>
      )
    })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-nebula text-foreground flex relative overflow-hidden h-screen">
      {/* Interactive Background Particles */}
      <InteractiveParticles />

      {/* Aurora layers */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none animate-float-3d" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Collapsible glassmorphism sidebar (Arc & Linear inspired) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen bg-black/35 backdrop-blur-2xl border-r border-white/5 flex flex-col z-40 relative flex-shrink-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-550 flex items-center justify-center shadow-glow">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">Mindflux OS</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* New Session Button */}
            <div className="p-4">
              <Button
                onClick={createNewChat}
                className="w-full gap-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-glow rounded-xl font-bold py-6"
              >
                <Plus className="w-4 h-4" />
                New Workspace
              </Button>
            </div>

            {/* Chat History / Session List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 py-2">
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest px-2 py-2">
                Session Logs
              </p>
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                </div>
              ) : (
                chats.map((chat) => (
                  <div key={chat._id} className="relative group">
                    <button
                      onClick={() => selectChat(chat._id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 pr-12 ${
                        currentChatId === chat._id 
                          ? 'bg-white/5 text-emerald-400 border border-emerald-500/20' 
                          : 'hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate font-medium">{chat.title}</span>
                    </button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border border-white/10">
                        <DropdownMenuItem
                          onClick={() => deleteChat(chat._id)}
                          className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>

            {/* LIVE SYSTEM TELEMETRY WIDGETS */}
            <div className="p-4 border-t border-white/5 space-y-3 bg-black/20">
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest px-2">
                Core Telemetry
              </p>
              
              <div className="space-y-2.5 px-2">
                {/* 1. CPU / Core Load */}
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-emerald-400" /> NEURAL_LOAD</span>
                    <span className="text-emerald-300 font-semibold">{coreLoad}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${coreLoad}%` }}
                      className="h-full bg-emerald-500 rounded-full" 
                    />
                  </div>
                </div>

                {/* 2. Latency */}
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-teal-400" /> COR_LATENCY</span>
                    <span className="text-teal-300 font-semibold">{latency} ms</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${(latency / 30) * 100}%` }}
                      className="h-full bg-teal-500 rounded-full" 
                    />
                  </div>
                </div>

                {/* 3. Bandwidth */}
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono mb-1">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3 text-cyan-400" /> SYNC_BW</span>
                    <span className="text-cyan-300 font-semibold">{bandwidth} MB/s</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${(bandwidth / 120) * 100}%` }}
                      className="h-full bg-cyan-500 rounded-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Status Indicator Flags */}
              <div className="flex gap-2 flex-wrap px-2 pt-1 font-mono text-[8px]">
                <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/25 rounded text-green-400 font-bold uppercase tracking-wider">
                  OS_CORE: OK
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-450 font-bold uppercase tracking-wider animate-pulse">
                  SYNC: ON
                </span>
              </div>
            </div>

            {/* Profile & Settings Footer */}
            <div className="border-t border-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate max-w-[150px] font-semibold">
                  {user?.name || 'Authorized Node'}
                </span>
                <ModeToggle />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 rounded-xl"
                onClick={() => {
                  logout()
                  router.push('/')
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout Session
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full relative z-10 bg-black/10">
        
        {/* Workspace Upper Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            {/* Workspace tabs container */}
            <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/5">
              {[
                { id: 'chat', label: 'Chat OS', icon: MessageSquare },
                { id: 'image', label: 'Image Creator', icon: ImageIcon },
                { id: 'doc', label: 'Doc Intel', icon: FileText },
                { id: 'code', label: 'Code assistant', icon: Code },
                { id: 'research', label: 'Research', icon: Globe }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeWorkspace === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveWorkspace(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-teal-550 via-emerald-500 to-cyan-550 text-white shadow-glow' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* WORKSPACE PANELS VIEWPORT (Borders glow matching the active mode) */}
        <div className={`flex-1 overflow-y-auto m-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 transition-all duration-500 ${getWorkspaceBorderClass()}`}>
          <AnimatePresence mode="wait">
            
            {/* 1. CHAT WORKSPACE */}
            {activeWorkspace === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full flex flex-col"
              >
                {/* Chat Message feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full flex-col text-center gap-4 py-20">
                      <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow animate-float-3d">
                        <Sparkles className="w-8 h-8 text-black animate-pulse" />
                      </div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                        Mindflux Dialog Stream
                      </h2>
                      <p className="text-muted-foreground max-w-sm text-sm">
                        Start prompting to process intelligence variables. Connect documents or generate high-fidelity visualizations.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                      {messages.map((msg, index) => (
                        <div
                          key={msg._id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg ${
                              msg.sender === 'user'
                                ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
                                : 'bg-white/5 border border-white/10 text-emerald-400'
                            }`}>
                              {msg.sender === 'user' ? 'YOU' : 'AI'}
                            </div>

                            {/* Message Bubble Card */}
                            <div>
                              <div className={`px-6 py-4 rounded-3xl shadow-xl leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-gradient-to-r from-teal-500/25 to-cyan-500/25 border border-teal-500/20 text-white rounded-tr-sm'
                                  : 'bg-black/30 backdrop-blur-md border border-white/5 rounded-tl-sm text-white/95'
                              }`}>
                                <div className="text-sm md:text-base whitespace-pre-wrap">
                                  {formatMessageWithBold(msg.message)}
                                </div>
                              </div>

                              {msg.sender === 'ai' && (
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-white"
                                    onClick={() => handleCopyMessage(msg._id, msg.message)}
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    {copiedMessageId === msg._id ? 'Copied' : 'Copy'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-4 max-w-[85%]">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-emerald-400">
                              AI
                            </div>
                            <div className="bg-black/30 border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Selected Files Drawer */}
                {selectedFiles.length > 0 && (
                  <div className="px-6 py-2 bg-black/10 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white">
                          <span className="truncate max-w-[120px] font-semibold">{file.name}</span>
                          <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Chat Input */}
                <div className="p-6 bg-black/20 backdrop-blur-md border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 p-2.5 rounded-[2rem] bg-white/5 border border-white/5 shadow-2xl items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileSelect}
                    />
                    <Input
                      type="text"
                      placeholder="Input model directives..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent border-none text-white text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 px-3"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={toggleSpeechRecognition}
                      className={`rounded-full hover:bg-white/5 text-muted-foreground hover:text-white ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
                      className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full p-6 shadow-glow"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* 2. IMAGE CREATOR WORKSPACE */}
            {activeWorkspace === 'image' && (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Visual Synthesis Suite</h2>
                    <p className="text-muted-foreground text-xs">Transform prompts into high-fidelity generative imagery.</p>
                  </div>
                </div>

                <div className="glass-card-premium p-6 rounded-3xl border border-white/5 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Generation prompt</label>
                    <textarea
                      placeholder="e.g. A futuristic glass neural core floating in deep cyberspace, vaporwave glow, ultra-detailed 3d render..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-emerald-500/50 outline-none resize-none placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Aspect Ratio</label>
                      <div className="flex gap-2 flex-wrap">
                        {['1:1', '16:9', '9:16'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setImageAspectRatio(ratio)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              imageAspectRatio === ratio 
                                ? 'bg-emerald-600 text-white shadow-glow' 
                                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visual Style</label>
                      <div className="flex gap-2 flex-wrap">
                        {['cinematic', 'anime', 'cyberpunk', 'photorealistic'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setImageStyle(style)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                              imageStyle === style 
                                ? 'bg-emerald-600 text-white shadow-glow' 
                                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full py-6 font-bold shadow-glow"
                  >
                    {isGeneratingImage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Synthesize Visual Node
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Images Grid */}
                {generatedImages.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Output History</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {generatedImages.map((url, idx) => (
                        <div key={idx} className="glass-card-premium p-4 rounded-3xl border border-white/5 overflow-hidden group shadow-glow">
                          <img src={url} alt="Generated visual node" className="w-full aspect-square object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform duration-300" />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium">Output Node #{generatedImages.length - idx}</span>
                            <Button
                              onClick={() => handleDownloadImage(url, `image-node-${idx}.png`)}
                              variant="ghost"
                              size="icon"
                              className="hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. DOCUMENT INTELLIGENCE WORKSPACE */}
            {activeWorkspace === 'doc' && (
              <motion.div
                key="doc"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Document Intelligence Console</h2>
                    <p className="text-muted-foreground text-xs">Examine document files, compile metrics, and run queries.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Upload Panel */}
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center cursor-pointer min-h-[220px]" onClick={() => docInputRef.current?.click()}>
                    <input
                      type="file"
                      ref={docInputRef}
                      className="hidden"
                      accept=".pdf,.txt,.docx"
                      onChange={handleDocFileSelect}
                    />
                    <FileText className="w-12 h-12 text-emerald-400 mb-4 animate-float-3d" />
                    <span className="text-sm font-bold text-white">Load Document Node</span>
                    <span className="text-xs text-muted-foreground mt-1">PDF, TXT, DOCX files supported</span>
                    {docFile && (
                      <span className="mt-4 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 font-semibold text-[10px]">
                        {docFile.name}
                      </span>
                    )}
                  </div>

                  {/* Document Parser Text Area */}
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Extracted File Data</h3>
                      <textarea
                        readOnly
                        value={docExtractedText || 'Upload a file node to parse content...'}
                        className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none resize-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Analysis prompt box */}
                {docFile && (
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Analysis Prompt</h3>
                    <div className="flex gap-3">
                      <Input
                        value={docPrompt}
                        onChange={(e) => setDocPrompt(e.target.value)}
                        placeholder="e.g. List all metrics mentioned..."
                        className="bg-white/5 border-white/10 text-white rounded-xl focus:border-emerald-500/50"
                      />
                      <Button
                        onClick={handleAnalyzeDoc}
                        disabled={isAnalyzingDoc}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                      >
                        {isAnalyzingDoc ? 'Analyzing...' : 'Execute'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Analysis Output */}
                {docResponse && (
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Analysis Result</h3>
                    <div className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
                      {formatMessageWithBold(docResponse)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. CODE ASSISTANT WORKSPACE */}
            {activeWorkspace === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Code Synthesizer console</h2>
                    <p className="text-muted-foreground text-xs">Generate clean script blocks and syntax-highlighted nodes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Directives input */}
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Syntax description</label>
                      <textarea
                        placeholder="e.g. Express controller routing helper..."
                        value={codeQuery}
                        onChange={(e) => setCodeQuery(e.target.value)}
                        className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-emerald-500/50 outline-none resize-none placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Language</label>
                        <select 
                          value={codeLanguage} 
                          onChange={(e) => setCodeLanguage(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none"
                        >
                          <option value="javascript" className="bg-slate-900 text-white">JavaScript</option>
                          <option value="typescript" className="bg-slate-900 text-white">TypeScript</option>
                          <option value="python" className="bg-slate-900 text-white">Python</option>
                          <option value="html" className="bg-slate-900 text-white">HTML/CSS</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateCode}
                      disabled={isGeneratingCode || !codeQuery.trim()}
                      className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full py-6 font-bold shadow-glow"
                    >
                      {isGeneratingCode ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Terminal className="w-5 h-5 mr-2" />
                          Synthesize Code Node
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Right Column: Code block output */}
                  <div className="glass-card-premium p-6 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[300px]">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-450">Synthesized Output</h3>
                      {generatedCode ? (
                        <div className="text-sm font-mono text-white/95 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                          {formatMessageWithBold(generatedCode)}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground text-xs">
                          <Terminal className="w-8 h-8 text-white/10 mb-3 animate-pulse" />
                          <span>Generated syntax will appear here.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. RESEARCH WORKSPACE */}
            {activeWorkspace === 'research' && (
              <motion.div
                key="research"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Aggregated Research Portal</h2>
                    <p className="text-muted-foreground text-xs">Fetch data with citations, aggregates, and mockup references.</p>
                  </div>
                </div>

                <div className="glass-card-premium p-6 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Research Directive</h3>
                  <div className="flex gap-3">
                    <Input
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                      placeholder="e.g. Compare Next.js Turbopack speeds..."
                      className="bg-white/5 border-white/10 text-white rounded-xl focus:border-emerald-500/50"
                    />
                    <Button
                      onClick={handleStartResearch}
                      disabled={isResearching}
                      className="bg-emerald-650 hover:bg-emerald-750 text-white rounded-xl px-6"
                    >
                      {isResearching ? 'Aggregating...' : 'Search'}
                    </Button>
                  </div>
                </div>

                {/* Research Output display */}
                {researchOutput && (
                  <div className="glass-card-premium p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-2 text-emerald-450">
                      <BookOpen className="w-4 h-4" />
                      <h3 className="text-xs font-bold uppercase tracking-widest">Aggregated Synthesis Report</h3>
                    </div>
                    <div className="text-sm md:text-base leading-relaxed text-white/95 whitespace-pre-wrap">
                      {formatMessageWithBold(researchOutput)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
