const fs = require('fs');

// ── app.js upgrades ────────────────────────────────────────────────────────
let app = fs.readFileSync('app.js', 'utf8');

// 1. Upgrade VanillaTilt
app = app.replace(
  `VanillaTilt.init(document.querySelectorAll('.step-card, .service-card, .trust-card, .testi-card, .form-wrapper'), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      scale: 1.03
    });`,
  `VanillaTilt.init(document.querySelectorAll('.step-card, .service-card, .trust-card, .testi-card'), {
      max: 18, speed: 500, glare: true, "max-glare": 0.35, scale: 1.05, perspective: 1000
    });`
);

// 2. Add IntersectionObserver + free tools after VanillaTilt block
const revealCode = `

  // ── Scroll Reveal ─────────────────────────────────────────────────────────
  const _ro = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const _observe = () => document.querySelectorAll('.reveal, .reveal-blur').forEach(el => _ro.observe(el));
  _observe();

  // ── Free Spiritual Tools ──────────────────────────────────────────────────
  const _grid = document.getElementById('free-tools-grid');
  if (_grid) {
    const tools = [
      { icon:'✨', title:'Daily Horoscope', desc:'Your personalised astrological forecast for today.', url:'/horoscope/aries' },
      { icon:'♈', title:'Rashi (Zodiac)', desc:'Discover your Moon sign and what it reveals.', url:'/rashi' },
      { icon:'⭐', title:'Nakshatra', desc:'Your birth star and its cosmic guidance.', url:'/nakshatra' },
      { icon:'📿', title:'Mantra Guide', desc:'Sacred mantras chosen for your energy.', url:'/mantra' },
      { icon:'🟤', title:'Rudraksha Finder', desc:'Which Rudraksha bead aligns with your vibration.', url:'/rudraksha' },
      { icon:'💎', title:'Gemstone Guide', desc:'Lucky gemstones matched to your birth chart.', url:'/gemstone' },
      { icon:'🕉️', title:'Yantra Mastery', desc:'Sacred geometry for wealth, peace, and protection.', url:'/yantra' },
      { icon:'⏳', title:'Muhurat Timing', desc:'The most auspicious moment to begin anything new.', url:'/muhurat' },
      { icon:'🥥', title:'Puja Guide', desc:'Step-by-step rituals for Ganesh, Shiva, Lakshmi.', url:'/puja' },
      { icon:'🌈', title:'Chakra Healing', desc:'Balance your 7 energy centres for total wellness.', url:'/chakra' },
      { icon:'🧘', title:'Guided Meditation', desc:'Offline timers: 5, 10, and 20 minute sessions.', url:'/meditation/10' },
      { icon:'🌿', title:'Ayurveda Doshas', desc:'Find your body type — Vata, Pitta, or Kapha.', url:'/ayurveda' },
      { icon:'🎊', title:'Hindu Festivals', desc:'Upcoming major festival calendar for the year.', url:'/festivals' },
      { icon:'🌙', title:'Ekadashi Dates', desc:'All Ekadashi fasting dates — never miss one.', url:'/ekadashi' },
      { icon:'🍏', title:'Fasting Guide', desc:'Spiritual fasts and their health benefits explained.', url:'/fast' },
      { icon:'🪐', title:'Astrological Doshas', desc:'Check Mangal Dosha, Kaal Sarp, and Sade Sati.', url:'/dosha' },
      { icon:'🛕', title:'Temple Locator', desc:'Ancient and famous temples near you.', url:'/temples' },
      { icon:'❓', title:'Spiritual Quiz', desc:'Test your knowledge of sacred scriptures.', url:'/quiz' },
      { icon:'📖', title:'Daily Gita Verse', desc:'Begin each day with Lord Krishna\'s timeless wisdom.', url:'/daily-verse' },
    ];
    const delays = ['rd1','rd2','rd3'];
    _grid.innerHTML = tools.map((t,i) =>
      \`<div class="service-card reveal \${delays[i%3]}" onclick="window.location.href='\${t.url}'" title="\${t.title}">
        <div class="service-icon">\${t.icon}</div>
        <h3>\${t.title}</h3>
        <p>\${t.desc}</p>
      </div>\`
    ).join('');
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(_grid.querySelectorAll('.service-card'), { max:18, speed:500, glare:true, "max-glare":0.3, scale:1.05 });
    }
    _grid.querySelectorAll('.reveal').forEach(el => _ro.observe(el));
  }

`;

