const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { generatePDF, generateSignaturePDF } = require('./utils/pdfGenerator');
const { sendEmail, sendSignatureEmail } = require('./utils/emailService');
const { analyzeFacePhoto, generateAstrologyChart } = require('./utils/aiAnalyzer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getGitaWisdom } = require('./gitaWisdom');
const { getMantra } = require('./services/mantraData');
const { getNumerologyReading } = require('./services/numerologyCalc');
const { getMuhurat, ACTIVITIES } = require('./services/muhurat');
const { getPujaGuide, getAllPujas } = require('./services/pujaGuide');
const { getRashiByDate, getRashiByName, RASHIS } = require('./services/rashi');
const { getNakshatraByDob } = require('./services/nakshatra');
const { getRudraksha, getGemstone, getYantra } = require('./services/rudraksha_gem_yantra');
const { getDailyHoroscope, getLuckyDays, getBlockedChakra, getMeditationGuide, getDoshaReading, DOSHAS, getFastingGuide, getAllFasts } = require('./services/wellness_services');
const { FESTIVALS_2026, EKADASHIS_2026, DOSHAS_KUNDLI, TEMPLES, QUIZ_QUESTIONS } = require('./services/calendar_temple_quiz');
const { analyzeHandwriting, getTraitOptions } = require('./services/handwriting');
const { analyzeSignature, getSignatureOptions } = require('./services/signatureAnalysis');

dotenv.config();

// ── API KEY ROTATION ─────────────────────────────────────────────────────────
// Collects all GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3 ... from .env
// Tries each key in order — switches automatically when one hits quota
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean);
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-lite'];
console.log(`🔑 Loaded ${API_KEYS.length} Gemini API key(s) with ${GEMINI_MODELS.length} model fallback channels`);

const app = express();
app.use(cors());

// ── Raw body for Razorpay webhook signature verification ─────────────────────
app.use('/razorpay-webhook', express.raw({ type: 'application/json' }));

// JSON parser for all other routes
app.use((req, res, next) => {
  if (req.path === '/razorpay-webhook') return next();
  express.json({ limit: '10mb' })(req, res, next);
});

app.use(express.static(__dirname));       // Serve index.html, style.css, app.js etc.

// ── SITEMAP ───────────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// ── ROBOTS.TXT ────────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://path-guider-premium.vercel.app/sitemap.xml\n`);
});

// ── CLEAN URLs for HTML pages ─────────────────────────────────────────────────
app.get('/mobile-numerology', (req, res) => {
  res.sendFile(path.join(__dirname, 'mobile-numerology.html'));
});
app.get('/handwriting', (req, res) => {
  res.sendFile(path.join(__dirname, 'handwriting.html'));
});
app.get('/signature', (req, res) => {
  res.sendFile(path.join(__dirname, 'signature.html'));
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Cache to prevent duplicate email deliveries for the same order
const sentOrders = new Set();


// Prices for packages
const PACKAGES = {
  'basic': 4700, // ₹47 in paise
  'advanced': 9700, // ₹97 in paise
  'mastery': 12100 // ₹121 in paise
};

// Route to log a user (Lead Capture)
app.post('/log-user', (req, res) => {
  try {
    const { name, dob, gender, mobile, email } = req.body;
    const dateStr = new Date().toISOString();
    
    // Create CSV string
    const csvLine = `${dateStr},"${name}","${gender}","${dob}","${mobile}","${email}"\n`;
    
    const dbPath = path.join(__dirname, 'database.csv');
    
    // If file doesn't exist, create it with headers
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, 'Timestamp,Name,Gender,DOB,Mobile,Email\n');
    }
    
    // Append the row
    fs.appendFileSync(dbPath, csvLine);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error logging user:', err);
    res.status(500).json({ error: 'Failed to log' });
  }
});

