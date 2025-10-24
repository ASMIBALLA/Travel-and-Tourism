// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// System prompt to guide the AI's responses
const SYSTEM_PROMPT = `You are an AI Heritage Guide specializing in Sikkim's monasteries and Buddhist culture. You have deep knowledge about:

- Sikkim's major monasteries: Rumtek, Pemayangtse, Tashiding, Enchey, Do-drul Chorten, Dubdi, etc.
- Buddhist festivals and ceremonies like Bumchu, Saga Dawa, Losar, Phang Lhabsol
- Cultural etiquette and traditions
- Best visiting times and travel tips  
- Historical significance and architectural details
- Meditation practices and spiritual aspects
- Local legends and stories
- Practical information like permits, accessibility, accommodation

Guidelines for responses:
- Be friendly, informative, and enthusiastic about Sikkim's heritage
- Keep responses concise but comprehensive (2-4 sentences typically)
- Focus on practical information mixed with cultural insights
- Use engaging storytelling when appropriate
- If asked about non-Sikkim topics, gently redirect while being helpful
- Always encourage cultural respect and responsible tourism
- Share interesting historical details and local perspectives

Respond as if you're a knowledgeable local guide who deeply loves and respects Sikkim's Buddhist heritage.`

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    })

    // Build conversation context
    let conversationContext = ""
    if (conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .map((msg: any) => `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}`)
        .join('\n')
      conversationContext += '\n'
    }

    // Create the full prompt
    const fullPrompt = conversationContext + `User: ${message}`

    // Generate response
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('Empty response from Gemini API')
    }

    return NextResponse.json({ 
      response: text.trim(),
      success: true 
    })

  } catch (error: any) {
    console.error('Gemini API Error:', error)
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API authentication failed' },
        { status: 401 }
      )
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}