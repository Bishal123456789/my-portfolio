import crypto from 'crypto';

function sign(payload) {
  const secret = process.env.OTP_SECRET;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, otp } = req.body || {};
  if (!token || !otp) return res.status(400).json({ error: 'Missing code' });

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return res.status(400).json({ error: 'Invalid request' });

  const expectedSignature = sign(encodedPayload);
  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());

  if (Date.now() > payload.exp) {
    return res.status(400).json({ error: 'Code expired, request a new one' });
  }

  if (String(otp) !== String(payload.otp)) {
    return res.status(400).json({ error: 'Incorrect code' });
  }

  return res.status(200).json({ success: true });
}
