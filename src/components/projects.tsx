'use client'

import { usePortfolio } from '@/app/providers'
import { useEffect, useRef, useState } from 'react'

const THUMB_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

function getThumbGradient(i: number) {
  const c1 = THUMB_COLORS[i % THUMB_COLORS.length]
  const c2 = THUMB_COLORS[(i + 1) % THUMB_COLORS.length]
  const c3 = THUMB_COLORS[(i + 2) % THUMB_COLORS.length]
  return `linear-gradient(135deg, ${c1}22, ${c2}11, ${c3}22)`
}

function Card({ title, desc, tags, github, live, i }: {
  title: string; desc: string; tags: string[]; github: string; live: string; i: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); o.disconnect() }
    }, { threshold: 0.05 })
    o.observe(el)
    return () => o.disconnect()
  }, [])

  const initials = title.split(/(?=[A-Z])/).map(w => w[0]).join('').slice(0, 2)

  return (
    <div ref={ref}
      className={`group glass-card rounded-2xl overflow-hidden transition-all duration-500 cursor-default
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20
        ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${i * 80}ms` }}>
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden"
        style={{ background: getThumbGradient(i) }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-white/20 select-none"
            style={{ fontFamily: 'var(--font-mono)' }}>
            {initials}
          </span>
        </div>
        {/* Decorative shapes */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border border-white/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-white/5" />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg rotate-45 border border-white/5" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs text-white/60 font-[family-name:var(--font-mono)]">
            Click links below
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400/60" />
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">{desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(t => (
            <span key={t}
              className="text-[0.5rem] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full
                font-[family-name:var(--font-mono)] tracking-wide uppercase">{t}</span>
          ))}
        </div>
        <div className="flex gap-3 pt-3 border-t border-white/5">
          <a href={github} target="_blank" rel="noreferrer"
            className="text-xs text-zinc-500 no-underline transition-all hover:text-indigo-400
              inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] group/link
              hover:scale-105">
            <i className="fa-brands fa-github group-hover/link:rotate-12 transition-transform" /> Source
            <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">&rarr;</span>
          </a>
          <a href={live} target="_blank" rel="noreferrer"
            className="text-xs text-zinc-500 no-underline transition-all hover:text-emerald-400
              inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] group/link
              hover:scale-105">
            <i className="fa-solid fa-arrow-up-right-from-square group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /> Demo
            <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects } = usePortfolio()
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

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#030014] relative">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-purple-600/5 blur-[100px]" />

      <div className="section-inner relative">
        <div ref={headingRef}
          className={`transition-all duration-700 ${headingVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-indigo-400 font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] uppercase mb-2">
            &mdash; Projects
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Featured <span className="gradient-text-vibrant">work</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mb-12 leading-relaxed">
            Projects I&apos;ve built that showcase my skills and experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <Card key={`${p.title}-${i}`} {...p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
