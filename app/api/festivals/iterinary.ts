import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userPreference } = await req.json();
    if (!userPreference) {
      return NextResponse.json(
        { itinerary: "Please provide a preference." },
        { status: 400 }
      );
    }

    const prompt = `
You are a travel assistant for Sikkim. A user says: "${userPreference}".
Create a detailed itinerary for the day including:
- Morning activities (with average time spent)
- Lunch suggestions (with nearby restaurants)
- Afternoon activities or festivals
- Evening suggestions
Make it easy to read in blocks, include times, locations, and activity descriptions.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateText",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          candidate_count: 1,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ itinerary: error.error?.message || "Error" }, { status: response.status });
    }

    const data = await response.json();
    const itinerary = data.candidates?.[0]?.output?.text?.trim() || "No itinerary generated.";

    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ itinerary: "Failed to generate itinerary." }, { status: 500 });
  }
}
