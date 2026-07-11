'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import type { Project, Message, Settings } from '@/lib/types'

type Ctx = {
  projects: Project[]
  addProject: (p: Project) => void
  deleteProject: (idx: number) => void
  messages: Message[]
  addMessage: (m: Message) => void
  deleteMessage: (idx: number) => void
  settings: Settings
  saveSettings: (s: Settings) => void
  terminalOpen: boolean
  toggleTerminal: () => void
  adminOpen: boolean
  openAdmin: () => void
  closeAdmin: () => void
  konamiAdvance: () => void
}

const PortCtx = createContext<Ctx | null>(null)

export function usePortfolio() {
  const c = useContext(PortCtx)
  if (!c) throw new Error('usePortfolio outside Provider')
  return c
}

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]

export default function Provider({ children }: { children: React.ReactNode }) {
  const store = useStore()
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const buf = useRef<number[]>([])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTerminalOpen(o => !o)
        return
      }
      if (e.key === 'Escape') {
        setAdminOpen(false)
        setTerminalOpen(false)
        return
      }
      buf.current.push(e.keyCode)
      if (buf.current.length > KONAMI.length) buf.current.shift()
      if (buf.current.length === KONAMI.length && buf.current.every((k, i) => k === KONAMI[i])) {
        buf.current = []
        setAdminOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', adminOpen || terminalOpen)
  }, [adminOpen, terminalOpen])

  const toggleTerminal = useCallback(() => setTerminalOpen(o => !o), [])
  const openAdmin = useCallback(() => setAdminOpen(true), [])
  const closeAdmin = useCallback(() => setAdminOpen(false), [])

  const konamiAdvance = useCallback(() => {
    if (buf.current.length < KONAMI.length) {
      buf.current.push(KONAMI[buf.current.length])
    }
  }, [])

  return (
    <PortCtx.Provider value={{ ...store, terminalOpen, toggleTerminal, adminOpen, openAdmin, closeAdmin, konamiAdvance }}>
      {children}
    </PortCtx.Provider>
  )
}
