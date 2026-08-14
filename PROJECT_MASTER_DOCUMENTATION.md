# 🔮 PATH GUIDER PREMIUM — MASTER PROJECT DOCUMENTATION

> **Project Name**: Path Guider Premium (Spiritual Wisdom & AI Life Analysis Platform)  
> **Author & Studio**: Amar Visual Studio  
> **Current Version**: v2.1.0 (Refined UX/UI & Resilient Multi-Service Architecture)  
> **Target Node Environment**: Node.js v18+ / v20+  
> **Deployment Target**: Vercel Serverless / Node VPS  

---

## 📖 1. Project Overview & Vision

**Path Guider Premium** is an all-in-one spiritual guidance, Vedic astrology, numerological calculation, and AI-powered graphology web application. The platform merges thousands of years of ancient Pythagorean numerology and Vedic wisdom with modern Google Gemini AI Vision intelligence, providing users with instant cosmic insights and downloadable PDF reports.

### Key Capabilities:
1. **Pythagorean Numerology Engine**: Instant client-side computation of Life Path, Destiny, Soul Urge, Personality, Mobile Vibration, Zodiac Sign, and Lucky Elements.
2. **AI Handwriting & Signature Analysis**: Graphological reading powered by Gemini 1.5 Flash Vision AI with intelligent local graphological fallback.
3. **Bhagavad Gita Wisdom Chatbot**: Query-matching against a dataset of 701 Gita verses (`gita_full.json`) providing Hindi & English translations and guidance.
4. **Comprehensive Vedic Astrology Suite**:
   - Rashi (Moon/Sun Zodiac) & 27 Nakshatras calculation.
   - 10+ Activity Auspicious Muhurat Finder.
   - 6 Full Vedic Puja Step-by-Step Guides.
   - 7 Chakras Diagnosis & Healing Guide.
   - Daily Horoscopes & Lucky Day Profiles.
   - Rudraksha, Gemstones & Yantra Recommendations.
   - 2026 Festival Calendar & Ekadashi Vrat Schedule.
   - Kundli Dosha Remedial Guide (Mangal, Kaal Sarp, Pitru, Shani Sade Sati).
   - 15-Question Spiritual Quiz Engine.
5. **Automated PDF Report Engine**: Vector-rendered PDF reports generated using PDFKit.
6. **Lead Capture & E-Commerce Integration**: Silent CSV logging (`database.csv`) and Razorpay checkout integration with promo discount engines.

---

## 🏗️ 2. Architectural Blueprint & File Structure

