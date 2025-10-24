"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, X, Send, Sparkles, Mountain, MapPin, Calendar, Users } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

// System prompt to guide the AI's responses
const SYSTEM_PROMPT = `You are an AI Heritage Guide specializing in Sikkim's monasteries and Buddhist culture. You have deep knowledge about:

- Sikkim's major monasteries: Rumtek, Pemayangtse, Tashiding, Enchey, Do-drul Chorten, etc.
- Buddhist festivals and ceremonies like Bumchu, Saga Dawa, Losar
- Cultural etiquette and traditions
- Best visiting times and travel tips
- Historical significance and architectural details
- Meditation practices and spiritual aspects

Respond in a friendly, informative manner. Keep responses concise but helpful (2-3 sentences typically). Focus on practical information mixed with cultural insights. If asked about non-Sikkim monastery topics, gently redirect back to Sikkim's heritage while still being helpful.`

export function AIHeritageGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chatbot opens
      setTimeout(() => {
        addBotMessage("Welcome to Sikkim's monasteries! I'm your AI Heritage Guide, ready to help you discover the rich Buddhist heritage of places like Rumtek, Pemayangtse, and Tashiding. What would you like to explore?")
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-6), // Send last 6 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || "I apologize, but I'm having trouble processing your request right now. Please try asking about Sikkim's monasteries again."
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      return "I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, I'd love to help you learn about Sikkim's beautiful monasteries!"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage = inputValue.trim()
    addUserMessage(userMessage)
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await callGeminiAPI(userMessage)
      addBotMessage(response)
    } catch (error) {
      addBotMessage("I apologize for the inconvenience. Please try your question again, and I'll do my best to help you explore Sikkim's monastery heritage!")
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = async (questionText: string) => {
    addUserMessage(questionText)
    setIsTyping(true)
    
    try {
      const response = await callGeminiAPI(questionText)
      addBotMessage(response)
    } catch (error) {
      addBotMessage("I apologize for the inconvenience. Please try your question again!")
    } finally {
      setIsTyping(false)
    }
  }

  const quickQuestions = [
    { icon: Mountain, text: "Tell me about Rumtek Monastery" },
    { icon: Calendar, text: "When is the best time to visit?" },
    { icon: Users, text: "What are the cultural etiquette rules?" },
    { icon: MapPin, text: "How do I plan my monastery route?" },
  ]

  return (
    <>
      {/* Floating AI Guide Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-xl animate-pulse-gentle group"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
          </div>
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
          <Card className="w-full max-w-md h-[600px] bg-white shadow-2xl border-0 animate-slide-in-up pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-secondary to-secondary/80 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Heritage Guide</h3>
                  <p className="text-sm text-muted-foreground">Explore Sikkim's monasteries</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-[400px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.isBot
                          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground"
                          : "bg-gradient-to-r from-secondary to-secondary/80 text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Questions */}
                {messages.length === 1 && !isTyping && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">Quick questions:</p>
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 border-primary/20"
                        onClick={() => handleQuickQuestion(question.text)}
                        disabled={isTyping}
                      >
                        <question.icon className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">{question.text}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about monasteries, festivals, or culture..."
                  className="flex-1 bg-white border-primary/20 focus:border-primary"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}