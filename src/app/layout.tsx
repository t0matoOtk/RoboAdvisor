import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DAT.co RoboAdvisor — mNAV Monitor',
  description:
    'Track mNAV premium/discount for Bitcoin treasury companies in real time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f13] text-slate-200 antialiased">
        <header className="border-b border-slate-800 px-6 py-4">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                DAT.co Monitor
              </h1>
              <p className="text-xs text-slate-500">
                mNAV Premium Tracker for Bitcoin Treasury Companies
              </p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
