"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageCircle, Archive, ArrowRight, Heart } from "lucide-react"

const communityFeatures = [
  {
    icon: BookOpen,
    title: "Scholar Notes",
    description: "Peer-reviewed annotations on murals, inscriptions, and thangkas.",
    action: "Contribute",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    title: "Local Stories",
    description: "Interviews with monks, artisans, and residents—credited and archived.",
    action: "Contribute",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Archive,
    title: "Artifact Cards",
    description: "Structured entries with provenance, period, and restoration history.",
    action: "Contribute",
    color: "bg-primary/10 text-primary",
  },
]

export function CommunitySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">Community & Knowledge</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A respectful platform for sharing verified knowledge and lived memories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {communityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div
                  className={`inline-flex p-4 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>

                <h3 className="font-bold text-xl text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                <Button
                  variant="outline"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-all bg-transparent"
                >
                  {feature.action}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
