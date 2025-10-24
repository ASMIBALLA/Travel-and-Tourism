"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Clock,
  Play,
  Camera,
  Sparkles,
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils" // optional; if you don't have cn, remove cn(...) usages or implement one

interface MonasteryCardProps {
  title: string
  location: string
  duration: string
  image: string
  tags: string[]
  description?: string
}

export function MonasteryCard({ title, location, duration, image, tags, description }: MonasteryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // modal + 360/video state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showYouTube, setShowYouTube] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // ---------- Image mapping (cover + 360 + video) ----------
  const getImageForTour = (title: string) => {
    if (title.includes("Rumtek")) {
      return "/beautiful-himalayan-monastery-with-golden-roofs-an.jpg"
    } else if (title.includes("Pemayangtse")) {
      return "/ancient-tibetan-monastery-interior-with-wooden-scu.jpg"
    } else if (title.includes("Tashiding")) {
      return "/colorful-tibetan-festival-with-monks-in-traditiona.jpg"
    }
    return image
  }

  const get360Image = (title: string) => {
    if (title.includes("Rumtek")) return "/img1.jpg"
    if (title.includes("Pemayangtse")) return "/img2.jpg"
    if (title.includes("Tashiding")) return "/img3.jpg"
    return "/360-monastery-view.jpg" // default
  }

  const getYouTubeUrl = (title: string) => {
    if (title.includes("Rumtek")) {
      return "https://www.youtube.com/embed/3f-7Gxsg7s8?autoplay=1&rel=0"
    } else if (title.includes("Pemayangtse")) {
      return "https://www.youtube.com/embed/BP3VqOmmgqs?autoplay=1&rel=0"
    } else if (title.includes("Tashiding")) {
      return "https://www.youtube.com/embed/EoJScAcAGsQ?autoplay=1&rel=0"
    }
    return "" // no video
  }

  // ---------- Open/Close / toggles ----------
  const openTour = () => {
    setIsModalOpen(true)
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setImageLoaded(false)
    setShowYouTube(false)
  }

  const closeTour = () => {
    setIsModalOpen(false)
    setImageLoaded(false)
    setShowYouTube(false)
  }

  const showYouTubeVideo = () => setShowYouTube(true)
  const show360View = () => setShowYouTube(false)

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3))
  const zoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5))

  // ---------- Mouse handlers for canvas ----------
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastMouse.x
    const deltaY = e.clientY - lastMouse.y
    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360,
    }))
    setLastMouse({ x: e.clientX, y: e.clientY })
  }
  const handleMouseUp = () => setIsDragging(false)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)))
  }

  // ---------- Canvas draw (simple panoramic pan/zoom) ----------
  useEffect(() => {
    if (!isModalOpen || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    const drawSimplified = (image: HTMLImageElement) => {
      if (!ctx) return
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const viewWidth = width / zoom
      const viewHeight = height / zoom

      const srcX = ((rotation.y + 180) / 360) * image.width - viewWidth / 2
      const srcY = ((rotation.x + 90) / 180) * image.height - viewHeight / 2

      const clampedSrcX = Math.max(0, Math.min(image.width - viewWidth, srcX))
      const clampedSrcY = Math.max(0, Math.min(image.height - viewHeight, srcY))

      ctx.drawImage(
        image,
        clampedSrcX,
        clampedSrcY,
        Math.min(viewWidth, image.width),
        Math.min(viewHeight, image.height),
        0,
        0,
        width,
        height
      )

      // subtle vignette for immersion
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      )
      gradient.addColorStop(0, "rgba(0,0,0,0)")
      gradient.addColorStop(1, "rgba(0,0,0,0.3)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    img.onload = () => {
      setImageLoaded(true)
      drawSimplified(img)
      imageRef.current = img
    }

    img.onerror = () => {
      console.error("Failed to load 360° image:", get360Image(title))
      setImageLoaded(true)
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#bbb"
      ctx.font = "16px system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("360° image failed to load.", canvas.width / 2, canvas.height / 2)
    }

    img.src = get360Image(title)
    // re-draw when rotation/zoom change (after image has loaded)
    // NOTE: we redraw by re-triggering this effect; for smoother perf you can store img and call drawSimplified(img) in a separate effect keyed on rotation/zoom.
  }, [isModalOpen, rotation, zoom, title])

  // If you want smoother redraws without reloading image:
  useEffect(() => {
    const img = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!isModalOpen || !img || !canvas || !ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    const viewWidth = width / zoom
    const viewHeight = height / zoom
    const srcX = ((rotation.y + 180) / 360) * img.width - viewWidth / 2
    const srcY = ((rotation.x + 90) / 180) * img.height - viewHeight / 2
    const clampedSrcX = Math.max(0, Math.min(img.width - viewWidth, srcX))
    const clampedSrcY = Math.max(0, Math.min(img.height - viewHeight, srcY))

    ctx.drawImage(
      img,
      clampedSrcX,
      clampedSrcY,
      Math.min(viewWidth, img.width),
      Math.min(viewHeight, img.height),
      0,
      0,
      width,
      height
    )

    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    )
    gradient.addColorStop(0, "rgba(0,0,0,0)")
    gradient.addColorStop(1, "rgba(0,0,0,0.3)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }, [rotation, zoom, isModalOpen])

  return (
    <>
      {/* Card */}
      <Card
        className="group overflow-hidden bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img
            src={getImageForTour(title) || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Camera className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-secondary/90 text-white backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              360° Tour
            </Badge>
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in-up">
              <Button
                size="lg"
                className="bg-white/90 text-primary hover:bg-white shadow-lg"
                onClick={openTour}
              >
                <Play className="w-5 h-5 mr-2" />
                Open Tour
              </Button>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-bold text-xl mb-2 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {duration}
            </div>
          </div>

          {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>}

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] m-2">
            {/* Close */}
            <Button
              onClick={closeTour}
              className="absolute top-2 right-2 z-10 bg-white/90 text-black hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Controls (right) */}
            <div className="absolute top-2 right-14 z-10 flex gap-2">
              {!showYouTube ? (
                <>
                  <Button
                    onClick={() => (getYouTubeUrl(title) ? showYouTubeVideo() : null)}
                    className={cn(
                      "rounded-full w-10 h-10 p-0 shadow-lg",
                      getYouTubeUrl(title) ? "bg-red-600/90 text-white hover:bg-red-600" : "bg-gray-400 text-white cursor-not-allowed"
                    )}
                    title={getYouTubeUrl(title) ? "Watch Video" : "No video available"}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={resetView}
                    className="bg-white/90 text-black hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg"
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={zoomIn}
                    className="bg-white/90 text-black hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={zoomOut}
                    className="bg-white/90 text-black hover:bg-white rounded-full w-10 h-10 p-0 shadow-lg"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={show360View}
                  className="bg-blue-600/90 text-white hover:bg-blue-600 rounded-full w-10 h-10 p-0 shadow-lg"
                  title="Back to 360° View"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Title (left) */}
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-white/80 text-sm">{location}</p>
            </div>

            {/* Body */}
            {!showYouTube ? (
              <>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={1000}
                    height={700}
                    className="cursor-grab active:cursor-grabbing w-full h-full object-contain"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  />
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white text-sm text-center">
                    Click and drag to look around • Scroll to zoom • Use ➡ for video tour
                  </p>
                </div>

                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-20">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Loading 360° view...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeUrl(title)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${title} Video Tour`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
