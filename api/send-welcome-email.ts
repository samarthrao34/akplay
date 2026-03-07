import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'akplay@akproductionhouse.in',
      pass: process.env.HOSTINGER_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"AKPLAY" <akplay@akproductionhouse.in>',
    to: email,
    subject: 'Welcome to AKPLAY! 🎬',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <div style="background: linear-gradient(135deg, #E62429, #ff333a); padding: 40px 30px; text-align: center;">
          <h1 style="color: #fff; font-size: 32px; margin: 0; letter-spacing: 2px;">AKPLAY</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Your Entertainment, Your Way</p>
        </div>
        <div style="padding: 36px 30px; color: #e0e0e0;">
          <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px;">Hey ${name}! 👋</h2>
          <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px; color: #b0b0b0;">
            Welcome to <strong style="color: #E62429;">AKPLAY</strong> — we're thrilled to have you on board!
          </p>
          <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px; color: #b0b0b0;">
            Get ready to explore our exclusive content library, original web series, and a vibrant community of creators and viewers.
          </p>
          <div style="background: #151515; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #222;">
            <p style="font-size: 14px; color: #999; margin: 0 0 12px;">Here's what you can do next:</p>
            <ul style="font-size: 14px; color: #ccc; padding-left: 18px; margin: 0; line-height: 2;">
              <li>🎥 Browse our video library</li>
              <li>👤 Set up your profile</li>
              <li>⭐ Subscribe for premium content</li>
              <li>💬 Join the community</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 32px 0 8px;">
            <a href="https://akplay.in" style="display: inline-block; background: linear-gradient(135deg, #E62429, #ff333a); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: bold; font-size: 15px;">
              Start Watching →
            </a>
          </div>
        </div>
        <div style="padding: 20px 30px; text-align: center; border-top: 1px solid #222;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            © ${new Date().getFullYear()} AKPLAY by AK Production House. All rights reserved.
          </p>
          <p style="font-size: 11px; color: #555; margin: 8px 0 0;">
            This email was sent to ${email} because you signed up on AKPLAY.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Email send failed:', e);
    return res.status(500).json({ error: 'Failed to send welcome email' });
  }
}