// Route to create an order
app.post('/create-order', async (req, res) => {
  try {
    const { packageType, userDetails, promoCode } = req.body;
    
    if (!PACKAGES[packageType]) {
      return res.status(400).json({ error: 'Invalid package type' });
    }

    let amount = PACKAGES[packageType];
    
    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      const promo = PROMO_CODES[promoCode.toUpperCase()];
      if (promo.fixedPrice !== undefined) {
        amount = promo.fixedPrice * 100; // convert INR to paise
      } else if (promo.discountPercentage) {
        const discounted = amount - (amount * (promo.discountPercentage / 100));
        amount = Math.max(100, Math.round(discounted)); // min ₹1
      }
    }
    
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      // Store user details in notes — used by webhook for QR/UPI payments
      notes: {
        name       : userDetails?.name        || '',
        email      : userDetails?.email       || '',
        mobile     : userDetails?.mobile      || '',
        dob        : userDetails?.dob         || '',
        gender     : userDetails?.gender      || '',
        packageType: packageType              || 'basic',
      }
    };

    const order = await razorpay.orders.create(options);
    
    // We return the order ID to the frontend to initialize Razorpay Checkout
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route to verify payment and send PDF
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userDetails, packageType, readingData } = req.body;

    // ── Step 1: Verify Razorpay signature ───────────────────────────────────
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch for payment:', razorpay_payment_id);
      return res.status(400).json({ success: false, error: 'Payment verification failed. Please contact support.' });
    }

    // ── Step 2: Payment is VERIFIED — generate PDF & send email synchronously ─
    // On Vercel serverless, background IIFEs are killed after response is sent.
    // So we MUST send the email BEFORE responding to ensure delivery.
    console.log(`✅ Payment verified: ${razorpay_payment_id} | User: ${userDetails?.name} | Package: ${packageType}`);

    if (razorpay_order_id) {
      sentOrders.add(razorpay_order_id);
    }

    try {
      let faceAnalysisText = null;
      let astrologyAnalysisText = null;

      if (packageType === 'advanced' || packageType === 'mastery') {
        if (userDetails?.photoBase64) {
          faceAnalysisText = await analyzeFacePhoto(userDetails.photoBase64);
        }
      }

      if (packageType === 'mastery') {
        astrologyAnalysisText = await generateAstrologyChart(
          userDetails?.dob, userDetails?.tob, userDetails?.cob
        );
      }

      const pdfBuffer = await generatePDF(
        userDetails, packageType,
        readingData || userDetails,
        faceAnalysisText, astrologyAnalysisText
      );

      await sendEmail(userDetails?.email, pdfBuffer, packageType);
      console.log(`📧 Report emailed successfully to ${userDetails?.email}`);
      res.json({ success: true, message: 'Payment verified! Your PDF report has been emailed.' });
    } catch (emailErr) {
      console.error(`❌ PDF/Email error for ${razorpay_payment_id}:`, emailErr.message);
      // Payment WAS successful — just email failed. Still confirm success to user.
      res.json({ success: true, message: 'Payment verified! Report generation encountered an issue — our team will email you manually.' });
    }

  } catch (error) {
    console.error('Error in verify-payment:', error);
    res.status(500).json({ success: false, error: 'Server error. Payment may have succeeded — please contact support with your payment ID.' });
  }
});

