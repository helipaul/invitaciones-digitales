"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

export function AnimatedSection({ children, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    setReady(true)
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${
        !ready ? "" : inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  )
}
