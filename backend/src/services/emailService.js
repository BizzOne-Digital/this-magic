import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendLeadNotification = async (lead) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping admin notification email');
    return;
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00B7C7;">New Lead — This Magic Moment</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.email}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Event Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.eventType}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Event Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.eventLocation || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guest Count:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.guestCount || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Services:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.interestedServices?.join(', ') || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Heard About Us:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.hearAboutUs || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.message}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Submitted at ${new Date().toLocaleString()}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Inquiry: ${lead.eventType} — ${lead.name}`,
    html,
  });
};

export const sendCustomerConfirmation = async (lead) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping customer confirmation email');
    return;
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00B7C7;">Thank You, ${lead.name}!</h2>
      <p>We've received your inquiry for your <strong>${lead.eventType}</strong> and we're excited to learn more about your celebration!</p>
      <p>Adam Aronow will personally review your message and get back to you within 24 hours to discuss availability, packages, and how we can make your event truly unforgettable.</p>
      <p>In the meantime, feel free to follow us on social media for inspiration from recent events:</p>
      <p>
        Instagram: <a href="https://instagram.com/this_magic_moment_nj">@this_magic_moment_nj</a><br>
        Facebook: Adam Aronow
      </p>
      <p style="color: #666;">— The This Magic Moment Team<br>
      📞 732-829-2344 | ✉️ djadam@thismagicmomentnj.com</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: lead.email,
    subject: 'We Received Your Inquiry — This Magic Moment',
    html,
  });
};