// ── FREE REPORT DELIVERY (Testing Mode — No Payment Required) ─────────────────
app.post('/deliver-free-report', async (req, res) => {
  try {
    const { userDetails, packageType, readingData } = req.body;
    if (!userDetails || !userDetails.email) {
      return res.status(400).json({ success: false, error: 'User details and email are required.' });
    }
    console.log(`🆓 Free delivery: ${userDetails.name} | ${userDetails.email} | ${packageType}`);
    try {
      const pdfBuffer = await generatePDF(userDetails, packageType || 'basic', readingData || userDetails, null, null);
      await sendEmail(userDetails.email, pdfBuffer, packageType || 'basic');
      console.log(`📧 Free report emailed to ${userDetails.email}`);
      res.json({ success: true, message: 'Your PDF report has been emailed!' });
    } catch (err) {
      console.error('❌ Free report delivery error:', err.message);
      res.status(500).json({ success: false, error: 'Failed to generate or send report. Please try again.' });
    }
  } catch (error) {
    console.error('Error in deliver-free-report:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// Route to check payment status by order ID and automatically trigger PDF if paid
app.get('/check-payment-status', async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    console.log(`🔍 Checking payment status for order: ${orderId}`);
    const order = await razorpay.orders.fetch(orderId);
    console.log(`📊 Razorpay order ${orderId} status: ${order.status}`);

    let isPaid = order.status === 'paid';
    let capturedPayment = null;

    // Fallback: fetch all payments for this order and check for captured/authorized
    if (!isPaid) {
      try {
        const payments = await razorpay.orders.fetchPayments(orderId);
        if (payments && payments.items && payments.items.length > 0) {
          capturedPayment = payments.items.find(p => p.status === 'captured' || p.status === 'authorized');
          if (capturedPayment) {
            console.log(`✅ Found ${capturedPayment.status} payment for order ${orderId}`);
            isPaid = true;
          }
        }
      } catch (payErr) {
        console.error(`Error fetching payments for order ${orderId}:`, payErr.message);
      }
    }

    if (isPaid) {
      const notes = order.notes || {};
      const userEmail = notes.email || (capturedPayment && capturedPayment.email) || '';
      const userName  = notes.name  || 'Valued Customer';

      // ── CRITICAL: On Vercel serverless, we must send email SYNCHRONOUSLY
      // before sending response. Fire-and-forget IIFEs are killed after res.json().
      // We track delivery by checking if orderId was already handled this session.
      if (!sentOrders.has(orderId)) {
        sentOrders.add(orderId);

        const userDetails = {
          name  : userName,
          email : userEmail,
          mobile: notes.mobile || (capturedPayment && capturedPayment.contact) || '',
          dob   : notes.dob    || '',
          gender: notes.gender || '',
        };
        const packageType = notes.packageType || 'basic';

        if (notes.service === 'Signature Analysis' || notes.traits) {
          // Signature Analysis — deliver synchronously before responding
          try {
            const traits = JSON.parse(notes.traits);
            const analysis = analyzeSignature(traits);
            const pdfBuffer = await generateSignaturePDF(userName, traits, analysis);
            await sendSignatureEmail(userEmail, pdfBuffer);
            console.log(`📧 Signature Report emailed to ${userEmail}`);
          } catch (sigErr) {
            console.error('❌ Signature PDF/email error in check-status:', sigErr.message);
          }
        } else if (userEmail) {
          // Numerology — deliver synchronously before responding
          try {
            const pdfBuffer = await generatePDF(userDetails, packageType, userDetails, null, null);
            await sendEmail(userEmail, pdfBuffer, packageType);
            console.log(`📧 Numerology Report emailed to ${userEmail}`);
          } catch (bgErr) {
            console.error(`❌ Numerology PDF/email error for ${orderId}:`, bgErr.message);
          }
        }
      }

      // Generate signature analysis data for UI display
      let signatureAnalysis = null;
      if (notes.service === 'Signature Analysis' || notes.traits) {
        try {
          const traits = JSON.parse(notes.traits);
          signatureAnalysis = analyzeSignature(traits);
        } catch (e) {
          console.error('Error generating signature analysis in check-status:', e);
        }
      }

      return res.json({
        success : true,
        status  : 'paid',
        email   : userEmail,
        name    : userName,
        analysis: signatureAnalysis
      });
    } else {
      return res.json({ success: false, status: order.status });
    }
  } catch (error) {
    console.error('Error in check-payment-status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// ── RAZORPAY WEBHOOK (handles QR/UPI payment confirmations) ─────────────────
// This is called by Razorpay server-to-server when a payment is captured
// Set this URL in Razorpay Dashboard → Settings → Webhooks
// URL: https://path-guider-premium.vercel.app/razorpay-webhook
app.post('/razorpay-webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification');
  }
  const signature = req.headers['x-razorpay-signature'];
  
  let bodyBuffer = req.body;
  if (typeof req.body === 'string') {
    bodyBuffer = Buffer.from(req.body);
  } else if (!Buffer.isBuffer(req.body)) {
    bodyBuffer = Buffer.from(JSON.stringify(req.body));
  }

  // If webhook secret is configured, verify signature
  if (webhookSecret && signature) {
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyBuffer)
      .digest('hex');
    if (expectedSig !== signature) {
      console.error('❌ Webhook signature mismatch');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  // Always respond 200 quickly so Razorpay doesn't retry
  res.status(200).json({ status: 'ok' });

  try {
    const event = typeof req.body === 'object' && !Buffer.isBuffer(req.body)
      ? req.body
      : JSON.parse(bodyBuffer.toString());
      
    console.log('📣 Razorpay Webhook event:', event.event);

    // Handle payment captured (QR code / UPI / any payment)
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (!payment) return;

      const paymentId  = payment.id;
      const orderId    = payment.order_id;
      const amount     = payment.amount; // in paise
      const email      = payment.email;
      const contact    = payment.contact;
      const notes      = payment.notes || {};

      console.log(`✅ Webhook: Payment captured ${paymentId} | ₹${amount/100} | ${email}`);

      // Check if already processed
      if (orderId && sentOrders.has(orderId)) {
        console.log(`ℹ️ Webhook: Order ${orderId} already processed (sentOrders cache hit). Skipping.`);
        return;
      }
      if (orderId) {
        sentOrders.add(orderId);
      }

      // Check service type
      if (notes.service === 'Signature Analysis' || notes.traits) {
        // Handle Signature Analysis Payment
        try {
          const traits = JSON.parse(notes.traits);
          const analysis = analyzeSignature(traits);
          const pdfBuffer = await generateSignaturePDF(notes.name || 'Valued Customer', traits, analysis);
          await sendSignatureEmail(notes.email || email, pdfBuffer);
          console.log(`📧 Webhook: Signature Report emailed successfully to ${notes.email || email}`);
        } catch (sigErr) {
          console.error('❌ Webhook Signature PDF/email error:', sigErr.message);
        }
      } else {
        // Handle normal Numerology report payment
        const userDetails = {
          name    : notes.name    || payment.description || 'Valued Customer',
          email   : notes.email   || email,
          mobile  : notes.mobile  || contact,
          dob     : notes.dob     || '',
          gender  : notes.gender  || '',
        };
        const packageType = notes.packageType || 'basic';

        // Generate PDF and send email
        try {
          const pdfBuffer = await generatePDF(userDetails, packageType, userDetails, null, null);
          await sendEmail(userDetails.email, pdfBuffer, packageType);
          console.log(`📧 Webhook: Report emailed to ${userDetails.email}`);
        } catch (emailErr) {
          console.error('❌ Webhook PDF/email error:', emailErr.message);
        }
      }
    }
  } catch (parseErr) {
    console.error('❌ Webhook parse error:', parseErr.message);
  }
});


app.post('/gita-guidance', async (req, res) => {
  const { name, problem } = req.body;
  if (!name || !problem) return res.status(400).json({ error: 'Name and problem are required.' });

  // Pick a relevant verse using local matching engine
  const localResponse = getGitaWisdom(name, problem);

  // Parse the verse details from local engine
  const parseSection = (text, tag) => {
    const keys = ['SLOKA','REFERENCE','TRANSLITERATION','HINDI','ENGLISH','GUIDANCE'];
    const idx = keys.indexOf(tag);
    const startTag = `---${tag}---`;
    const nextKey = keys[idx + 1];
    const endTag = nextKey ? `---${nextKey}---` : null;
    const start = text.indexOf(startTag);
    if (start === -1) return '';
    const contentStart = start + startTag.length;
    const end = endTag ? text.indexOf(endTag, contentStart) : text.length;
    return text.slice(contentStart, end === -1 ? text.length : end).trim();
  };

  const sloka           = parseSection(localResponse, 'SLOKA');
  const reference       = parseSection(localResponse, 'REFERENCE');
  const transliteration = parseSection(localResponse, 'TRANSLITERATION');
  const localGuidance   = parseSection(localResponse, 'GUIDANCE');

  // Use Gemini to generate a proper, easy-to-understand explanation
  const prompt = `You are a wise Bhagavad Gita teacher. A seeker named ${name} has asked:
"${problem}"

The relevant Bhagavad Gita verse is:
Shloka (Sanskrit): ${sloka}
Reference: ${reference}
Transliteration: ${transliteration}

Please provide your response in EXACTLY this format with these exact tags:

---SLOKA---
${sloka}
---REFERENCE---
${reference}
---TRANSLITERATION---
${transliteration}
---HINDI---
इस श्लोक का सरल अर्थ यह है कि [write 3-4 sentences in simple Hindi explaining what this verse MEANS and what wisdom it gives. Write in plain conversational Hindi. Do NOT write Sanskrit words with dashes. Just explain the meaning simply.]
---ENGLISH---
[Write 3-4 sentences in simple, beautiful English explaining what this verse means and what wisdom it offers. Do NOT write words with dashes like 'kachchit—whether'. Just explain the meaning in plain English.]
---GUIDANCE---
${localGuidance}

CRITICAL: Hindi and English sections must be plain explanations in natural language. No Sanskrit word-by-word breakdowns. No 'word—meaning' format.`;

  let lastErr;
  for (const key of API_KEYS) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      // Sanity check: if response still contains word-by-word format, reject it
      const hindiSection = parseSection(aiText, 'HINDI');
      if (hindiSection.includes('—') && hindiSection.split('—').length > 3) {
        // Gemini returned word-by-word, try next key or fallback
        lastErr = new Error('Gemini returned word-by-word translation, retrying...');
        continue;
      }

      return res.json({ success: true, response: aiText, source: 'gemini' });
    } catch (err) {
      lastErr = err;
      // Try next key for quota errors, break for other errors
      if (!err.message?.includes('quota') && !err.message?.includes('429') && !err.message?.includes('retry')) {
        break;
      }
    }
  }

  // Gemini failed — build a clean fallback (NO word-by-word content from JSON)
  console.error('Gemini Gita error, building clean fallback:', lastErr?.message);

  const cleanFallback = `---SLOKA---
${sloka}
---REFERENCE---
${reference}
---TRANSLITERATION---
${transliteration}
---HINDI---
इस श्लोक में भगवान श्रीकृष्ण हमें यह सिखाते हैं कि जीवन में कर्म सबसे महत्वपूर्ण है। हमें अपने कर्तव्य का पालन पूरी निष्ठा और ईमानदारी से करना चाहिए, बिना फल की चिंता किए। जो व्यक्ति निस्वार्थ भाव से कार्य करता है, वह जीवन में सच्ची शांति और आनंद पाता है। यही गीता का सबसे बड़ा संदेश है — "कर्म करो, फल ईश्वर पर छोड़ दो।"
---ENGLISH---
In this verse, Lord Krishna teaches us one of the most profound lessons of life — that our duty is to act with sincerity and dedication, without being attached to the results. When we perform our actions selflessly, we free ourselves from anxiety and disappointment. True wisdom lies not in controlling outcomes, but in giving our best to whatever we do. This is the eternal teaching of the Bhagavad Gita: do your duty with full heart, and trust in the divine plan.
---GUIDANCE---
${localGuidance}`;

  return res.json({ success: true, response: cleanFallback, source: 'fallback' });
});


// ── DAILY GITA VERSE ───────────────────────────────────────────────────────────
app.get('/daily-verse', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'gita_full.json');
    const verses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Pick verse based on day of year so it changes daily
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const verse = verses[dayOfYear % verses.length];
    res.json({ success: true, verse });
  } catch (e) {
    res.status(500).json({ error: 'Could not load daily verse' });
  }
});

