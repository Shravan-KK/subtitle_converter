import { NextResponse } from 'next/server';
import { SarvamAIClient } from 'sarvamai';

export async function POST(request) {
  try {
    const { text, language } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY is not configured' }, { status: 500 });
    }

    const client = new SarvamAIClient({ token: apiKey });

    // Since SRT files have timestamps and formatting, the chat completion model is 
    // perfect because we can instruct it to strictly preserve the SRT structure.
    const response = await client.chat.completions({
      model: "sarvam-105b-conversations",
      messages: [
        { 
          role: "system", 
          content: `You are a professional subtitle translator. Translate the following .srt file text into ${language}. 
          CRITICAL INSTRUCTIONS:
          1. Do NOT change the subtitle sequence numbers (1, 2, 3...).
          2. Do NOT change the timestamps (e.g. 00:00:01,000 --> 00:00:04,000).
          3. ONLY translate the actual dialogue text.
          4. Output ONLY the translated valid SRT format, with no markdown code blocks, intro, or outro text.` 
        },
        { 
          role: "user", 
          content: text 
        }
      ]
    });

    let translatedText = response.choices[0].message.content;
    // Clean up markdown formatting if the model still outputs it
    translatedText = translatedText.replace(/^```srt\n?/m, '').replace(/^```\n?/m, '').replace(/```$/m, '');

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to translate' }, { status: 500 });
  }
}
