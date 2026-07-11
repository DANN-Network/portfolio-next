'use client'

import { useEffect, useState, useRef } from 'react'
import { usePortfolio } from '@/app/providers'

const ROLES = ['Front-End Developer', 'UI/UX Enthusiast', 'Problem Solver']

function Starfield({ mousePos }: { mousePos: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: { x: number; y: number; z: number; size: number; speedX: number; speedY: number; opacity: number; phase: number }[] = []
    const STAR_COUNT = 400

    function resize() {
      if (!canvas || !section) return
      const rect = section.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    function initStars() {
      if (!canvas) return
      stars = []
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 3 + 0.5,
          size: Math.random() * 1.8 + 0.2,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.7 + 0.3,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = (mousePos.x / window.innerWidth - 0.5) * 2
      const my = (mousePos.y / window.innerHeight - 0.5) * 2
      const time = Date.now() * 0.001

      for (const star of stars) {
        const parallaxX = mx * star.z * 10
        const parallaxY = my * star.z * 10

        star.x += star.speedX * star.z * 0.3
        star.y += star.speedY * star.z * 0.3

        if (star.x < -10) star.x = canvas.width + 10
        if (star.x > canvas.width + 10) star.x = -10
        if (star.y < -10) star.y = canvas.height + 10
        if (star.y > canvas.height + 10) star.y = -10

        const sx = star.x + parallaxX
        const sy = star.y + parallaxY

        const twinkle = 0.4 + Math.sin(time * 1.5 * star.z + star.phase) * 0.6
        const alpha = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()

        if (star.size > 1.3) {
          ctx.beginPath()
          ctx.arc(sx, sy, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.06})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initStars()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(section)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [mousePos])

  return (
    <div ref={sectionRef} className="absolute inset-0 z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default function Hero() {
  const { toggleTerminal } = usePortfolio()
  const [role, setRole] = useState('')
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const [del, setDel] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [bgImage, setBgImage] = useState('')
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = localStorage.getItem('portfolio_media')
      if (media) {
        const data = JSON.parse(media)
        setBgImage(data.bgImage || '')
      }
    }
  }, [])

  useEffect(() => {
    const cur = ROLES[idx]
    const t = setTimeout(() => {
      if (!del) {
        if (char < cur.length) { setRole(cur.substring(0, char + 1)); setChar(c => c + 1) }
        else { setTimeout(() => setDel(true), 2000) }
      } else {
        if (char > 0) { setRole(cur.substring(0, char - 1)); setChar(c => c - 1) }
        else { setDel(false); setIdx((idx + 1) % ROLES.length) }
      }
    }, del ? 20 : 50)
    return () => clearTimeout(t)
  }, [idx, char, del])

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section id="home" ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#030014]">
      <Starfield mousePos={mousePos} />

      {/* Background image */}
      {bgImage && (
        <div className="absolute inset-0 z-[-1]">
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover opacity-20"
            style={{ filter: 'brightness(0.3)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014]" />
        </div>
      )}

      {/* Grid pattern bottom half */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 z-[1] opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient orbs - top only */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px]" />

      <div className="relative z-10 text-center max-w-2xl pt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-emerald-400
          border border-emerald-500/20 bg-emerald-500/5 mb-6 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for work
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 animate-fade-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <span className="text-white">Danish Ata</span>
          <br />
          <span className="gradient-text-vibrant">Mahendra</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-4 min-h-[1.6em] animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          {role}<span className="inline-block w-[3px] h-5 bg-indigo-400 ml-1 animate-blink align-middle" />
        </p>

        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          I craft digital experiences with clean code and modern tech.
          Building things that matter, one commit at a time.
        </p>

        <div className="flex gap-3 justify-center flex-wrap animate-fade-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <a href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white
              text-sm font-medium no-underline transition-all duration-300
              hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/20
              hover:shadow-indigo-500/30">
            <i className="fa-solid fa-arrow-down" /> View Projects
          </a>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-zinc-300 text-sm no-underline
              transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-y-0.5
              hover:shadow-lg hover:shadow-white/5">
            <i className="fa-solid fa-envelope" /> Contact
          </a>
          <button onClick={toggleTerminal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-zinc-300
              text-sm cursor-pointer transition-all duration-300
              hover:bg-white/10 hover:text-white hover:-translate-y-0.5">
            <i className="fa-solid fa-terminal" /> Console
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
        <svg width="20" height="30" viewBox="0 0 20 30" className="text-indigo-400/50">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="10" cy="10" r="2" fill="currentColor" className="animate-blink" />
        </svg>
      </div>
    </section>
  )
}