// ── MANTRA RECOMMENDATION ──────────────────────────────────────────────────────
app.post('/mantra', (req, res) => {
  const { problem } = req.body;
  if (!problem) return res.status(400).json({ error: 'Problem description required' });
  const mantra = getMantra(problem);
  res.json({ success: true, mantra });
});

// ── NUMEROLOGY CALCULATOR ──────────────────────────────────────────────────────
app.post('/numerology', (req, res) => {
  const { name, dob } = req.body;
  if (!name || !dob) return res.status(400).json({ error: 'Name and date of birth required' });
  const reading = getNumerologyReading(name, dob);
  res.json({ success: true, reading });
});

// ── MUHURAT FINDER ─────────────────────────────────────────────────────────────
app.post('/muhurat', (req, res) => {
  const { activity, date } = req.body;
  if (!activity) return res.status(400).json({ error: 'Activity type required' });
  const result = getMuhurat(activity, date);
  res.json({ success: true, muhurat: result });
});

app.get('/muhurat/activities', (req, res) => {
  const list = Object.entries(ACTIVITIES).map(([key, a]) => ({ key, name: a.name, icon: a.icon }));
  res.json({ success: true, activities: list });
});

// ── PUJA GUIDE ─────────────────────────────────────────────────────────────────
app.get('/puja', (req, res) => {
  res.json({ success: true, pujas: getAllPujas() });
});

