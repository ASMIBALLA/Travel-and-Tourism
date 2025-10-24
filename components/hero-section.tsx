"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Play, Mountain, Compass, Globe, Calendar } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center cloud-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          {/* Logo and brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Mountain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Monastery360</h1>
          </div>

          {/* Main heading */}
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Explore Sikkim's{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Monasteries
            </span>
          </h2>

          {/* Subheading with animated text */}
          <div className="text-xl md:text-2xl font-bold mb-4">
            <span
              className="
                bg-gradient-to-r from-neutral-900 via-neutral-800 to-black
                bg-clip-text text-transparent
                animate-[shimmer_2.5s_linear_infinite]
                bg-[length:200%_100%]
              "
            >
              360° tours, guides & festival calendar
            </span>
          </div>



          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A modern, multilingual gateway to art, history, and living traditions — designed for travelers, students,
            and researchers.
          </p>

          {/* Search and CTA */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search tours, places, or festivals..."
                className="pl-12 h-14 text-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start a tour
            </Button>
          </div>

          {/* Stats with better icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Mountain className="w-6 h-6 text-primary mr-2" />
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={25} suffix="+" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Monasteries</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Compass className="w-6 h-6 text-secondary mr-2" />
                <div className="text-3xl font-bold text-secondary">
                  <AnimatedCounter end={100} suffix="+" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">360° Tours</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-primary mr-2" />
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Festivals</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-secondary mr-2" />
                <div className="text-3xl font-bold text-secondary">
                  <AnimatedCounter end={4} />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