app = app.replace(
  `  // ── Signature Analysis Form Submission ──────────────────────`,
  revealCode + `  // ── Signature Analysis Form Submission ──────────────────────`
);

// 3. Pass email in deliver-free call
app = app.replace(
  `body: JSON.stringify({ name, traits, promoCode: appliedPromoCode })`,
  `body: JSON.stringify({ name, email, traits, promoCode: appliedPromoCode })`
);

// 4. Pass email in verify-and-deliver call
app = app.replace(
  `traits,\n                name\n              })`,
  `traits,\n                name,\n                email\n              })`
);

// 5. Premium Thank You card in displaySignatureResult
app = app.replace(
  `  let html = \`
    <h3 style="color:var(--gold-light); margin-bottom:1rem; font-size:1.8rem; font-family:'Cinzel',serif;">
      \${data.message}
    </h3>
    <p style="margin-bottom:2rem; font-size:1.1rem; line-height:1.6;">
      \${analysis.summary}
    </p>`,
  `  let html = \`
    <div style="background:linear-gradient(135deg,rgba(72,201,176,.1),rgba(72,201,176,.02));border:1px solid rgba(72,201,176,.3);padding:2rem 2.5rem;border-radius:20px;margin-bottom:2rem;text-align:center;">
      <div style="font-size:3rem;margin-bottom:.8rem;">✅</div>
      <h2 style="color:#48c9b0;margin-bottom:.6rem;font-family:'Cinzel',serif;font-size:1.7rem;">Report Unlocked!</h2>
      <p style="color:#f8fafc;font-size:1rem;margin-bottom:1rem;">Thank you, \${data.name || 'Seeker'}. Your premium analysis is ready below.</p>
      <p style="background:rgba(245,176,65,.1);display:inline-block;padding:.7rem 1.4rem;border-radius:10px;color:#fad7a1;font-size:.95rem;">
        ✉️ A detailed PDF has been sent to <strong>\${data.email || 'your email'}</strong>
      </p>
    </div>
    <h3 style="color:var(--gold-light); margin-bottom:1rem; font-size:1.8rem; font-family:'Cinzel',serif;">
      \${data.message}
    </h3>
    <p style="margin-bottom:2rem; font-size:1.1rem; line-height:1.6;">
      \${analysis.summary}
    </p>`
);

fs.writeFileSync('app.js', app, 'utf8');
console.log('app.js done');

// ── server.js: wire PDF + email ─────────────────────────────────────────────
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  `const { generatePDF } = require('./utils/pdfGenerator');`,
  `const { generatePDF, generateSignaturePDF } = require('./utils/pdfGenerator');`
);
server = server.replace(
  `const { sendEmail } = require('./utils/emailService');`,
  `const { sendEmail, sendSignatureEmail } = require('./utils/emailService');`
);

// deliver-free → async + PDF/email
server = server.replace(
  `app.post('/signature/deliver-free', (req, res) => {\n  const { name, traits, promoCode } = req.body;`,
  `app.post('/signature/deliver-free', async (req, res) => {\n  const { name, email, traits, promoCode } = req.body;`
);
server = server.replace(
  `  const analysis = analyzeSignature(traits);\n  res.json({\n    success: true,\n    paid: false,\n    payment_id: 'FREE_PROMO_' + promoCode.toUpperCase(),\n    name,\n    analysis,\n    message: \`🙏 Namaste \${name}! Your free Signature Analysis Report is ready.\`\n  });\n});`,
  `  const analysis = analyzeSignature(traits);\n  if (email) {\n    try { const buf = await generateSignaturePDF(name, traits, analysis); sendSignatureEmail(email, buf).catch(()=>{}); } catch(e){}\n  }\n  res.json({ success:true, paid:false, payment_id:'FREE_PROMO_'+promoCode.toUpperCase(), name, email, analysis, message:\`🙏 Namaste \${name}! Your free Signature Analysis is ready.\` });\n});`
);

