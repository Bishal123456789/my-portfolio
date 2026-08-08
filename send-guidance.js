import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.OWNER_EMAIL,
      reply_to: email,
      subject: `Guidance question from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not send. Try again.' });
  }
}
