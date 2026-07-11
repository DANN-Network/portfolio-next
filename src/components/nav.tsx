'use client'

import { useState } from 'react'
import { usePortfolio } from '@/app/providers'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const { openAdmin } = usePortfolio()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-8 flex items-center justify-between"
      style={{ background: 'rgba(3,0,20,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <a href="#home" className="font-bold text-lg tracking-tight text-white no-underline">
        DANN<span className="text-indigo-400">.</span>
      </a>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        {LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href}
              className="px-3 py-2 text-sm text-zinc-400 no-underline rounded-lg transition-all
                duration-200 hover:text-white hover:bg-white/5 font-[family-name:var(--font-mono)] tracking-wide">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button onClick={openAdmin}
            className="ml-2 px-3 py-2 text-sm text-zinc-500 no-underline rounded-lg
              transition-all duration-200 hover:text-white hover:bg-white/5
              font-[family-name:var(--font-mono)] cursor-pointer" title="Admin">
            &#9733;
          </button>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)}
        className="md:hidden text-white p-2 cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#030014] border-b border-white/10 md:hidden"
          style={{ backdropFilter: 'blur(16px)' }}>
          <ul className="flex flex-col p-4 list-none">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-zinc-400 no-underline rounded-lg
                    transition-colors hover:text-white hover:bg-white/5">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <button onClick={() => { openAdmin(); setOpen(false) }}
                className="w-full text-left px-4 py-3 text-sm text-zinc-400 rounded-lg
                  transition-colors hover:text-white hover:bg-white/5 cursor-pointer">
                &#9733; Admin
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
