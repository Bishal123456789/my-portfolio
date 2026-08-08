const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, purpose, mobile } = req.body || {};
  if (!name || !email || !purpose) {
    return res.status(400).json({ error: 'Name, email, and purpose are required' });
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: 'Resume request - ' + name,
      html: '<p><strong>Name:</strong> ' + name + '</p>' +
            '<p><strong>Email:</strong> ' + email + '</p>' +
            '<p><strong>Purpose:</strong> ' + purpose + '</p>' +
            '<p><strong>Mobile:</strong> ' + (mobile || 'not provided') + '</p>' +
            '<p><strong>Time:</strong> ' + new Date().toLocaleString() + '</p>',
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not send. Try again.' });
  }
};
