"use client"

import { Card } from "@/components/ui/card"
import { Camera, Calendar, Shield, Globe, Heart, Compass } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Immersive 360°",
    description: "Pan around sanctums, murals, and courtyards as if you're there.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Multilingual Guides",
    description: "Audio/text tours in English, Hindi, Nepali, and Dzongkha.",
    color: "text-secondary",
    link: "http://127.0.0.1:8080/index.html",  // Replace index.html if different entry file
    external: true,
  },
  {
    icon: Calendar,
    title: "Festival Calendar",
    description: "Track rituals, mask dances, and local events across monasteries.",
    color: "text-primary",
  },
  {
    icon: Compass,
    title: "Smart Search",
    description: "Find art styles, periods, and cultural contexts with instant results.",
    color: "text-secondary",
  },
  {
    icon: Heart,
    title: "Community Layer",
    description: "Monks, scholars, and locals can contribute stories and notes.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Ethical Access",
    description: "Respect guidelines with cultural-sensitivity prompts built-in.",
    color: "text-secondary",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">Why travelers love Monastery360</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to plan, learn, and experience with respect and ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 group animate-fade-in-up hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
