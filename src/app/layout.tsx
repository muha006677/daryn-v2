import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Shokhan Daryny — Оқушының дарындылық бағытын анықтау жүйесі',
  description: 'Оқушылардың артықшылық бағыттарын анықтауға арналған жүйе',
  openGraph: {
    title: 'Shokhan Daryny',
    description: 'Оқушылардың артықшылық бағыттарын анықтауға арналған жүйе',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kk">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-xl text-slate-800">Shokhan Daryny</span>
              </Link>
              <div className="hidden sm:flex items-center gap-6">
                <Link href="/lesson-plan" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Сабақ жоспары
                </Link>
                <Link href="/worksheet" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Жұмыс парағы
                </Link>
                <Link href="/contest" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Олимпиада
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-xl text-white">Shokhan Daryny</span>
              </div>
              <p className="text-sm text-center md:text-right">
                Оқушының дарындылық бағытын анықтау жүйесі
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
              © 2024 Shokhan Daryny. Барлық құқықтар қорғалған.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
