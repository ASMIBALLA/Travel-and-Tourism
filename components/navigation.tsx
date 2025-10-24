"use client"

import { Button } from "@/components/ui/button"
import { Mountain, Menu, Globe } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Mountain className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Monastery360</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#tours" className="text-foreground hover:text-primary transition-colors font-medium">
              Tours
            </a>
            <a href="#map" className="text-foreground hover:text-primary transition-colors font-medium">
              Map
            </a>
            <a href="#festivals" className="text-foreground hover:text-primary transition-colors font-medium">
              Festivals
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 bg-transparent">
              <Globe className="w-4 h-4" />
              English
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              <a href="#tours" className="text-foreground hover:text-primary transition-colors font-medium">
                Tours
              </a>
              <a href="#map" className="text-foreground hover:text-primary transition-colors font-medium">
                Map
              </a>
              <a href="#festivals" className="text-foreground hover:text-primary transition-colors font-medium">
                Festivals
              </a>
              <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
                Community
              </a>
              <Button variant="outline" size="sm" className="flex items-center gap-2 w-fit bg-transparent">
                <Globe className="w-4 h-4" />
                English
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
