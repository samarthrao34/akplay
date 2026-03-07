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
    from: '"Samarth Rao — AKPLAY" <akplay@akproductionhouse.in>',
    to: email,
    subject: `Welcome aboard, ${name}! So glad you're here 🎬`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <div style="background: linear-gradient(135deg, #E62429, #ff333a); padding: 40px 30px; text-align: center;">
          <h1 style="color: #fff; font-size: 32px; margin: 0; letter-spacing: 2px;">AKPLAY</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Your Entertainment, Your Way</p>
        </div>
        <div style="padding: 36px 30px; color: #e0e0e0;">
          <h2 style="color: #fff; font-size: 22px; margin: 0 0 20px;">Hey ${name}! 👋</h2>
          <p style="font-size: 15px; line-height: 1.8; margin: 0 0 18px; color: #ccc;">
            I just wanted to personally drop in and say — <strong style="color: #fff;">welcome to AKPLAY!</strong> You have no idea how happy it makes me to see you join us.
          </p>
          <p style="font-size: 15px; line-height: 1.8; margin: 0 0 18px; color: #ccc;">
            We've been building this platform with a lot of love, late nights, and a dream to create something truly special for people like you. AKPLAY isn't just a streaming platform — it's a home for stories, creativity, and a community that genuinely cares.
          </p>
          <p style="font-size: 15px; line-height: 1.8; margin: 0 0 18px; color: #ccc;">
            Whether you're here to binge our original web series, discover new creators, or just vibe with the community — I promise you, you're in for something amazing.
          </p>
          <div style="background: #151515; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #222;">
            <p style="font-size: 14px; color: #999; margin: 0 0 12px;">Here's a few things you can start with:</p>
            <ul style="font-size: 14px; color: #ccc; padding-left: 18px; margin: 0; line-height: 2.2;">
              <li>🎥 Explore our video library — there's already some great stuff waiting</li>
              <li>👤 Set up your profile and make it yours</li>
              <li>⭐ Check out our subscription plans for the full experience</li>
              <li>💬 Jump into the community — say hi, we don't bite!</li>
              <li>🤖 Chat with <strong>Soni</strong>, our AI assistant — she knows everything about AKPLAY</li>
            </ul>
          </div>
          <p style="font-size: 15px; line-height: 1.8; margin: 0 0 18px; color: #ccc;">
            If you ever need anything or have ideas on how we can make AKPLAY even better — I'm all ears. Seriously, your feedback means the world to us.
          </p>
          <p style="font-size: 15px; line-height: 1.8; margin: 0 0 8px; color: #ccc;">
            Welcome to the family. Let's make something incredible together. ❤️
          </p>
          <div style="text-align: center; margin: 32px 0 28px;">
            <a href="https://akplay.in" style="display: inline-block; background: linear-gradient(135deg, #E62429, #ff333a); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: bold; font-size: 15px;">
              Start Exploring AKPLAY →
            </a>
          </div>
          <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 8px;">
            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 4px; color: #ccc;">
              Warm regards,
            </p>
            <p style="font-size: 17px; font-weight: bold; margin: 0 0 4px; color: #fff;">
              Samarth Rao
            </p>
            <p style="font-size: 13px; color: #E62429; margin: 0 0 2px; font-weight: 600;">
              Vice President & Technical Head
            </p>
            <p style="font-size: 13px; color: #888; margin: 0;">
              AK Production House
            </p>
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
