"use client"

import { useEffect, useState } from "react"

export function WaterBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-60 dark:opacity-40">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="wave-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.2" />
            </linearGradient>

            <radialGradient id="bubble-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Flowing wave layers */}
          <path
            d="M0,400 Q300,320 600,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#wave-gradient-1)"
            style={{
              transform: `translateX(${mousePosition.x * 0.02}px) translateY(${Math.sin(Date.now() * 0.001) * 10}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />

          <path
            d="M0,500 Q400,420 800,500 T1200,500 L1200,800 L0,800 Z"
            fill="url(#wave-gradient-2)"
            style={{
              transform: `translateX(${-mousePosition.x * 0.015}px) translateY(${Math.sin(Date.now() * 0.0008 + 1) * 15}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />

          {/* Floating elements */}
          <circle
            cx="200"
            cy="300"
            r="40"
            fill="url(#bubble-gradient)"
            style={{
              transform: `translateX(${mousePosition.x * 0.03}px) translateY(${mousePosition.y * 0.02 + Math.sin(Date.now() * 0.002) * 20}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <circle
            cx="800"
            cy="200"
            r="60"
            fill="url(#bubble-gradient)"
            style={{
              transform: `translateX(${-mousePosition.x * 0.025}px) translateY(${mousePosition.y * 0.015 + Math.sin(Date.now() * 0.0015 + 2) * 25}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        </svg>
      </div>

      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const size = Math.random() * 8 + 3
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 4

          return (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 dark:bg-cyan-400/20"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                transform: `translateX(${(mousePosition.x - 50) * 0.05}px) translateY(${(mousePosition.y - 50) * 0.03}px)`,
                transition: "transform 0.3s ease-out",
              }}
            />
          )
        })}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
