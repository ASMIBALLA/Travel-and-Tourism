"use client";

import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { MonasteryCard } from "@/components/monastery-card";
import { FeaturesSection } from "@/components/features-section";
import { FestivalCalendar } from "@/components/festival-calendar";
import { CommunitySection } from "@/components/community-section";
import { FloatingClouds } from "@/components/floating-clouds";
import { AIHeritageGuide } from "@/components/ai-heritage-guide";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ArrowRight, Mountain } from "lucide-react";

// Dynamic import of InteractiveMap with SSR disabled
const InteractiveMap = dynamic(() => import("@/components/interactive-map"), { ssr: false });

const featuredTours = [
  {
    title: "Rumtek Monastery 360° (Demo)",
    location: "Gangtok, East Sikkim",
    duration: "4-7 min",
    image: "/beautiful-himalayan-monastery-with-golden-roofs-an.jpg",
    tags: ["Kagyu", "Art", "360°"],
    description: "Seat of the Karma Kagyu lineage with exquisite thangka galleries.",
  },
  {
    title: "Pemayangtse Walkthrough (Demo)",
    location: "Pelling, West Sikkim",
    duration: "5-8 min",
    image: "/ancient-tibetan-monastery-interior-with-wooden-scu.jpg",
    tags: ["Nyingma", "Sculpture", "Guide"],
    description: "Home to the famed wooden 'Zangdok Palri' model and murals.",
  },
  {
    title: "Tashiding Festival Highlights (Demo)",
    location: "Gyalshing, West Sikkim",
    duration: "3-6 min",
    image: "/colorful-tibetan-festival-with-monks-in-traditiona.jpg",
    tags: ["Cham", "Festival", "Culture"],
    description: "Pilgrimage site known for Bumchu's sacred water ritual.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <FloatingClouds />
      <Navigation />
      <AIHeritageGuide />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Tours Section */}
      <section id="tours" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Featured 360° Tours</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Click a card to open an interactive panorama (demo content).
            </p>

            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input placeholder="Filter tours..." className="pl-12 h-12 bg-white shadow-lg border-0" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <MonasteryCard key={index} {...tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Interactive Map Section */}
      <section id="map" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <InteractiveMap />
        </div>
      </section>

      {/* Festival Calendar Section */}
      <section id="festivals" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <FestivalCalendar />
        </div>
      </section>

      {/* Community Section */}
      <section id="community">
        <CommunitySection />
      </section>

      {/* Plan Your Visit Section */}
      <section className="py-20 bg-gradient-to-br from-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Plan your visit with confidence</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Save tours, export calendars, and access offline guides.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Get the curated starter pack</h3>
                <p className="text-muted-foreground mb-6">
                  PDF guide • Map pins • Festival reminders • Etiquette checklist
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="bg-white shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg">
                  Explore Itinerary
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-primary/5 to-background border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Column 1: About */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Mountain className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">Monastery360</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A respectful digital gateway to Sikkim's monasteries. Prototype for demo purposes.
              </p>
            </div>

            {/* Column 2: Links + QR Code */}
            <div className="text-center">
              <h4 className="font-bold text-foreground mb-4">Links</h4>
              <div className="space-y-2 mb-8">
                <a href="#tours" className="block text-muted-foreground hover:text-primary transition-colors">
                  Tours
                </a>
                <a href="#map" className="block text-muted-foreground hover:text-primary transition-colors">
                  Map
                </a>
                <a href="#festivals" className="block text-muted-foreground hover:text-primary transition-colors">
                  Festivals
                </a>
                <a href="#community" className="block text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </div>

              {/* ✅ QR Image Section — right after links */}
              <div className="flex flex-col items-center mt-4">
                <a
                  href="/qr.jpg" // your QR image in /public
                  download
                  className="inline-block transition-transform hover:scale-105"
                  title="Scan or click to download"
                >
                  <img
                    src="/qr.jpg"
                    alt="QR code to download Monastery360 file"
                    className="w-32 h-32 rounded-lg shadow-md border border-border hover:shadow-lg"
                  />
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  Scan to download the file
                </p>
              </div>
            </div>

            {/* Column 3: Acknowledgments */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Acknowledgments</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Created for a tourism innovation concept. Respectful collaboration with licensed monasteries and
                cultural institutions.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Monastery360. Built with respect for Sikkim's sacred heritage.
            </p>
          </div>
        </div>
      </footer>


    </main>
  );
}
