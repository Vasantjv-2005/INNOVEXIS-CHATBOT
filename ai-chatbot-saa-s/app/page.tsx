'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Brain, Shield, Sparkles, Code, Cpu, MessageSquare, Globe, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import InteractiveParticles from '@/components/InteractiveParticles'
import AIOtherworldlyCore from '@/components/AIOtherworldlyCore'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-nebula text-foreground overflow-x-hidden relative">
      
      {/* Interactive Canvas Starfield Particles */}
      <InteractiveParticles />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow animate-glow-pulse"
            >
              <Sparkles className="w-5 h-5 text-black" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-cyan-300 bg-clip-text text-transparent">
              Mindflux
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Button asChild className="relative group overflow-hidden bg-white hover:bg-white/90 text-black rounded-full px-6 font-semibold shadow-2xl transition-all duration-300">
              <Link href="/chat">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-36 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Introducing Mindflux 2.0</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
            The Intelligence <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent text-glow">
              Operating System
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium, ultra-fast workspace blending multiple AI modes, state-of-the-art visual output, and research capabilities into one beautifully immersive console.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 rounded-full px-8 py-7 text-base font-semibold group"
            >
              <Link href="/chat" className="flex items-center gap-2">
                Launch Workspace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white/10 hover:bg-white/5 text-white hover:text-white rounded-full px-8 py-7 text-base backdrop-blur-md"
            >
              <Link href="#features">Explore OS Features</Link>
            </Button>
          </div>
        </motion.div>

        {/* 3D Holographic SVG AI Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="w-full max-w-2xl aspect-[2/1] relative flex items-center justify-center my-8 z-10"
        >
          <AIOtherworldlyCore />
        </motion.div>
      </section>

      {/* Infinite Logos Section */}
      <section className="py-12 border-t border-b border-white/5 bg-black/20 backdrop-blur-md overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            Powering workflow at modern enterprises
          </p>
          <div className="flex gap-16 justify-center items-center opacity-40 grayscale contrast-200">
            <span className="text-lg font-bold tracking-tighter text-white">OPENAI</span>
            <span className="text-lg font-bold tracking-tighter text-white">ANTHROPIC</span>
            <span className="text-lg font-bold tracking-tighter text-white">GOOGLE AI</span>
            <span className="text-lg font-bold tracking-tighter text-white">META AI</span>
            <span className="text-lg font-bold tracking-tighter text-white">LINEAR</span>
            <span className="text-lg font-bold tracking-tighter text-white">ARC CO.</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Feature Deck</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            One platform. Five AI Workspaces.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience our multi-panel OS workspace layout that transforms your daily interaction with artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MessageSquare,
              title: 'Contextual Chat',
              description: 'Talk to advanced models with a streamlined message flow, inline code support, and memory buffers.',
              color: 'from-blue-500 to-indigo-500'
            },
            {
              icon: Sparkles,
              title: 'Image Generator',
              description: 'Create high-resolution imagery using state-of-the-art text-to-image AI built right into your flow.',
              color: 'from-teal-500 to-emerald-500'
            },
            {
              icon: Brain,
              title: 'Doc Intelligence',
              description: 'Analyze PDF and Word docs instantly. Extract tables, summarize content, and query complex details.',
              color: 'from-cyan-500 to-teal-500'
            },
            {
              icon: Code,
              title: 'Code Synthesizer',
              description: 'Generate production-ready code blocks in multiple languages with code copy shortcuts and clean structures.',
              color: 'from-emerald-500 to-cyan-500'
            },
            {
              icon: Globe,
              title: 'Research Engine',
              description: 'Perform web queries with citations. Automatically aggregate facts and export details in real-time.',
              color: 'from-teal-500 to-cyan-500'
            },
            {
              icon: Shield,
              title: 'Secure Environment',
              description: 'Keep your proprietary code, docs, and prompts safe with enterprise-grade encrypted channels.',
              color: 'from-indigo-500 to-cyan-500'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              className="glass-card-premium p-8 rounded-3xl relative overflow-hidden group cursor-pointer"
            >
              {/* Highlight backdrop */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats counter Section */}
      <section className="py-20 relative max-w-7xl mx-auto px-6 z-10">
        <div className="glass-card-premium p-12 rounded-[2.5rem] relative overflow-hidden border border-white/5 bg-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-100%,rgba(16,185,129,0.08),transparent)]" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-6xl font-black text-white mb-2">99.8%</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Response Accuracy</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-black text-white mb-2">&lt; 0.5s</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-teal-400">Average Uptime Delay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            Simple, Transparent Plans
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the workspace capability right for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
          {/* Plan 1 */}
          <div className="glass-card-premium p-10 rounded-[2rem] border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Workspace Starter</h3>
              <p className="text-muted-foreground text-sm mb-6">Perfect for individual AI experimentation.</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                $0 <span className="text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-4 text-sm mb-8 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                  Access to Chat Workspace
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                  Basic AI Language Models
                </li>
                <li className="flex items-center gap-2 text-white/30">
                  <ChevronRight className="w-4 h-4 text-white/20" />
                  Image generator (Unavailable)
                </li>
              </ul>
            </div>
            <Button asChild className="w-full bg-white/5 hover:bg-white/10 text-white rounded-full py-6 font-semibold">
              <Link href="/chat">Access Free Plan</Link>
            </Button>
          </div>

          {/* Plan 2 */}
          <div className="glass-card-premium p-10 rounded-[2rem] border border-emerald-500/20 relative flex flex-col justify-between overflow-hidden shadow-glow">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs uppercase font-extrabold tracking-wider px-6 py-2 rounded-bl-2xl">
              Most Popular
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Mindflux Unlimited</h3>
              <p className="text-muted-foreground text-sm mb-6">The ultimate workspace with maximum capability.</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                $20 <span className="text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-4 text-sm mb-8 text-muted-foreground">
                <li className="flex items-center gap-2 text-white">
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                  Unlimited Chat & Image Generation
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                  Advanced Document Intelligence
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                  Enterprise API integration & Research Engine
                </li>
              </ul>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-650 hover:to-cyan-650 text-white rounded-full py-6 font-semibold shadow-glow">
              <Link href="/chat">Upgrade Workspace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl px-6 py-16 text-sm text-muted-foreground relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold text-white">Mindflux</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              Crafting premium human-AI operating systems. Elevating prompt interactions into visual workflow art.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-white mb-4">Workspace</h4>
              <ul className="space-y-2">
                <li><Link href="/chat" className="hover:text-white transition">Chat OS</Link></li>
                <li><Link href="/chat" className="hover:text-white transition">Image Creator</Link></li>
                <li><Link href="/chat" className="hover:text-white transition">Doc Intelligence</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-white transition">Register</Link></li>
                <li><Link href="/profile" className="hover:text-white transition">Workspace Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 text-center">
          <p>&copy; 2026 Mindflux AI. Designed for tomorrow.</p>
        </div>
      </footer>
    </div>
  )
}
