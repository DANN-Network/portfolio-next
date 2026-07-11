'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePortfolio } from '@/app/providers'

type Line = { text: string; className?: string }

const HELP = `Commands:
  help       - Show help
  clear      - Clear terminal
  whoami     - Show user
  date       - Current date
  uptime     - Uptime info
  projects   - List projects
  skills     - List skills
  contact    - Contact info
  admin      - Open admin panel
  echo       - Print text
  ls         - List directories
  neofetch   - System info`

export default function TerminalConsole() {
  const { projects, settings, openAdmin, terminalOpen, toggleTerminal } = usePortfolio()
  const [lines, setLines] = useState<Line[]>([
    { text: '[SYSTEM] Console ready.', className: 'text-emerald-400' },
    { text: "[SYSTEM] Type 'help' for commands.", className: 'text-emerald-400' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [lines])
  useEffect(() => { if (terminalOpen) setTimeout(() => inputRef.current?.focus(), 100) }, [terminalOpen])

  const addL = (arr: Line[], text: string, className?: string) => [...arr, { text, className }]

  const process = useCallback((cmd: string) => {
    if (!cmd.trim()) return
    const next = [...lines, { text: `$ ${cmd}`, className: 'text-indigo-300' }]
    setHistory(h => [...h, cmd]); setHistIdx(-1)

    const parts = cmd.trim().split(/\s+/)
    const c = parts[0].toLowerCase()
    const args = parts.slice(1)
    let result: Line[]

    switch (c) {
      case 'help': result = addL(next, HELP, 'text-zinc-400'); break
      case 'clear': result = []; break
      case 'whoami': result = addL(next, settings.displayName); break
      case 'date': result = addL(next, new Date().toLocaleString()); break
      case 'uptime': result = addL(next, '5+ years and counting'); break
      case 'projects':
        result = next
        projects.forEach(p => { result = addL(result, `  - ${p.title}`) })
        break
      case 'skills': result = addL(next, 'React, Next.js, Node.js, TypeScript, Python, Docker, AWS'); break
      case 'contact': result = addL(next, `Email: ${settings.email}`); break
      case 'admin': openAdmin(); result = addL(next, 'Opening admin...', 'text-emerald-400'); break
      case 'echo': result = addL(next, args.join(' ')); break
      case 'ls': result = addL(next, 'about/  projects/  skills/  contact/  admin/'); break
      case 'neofetch': result = addL(next, 'OS: Portfolio v3.0\nTheme: indigo_dark'); break
      default: result = addL(next, `Unknown: ${c}. Type 'help'`, 'text-red-400')
    }
    setLines(result)
  }, [lines, projects, settings, openAdmin])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { process(input); setInput('') }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx); setInput(history[history.length - 1 - idx])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx <= 0) { setHistIdx(-1); setInput(''); return }
      setHistIdx(histIdx - 1); setInput(history[history.length - 1 - (histIdx - 1)])
    }
  }

  if (!terminalOpen) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex flex-col bg-[#0a0a1a]/95
      border-t border-indigo-500/30 font-[family-name:var(--font-mono)] transition-all duration-300 h-[300px]">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5 shrink-0">
        <span className="text-xs text-zinc-500">
          <i className="fa-solid fa-terminal text-indigo-400" /> terminal
        </span>
        <button onClick={toggleTerminal}
          className="text-zinc-500 cursor-pointer text-sm px-1.5 py-0.5 rounded hover:text-white transition-colors">
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
        {lines.map((l, i) => (
          <div key={i} className={l.className} style={{ whiteSpace: 'pre-wrap' }}>{l.text}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-t border-white/5 shrink-0">
        <span className="text-indigo-400 shrink-0">$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          className="flex-1 bg-transparent text-white text-sm outline-none font-[family-name:var(--font-mono)]"
          placeholder="Type command..." autoComplete="off" spellCheck={false} />
      </div>
    </div>
  )
}