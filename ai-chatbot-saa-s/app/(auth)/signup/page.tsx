'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Sparkles, UserPlus } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/contexts/AuthContext'
import { toast } from 'sonner'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mounted, setMounted] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const bgBackgroundSpotlight = useMotionTemplate`
    radial-gradient(
      500px circle at ${mouseX}px ${mouseY}px,
      rgba(16, 185, 129, 0.2),
      transparent 80%
    )
  `

  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-white/10', width: '0%' }
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' }
    if (score <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '60%' }
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      await signup(name, email, password)
      toast.success('Account created successfully!')
      router.push('/chat')
    } catch (error: any) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div 
      className="min-h-screen bg-nebula text-foreground flex items-center justify-center px-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background radial spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-20 transition duration-300"
        style={{
          background: bgBackgroundSpotlight,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Aurora layers */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-float-3d" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 py-10"
      >
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to home
        </Link>

        {/* Floating Card */}
        <div className="glass-card-premium p-10 rounded-[2.5rem] relative overflow-hidden bg-black/40 border border-white/5 shadow-glow">
          <div className="flex items-center gap-3 mb-8">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow animate-glow-pulse"
            >
              <Sparkles className="w-5 h-5 text-black" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-cyan-300 bg-clip-text text-transparent">
              Mindflux OS
            </span>
          </div>

          <h1 className="text-3xl font-black mb-2 text-white">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">Enlist your node on the intelligence network.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Agent Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/30 px-5 py-4 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Access Email</label>
              <Input
                type="email"
                placeholder="agent@mindflux.io"
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/30 px-5 py-4 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Workspace Key (Password)</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/30 px-5 py-4 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Password strength bar */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                    <span>Key Strength:</span>
                    <span className="text-emerald-400 font-semibold">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Verify Key</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/30 px-5 py-4 rounded-xl text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full py-7 font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register Node
                </>
              )}
            </Button>
          </form>

          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-4 bg-transparent text-muted-foreground">Direct Handshake</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-white/5 bg-white/5 hover:bg-white/10 hover:text-white rounded-full py-6 flex items-center justify-center gap-2 text-white"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.24-.63-.35-1.3-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Connect with Google
          </Button>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-center text-sm text-muted-foreground">
              Already enlisted?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-350 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
