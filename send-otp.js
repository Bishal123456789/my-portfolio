import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function sign(payload) {
  const secret = process.env.OTP_SECRET;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, purpose, mobile } = req.body || {};
  if (!name || !email || !purpose) {
    return res.status(400).json({ error: 'Name, email, and purpose are required' });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = JSON.stringify({ email, otp, exp });
  const encodedPayload = Buffer.from(payload).toString('base64');
  const signature = sign(encodedPayload);
  const token = `${encodedPayload}.${signature}`;

  try {
    // Send OTP to the visitor
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your verification code',
      html: `<p>Your code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });

    // Notify site owner — this doubles as the download log
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: `Resume download request — ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Purpose:</strong> ${purpose}</p>
             <p><strong>Mobile:</strong> ${mobile || 'not provided'}</p>
             <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`,
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not send the code. Try again.' });
  }
}
