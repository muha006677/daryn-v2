'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login (no backend yet)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <Link href="/" className="flex items-center gap-3 max-w-md mx-auto">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">MathForce AI</p>
            <p className="text-slate-500 text-xs">AI Cognitive Platform</p>
          </div>
        </Link>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Жүйеге кіру</h1>
            <p className="text-slate-400">Аккаунтыңызға кіріңіз</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" strokeWidth={1.75} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">
                Құпия сөз
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-white/5" />
                <span>Есте сақтау</span>
              </label>
              <button type="button" className="text-slate-400 hover:text-white transition-colors">
                Құпия сөзді ұмыттыңыз ба?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Кіру...</span>
              ) : (
                <>
                  <span>Кіру</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">немесе</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-400">
            Аккаунтыңыз жоқ па?{' '}
            <Link href="/dashboard" className="text-white hover:underline font-medium">
              Тіркелу
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-sm">
        <p>© 2026 MathForce AI. Барлық құқықтар қорғалған.</p>
      </footer>
    </div>
  )
}