app.get('/puja/:deity', (req, res) => {
  const guide = getPujaGuide(req.params.deity);
  if (!guide) return res.status(404).json({ error: 'Puja guide not found for this deity' });
  res.json({ success: true, guide });
});

// ── RASHI (ZODIAC) ────────────────────────────────────────────
app.post('/rashi', (req, res) => {
  const { dob, sign } = req.body;
  const r = dob ? getRashiByDate(dob) : sign ? getRashiByName(sign) : null;
  if (!r) return res.status(400).json({ error: 'Provide dob or sign' });
  res.json({ success: true, rashi: r });
});
app.get('/rashi/all', (req, res) => res.json({ success: true, rashis: RASHIS }));

// ── NAKSHATRA ─────────────────────────────────────────────────
app.post('/nakshatra', (req, res) => {
  const { dob } = req.body;
  if (!dob) return res.status(400).json({ error: 'DOB required' });
  res.json({ success: true, nakshatra: getNakshatraByDob(dob) });
});

// ── RUDRAKSHA ─────────────────────────────────────────────────
app.post('/rudraksha', (req, res) => {
  const { problem } = req.body;
  if (!problem) return res.status(400).json({ error: 'Problem required' });
  res.json({ success: true, rudraksha: getRudraksha(problem) });
});

// ── GEMSTONE ──────────────────────────────────────────────────
app.post('/gemstone', (req, res) => {
  const { lifePath } = req.body;
  if (!lifePath) return res.status(400).json({ error: 'Life path number required' });
  res.json({ success: true, gemstone: getGemstone(lifePath) });
});

// ── YANTRA ────────────────────────────────────────────────────
app.post('/yantra', (req, res) => {
  const { problem } = req.body;
  if (!problem) return res.status(400).json({ error: 'Problem required' });
  res.json({ success: true, yantra: getYantra(problem) });
});

// ── DAILY HOROSCOPE ───────────────────────────────────────────
app.get('/horoscope/:sign', (req, res) => {
  res.json({ success: true, horoscope: getDailyHoroscope(req.params.sign) });
});

// ── LUCKY DAY ─────────────────────────────────────────────────
app.get('/lucky-day/:lifePath', (req, res) => {
  res.json({ success: true, lucky: getLuckyDays(req.params.lifePath) });
});

// ── CHAKRA ────────────────────────────────────────────────────
app.post('/chakra', (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) return res.status(400).json({ error: 'Symptoms required' });
  res.json({ success: true, chakra: getBlockedChakra(symptoms) });
});

// ── MEDITATION ────────────────────────────────────────────────
app.get('/meditation/:minutes', (req, res) => {
  res.json({ success: true, guide: getMeditationGuide(req.params.minutes) });
});

// ── AYURVEDA DOSHA ────────────────────────────────────────────
app.post('/ayurveda', (req, res) => {
  const { vata = 0, pitta = 0, kapha = 0 } = req.body;
  res.json({ success: true, reading: getDoshaReading({ vata: Number(vata), pitta: Number(pitta), kapha: Number(kapha) }) });
});
app.get('/ayurveda/doshas', (req, res) => res.json({ success: true, doshas: DOSHAS }));

// ── FASTING GUIDE ─────────────────────────────────────────────
app.get('/fast', (req, res) => res.json({ success: true, fasts: getAllFasts() }));
app.get('/fast/:type', (req, res) => {
  const f = getFastingGuide(req.params.type);
  if (!f) return res.status(404).json({ error: 'Fast not found' });
  res.json({ success: true, fast: f });
});

// ── FESTIVAL CALENDAR ─────────────────────────────────────────
app.get('/festivals', (req, res) => res.json({ success: true, festivals: FESTIVALS_2026 }));
app.get('/ekadashi', (req, res) => res.json({ success: true, ekadashis: EKADASHIS_2026 }));

// ── KUNDLI DOSHAS ─────────────────────────────────────────────
app.get('/dosha', (req, res) => {
  const list = Object.entries(DOSHAS_KUNDLI).map(([k,d])=>({ key:k, name:d.name, effects:d.effects.slice(0,2) }));
  res.json({ success: true, doshas: list });
});
app.get('/dosha/:type', (req, res) => {
  const d = DOSHAS_KUNDLI[req.params.type];
  if (!d) return res.status(404).json({ error: 'Dosha not found' });
  res.json({ success: true, dosha: d });
});

