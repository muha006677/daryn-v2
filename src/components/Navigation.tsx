'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Brain, Search, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/courses', label: 'Курстар' },
  { href: '/training', label: 'Жаттығу' },
  { href: '/ubt', label: 'ҰБТ' },
  { href: '/diagnostics', label: 'Диагностика' },
  { href: '/talent', label: 'Дарын' },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm leading-tight">MathForce AI</p>
              <p className="text-slate-500 text-xs">AI Cognitive Platform</p>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === link.href
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                />
              </div>
            </form>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Панель
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg border border-white/10 transition-all"
            >
              Кіру
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Панель
              </Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4 px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
