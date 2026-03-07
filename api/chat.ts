import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const MAX_BODY_SIZE = 4 * 1024 * 1024; // 4MB max request

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  const { systemInstruction, contents } = req.body ?? {};

  if (!systemInstruction || typeof systemInstruction !== 'string') {
    return res.status(400).json({ error: 'systemInstruction is required' });
  }
  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'contents array is required' });
  }

  // Basic size check
  const bodySize = JSON.stringify(req.body).length;
  if (bodySize > MAX_BODY_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }

  // Limit conversation history depth
  if (contents.length > 50) {
    return res.status(400).json({ error: 'Conversation too long, please start a new chat' });
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    return res.status(200).json({ text });
  } catch (e: any) {
    console.error('Gemini API error:', e);
    if (e?.status === 429) {
      return res.status(429).json({ error: 'Rate limited, please try again shortly' });
    }
    return res.status(500).json({ error: 'AI request failed' });
  }
}
