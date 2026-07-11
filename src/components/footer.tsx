'use client'

import { usePortfolio } from '@/app/providers'

export default function Footer() {
  const { openAdmin } = usePortfolio()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-10 px-4 bg-[#030014] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xs text-zinc-600">
          <span onClick={openAdmin}
            className="inline-block w-2 h-2 text-transparent cursor-pointer select-none align-middle mr-1"
            title="secret" aria-label="secret">&#x2022;</span>
          &copy; {year} <span className="text-zinc-400">DANN</span>
        </div>

        <div className="flex items-center gap-4">
          {[
            { icon: 'fa-brands fa-github', href: '#', label: 'GitHub' },
            { icon: 'fa-brands fa-linkedin', href: '#', label: 'LinkedIn' },
            { icon: 'fa-brands fa-instagram', href: '#', label: 'Instagram' },
            { icon: 'fa-solid fa-envelope', href: '#', label: 'Email' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="text-zinc-600 hover:text-indigo-400 transition-colors duration-200"
              aria-label={s.label}>
              <i className={`${s.icon} text-sm`} />
            </a>
          ))}
        </div>

        <div className="text-[0.5rem] text-zinc-600 tracking-[0.1em] uppercase font-[family-name:var(--font-mono)]">
          Built with Next.js &middot; Deployed with love
        </div>
      </div>
    </footer>
  )
}
