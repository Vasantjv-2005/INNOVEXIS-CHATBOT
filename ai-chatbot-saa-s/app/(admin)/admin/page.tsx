'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, BarChart3, AlertCircle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '12,543',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Active Sessions',
      value: '3,284',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'API Requests',
      value: '1.2M',
      change: '+23.1%',
      icon: BarChart3,
      color: 'text-purple-500',
    },
    {
      label: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      icon: AlertCircle,
      color: 'text-orange-500',
    },
  ]

  const recentUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Active' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'Inactive' },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Active' },
  ]

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
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-xs text-green-500">{stat.change} from last month</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-12"
        >
          <h2 className="text-xl font-bold mb-6">Usage Overview</h2>
          <div className="h-64 bg-background rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50 transition">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