// verify-and-deliver → async + PDF/email
server = server.replace(
  `app.post('/signature/verify-and-deliver', (req, res) => {\n  try {\n    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, traits, name } = req.body;`,
  `app.post('/signature/verify-and-deliver', async (req, res) => {\n  try {\n    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, traits, name, email } = req.body;`
);
server = server.replace(
  `    const analysis = analyzeSignature(traits);\n    res.json({\n      success: true,\n      paid: true,\n      payment_id: razorpay_payment_id,\n      name,\n      analysis,\n      message: \`🙏 Namaste \${name}! Your complete Signature Analysis Report is ready.\`,\n    });`,
  `    const analysis = analyzeSignature(traits);\n    if (email) {\n      try { const buf = await generateSignaturePDF(name, traits, analysis); sendSignatureEmail(email, buf).catch(()=>{}); } catch(e){}\n    }\n    res.json({ success:true, paid:true, payment_id:razorpay_payment_id, name, email, analysis, message:\`🙏 Namaste \${name}! Your complete Signature Analysis is ready.\` });`
);

fs.writeFileSync('server.js', server, 'utf8');
console.log('server.js done');

// ── pdfGenerator.js: add generateSignaturePDF ──────────────────────────────
let pdf = fs.readFileSync('utils/pdfGenerator.js', 'utf8');
pdf = pdf.replace(
  `module.exports = { generatePDF };`,
  `async function generateSignaturePDF(name, traits, analysis) {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50 });
      const bufs = [];
      doc.on('data', b => bufs.push(b));
      doc.on('end', () => resolve(Buffer.concat(bufs)));

      doc.fontSize(22).fillColor('#D4AF37').text('Path Guider — Premium Signature Analysis', { align: 'center' });
      doc.moveDown();
      doc.fontSize(13).fillColor('#555').text('Prepared For: ' + (name||'Seeker'));
      doc.text('Date: ' + new Date().toLocaleDateString('en-IN'));
      doc.moveDown(2);

      const section = (title, text) => {
        if (!text) return;
        doc.fontSize(14).fillColor('#D4AF37').text(title);
        doc.moveDown(0.4);
        doc.fontSize(11).fillColor('#333').text(text, { align:'justify' });
        doc.moveDown(1.5);
      };

      section('Destiny & Fortune', analysis.destiny);
      section('Deep Personality', analysis.personality);
      section('Love & Relationships', analysis.love);

      doc.addPage();
      doc.fontSize(14).fillColor('#000').text('Your Signature Stroke Profile', { underline: true });
      doc.moveDown();
      doc.fontSize(11).fillColor('#444');
      doc.text('Size: ' + (traits.size_vs_writing||'-'));
      doc.text('Slant: ' + (traits.slant_direction||'-'));
      doc.text('Underline: ' + (traits.underline||'-'));
      doc.text('Legibility: ' + (traits.legibility||'-'));

      doc.end();
    } catch(err) { reject(err); }
  });
}

module.exports = { generatePDF, generateSignaturePDF };`
);
fs.writeFileSync('utils/pdfGenerator.js', pdf, 'utf8');
console.log('pdfGenerator.js done');

// ── emailService.js: add sendSignatureEmail ─────────────────────────────────
let email = fs.readFileSync('utils/emailService.js', 'utf8');
email = email.replace(
  `module.exports = { sendEmail };`,
  `async function sendSignatureEmail(userEmail, pdfBuffer) {
  const nodemailer = require('nodemailer');
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST||'smtp.gmail.com', port: process.env.SMTP_PORT||587, secure:false,
    auth: { user: process.env.SMTP_USER||'', pass: process.env.SMTP_PASS||'' }
  });
  await t.sendMail({
    from: '"Path Guider" <' + (process.env.SMTP_USER||'noreply@pathguider.com') + '>',
    to: userEmail,
    subject: 'Your Premium Signature Analysis Report \u2014 Path Guider \uD83D\uDD8B\uFE0F',
    html: '<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2 style="color:#D4AF37">\uD83D\uDD8B\uFE0F Your Report is Ready!</h2><p>Thank you for choosing Path Guider.</p><p>Your <strong>Premium Signature Analysis</strong> is attached as a PDF.</p><p style="margin-top:20px">May the universe guide you always,<br><strong>Path Guider Team</strong></p></div>',
    attachments: [{ filename:'Path_Guider_Signature_Analysis.pdf', content:pdfBuffer, contentType:'application/pdf' }]
  });
}

module.exports = { sendEmail, sendSignatureEmail };`
);
fs.writeFileSync('utils/emailService.js', email, 'utf8');
console.log('emailService.js done');