```
02_Path_Guider_Premium/
│
├── 📄 PROJECT_MASTER_DOCUMENTATION.md  # [CRITICAL] Full documentation & continuous change register
├── 📄 README.md                        # High-level project intro
├── 📄 package.json                     # NPM dependencies & start scripts
├── 📄 package-lock.json                # Locked dependency tree
├── 📄 server.js                        # Master Express backend with 22+ API endpoints & fallbacks
├── 📄 app.js                           # Master frontend client-side controller & animation engine
├── 📄 style.css                        # Design system, glassmorphism tokens & micro-animations
│
├── 🌐 Pages & Templates
│   ├── index.html                      # Main landing page & complete interactive hub
│   ├── signature.html                  # Dedicated AI Signature analysis portal
│   ├── handwriting.html                # Dedicated AI Handwriting analysis portal
│   ├── mobile-numerology.html          # Deep mobile number vibration analysis portal
│   └── blog-template.html              # Template for SEO-optimized spiritual articles
│
├── 🗄️ Datasets & Calculation Engines
│   ├── gita_full.json                  # Complete 701 verses of Bhagavad Gita in JSON
│   ├── gitaWisdom.js                   # High-speed semantic & keyword matching Gita engine
│   ├── numerology.js                   # Pure Pythagorean mathematical reduction engine
│   ├── readings.js                     # Exhaustive interpretive database for all numbers
│   └── database.csv                    # Silent lead capture storage
│
├── ⚙️ Backend Services (`/services/`)
│   ├── calendar_temple_quiz.js         # 2026 Festivals, Ekadashis, Kundli Doshas, Temples & Quiz
│   ├── handwriting.js                  # Standard graphological traits & interpretations
│   ├── mantraData.js                   # Curated Vedic mantras for psychological & spiritual states
│   ├── muhurat.js                      # Vedic planetary timing & auspicious day calculator
│   ├── nakshatra.js                    # 27 Lunar mansions mapping & characteristics
│   ├── numerologyCalc.js               # Server-side numerology engine mirror
│   ├── pujaGuide.js                    # Step-by-step rituals for 6 primary deities
│   ├── rashi.js                        # 12 Vedic Rashi (Zodiac) mappings & elements
│   ├── rudraksha_gem_yantra.js         # Gemstone, Mukhi Rudraksha, and Yantra recommendations
│   ├── signatureAnalysis.js            # Standard graphological signature rules & traits
│   └── wellness_services.js            # Horoscopes, 7 Chakras, Ayurveda Doshas & Fasting guides
│
├── 🛠️ Utilities (`/utils/`)
│   ├── aiAnalyzer.js                   # Gemini Vision triggers for facial and chart analysis
│   ├── emailService.js                 # Nodemailer transporter & responsive HTML templates
│   └── pdfGenerator.js                 # PDFKit engine for generating multi-page customized reports
│
├── 📁 Content & Legal
│   ├── articles/                       # 30+ SEO articles covering graphology, face reading & numerology
│   ├── legal/                          # Privacy Policy, Terms, Refund Policy, Contact
│   ├── sitemap.xml                     # Search engine index sitemap
│   ├── robots.txt                      # Search crawler directives
│   └── logo.png                        # Branding logo asset
│
└── ☁️ Serverless & Environment
    ├── vercel.json                     # Serverless routing configuration
    ├── api/index.js                    # Vercel serverless entry point
    └── .env                            # Environment secrets (PORT, SMTP, GEMINI, RAZORPAY)
```

---

## 🎨 3. Design System & UX/UI Guidelines

The UI uses a **Cosmic Glassmorphism** design system crafted to evoke spiritual elevation, clarity, and trust:

### Color Tokens:
| Token Name | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--navy` | `#030308` | Primary deep void canvas background |
| `--navy2` | `#080816` | Secondary card & section gradient backdrop |
| `--gold` | `#F5B041` / `#D4AF37` | Divine accents, active states, key icons, prices |
| `--gold-light` | `#FAD7A1` | Sub-headlines, highlighted text, badge borders |
| `--cyan` | `#48C9B0` | Healing energy, positive metrics, free badges |
| `--pink` | `#AF7AC5` | Mystic vibrations, astrology indicators |
| `--purple` | `#6C3FC5` | Primary CTA gradients & spiritual resonance |
| `--glass` | `rgba(255, 255, 255, 0.03)` | Semi-transparent card backdrops |
| `--glass-border` | `rgba(245, 176, 65, 0.15)` | Subtle golden refractive borders |
| `--text` | `#F8FAFC` | Primary high-contrast text |
| `--text-muted` | `#94A3B8` | Subtitles, labels, timestamps |

### Typography:
- **Display / Headers**: `'Cinzel', serif` — majestic, classical, and sacred geometry aesthetic.
- **Body / Interface**: `'Inter', 'Plus Jakarta Sans', sans-serif` — crisp, ultra-legible, modern sans-serif.

---

## 🔌 4. API Endpoints Reference Matrix

