const nodemailer = require('nodemailer');

async function sendEmail(userEmail, pdfBuffer, packageType) {
  // Create a transporter using SMTP (e.g., Gmail, SendGrid, etc.)
  // Note: For Gmail, you would use an App Password, not your regular password.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  });

  const packageTitle = packageType === 'mastery' ? 'Complete Mastery' 
                     : packageType === 'advanced' ? 'Advanced' 
                     : 'Basic';

  const mailOptions = {
    from: `"Path Guider" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
    to: userEmail,
    subject: `Your ${packageTitle} Numerology Report is Here! 🔮`,
    text: `Hello!\n\nThank you for choosing Path Guider.\n\nPlease find your personalized ${packageTitle} analysis attached as a PDF document.\n\nMay the numbers guide you,\nPath Guider Team`,
    html: `
      <h2>Your Path Guider Analysis is Ready! 🔮</h2>
      <p>Thank you for choosing Path Guider.</p>
      <p>Please find your personalized <strong>${packageTitle}</strong> analysis attached to this email.</p>
      <br>
      <p>May the numbers guide you,<br>Path Guider Team</p>
    `,
    attachments: [
      {
        filename: 'Your_Numerology_Report.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendSignatureEmail(userEmail, pdfBuffer) {
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST||'smtp.gmail.com', port: process.env.SMTP_PORT||587, secure:false,
    auth: { user: process.env.SMTP_USER||'', pass: process.env.SMTP_PASS||'' }
  });
  await t.sendMail({
    from: '"Path Guider" <' + (process.env.SMTP_USER||'noreply@pathguider.com') + '>',
    to: userEmail,
    subject: 'Your Premium Signature Analysis Report — Path Guider 🖋️',
    html: '<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2 style="color:#D4AF37">🖋️ Your Report is Ready!</h2><p>Thank you for choosing Path Guider.</p><p>Your <strong>Premium Signature Analysis</strong> is attached as a PDF.</p><p style="margin-top:20px">May the universe guide you always,<br><strong>Path Guider Team</strong></p></div>',
    attachments: [{ filename:'Path_Guider_Signature_Analysis.pdf', content:pdfBuffer, contentType:'application/pdf' }]
  });
}

module.exports = { sendEmail, sendSignatureEmail };