// ── TEMPLE GUIDE ──────────────────────────────────────────────
app.get('/temples', (req, res) => res.json({ success: true, cities: Object.keys(TEMPLES) }));
app.get('/temples/:city', (req, res) => {
  const t = TEMPLES[req.params.city];
  if (!t) return res.status(404).json({ error: 'City not found' });
  res.json({ success: true, temples: t });
});

// ── SPIRITUAL QUIZ ────────────────────────────────────────────
app.get('/quiz', (req, res) => res.json({ success: true, questions: QUIZ_QUESTIONS }));
app.get('/quiz/random', (req, res) => {
  const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
  res.json({ success: true, question: q });
});

// ── GITA COUNSELING CHATBOT ───────────────────────────────────
app.post('/gita/chat', (req, res) => {
  const { name, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Please describe your situation or question.' });
  try {
    const raw = getGitaWisdom(name || 'Seeker', message);
    const parse = (tag) => {
      const m = raw.match(new RegExp(`---${tag}---\\n([\\s\\S]*?)(?=---[A-Z]+---|$)`));
      return m ? m[1].trim() : '';
    };

    res.json({
      success: true,
      sloka: parse('SLOKA'),
      reference: parse('REFERENCE'),
      transliteration: parse('TRANSLITERATION'),
      hindi: parse('HINDI'),
      english: parse('ENGLISH'),
      guidance: parse('GUIDANCE')
    });
  } catch (err) {
    console.error('Gita wisdom error:', err);
    res.status(500).json({ error: 'Could not retrieve divine verse at this moment.' });
  }
});

// ── HANDWRITING ANALYSIS ──────────────────────────────────────────────
// GET all trait options (to show dropdowns/choices in frontend)
app.get('/handwriting/options', (req, res) => {
  res.json({ success: true, options: getTraitOptions() });
});

// POST selections → full personality analysis
app.post('/handwriting', (req, res) => {
  const { size, slant, pressure, baseline, spacing, connection, loops, signature } = req.body;
  if (!size && !slant && !pressure) {
    return res.status(400).json({ error: 'Please provide at least size, slant, and pressure' });
  }
  const result = analyzeHandwriting({ size, slant, pressure, baseline, spacing, connection, loops, signature });
  res.json({ success: true, result });
});

// ── FREE HANDWRITING IMAGE ANALYSIS (Gemini Vision AI) ───────────────────────
app.post('/handwriting/analyze-image', async (req, res) => {
  const { name, imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Handwriting image is required.' });

  const prompt = `You are Dr. Priya Mehta, a world-class graphologist and handwriting analyst with 25 years of experience. You are analyzing a handwritten notes/text image for a person named ${name}.

Study the handwriting carefully — look at letter size, slant, spacing, pressure, baseline, loops, connections, and overall flow.

Provide your reading in EXACTLY this format:

---PERSONALITY---
[3-4 sentences about core personality traits revealed by this handwriting]

---MINDSET---
[3-4 sentences about thinking style, intelligence type, and how this person processes information]

---EMOTIONS---
[3-4 sentences about emotional nature, stress levels, and inner feelings hidden in the strokes]

---STRENGTHS---
• [Strength 1]
• [Strength 2]
• [Strength 3]

---HIDDEN_TRAITS---
[2-3 sentences about surprising or hidden personality aspects most people don't see on the surface]

---GROWTH_ADVICE---
[A warm, encouraging piece of advice based on what the handwriting reveals about areas for growth]

Be specific about what you observe — mention actual things you see like "the right-leaning slant suggests...", "the heavy pressure indicates...". Make it feel personal and insightful.`;

  let lastErr;
  for (const modelName of GEMINI_MODELS) {
    for (const key of API_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const result = await model.generateContent([
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
        ]);

        const text = result.response.text();
        const parse = (tag) => {
          const m = text.match(new RegExp(`---${tag}---\\s*([\\s\\S]*?)(?=---[A-Z_]|$)`));
          return m ? m[1].trim() : '';
        };

        return res.json({
          success: true,
          name,
          source: modelName,
          analysis: {
            personality:   parse('PERSONALITY'),
            mindset:       parse('MINDSET'),
            emotions:      parse('EMOTIONS'),
            strengths:     parse('STRENGTHS'),
            hiddenTraits:  parse('HIDDEN_TRAITS'),
            growthAdvice:  parse('GROWTH_ADVICE'),
          }
        });
      } catch (err) {
        lastErr = err;
      }
    }
  }
  console.error('Handwriting AI error, using graphology fallback:', lastErr?.message);
  return res.json({
    success: true,
    name: name || 'Seeker',
    source: 'fallback',
    analysis: {
      personality: `${name || 'Seeker'}'s handwriting reflects high focus, emotional resilience, and a balanced harmony between logical reasoning and intuitive creativity. The stroke pressure and rhythm demonstrate strong dedication and integrity.`,
      mindset: `Analytical yet adaptable. You process information by connecting practical realism with creative vision, ensuring dependable execution.`,
      emotions: `Composed and empathetic. You maintain emotional steadiness under pressure while showing genuine care for those in your circle.`,
      strengths: `• Strategic analytical thinking\n• High adaptability & resilience\n• Reliable execution and loyalty`,
      hiddenTraits: `Possesses an innate artistic intuition and deep spiritual appreciation that isn't always obvious on the surface.`,
      growthAdvice: `Give yourself permission to celebrate daily small victories. Cultivate quiet moments of mindfulness to recharge your energy.`
    }
  });
});

// ── SIGNATURE ANALYSIS (PAID ₹79) ─────────────────────────────────────
// Step 1: Get trait options for the form
app.get('/signature/options', (req, res) => {
  res.json({ success: true, options: getSignatureOptions() });
});

const PROMO_CODES = {
  'AMAR':     { fixedPrice: 1,  message: 'Admin Promo: Price reduced to ₹1! 🙏' },
  'DISHAAA':  { fixedPrice: 7,  message: 'Special Promo: Price reduced to ₹7! 🎁' },
  'WELCOME50': { discountPercentage: 50, message: '50% Welcome Discount Applied!' },
  'GUIDER20':  { discountPercentage: 20, message: '20% Special Discount Applied!' },
  'AMAR99':    { discountPercentage: 99, message: '99% Creator Discount Applied!' },
  'MYKRISHNA': { discountPercentage: 100, message: '100% Devotional Discount Applied! 🙏' }
};

// Validate Promo Code
app.post('/signature/validate-promo', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });
  
  const upperCode = code.toUpperCase();
  if (PROMO_CODES[upperCode]) {
    res.json({ success: true, promo: PROMO_CODES[upperCode] });
  } else {
    res.status(400).json({ error: 'Invalid or expired promo code' });
  }
});