| Method | Endpoint | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/daily-verse` | Fetches daily Bhagavad Gita Shloka | None |
| `POST` | `/mantra` | Recommends mantra based on problem | `{ "problem": "string" }` |
| `POST` | `/numerology` | Full numerology calculations | `{ "name": "string", "dob": "YYYY-MM-DD" }` |
| `POST` | `/muhurat` | Auspicious time verdict | `{ "activity": "business", "date": "YYYY-MM-DD" }` |
| `GET` | `/puja` | List all 6 deity puja guides | None |
| `GET` | `/puja/:deity` | Fetch specific deity puja ritual | `:deity` (e.g., `ganesh`, `shiva`) |
| `POST` | `/rashi` | Determine Vedic Rashi | `{ "dob": "YYYY-MM-DD" }` or `{ "sign": "Leo" }` |
| `POST` | `/nakshatra` | Determine Lunar Nakshatra | `{ "dob": "YYYY-MM-DD" }` |
| `POST` | `/gemstone` | Gemstone recommendation | `{ "lifePath": 1 }` or `{ "rashi": "Leo" }` |
| `POST` | `/rudraksha` | Rudraksha recommendation | `{ "problem": "stress" }` |
| `POST` | `/yantra` | Yantra recommendation | `{ "problem": "wealth" }` |
| `GET` | `/horoscope/:sign` | Daily zodiac horoscope | `:sign` (e.g., `leo`, `aries`) |
| `GET` | `/lucky-day/:lifePath` | Lucky days, numbers, colors | `:lifePath` (e.g., `1`, `7`) |
| `POST` | `/chakra` | Diagnostic for blocked chakras | `{ "symptoms": "anxiety" }` |
| `GET` | `/festivals` | 2026 Hindu festival calendar | None |
| `GET` | `/ekadashi` | 2026 Ekadashi vrat schedule | None |
| `GET` | `/dosha` | Kundli dosha remedies | None |
| `GET` | `/temples` | Sacred temples directory | None |
| `GET` | `/quiz` | 15-question spiritual quiz | None |
| `POST` | `/gita-guidance` | Gita chatbot guidance | `{ "name": "string", "problem": "string" }` |
| `POST` | `/handwriting/analyze-image` | AI & fallback handwriting analysis | `{ "name": "string", "imageBase64": "..." }` |
| `POST` | `/signature/analyze-image` | AI & fallback signature analysis | `{ "name": "string", "email": "...", "imageBase64": "..." }` |
| `POST` | `/validate-promo` | Validate discount promo codes | `{ "code": "WELCOME50", "packageType": "basic" }` |
| `POST` | `/log-user` | Silent lead capture to CSV | `{ "name": "...", "dob": "...", "mobile": "...", "email": "..." }` |
| `POST` | `/deliver-free-report` | Free numerology PDF dispatch | `{ "userDetails": { ... }, "packageType": "basic" }` |

---

## 🚀 5. How to Run & Deploy on Any Machine

### Step 1: Install Dependencies
```bash
cd "02_Path_Guider_Premium"
npm install
```

### Step 2: Configure `.env`
Create or update `.env` in the root folder:
```env
PORT=3000

# Brevo SMTP or Gmail App Password
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Google Gemini AI Keys
GEMINI_API_KEY=your_gemini_api_key

# Razorpay (Live or Test)
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
RAZORPAY_WEBHOOK_SECRET=xxxx
```

### Step 3: Run Locally
```bash
node server.js
# Access at http://localhost:3000
```

---

## 📝 6. Strict Change Log & State Register

> **RULE**: Whenever any modification, feature addition, styling change, or backend fix is made to this codebase, it **must** be appended below with full technical rationale and exact changed file paths.

### 📅 Entry #001 — [2026-08-14] Full System Audit, Resilience & Fallback Integration
- **Modified**: `server.js`
  - **Reason**: Google Gemini API keys in `.env` were flagged as leaked/expired, causing unhandled 500 errors on image endpoints.
  - **Changes**: Integrated intelligent graphological fallbacks in `POST /handwriting/analyze-image` and `POST /signature/analyze-image`. Added graceful error handling so users always receive deep, structured readings with zero downtime.
  - **Tests**: Verified all 22 extended endpoints (Daily verse, Mantras, Muhurat, Puja, Rashi, Nakshatra, Chakras, Quizzes) passing with HTTP 200.
- **Created**: `PROJECT_MASTER_DOCUMENTATION.md` (This master file).

### 📅 Entry #002 — [2026-08-14] UX/UI & Interactive Vedic Astrology Suite Integration
- **Modified**: [index.html](file:///f:/all%20working%20project/02_Path_Guider_Premium/index.html), [style.css](file:///f:/all%20working%20project/02_Path_Guider_Premium/style.css), [app.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/app.js)
- **Rationale**: 
  - Elevate visual appeal to a luxury cosmic mystic aesthetic with deep obsidian glassmorphism, golden refractive highlights, and fluid tab navigation.
  - Implement a real-time **Interactive Vedic Astrology Suite** on the landing page enabling users to immediately calculate their **Daily Horoscope, Auspicious Muhurat, Blocked Chakra Diagnostic, and Vedic Rashi & Gemstone** without leaving the page.
- **Specific Code Additions**:
  1. `style.css`: Added `#vedic-suite`, `.vedic-tabs`, `.vedic-tab-btn`, `.vedic-interactive-card`, `.vedic-select`, `.vedic-calc-btn`, and responsive glassmorphic cards.
  2. `index.html`: Created the `#vedic-suite` container with 4 dynamic tab panels (`tab-horoscope`, `tab-muhurat`, `tab-chakra`, `tab-rashi`) and linked navbar navigation items.
  3. `app.js`: Added client-side asynchronous controllers `switchVedicTab()`, `fetchHoroscope()`, `fetchMuhurat()`, `fetchChakraDiagnostic()`, and `fetchRashiAndGemstone()` mapped to live Express API endpoints.
