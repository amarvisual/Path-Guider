# 🔮 Path Guider Premium — Ancient Wisdom Meets AI Intelligence

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Application-gold?style=for-the-badge&logo=google-chrome)](https://pathguider.in/)
[![Engine](https://img.shields.io/badge/Numerology_Engine-v3.0_Pythagorean_%26_Vedic-6c3fc5?style=for-the-badge)](https://pathguider.in/)
[![AI Vision](https://img.shields.io/badge/AI_Vision-Gemini_Rotation_%26_Graphology-48c9b0?style=for-the-badge)](https://pathguider.in/signature.html)

**Path Guider Premium** is a state-of-the-art spiritual intelligence and behavioral analysis platform designed to help individuals discover their life purpose, heal karmic patterns, understand romantic dynamics, and command executive personal presence.

---

## 🌟 Key Highlights & Modules

### 1. 🔢 Advanced Pythagorean & Vedic Numerology Engine v3.0
- **Calculates Core Blueprint**: Life Path, Destiny (Expression), Soul Urge (Heart's Desire), Personality Number, Birth Day vibration, and Maturity numbers.
- **Karmic Debt Number Detection**: Identifies `13/4`, `14/5`, `16/7`, and `19/1` across birth date and name totals with specific remedies.
- **Karmic Lessons Matrix**: Scans name frequencies to detect missing single digits (1–9) and identifies areas for soul growth.
- **2026 Personal Year Cycle Forecast**: Real-time annual vibrational calculation with monthly pacing advice.
- **Planes of Expression**: Quantitative breakdown across Mental %, Emotional %, Physical %, and Intuitive % planes.
- **4-Stage Pinnacles & Challenges Lifecycle**: Visual timeline for foundational, productive, leadership, and legacy years.
- **Interactive 8-Tab Cosmic Cockpit**: Client-side dashboard with sticky tabs, progress bars, and instant browser PDF report exporter.

### 2. 📖 Wisdom Academy & Knowledge Hub (SEO/AEO/GEO Optimized)
A curated academy of deep, relatable masterclasses with Schema.org JSON-LD structured data and AI Voice Search Key Takeaways:
- **Master Numbers 11, 22, 33 Guide**: Spiritual callings, high-frequency nervous energy management, and career fulfillment.
- **Karmic Debt Numbers (13, 14, 16, 19)**: Past-life origins, recurring life blocks, and daily healing remedies.
- **Face Reading (Physiognomy) Secrets**: Decoding the 3 facial zones, jawline willpower, eye spacing, and nose wealth bridges.
- **Signature Analysis (Graphology)**: Stroke baseline slants, underlines, self-sabotage strokes, and subconscious graphotherapy.
- **Body Language & Micro-Expressions**: Spotting deception with the Rule of 3, universal micro-expressions, and honest feet cues.
- **Dark Psychology vs. Empaths**: Tactical psychological protection, gaslighting defense, and the Grey Rock method.
- **The 4 Attachment Styles**: Breaking the Anxious-Avoidant trap and pairing attachment theory with Numerology.
- **The 7 Chakras Diagnostic Guide**: Subtle body energetic diagnostic from Root to Crown with seed mantras and yoga asanas.
- **Personality Development & Executive Presence**: Diaphragmatic vocal techniques, eliminating upspeak, and commanding rooms.

### 3. ✍️ AI Vision Graphology & Handwriting Profiler
- **AI Signature Analysis (`signature.html`)**: Reads signature photos to assess public persona, financial confidence, and destiny.
- **Free Handwriting Analyzer (`handwriting.html`)**: Decodes letter spacing, pressure, slant, and loops.
- **Multi-Model Gemini Rotation**: Cycles through `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-flash-8b`, and `gemini-2.0-flash-lite`.
- **Zero-Failure Fallback System**: Instant fallback ensuring 100% uptime even when Google API daily quotas are exceeded.

### 4. 🕉️ Bhagavad Gita Guidance Chatbot
- Semantic matching engine connecting queries against all 701 verses in `gita_full.json`.
- Delivers the authentic Sanskrit Sloka, transliteration, Hindi meaning, English purport, and personalized divine counseling guidance.

### 5. 🪐 Interactive Vedic Astrology Suite
- **Daily Rashi Horoscope**: Real-time planetary insights.
- **Auspicious Muhurat Finder**: Timing for business launches, property purchases, ceremonies, and travel.
- **Blocked Chakra Diagnostic**: Instant assessment of energetic blocks with gemstone and crystal recommendations.
- **Vedic Rashi & Nakshatra Calculator**: Calculates Moon sign, Nakshatra deity, benefic gemstones, and ruling planets.

---

## 🏗️ Architecture & File Structure

```text
Path-Guider-Premium/
├── blog/                                # Wisdom Academy Knowledge Hub & Articles
│   ├── index.html                       # Academy Directory & Filter Grid
│   ├── life-path-master-numbers-guide.html
│   ├── karmic-debt-numbers-healing.html
│   ├── face-reading-physiognomy-personality.html
│   ├── signature-analysis-graphology-secrets.html
│   ├── body-language-micro-expressions-mastery.html
│   ├── dark-psychology-vs-empath-boundaries.html
│   ├── love-compatibility-attachment-styles.html
│   ├── 7-chakras-energy-healing-guide.html
│   └── personality-development-unshakeable-confidence.html
├── legal/                               # Terms, Privacy Policy, Refund Policy & Contact
├── services/                            # Vedic calculators, Muhurat, Rashi, and Graphology engines
├── utils/
│   ├── aiAnalyzer.js                    # Gemini Vision integration
│   ├── emailService.js                  # Nodemailer SMTP dispatcher
│   └── pdfGenerator.js                  # Vector PDF report builder
├── app.js                               # Cosmic Cockpit UI orchestrator & client controllers
├── server.js                            # Express backend, Gemini rotation, and fallback pipelines
├── numerology.js                        # Pythagorean v3.0 core mathematical calculation engine
├── readings.js                          # Comprehensive master readings dictionary
├── index.html                           # Main Landing Page, Vedic Suite & Gita Chatbot
├── signature.html                       # AI Signature Analysis tool
├── handwriting.html                     # Free AI Handwriting Analysis tool
├── mobile-numerology.html               # Mobile Frequency Matrix analyzer
├── style.css                            # Obsidian & Gold Luxury Glassmorphic Design System
├── sitemap.xml                          # High-priority search engine index
├── vercel.json                          # Serverless routing rules
└── PROJECT_MASTER_DOCUMENTATION.md      # Comprehensive changelog & technical record
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/amarvisual/Path-Guider.git
cd Path-Guider

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` template:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
PORT=3000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GEMINI_API_KEY=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Start the Application
```bash
# Run Express server
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📜 Master Documentation
Every single update and architecture decision is tracked in **[PROJECT_MASTER_DOCUMENTATION.md](file:///f:/all%20working%20project/02_Path_Guider_Premium/PROJECT_MASTER_DOCUMENTATION.md)**.

---

## 🛡️ License & Credits
© 2026 **Path Guider**. Developed with ancient spiritual wisdom and modern artificial intelligence by **Amar Visual Studio**. All rights reserved.