// ── VALIDATE PROMO CODE for numerology packages ───────────────────────────────
app.post('/validate-promo', (req, res) => {
  const { code, packageType } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const PACKAGE_PRICES = { basic: 47, advanced: 97, mastery: 121 };
  const upperCode = code.toUpperCase();
  const basePrice = PACKAGE_PRICES[packageType] || 47;

  if (PROMO_CODES[upperCode]) {
    const promo = PROMO_CODES[upperCode];
    let finalPrice = basePrice;
    if (promo.fixedPrice !== undefined) {
      finalPrice = promo.fixedPrice;
    } else if (promo.discountPercentage) {
      finalPrice = Math.round(basePrice - (basePrice * promo.discountPercentage / 100));
    }
    return res.json({ success: true, message: promo.message, finalPrice: Math.max(0, finalPrice) });
  }
  return res.status(400).json({ error: 'Invalid or expired promo code' });
});


// ── SIGNATURE IMAGE ANALYSIS via Gemini Vision AI ────────────────────────────
app.post('/signature/analyze-image', async (req, res) => {
  const { name, email, imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'Signature image is required.' });

  const prompt = `You are Dr. Arjun Sharma, one of India's top graphologists with 30 years of experience. Analyze this handwritten signature image for a client named ${name}.

Provide your reading in EXACTLY this format (keep the tags):

---PERSONALITY---
[3-4 sentences about core personality traits visible in this signature]

---DESTINY---
[3-4 sentences about career path, life purpose, and destined achievements]

---LOVE---
[3-4 sentences about emotional nature and relationships]

---FORTUNE---
[3-4 sentences about financial tendencies and wealth potential]

---STRENGTHS---
[3 key strengths as bullet points starting with •]

---CHALLENGES---
[2 key challenges as bullet points starting with •]

---ADVICE---
[One powerful piece of spiritual advice connected to what this signature reveals]

Be specific about what you actually see: size, slant, pressure, legibility, underlines, loops, flourishes. Make it feel like a premium personalized reading.`;

  let lastErr;
  for (const modelName of GEMINI_MODELS) {
    for (const key of API_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const result = await model.generateContent([
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
        ]);

        const text = result.response.text();
        const parse = (tag) => {
          const m = text.match(new RegExp(`---${tag}---\\s*([\\s\\S]*?)(?=---[A-Z]|$)`));
          return m ? m[1].trim() : '';
        };

        const analysis = {
          summary: `AI Graphology Reading for ${name} by Path Guider (${modelName})`,
          personality: parse('PERSONALITY'),
          destiny: parse('DESTINY'),
          love: parse('LOVE'),
          fortune: parse('FORTUNE'),
          strengths: parse('STRENGTHS'),
          challenges: parse('CHALLENGES'),
          spiritualGuidance: parse('ADVICE'),
          overallPersonality: parse('PERSONALITY').split('\n').filter(l => l.trim()),
          destinyInsights: parse('DESTINY').split('\n').filter(l => l.trim()),
          wealthFortune: parse('FORTUNE').split('\n').filter(l => l.trim()),
          loveCompatibility: parse('LOVE').split('\n').filter(l => l.trim()),
          careerPath: parse('DESTINY').split('\n').filter(l => l.trim()),
          luckyElements: [parse('STRENGTHS')],
        };

        return res.json({ success: true, analysis, name, email, source: modelName });
      } catch (err) {
        lastErr = err;
      }
    }
  }
  console.error('Signature AI error, using graphology fallback:', lastErr?.message);
  const fallbackAnalysis = {
    summary: `Graphology Reading for ${name || 'Seeker'} by Path Guider`,
    personality: `${name || 'Seeker'}'s signature reflects high self-drive, ambition, and authentic integrity. The strokes demonstrate clear focus and strong inner willpower to achieve personal and professional aspirations.`,
    destiny: `Destined for leadership, innovative problem solving, and building high-trust partnerships. Continuous perseverance will unlock significant milestones.`,
    love: `Values deep loyalty, genuine emotional connection, and mutual respect in relationships. Thoughtful and protective toward loved ones.`,
    fortune: `Financial stability grows through disciplined investments, strategic decisions, and creating long-term value.`,
    strengths: `• Strong willpower & determination\n• Authentic communication\n• Clear visionary focus`,
    challenges: `• Tendency to overthink details\n• Balancing rest with high ambitions`,
    spiritualGuidance: `Trust in your natural inner guidance and stay aligned with daily mindfulness. True success blooms when action meets peace of mind.`,
    overallPersonality: [`Authentic and purpose-driven individual.`, `Demonstrates clear goal alignment and focus.`],
    destinyInsights: [`Destined to inspire and lead through positive action.`],
    wealthFortune: [`Consistent growth with careful financial stewardship.`],
    loveCompatibility: [`Harmonious with empathetic, supportive partners.`],
    careerPath: [`Strategic leadership, creative direction, management.`],
    luckyElements: [`Gold, Sunday, Sun Energy`],
  };
  return res.json({ success: true, analysis: fallbackAnalysis, name: name || 'Seeker', email: email || '', source: 'fallback' });
});

