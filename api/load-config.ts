import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { blobs } = await list({ prefix: 'site-config' });
    if (blobs.length === 0) {
      return res.status(200).json(null);
    }
    const response = await fetch(blobs[0].url);
    const config = await response.json();
    return res.status(200).json(config);
  } catch {
    return res.status(200).json(null);
  }
}
