'use client'

import { useState, useEffect } from 'react'
import { usePortfolio } from '@/app/providers'
import type { TabId, Project } from '@/lib/types'

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'messages', label: 'Messages' },
  { id: 'settings', label: 'Settings' },
  { id: 'about', label: 'About' },
  { id: 'media', label: 'Media' },
]

const ADMIN_PASSWORD = 'dann2026'

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
]

export default function AdminPanel() {
  const { projects, addProject, deleteProject, syncProjects, messages, deleteMessage, settings, saveSettings, adminOpen, closeAdmin } = usePortfolio()
  const [tab, setTab] = useState<TabId>('dashboard')
  const [toast, setToast] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [pTitle, setPTitle] = useState('')
  const [pDesc, setPDesc] = useState('')
  const [pTags, setPTags] = useState('')
  const [pGithub, setPGithub] = useState('')
  const [pLive, setPLive] = useState('')
  const [pImage, setPImage] = useState<string>('')
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [aboutText, setAboutText] = useState('')
  const [aboutText2, setAboutText2] = useState('')
  const [aboutImage, setAboutImage] = useState<string>('')
  const [bgImage, setBgImage] = useState<string>('')
  const [showImagePicker, setShowImagePicker] = useState<'project' | 'about' | 'bg' | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  function t(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500) }

  function checkAuth() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPassword('')
      t('Access granted')
    } else {
      t('Wrong password')
    }
  }

  function resetForm() {
    setPTitle(''); setPDesc(''); setPTags(''); setPGithub(''); setPLive(''); setPImage('')
    setShowForm(false); setEditingIdx(null)
  }

  function handleAddProject() {
    if (!pTitle.trim() || !pDesc.trim()) { t('Title & description required'); return }
    addProject({
      title: pTitle.trim(), desc: pDesc.trim(),
      tags: pTags.split(',').map(x => x.trim()).filter(Boolean),
      github: pGithub.trim() || '#', live: pLive.trim() || '#', icon: 'fa-solid fa-code', image: pImage.trim() || undefined,
    })
    resetForm()
    t('Project added!')
  }

  function handleUpdateProject() {
    if (!pTitle.trim() || !pDesc.trim() || editingIdx === null) { t('Title & description required'); return }
    const updated = [...projects]
    updated[editingIdx] = {
      ...updated[editingIdx],
      title: pTitle.trim(), desc: pDesc.trim(),
      tags: pTags.split(',').map(x => x.trim()).filter(Boolean),
      github: pGithub.trim() || '#', live: pLive.trim() || '#', image: pImage.trim() || undefined,
    }
    syncProjects(updated)
    resetForm()
    t('Project updated!')
  }

  function startEdit(idx: number) {
    const p = projects[idx]
    setPTitle(p.title)
    setPDesc(p.desc)
    setPTags(p.tags.join(', '))
    setPGithub(p.github)
    setPLive(p.live)
    setPImage(p.image || '')
    setEditingIdx(idx)
    setShowForm(true)
  }

  function saveS() {
    const n = (document.getElementById('sName') as HTMLInputElement)?.value?.trim()
    const g = (document.getElementById('sTag') as HTMLInputElement)?.value?.trim()
    const e = (document.getElementById('sEmail') as HTMLInputElement)?.value?.trim()
    saveSettings({ displayName: n || settings.displayName, tagline: g || settings.tagline, email: e || settings.email })
    t('Settings saved!')
  }

  function saveAbout() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_about', JSON.stringify({ text1: aboutText, text2: aboutText2, image: aboutImage }))
      t('About section saved!')
    }
  }

  function saveMedia() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_media', JSON.stringify({ aboutImage, bgImage }))
      t('Media saved!')
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'project' | 'about' | 'bg') {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { t('Please select an image file'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (type === 'project') setPImage(base64)
      else if (type === 'about') { setAboutImage(base64); saveAbout() }
      else if (type === 'bg') { setBgImage(base64); saveMedia() }
      setUploading(false)
      setUploadProgress(0)
      t('Image uploaded!')
    }
    reader.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function pickImage(url: string) {
    if (showImagePicker === 'project') setPImage(url)
    else if (showImagePicker === 'about') { setAboutImage(url); saveAbout() }
    else if (showImagePicker === 'bg') { setBgImage(url); saveMedia() }
    setShowImagePicker(null)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_about')
      if (saved) {
        const data = JSON.parse(saved)
        setAboutText(data.text1 || '')
        setAboutText2(data.text2 || '')
        setAboutImage(data.image || '')
      }
      const media = localStorage.getItem('portfolio_media')
      if (media) {
        const data = JSON.parse(media)
        setAboutImage(data.aboutImage || '')
        setBgImage(data.bgImage || '')
      }
    }
  }, [])

  if (!adminOpen) return null

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0a0a1a] border border-indigo-500/30 rounded-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <i className="fa-solid fa-lock text-4xl text-indigo-400 mb-3" />
            <h2 className="text-xl font-bold text-white">Admin Console</h2>
            <p className="text-zinc-500 text-sm mt-1">Enter password to access</p>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkAuth()}
              className="w-full px-4 py-3 glass-card rounded-xl text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600 pr-12"
              placeholder="Password"
              autoFocus
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
            </button>
          </div>
          <button
            onClick={checkAuth}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-500"
          >
            Unlock
          </button>
          <button
            onClick={closeAdmin}
            className="w-full mt-2 px-4 py-2 rounded-xl glass text-zinc-400 text-sm transition-colors hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a1a] border border-indigo-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5">
          <h2 className="text-sm text-white font-[family-name:var(--font-mono)]">
            <i className="fa-solid fa-shield-halved text-indigo-400" /> Admin Console
          </h2>
          <button onClick={() => { setAuthenticated(false); closeAdmin() }}
            className="text-zinc-500 cursor-pointer text-lg px-2 py-1 rounded transition-colors hover:text-white bg-transparent border-none">
            x
          </button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map(t2 => (
            <button key={t2.id} onClick={() => setTab(t2.id)}
              className={`px-3 py-1.5 text-[0.55rem] rounded-lg border cursor-pointer transition-all
                tracking-[0.08em] uppercase font-[family-name:var(--font-mono)]
                ${tab === t2.id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/30'}`}>
              {t2.label}
            </button>
          ))}
        </div>

        {toast && (
          <div className="mb-4 px-3 py-2 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-fade-up">
            {toast}
          </div>
        )}

        {tab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { val: projects.length, lbl: 'Projects' },
                { val: messages.length, lbl: 'Messages' },
                { val: '142', lbl: 'Visitors' },
                { val: '99.9%', lbl: 'Uptime' },
              ].map(s => (
                <div key={s.lbl} className="glass-card rounded-xl py-3 px-3 text-center">
                  <div className="text-lg font-bold text-white">{s.val}</div>
                  <div className="text-[0.5rem] text-zinc-500 mt-1 tracking-[0.08em] uppercase">{s.lbl}</div>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-sm">Admin panel ready. Manage content from tabs above.</p>
          </div>
        )}

        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Projects</h3>
              <button onClick={() => { resetForm(); setShowForm(true) }}
                className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                + Add Project
              </button>
            </div>
            {showForm && (
              <div className="glass-card rounded-xl p-4 mb-4 space-y-3 animate-fade-up">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Title *</label>
                  <input value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Project title"
                    className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Description *</label>
                  <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Project description" rows={3}
                    className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600 resize-y" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Tags (comma separated)</label>
                  <input value={pTags} onChange={e => setPTags(e.target.value)} placeholder="React, Next.js, TypeScript"
                    className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                  <p className="text-[0.55rem] text-zinc-500 mt-1">Example: React, Next.js, TypeScript, Tailwind</p>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">GitHub URL</label>
                  <input value={pGithub} onChange={e => setPGithub(e.target.value)} placeholder="https://github.com/..."
                    className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Live Demo URL</label>
                  <input value={pLive} onChange={e => setPLive(e.target.value)} placeholder="https://demo.com"
                    className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Project Image</label>
                  <div className="flex gap-2 flex-wrap">
                    <input
                      value={pImage}
                      onChange={e => setPImage(e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 min-w-[200px] px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'project')}
                      disabled={uploading}
                      className="ml-2" />
                    {uploading && (
                      <div className="ml-2 flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-2 bg-indigo-500 transition-width duration-300`} style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-xs text-indigo-300">{uploadProgress}%</span>
                      </div>
                    )}
                    <button type="button" onClick={() => setShowImagePicker('project')}
                      className="px-3 py-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors text-sm ml-2">
                      Gallery
                    </button>
                  </div>
                  {pImage && (
                    <img src={pImage} alt="Preview" className="mt-2 max-h-32 rounded-lg border border-white/10" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={editingIdx !== null ? handleUpdateProject : handleAddProject}
                    className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
                    {editingIdx !== null ? 'Update Project' : 'Add Project'}
                  </button>
                  <button onClick={resetForm} className="px-3 py-2 rounded-lg glass text-zinc-400 hover:text-white">Cancel</button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {projects.map((p, i) => (
                <div key={i} className="glass-card rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{p.title}</div>
                    <div className="text-xs text-zinc-500 truncate">{p.desc}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.tags.map(t => <span key={t} className="text-[0.5rem] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded font-[family-name:var(--font-mono)]">{t}</span>)}
                    </div>
                    {p.image && <div className="text-[0.55rem] text-zinc-500 mt-1 font-[family-name:var(--font-mono)] truncate">Image: {p.image}</div>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(i)} className="text-indigo-400 hover:text-indigo-300 text-sm p-1" title="Edit">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button onClick={() => deleteProject(i)} className="text-red-400 hover:text-red-300 text-sm p-1" title="Delete">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-zinc-500 text-center py-4">No projects yet</p>}
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Messages</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className="glass-card rounded-xl p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-white truncate">{m.name}</div>
                    <button onClick={() => deleteMessage(i)} className="text-red-400 hover:text-red-300 text-xs p-1 shrink-0">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{m.email}</div>
                  <div className="text-sm text-zinc-300 mt-1 break-words">{m.message}</div>
                  <div className="text-[0.55rem] text-zinc-500 mt-1 font-[family-name:var(--font-mono)]">{new Date(m.date).toLocaleString()}</div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-zinc-500 text-center py-4">No messages</p>}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Profile Settings</h3>
            <div className="glass-card rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Display Name</label>
                <input id="sName" defaultValue={settings.displayName}
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Tagline</label>
                <input id="sTag" defaultValue={settings.tagline}
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Email</label>
                <input id="sEmail" type="email" defaultValue={settings.email}
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50" />
              </div>
              <button onClick={saveS} className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {tab === 'about' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4">About Section Content</h3>
            <div className="glass-card rounded-xl p-4 space-y-6">
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Paragraph 1</label>
                <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={4}
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600 resize-y"
                  placeholder="First paragraph about yourself..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Paragraph 2</label>
                <textarea value={aboutText2} onChange={e => setAboutText2(e.target.value)} rows={4}
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600 resize-y"
                  placeholder="Second paragraph about yourself..." />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Profile Image</label>
                <div className="flex gap-2 flex-wrap">
                  <input
                    value={aboutImage}
                    onChange={e => setAboutImage(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 min-w-[200px] px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'about')}
                    disabled={uploading}
                    className="ml-2" />
                  {uploading && (
                    <div className="ml-2 flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-2 bg-indigo-500 transition-width duration-300`} style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-xs text-indigo-300">{uploadProgress}%</span>
                    </div>
                  )}
                  <button type="button" onClick={() => setShowImagePicker('about')}
                    className="px-3 py-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors text-sm ml-2">
                    Gallery
                  </button>
                </div>
                {aboutImage && (
                  <img src={aboutImage} alt="Preview" className="mt-2 max-h-40 rounded-lg border border-white/10" />
                )}
              </div>
              <button onClick={saveAbout} className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                Save About Content
              </button>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Background & Media</h3>
            <div className="glass-card rounded-xl p-4 space-y-6">
              <div>
                <label className="block text-xs text-zinc-500 mb-1 font-[family-name:var(--font-mono)] tracking-wide">Hero Background Image</label>
                <div className="flex gap-2 flex-wrap">
                  <input
                    value={bgImage}
                    onChange={e => setBgImage(e.target.value)}
                    placeholder="Background image URL"
                    className="flex-1 min-w-[200px] px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'bg')}
                    disabled={uploading}
                    className="ml-2" />
                  {uploading && (
                    <div className="ml-2 flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-2 bg-indigo-500 transition-width duration-300`} style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-xs text-indigo-300">{uploadProgress}%</span>
                    </div>
                  )}
                  <button type="button" onClick={() => setShowImagePicker('bg')}
                    className="px-3 py-2 glass rounded-lg text-zinc-400 hover:text-white transition-colors text-sm ml-2">
                    Gallery
                  </button>
                </div>
                {bgImage && (
                  <img src={bgImage} alt="Preview" className="mt-2 max-h-40 rounded-lg border border-white/10" />
                )}
              </div>
              <button onClick={saveMedia} className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                Save Media
              </button>
            </div>
          </div>
        )}

        {/* Image Gallery Modal */}
        {showImagePicker && (
          <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0a0a1a] border border-indigo-500/30 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Select Image</h3>
                <button onClick={() => setShowImagePicker(null)} className="text-zinc-500 hover:text-white text-xl">x</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GALLERY_IMAGES.map((img, i) => (
                  <button key={i} onClick={() => pickImage(img)}
                    className="relative aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all group">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fa-solid fa-check text-2xl text-emerald-400" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="block text-xs text-zinc-500 mb-2 font-[family-name:var(--font-mono)] tracking-wide">Or enter custom URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 glass rounded-lg text-white outline-none focus:border-indigo-500/50 placeholder-zinc-600"
                  onKeyDown={e => e.key === 'Enter' && e.currentTarget && pickImage(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}