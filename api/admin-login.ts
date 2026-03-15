import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Use an environment variable for credentials, fallback to secure empty array
  // Format should be a JSON array of objects: [{"username": "...", "password": "..."}]
  let validCredentials = [];
  try {
    const credsEnv = process.env.ADMIN_CREDENTIALS;
    if (credsEnv) {
      validCredentials = JSON.parse(credsEnv);
    } else {
      console.warn("ADMIN_CREDENTIALS environment variable is not set. Admin login disabled.");
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }
  } catch (e) {
    console.error("Failed to parse ADMIN_CREDENTIALS environment variable", e);
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const validCred = validCredentials.find(
    (c: any) => c.username === username && c.password === password
  );

  if (validCred) {
    // Basic success response. In a full system, you'd issue a JWT here.
    return res.status(200).json({ success: true });
  } else {
    // Keep error generic to prevent username enumeration
    return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
  }
}