// ── Legal Pages ──────────────────────────────────────────────────────────────
const legalDir = 'legal';
if (!require('fs').existsSync(legalDir)) fs.mkdirSync(legalDir);

const legalTemplate = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} | Path Guider</title>
  <link rel="stylesheet" href="../style.css">
  <style>
    body{background:#020205;color:#e8e8f0;font-family:'Inter',sans-serif;padding:6rem 1.5rem 3rem}
    .legal-box{max-width:760px;margin:0 auto;background:rgba(255,255,255,.03);border:1px solid rgba(245,176,65,.15);border-radius:20px;padding:3rem}
    a.back{color:#f5b041;text-decoration:none;display:inline-block;margin-bottom:2rem;font-size:.9rem}
    h1{font-family:'Cinzel',serif;color:#fad7a1;margin-bottom:2rem;font-size:1.8rem}
    h2{color:#f5b041;margin:1.8rem 0 .6rem;font-size:1.1rem}
    p{color:#aaa;line-height:1.8;font-size:.95rem}
  </style>
</head>
<body>
  <div class="legal-box">
    <a class="back" href="../index.html">&#8592; Back to Path Guider</a>
    <h1>${title}</h1>
    ${body}
  </div>
</body>
</html>`;

const pages = {
  'privacy-policy.html': ['Privacy Policy', `
    <h2>1. What We Collect</h2><p>We collect only the information you voluntarily provide — your name, date of birth, and email — solely to generate your personalised spiritual report.</p>
    <h2>2. How We Use It</h2><p>Your data is used exclusively to calculate your numerology reading and deliver your PDF report. We never sell or share your data with third-party advertisers.</p>
    <h2>3. Data Security</h2><p>All data is processed securely. We do not store raw payment information; all payments are handled by Razorpay under PCI-DSS compliance.</p>
    <h2>4. Contact</h2><p>For any privacy concerns, email us at support@pathguider.com.</p>`],
  'terms-conditions.html': ['Terms & Conditions', `
    <h2>1. Acceptance</h2><p>By using Path Guider, you agree to these terms. The spiritual insights provided are for personal reflection and entertainment purposes only.</p>
    <h2>2. Services</h2><p>Path Guider provides digital numerology and signature analysis reports. These do not constitute medical, legal, financial, or psychological advice.</p>
    <h2>3. Intellectual Property</h2><p>All content, algorithms, and designs on this platform are the intellectual property of Path Guider by Amar Visual Studio.</p>
    <h2>4. Changes</h2><p>We reserve the right to modify these terms at any time. Continued use of the platform implies acceptance of the updated terms.</p>`],
  'refund-policy.html': ['Refund & Cancellation Policy', `
    <h2>1. Digital Products</h2><p>Path Guider delivers instantly generated digital PDF reports. Due to the nature of digital goods, refunds are generally not offered once the report has been generated and delivered.</p>
    <h2>2. Exceptional Cases</h2><p>If you were charged but did not receive your report due to a technical error, please contact our support team within 7 days with your payment ID for a full refund or manual delivery.</p>
    <h2>3. Processing Time</h2><p>Approved refunds are returned to the original payment method within 5–7 business days.</p>
    <h2>4. Contact</h2><p>Email us at support@pathguider.com with subject line: REFUND REQUEST — [Your Payment ID].</p>`],
  'contact.html': ['Contact Us', `
    <h2>We are Here to Help</h2>
    <p>Have a question about your reading, a technical issue, or need support with your order? Reach out to us anytime.</p>
    <br>
    <p><strong>Email:</strong> support@pathguider.com</p>
    <p><strong>Platform:</strong> Path Guider by Amar Visual Studio</p>
    <p><strong>Support Hours:</strong> Monday &ndash; Saturday, 10:00 AM &ndash; 6:00 PM IST</p>
    <br>
    <p>We typically respond within 24 hours. For urgent payment issues, please include your Razorpay Payment ID in your email for faster resolution.</p>`]
};

for (const [file, [title, body]] of Object.entries(pages)) {
  fs.writeFileSync('legal/' + file, legalTemplate(title, body), 'utf8');
}
console.log('Legal pages created');

// cleanup
fs.unlinkSync('_upgrade.js');
console.log('\n All upgrades complete!');
