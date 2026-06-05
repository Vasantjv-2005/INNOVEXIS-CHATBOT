'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail, Lock, Bell, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/contexts/AuthContext'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setBio(user.bio || '')
    }
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/api/user/profile', {
        name,
        email,
        bio
      })
      
      if (res.data.success) {
        updateUser(res.data.updatedUser)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b sticky top-0 z-40"
      >
        <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/50 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'appearance', label: 'Appearance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="bg-background border-border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="bg-background border-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Change Password</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background border-border"
                  />
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Update Password
                </Button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
              <p className="text-muted-foreground mb-4">Add an extra layer of security to your account</p>
              <Button variant="outline" className="border-border/50">
                Enable 2FA
              </Button>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Notification Preferences</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications', description: 'Receive updates via email' },
                  { label: 'Message alerts', description: 'Get notified about new messages' },
                  { label: 'System updates', description: 'Announcements about new features' },
                  { label: 'Weekly digest', description: 'Summary of your activity' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Theme Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Color Theme</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['Dark', 'Light', 'Purple', 'Blue'].map((theme) => (
                      <button
                        key={theme}
                        className={`p-3 rounded-lg border-2 transition ${
                          theme === 'Dark'
                            ? 'border-accent'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 mt-4">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm">Use system preferences</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
