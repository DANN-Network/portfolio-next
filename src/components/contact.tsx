'use client'

import { useState, useEffect, useRef } from 'react'
import { usePortfolio } from '@/app/providers'

export default function Contact() {
  const { addMessage } = usePortfolio()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [headingVis, setHeadingVis] = useState(false)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setHeadingVis(true); o.disconnect() }
    }, { threshold: 0.1 })
    o.observe(el)
    return () => o.disconnect()
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !msg.trim()) {
      setStatus({ text: 'All fields required.', ok: false }); return
    }
    if (!email.includes('@')) {
      setStatus({ text: 'Invalid email.', ok: false }); return
    }
    addMessage({ name: name.trim(), email: email.trim(), message: msg.trim(), date: new Date().toISOString() })
    setName(''); setEmail(''); setMsg('')
    setStatus({ text: 'Message sent! ✅', ok: true })
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#030014] relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="section-inner">
        <div ref={headingRef}
          className={`transition-all duration-700 ${headingVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-indigo-400 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase mb-2">
            &mdash; Contact
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Get in <span className="gradient-text-vibrant">touch</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mb-12 leading-relaxed">
            Have a project or just want to say hi? Drop me a message.
          </p>
        </div>

        <div className={`grid md:grid-cols-5 gap-8 transition-all duration-700 delay-200
          ${headingVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <form onSubmit={submit} className="md:col-span-3 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">
                Your Name
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 glass-card rounded-xl text-sm text-white
                  outline-none transition-all focus:border-indigo-500/50 focus:shadow-lg focus:shadow-indigo-500/5
                  placeholder-zinc-600"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">
                Your Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 glass-card rounded-xl text-sm text-white
                  outline-none transition-all focus:border-indigo-500/50 focus:shadow-lg focus:shadow-indigo-500/5
                  placeholder-zinc-600"
                placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">
                Your Message
              </label>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4}
                className="w-full px-4 py-3 glass-card rounded-xl text-sm text-white
                  outline-none transition-all focus:border-indigo-500/50 focus:shadow-lg focus:shadow-indigo-500/5
                  placeholder-zinc-600 resize-y" />
            </div>
            <button type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium cursor-pointer transition-all
                hover:from-indigo-500 hover:to-purple-500 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30 active:translate-y-0
                shadow-lg shadow-indigo-600/20 group/btn">
              <i className="fa-solid fa-paper-plane group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" /> Send Message
            </button>
            {status && (
              <p className={`text-sm font-[family-name:var(--font-mono)] transition-all duration-300
                ${status.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.text}
              </p>
            )}
          </form>

          <div className="md:col-span-2 space-y-3">
            <div className="glass-card rounded-2xl p-6">
              <h4 className="text-xs text-zinc-400 font-semibold mb-3 uppercase tracking-wide">Contact Info</h4>
              <div className="space-y-3">
                {[
                  { icon: 'fa-solid fa-envelope', label: 'Email', value: 'dann@example.com', href: 'mailto:dann@example.com' },
                  { icon: 'fa-solid fa-location-dot', label: 'Location', value: 'Indonesia', href: null },
                  { icon: 'fa-brands fa-github', label: 'GitHub', value: '@DANN-Network', href: 'https://github.com/DANN-Network' },
                  { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', value: '@gantengdann', href: 'https://linkedin.com/in/gantengdann' },
                  { icon: 'fa-brands fa-instagram', label: 'Instagram', value: '@gantengdann', href: 'https://instagram.com/gantengdann' },
                ].map(info => (
                  <div key={info.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <i className={`${info.icon} text-xs text-indigo-300`} />
                    </div>
                    <div>
                      <div className="text-[0.55rem] text-zinc-500 uppercase tracking-wide">{info.label}</div>
                      {info.href ? (
                        <a href={info.href} target="_blank" rel="noreferrer" className="text-xs text-zinc-300 hover:text-indigo-400 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-xs text-zinc-300">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h4 className="text-xs text-zinc-400 font-semibold mb-3 uppercase tracking-wide">Availability</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-[family-name:var(--font-mono)]">Open for opportunities</span>
              </div>
              <p className="text-[0.6rem] text-zinc-500 mt-2 leading-relaxed">
                I typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