- **Verification**: Tested all 4 interactive calculator tools on `http://localhost:3000` with instant response and formatted UI output.

### 📅 Entry #003 — [2026-08-14] Complete Removal of Blog & Article Pages
- **Deleted**:
  - `articles/` (Directory containing 30 static SEO article HTML files).
  - `blog-template.html` (Static article layout template).
  - `utils/generateSeoPages.js` (Script used to generate static articles).
- **Modified**:
  - [index.html](file:///f:/all%20working%20project/02_Path_Guider_Premium/index.html): Removed the `.footer-seo-links` container holding 30+ article hyperlinks. Replaced with clean, high-conversion legal & contact footer navigation.
### 📅 Entry #004 — [2026-08-14] Numerology Engine v3.0 & Cosmic Cockpit Dashboard Overhaul
- **Modified**:
  - [numerology.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/numerology.js):
    - Upgraded calculation engine to Pythagorean v3.0.
    - Added **Karmic Debt Number detection** (13/4, 14/5, 16/7, 19/1) across DOB and Name totals.
    - Added **Karmic Lessons detector** analyzing missing vibrational numbers (1-9) in the user's name.
    - Added **2026 Personal Year cycle calculator** (`reduce(Month + Day + 2026)`).
    - Added **Planes of Expression** mathematical breakdown (Mental, Emotional, Physical, Intuitive percentages).
    - Added **4-Stage Life Pinnacles & Challenges** lifecycle engine.
  - [readings.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/readings.js):
    - Deepened all 12 Life Path interpretations with **Shadow Sides & Pitfalls**, **Career & Wealth Magnetism Archetypes**, **Romantic Harmonious vs Challenging Match Numbers**, and **Daily Power Affirmations**.
    - Added comprehensive guides for Karmic Debts (13, 14, 16, 19), Karmic Lessons (1-9), and 2026 Personal Year Annual Forecasts (1-9).
  - [app.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/app.js):
    - Redesigned `displayResults()` into an 8-tab **Cosmic Cockpit Dashboard** with sticky category tabs (`Core Archetype`, `Career & Wealth`, `Love & Compatibility`, `2026 Year & Pinnacles`, `Karmic Lessons`, `Planes of Expression`, `Mobile Frequency`, `Lucky Matrix`).
    - Added **Print / Save Full PDF Report** direct browser action.
  - [style.css](file:///f:/all%20working%20project/02_Path_Guider_Premium/style.css):
    - Added styles for sticky result tab bars, animated plane progress bars, pinnacle timeline cards, karmic debt callout boxes, and glowing affirmation banners.
  - [utils/pdfGenerator.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/utils/pdfGenerator.js):
    - Upgraded vector PDF compiler with gold borders, multi-page layout, 2026 forecasts, karmic lessons, and structured sections.
- **Verification**: Verified calculation precision and PDF buffer generation in Node.js test suite. Tested live frontend responsiveness on `http://localhost:3000`.

### 📅 Entry #005 — [2026-08-14] Creation of Wisdom Academy & High-Ranking SEO/AEO/GEO Masterclasses
- **Created**:
  - `blog/index.html` (Master Knowledge Hub & Article Directory with glassmorphic cards and category pills).
  - `blog/life-path-master-numbers-guide.html` (Comprehensive guide on Master Numbers 11, 22, and 33).
  - `blog/karmic-debt-numbers-healing.html` (Deep dive on Karmic Debts 13/4, 14/5, 16/7, 19/1 with past-life origins and remedies).
  - `blog/face-reading-physiognomy-personality.html` (Chinese & Western Physiognomy guide on Jawline, Eyes, Nose & Forehead).
  - `blog/signature-analysis-graphology-secrets.html` (Graphology masterclass on Slants, Underlines, Baselines & Graphotherapy).
  - `blog/body-language-micro-expressions-mastery.html` (Behavioral psychology guide on Micro-expressions and Lie detection).
  - `blog/dark-psychology-vs-empath-boundaries.html` (Psychological protection guide on Gaslighting, Narcissism & Boundary scripts).
  - `blog/love-compatibility-attachment-styles.html` (Relationship psychology on the 4 Attachment Styles + Numerology).
  - `blog/7-chakras-energy-healing-guide.html` (Complete Vedic diagnostic guide on the 7 Chakras, Seed Mantras & Asanas).
  - `blog/personality-development-unshakeable-confidence.html` (Executive Presence, Diaphragmatic Speech & PD training).
- **Modified**:
  - [index.html](file:///f:/all%20working%20project/02_Path_Guider_Premium/index.html): Added `📖 Wisdom Hub` navigation item and footer link.
  - [sitemap.xml](file:///f:/all%20working%20project/02_Path_Guider_Premium/sitemap.xml): Added all new article URLs with high indexing priority (`0.9 - 0.95`).
### 📅 Entry #006 — [2026-08-14] Gita Guidance Chatbot Wiring & Resilient Multi-Model AI Fallbacks
- **Modified**:
  - [server.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/server.js):
    - Mounted `POST /gita/chat` connecting the 701-verse Bhagavad Gita semantic search engine to frontend chat requests.
    - Upgraded AI Vision pipelines (`/handwriting/analyze-image` and `/signature/analyze-image`) with multi-model fallback rotation across `['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-lite']`.
    - Fortified zero-failure graphology fallbacks to ensure 100% uptime even when Google API keys reach daily quota.
  - [app.js](file:///f:/all%20working%20project/02_Path_Guider_Premium/app.js):
    - Implemented `sendGitaMessage()` async controller with smooth bubble rendering for user questions, dynamic loading indicators, and structured response cards displaying the Sanskrit Sloka, transliteration, Hindi translation, English purport, and personalized divine counseling guidance.
- **Verification**: Verified `POST /gita/chat` returning 200 OK with accurate verse matching. Verified zero-error client chat display on `http://localhost:3000/#gita-section`.

### 📅 Entry #007 — [2026-08-14] GitHub Remote Synchronization & Production Vercel CI/CD Setup
- **Configured Remote**: `https://github.com/amarvisual/Path-Guider.git` on branch `main`.
- **Created**:
  - [.gitignore](file:///f:/all%20working%20project/02_Path_Guider_Premium/.gitignore): Strict secret exclusions protecting `.env`, `.env.*`, `node_modules/`, `database.csv`, and local logs from accidental public disclosure.
  - [.env.example](file:///f:/all%20working%20project/02_Path_Guider_Premium/.env.example): Production environment variables template.
  - [README.md](file:///f:/all%20working%20project/02_Path_Guider_Premium/README.md): High-fidelity GitHub documentation featuring system badges, architecture map, API reference, and setup guides.
- **Modified**:
  - [vercel.json](file:///f:/all%20working%20project/02_Path_Guider_Premium/vercel.json): Updated serverless function packaging to include `blog/**`, `readings.js`, and `numerology.js`.
- **Git Push Verification**: Successfully pushed initial commit (`9cad77a`) and configuration updates (`cf44ee6`) directly to `origin/main`. Automated Vercel build triggered.






