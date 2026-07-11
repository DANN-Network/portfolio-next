'use client'

import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React', icon: 'fa-brands fa-react', desc: 'Frontend framework', level: 90 },
  { name: 'Next.js', icon: 'fa-brands fa-js', desc: 'React metaframework', level: 85 },
  { name: 'Node.js', icon: 'fa-brands fa-node-js', desc: 'Runtime JS', level: 80 },
  { name: 'TypeScript', icon: 'fa-brands fa-js', desc: 'Typed JS', level: 85 },
  { name: 'JavaScript', icon: 'fa-brands fa-js', desc: 'The basics', level: 95 },
  { name: 'Python', icon: 'fa-brands fa-python', desc: 'Backend & data', level: 75 },
  { name: 'Docker', icon: 'fa-brands fa-docker', desc: 'Containerization', level: 70 },
  { name: 'AWS', icon: 'fa-solid fa-cloud', desc: 'Cloud infra', level: 65 },
  { name: 'MongoDB', icon: 'fa-solid fa-database', desc: 'NoSQL database', level: 75 },
  { name: 'PostgreSQL', icon: 'fa-solid fa-database', desc: 'SQL database', level: 70 },
  { name: 'Figma', icon: 'fa-brands fa-figma', desc: 'Design tool', level: 60 },
  { name: 'Git', icon: 'fa-brands fa-git-alt', desc: 'Version control', level: 90 },
]

function SkillBar({ name, icon, desc, level, i, visible }: {
  name: string; icon: string; desc: string; level: number; i: number; visible: boolean
}) {
  return (
    <div
      className={`glass-card rounded-xl p-4 transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${i * 40}ms` }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
          <i className={`${icon} text-sm text-indigo-300`} />
        </div>
        <div className="min-w-0">
          <span className="text-sm text-white font-medium block leading-tight">{name}</span>
          <span className="text-[0.55rem] text-zinc-500 tracking-wide uppercase">{desc}</span>
        </div>
        <span className="ml-auto text-xs text-indigo-300 font-[family-name:var(--font-mono)]">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
          style={{ width: visible ? `${level}%` : '0%', transitionDelay: `${i * 60 + 300}ms` }}
        />
      </div>
    </div>
  )
}

const CATEGORIES = [
  { label: 'Frontend', skills: ['React', 'Next.js', 'JavaScript', 'TypeScript'] },
  { label: 'Backend', skills: ['Node.js', 'Python'] },
  { label: 'DevOps', skills: ['Docker', 'AWS', 'Git'] },
  { label: 'Design', skills: ['Figma'] },
  { label: 'Data', skills: ['MongoDB', 'PostgreSQL'] },
]

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const [activeCat, setActiveCat] = useState('All')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); o.disconnect() }
    }, { threshold: 0.05 })
    o.observe(el)
    return () => o.disconnect()
  }, [])

  const filtered = activeCat === 'All'
    ? SKILLS
    : SKILLS.filter(s => CATEGORIES.find(c => c.label === activeCat)?.skills.includes(s.name))

  return (
    <section id="skills" className="py-24 md:py-32 bg-[#030014] relative">
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-indigo-600/5 blur-[100px]" />

      <div className="section-inner relative">
        <div
          className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-indigo-400 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase mb-2">
            &mdash; Skills
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            My <span className="gradient-text-vibrant">toolkit</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mb-8 leading-relaxed">
            Technologies I use daily to build and ship products.
          </p>
        </div>

        {/* Category filters */}
        <div ref={ref} className="flex flex-wrap gap-2 mb-8">
          {['All', ...CATEGORIES.map(c => c.label)].map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 text-[0.55rem] rounded-lg border cursor-pointer transition-all
                tracking-[0.08em] uppercase font-[family-name:var(--font-mono)]
                ${activeCat === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/30'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s, i) => (
            <SkillBar key={s.name} {...s} i={i} visible={vis} />
          ))}
        </div>
      </div>
    </section>
  )
}
