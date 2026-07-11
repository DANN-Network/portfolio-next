'use client'

import { useState, useCallback } from 'react'
import type { Project, Message, Settings } from './types'

const DEFAULT_PROJECTS: Project[] = [
  {
    title: 'CyberDashboard',
    desc: 'Real-time threat monitoring dashboard with live analytics and WebSocket feeds.',
    tags: ['React', 'D3.js', 'Node.js', 'WebSocket'],
    github: '#', live: '#', icon: 'fa-solid fa-shield-halved',
  },
  {
    title: 'DevFlow',
    desc: 'Developer workflow automation with CI/CD pipeline integration.',
    tags: ['Next.js', 'TypeScript', 'Docker', 'GraphQL'],
    github: '#', live: '#', icon: 'fa-solid fa-code-branch',
  },
  {
    title: 'CloudForge',
    desc: 'Cloud infrastructure management platform with auto-scaling.',
    tags: ['AWS', 'Terraform', 'Go', 'React'],
    github: '#', live: '#', icon: 'fa-solid fa-cloud',
  },
]

const DEFAULT_SETTINGS: Settings = {
  displayName: 'Danish Ata Mahendra',
  tagline: 'Full-stack Developer & Cybersecurity Enthusiast',
  email: 'dann@example.com',
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

export function useStore() {
  const [projects, setProjects] = useState<Project[]>(() => loadJSON('portfolio_projects', DEFAULT_PROJECTS))
  const [messages, setMessages] = useState<Message[]>(() => loadJSON('portfolio_messages', []))
  const [settings, setSettings] = useState<Settings>(() => loadJSON('portfolio_settings', DEFAULT_SETTINGS))

  const syncProjects = useCallback((next: Project[]) => {
    setProjects(next)
    if (typeof window !== 'undefined') localStorage.setItem('portfolio_projects', JSON.stringify(next))
  }, [])

  const addProject = useCallback((p: Project) => syncProjects([...projects, p]), [projects, syncProjects])
  const deleteProject = useCallback((idx: number) => syncProjects(projects.filter((_, i) => i !== idx)), [projects, syncProjects])

  const addMessage = useCallback((m: Message) => {
    const next = [...messages, m]
    setMessages(next)
    if (typeof window !== 'undefined') localStorage.setItem('portfolio_messages', JSON.stringify(next))
  }, [messages])

  const deleteMessage = useCallback((idx: number) => {
    const next = messages.filter((_, i) => i !== idx)
    setMessages(next)
    if (typeof window !== 'undefined') localStorage.setItem('portfolio_messages', JSON.stringify(next))
  }, [messages])

  const saveSettings = useCallback((s: Settings) => {
    setSettings(s)
    if (typeof window !== 'undefined') localStorage.setItem('portfolio_settings', JSON.stringify(s))
  }, [])

  return { projects, addProject, deleteProject, syncProjects, messages, addMessage, deleteMessage, settings, saveSettings }
}
