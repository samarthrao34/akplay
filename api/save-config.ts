import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

const MAX_CONFIG_SIZE = 512 * 1024; // 512KB max

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = req.body;

    // Validate the config has expected structure
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'Invalid config format' });
    }
    if (!Array.isArray(config.texts) || !Array.isArray(config.videos)) {
      return res.status(400).json({ error: 'Config must contain texts and videos arrays' });
    }

    const configStr = JSON.stringify(config);

    // Prevent excessively large payloads
    if (configStr.length > MAX_CONFIG_SIZE) {
      return res.status(413).json({ error: 'Config too large' });
    }

    await put('site-config.json', configStr, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
