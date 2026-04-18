import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const stats = [
  { value: 50, suffix: "М+", label: "Треков в базе", icon: "Music" },
  { value: 1200, suffix: "+", label: "Источников музыки", icon: "Globe" },
  { value: 2, suffix: "М+", label: "Пользователей", icon: "Users" },
  { value: 99, suffix: "%", label: "Бесплатно навсегда", icon: "Heart" },
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, start])
  return count
}

function StatCard({ value, suffix, label, icon, animate }: { value: number; suffix: string; label: string; icon: string; animate: boolean }) {
  const count = useCountUp(value, 1800, animate)
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
      <Icon name={icon as "Music"} size={28} className="text-violet-400 mb-3" />
      <div className="text-4xl font-extrabold text-white font-orbitron">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-sm mt-1 text-center">{label}</div>
    </div>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
