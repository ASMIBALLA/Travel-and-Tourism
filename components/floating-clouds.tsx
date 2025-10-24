"use client"

import { useEffect, useState } from "react"

interface Cloud {
  id: number
  size: number
  x: number
  y: number
  opacity: number
  duration: number
}

export function FloatingClouds() {
  const [clouds, setClouds] = useState<Cloud[]>([])

  useEffect(() => {
    const generateClouds = () => {
      const newClouds: Cloud[] = []
      for (let i = 0; i < 6; i++) {
        newClouds.push({
          id: i,
          size: Math.random() * 100 + 50,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 15,
        })
      }
      setClouds(newClouds)
    }

    generateClouds()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full bg-white/20 blur-xl animate-drift"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.id * 2}s`,
          }}
        />
      ))}
    </div>
  )
}
