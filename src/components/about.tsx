'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { num: '5+', label: 'Years Experience' },
  { num: '30+', label: 'Projects Done' },
  { num: '20+', label: 'Happy Clients' },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const [aboutText, setAboutText] = useState('')
  const [aboutText2, setAboutText2] = useState('')
  const [aboutImage, setAboutImage] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); o.disconnect() }
    }, { threshold: 0.1 })
    o.observe(el)
    return () => o.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_about')
      if (saved) {
        const data = JSON.parse(saved)
        setAboutText(data.text1 || "I'm a full-stack developer based in Indonesia with a passion for building secure, scalable applications. My journey in tech started with curiosity and evolved into a career crafting digital solutions.")
        setAboutText2(data.text2 || "When I'm not coding, you'll find me exploring cybersecurity, contributing to open source, or diving into new technologies. I believe in continuous learning and sharing knowledge with the community.")
        setAboutImage(data.image || '')
      } else {
        setAboutText("I'm a full-stack developer based in Indonesia with a passion for building secure, scalable applications. My journey in tech started with curiosity and evolved into a career crafting digital solutions.")
        setAboutText2("When I'm not coding, you'll find me exploring cybersecurity, contributing to open source, or diving into new technologies. I believe in continuous learning and sharing knowledge with the community.")
      }
    }
  }, [])

  return (
    <section id="about" className="py-24 md:py-32 bg-[#030014] relative">
      <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-purple-600/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-48 h-48 rounded-full bg-indigo-600/5 blur-[80px]" />

      <div className="section-inner">
        <div
          className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-indigo-400 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase mb-2">
            &mdash; About
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Who I <span className="gradient-text-vibrant">am</span>
          </h2>
        </div>

        <div ref={ref} className={`grid md:grid-cols-5 gap-10 items-start transition-all duration-700
          ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div className="relative group/avatar">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden glass-vibrant
                flex items-center justify-center group-hover/avatar:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10" />
                {aboutImage ? (
                  <img src={aboutImage} alt="Profile" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                ) : (
                  <i className="fa-solid fa-user text-6xl text-indigo-300/40 group-hover/avatar:text-indigo-300/60 transition-all duration-300" />
                )}
                <div className="absolute inset-0 border border-indigo-500/10 rounded-2xl group-hover/avatar:border-indigo-500/30 transition-colors" />
              </div>
              <div className="absolute -inset-2 rounded-2xl border border-indigo-500/10 animate-pulse-ring opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#030014]
                flex items-center justify-center group-hover/avatar:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="text-zinc-400 leading-relaxed">{aboutText}</p>
            <p className="text-zinc-400 leading-relaxed">{aboutText2}</p>
            <div className="flex gap-4 pt-2 flex-wrap">
              {[
                { name: 'GitHub', icon: 'fa-brands fa-github', href: 'https://github.com/DANN-Network' },
                { name: 'LinkedIn', icon: 'fa-brands fa-linkedin', href: 'https://linkedin.com/in/gantengdann' },
                { name: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://instagram.com/gantengdann' },
              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer"
                  className="text-sm text-zinc-500 no-underline transition-all hover:text-indigo-400
                    font-[family-name:var(--font-mono)] tracking-wide inline-flex items-center gap-2
                    group/link">
                  <i className={`${s.icon} text-base`} />
                  {s.name}
                  <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-4 mt-12 transition-all duration-700 delay-300
          ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {STATS.map((s, i) => (
            <div key={s.label}
              className="glass-card rounded-2xl py-6 px-4 text-center relative overflow-hidden group"
              style={{ transitionDelay: `${i * 100 + 300}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{s.num}</div>
                <div className="text-[0.6rem] text-zinc-500 mt-1 tracking-[0.08em] uppercase">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}