// Step 2: Create Razorpay order for ₹79 (with optional discount)
app.post('/signature/create-order', async (req, res) => {
  try {
    const { name, email, traits, promoCode } = req.body;
    if (!name || !email || !traits) {
      return res.status(400).json({ error: 'Name, email and signature traits are required' });
    }

    let basePriceInr = 79;
    
    // Apply discount if valid promo code provided
    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      const promo = PROMO_CODES[promoCode.toUpperCase()];
      if (promo.fixedPrice !== undefined) {
        basePriceInr = promo.fixedPrice;
      } else if (promo.discountPercentage) {
        basePriceInr = basePriceInr - (basePriceInr * (promo.discountPercentage / 100));
      }
    }
    
    // If the discount makes it totally free (100% off), bypass Razorpay
    if (basePriceInr <= 0) {
      return res.json({ success: true, isFree: true });
    }
    
    // Razorpay requires minimum 1 INR (100 paise)
    const amountInPaise = Math.max(100, Math.round(basePriceInr * 100));

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `sig_${Date.now()}`,
      notes: { name, email, service: 'Signature Analysis', traits: JSON.stringify(traits) },
    });
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Signature order error:', err);
    res.status(500).json({ error: 'Could not create payment order' });
  }
});

// Step 2B: Free Delivery (No promo code required in testing mode)
app.post('/signature/deliver-free', async (req, res) => {
  const { name, email, traits } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const safTraits = traits || { size_vs_writing: 'medium', slant_direction: 'right', underline: 'none', legibility: 'clear' };
  const analysis = analyzeSignature(safTraits);
  if (email) {
    try {
      const buf = await generateSignaturePDF(name, safTraits, analysis);
      await sendSignatureEmail(email, buf);
      console.log(`📧 Free Signature Report emailed to ${email}`);
    } catch (e) {
      console.error('❌ Signature deliver-free email error:', e.message);
    }
  }
  res.json({
    success: true,
    paid: false,
    payment_id: 'FREE_TEST_MODE',
    name,
    analysis,
    message: `🙏 Namaste ${name}! Your free Signature Analysis Report is ready.`
  });
});

// Step 3: Verify payment → deliver full analysis
app.post('/signature/verify-and-deliver', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, traits, name, email } = req.body;

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Please contact support.' });
    }

    if (razorpay_order_id) {
      sentOrders.add(razorpay_order_id);
    }

    // Payment verified → deliver full analysis
    const analysis = analyzeSignature(traits);

    // ── CRITICAL: Send email SYNCHRONOUSLY before responding on Vercel ──────
    // Background IIFEs are killed when res.json() is called on serverless.
    if (email) {
      try {
        const buf = await generateSignaturePDF(name, traits, analysis);
        await sendSignatureEmail(email, buf);
        console.log(`📧 Signature Report emailed to ${email}`);
      } catch (e) {
        console.error('❌ Signature verify-and-deliver email error:', e.message);
      }
    }

    res.json({
      success: true,
      paid: true,
      payment_id: razorpay_payment_id,
      name,
      analysis,
      message: `🙏 Namaste ${name}! Your complete Signature Analysis Report is ready.`,
    });
  } catch (err) {
    console.error('Signature verify error:', err);
    res.status(500).json({ error: 'Analysis delivery failed. Contact support with payment ID.' });
  }
});

// ── SERVER START ─────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
