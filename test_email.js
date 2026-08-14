const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing SMTP with settings:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const mailOptions = {
  from: `"Path Guider Test" <${process.env.SMTP_USER}>`,
  to: 'sahooamar569@gmail.com',
  subject: 'Test Email from Path Guider',
  text: 'This is a test email to verify SMTP configuration.'
};

transporter.sendMail(mailOptions)
  .then(info => {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  })
  .catch(err => {
    console.error('❌ Email sending failed:');
    console.error(err);
  });
