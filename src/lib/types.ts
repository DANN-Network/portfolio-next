export type Project = {
  title: string
  desc: string
  tags: string[]
  github: string
  live: string
  icon: string
}

export type Message = {
  name: string
  email: string
  message: string
  date: string
}

export type Settings = {
  displayName: string
  tagline: string
  email: string
}

export type TabId = 'dashboard' | 'projects' | 'messages' | 'settings' | 'about'
