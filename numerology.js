// ============================================================
// PATH GUIDER — Professional Pythagorean Numerology Engine v3.0
// Comprehensive calculation of Core Numbers, Karmic Debts,
// Karmic Lessons, Planes of Expression, Pinnacles & Personal Year
// ============================================================

const PYTHAGOREAN = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8
};

const VOWELS = new Set(['A','E','I','O','U']);
const MASTER_NUMBERS = new Set([11, 22, 33]);
const KARMIC_DEBT_NUMBERS = new Set([13, 14, 16, 19]);

function reduceNumber(num, preserveKarmic = false) {
  if (MASTER_NUMBERS.has(num)) return num;
  if (preserveKarmic && KARMIC_DEBT_NUMBERS.has(num)) return num;
  while (num > 9) {
    let sum = 0;
    String(num).split('').forEach(d => sum += parseInt(d));
    num = sum;
    if (MASTER_NUMBERS.has(num)) return num;
    if (preserveKarmic && KARMIC_DEBT_NUMBERS.has(num)) return num;
  }
  return num;
}

function digitSum(str) {
  return str.replace(/\D/g, '').split('').reduce((s, d) => s + parseInt(d), 0);
}

// ── 1. LIFE PATH NUMBER & KARMIC DETECTION ──────────────────
function calcLifePathDetailed(dob) {
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const rawDay = parseInt(dayStr);
  const rawMonth = parseInt(monthStr);
  const rawYear = digitSum(yearStr);

  const d = reduceNumber(rawDay);
  const m = reduceNumber(rawMonth);
  const y = reduceNumber(rawYear);

  const rawSum = d + m + y;
  const lifePath = reduceNumber(rawSum);

  // Check for Karmic Debt in day or rawSum
  const karmicDebts = [];
  if (KARMIC_DEBT_NUMBERS.has(rawDay)) karmicDebts.push({ number: rawDay, source: 'Birth Day' });
  if (KARMIC_DEBT_NUMBERS.has(rawSum)) karmicDebts.push({ number: rawSum, source: 'Life Path Sum' });

  return {
    lifePath,
    rawSum,
    karmicDebts
  };
}

// ── 2. DESTINY NUMBER (EXPRESSION) ─────────────────────────
function calcDestinyDetailed(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const total = letters.reduce((sum, l) => sum + (PYTHAGOREAN[l] || 0), 0);
  const destiny = reduceNumber(total);
  const karmic = KARMIC_DEBT_NUMBERS.has(total) ? total : null;
  return { destiny, rawTotal: total, karmic };
}

// ── 3. SOUL URGE (HEART'S DESIRE) ──────────────────────────
function calcSoulUrgeDetailed(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const vowelLetters = letters.filter(l => VOWELS.has(l));
  const total = vowelLetters.reduce((sum, l) => sum + (PYTHAGOREAN[l] || 0), 0);
  const soulUrge = reduceNumber(total || 1);
  const karmic = KARMIC_DEBT_NUMBERS.has(total) ? total : null;
  return { soulUrge, rawTotal: total, karmic };
}

// ── 4. PERSONALITY NUMBER ──────────────────────────────────
function calcPersonalityDetailed(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const consonants = letters.filter(l => !VOWELS.has(l));
  const total = consonants.reduce((sum, l) => sum + (PYTHAGOREAN[l] || 0), 0);
  const personality = reduceNumber(total || 1);
  return { personality, rawTotal: total };
}

// ── 5. KARMIC LESSONS (MISSING NUMBERS IN NAME) ────────────
function calcKarmicLessons(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const presentNumbers = new Set(letters.map(l => PYTHAGOREAN[l]).filter(Boolean));
  const missingNumbers = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      missingNumbers.push(i);
    }
  }
  return missingNumbers;
}

// ── 6. PLANES OF EXPRESSION ────────────────────────────────
function calcPlanesOfExpression(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
  if (letters.length === 0) return { mental: 25, emotional: 25, physical: 25, intuitive: 25 };

  const physicalLetters = new Set(['D', 'M', 'E', 'W']);
  const mentalLetters = new Set(['A', 'J', 'S', 'G', 'P', 'Y', 'H', 'Q', 'Z']);
  const emotionalLetters = new Set(['B', 'K', 'T', 'I', 'R', 'O', 'X']);
  const intuitiveLetters = new Set(['C', 'L', 'U', 'F']);

  let p = 0, m = 0, e = 0, i = 0;
  letters.forEach(l => {
    if (physicalLetters.has(l)) p++;
    else if (mentalLetters.has(l)) m++;
    else if (emotionalLetters.has(l)) e++;
    else if (intuitiveLetters.has(l)) i++;
  });

  const total = letters.length;
  return {
    physical: Math.round((p / total) * 100),
    mental: Math.round((m / total) * 100),
    emotional: Math.round((e / total) * 100),
    intuitive: Math.round((i / total) * 100)
  };
}

// ── 7. PERSONAL YEAR (2026) ────────────────────────────────
function calcPersonalYear(dob, targetYear = 2026) {
  const [, monthStr, dayStr] = dob.split('-');
  const m = reduceNumber(parseInt(monthStr));
  const d = reduceNumber(parseInt(dayStr));
  const y = reduceNumber(digitSum(String(targetYear)));
  return reduceNumber(m + d + y);
}

// ── 8. PINNACLES & CHALLENGES (4 LIFE STAGES) ─────────────
function calcPinnaclesAndChallenges(dob) {
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const m = reduceNumber(parseInt(monthStr));
  const d = reduceNumber(parseInt(dayStr));
  const y = reduceNumber(digitSum(yearStr));

  // 4 Pinnacles
  const p1 = reduceNumber(m + d);
  const p2 = reduceNumber(d + y);
  const p3 = reduceNumber(p1 + p2);
  const p4 = reduceNumber(m + y);

  // 4 Challenges
  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  // Life Path age transition for Pinnacles
  const lp = reduceNumber(m + d + y);
  const p1EndAge = 36 - lp;
  const p2EndAge = p1EndAge + 9;
  const p3EndAge = p2EndAge + 9;

  return {
    pinnacles: [
      { stage: 1, number: p1, ageRange: `Age 0 to ${p1EndAge}` },
      { stage: 2, number: p2, ageRange: `Age ${p1EndAge + 1} to ${p2EndAge}` },
      { stage: 3, number: p3, ageRange: `Age ${p2EndAge + 1} to ${p3EndAge}` },
      { stage: 4, number: p4, ageRange: `Age ${p3EndAge + 1}+` }
    ],
    challenges: [
      { stage: 1, number: c1, title: 'Early Life Challenge' },
      { stage: 2, number: c2, title: 'Mid-Life Challenge' },
      { stage: 3, number: c3, title: 'Main Life Challenge' },
      { stage: 4, number: c4, title: 'Culmination Challenge' }
    ]
  };
}

// ── 9. MOBILE VIBRATION ────────────────────────────────────
function calcMobileVibration(mobile) {
  const digits = mobile.replace(/\D/g, '');
  const total = digits.split('').reduce((s, d) => s + parseInt(d), 0);
  return reduceNumber(total || 1);
}

// ── 10. BIRTHDAY & MATURITY ────────────────────────────────
function calcBirthDay(dob) {
  const day = parseInt(dob.split('-')[2]);
  return reduceNumber(day);
}

function calcMaturityNumber(lifePath, destiny) {
  return reduceNumber(lifePath + destiny);
}

// ── 11. ZODIAC SIGN & LUCKY PROFILE ────────────────────────
function getZodiacSign(dob) {
  const [, month, day] = dob.split('-').map(Number);
  const signs = [
    { sign: 'Capricorn',  hindi: 'मकर', symbol: '♑', element: 'Earth', ruler: 'Saturn', end: [1,19] },
    { sign: 'Aquarius',   hindi: 'कुंभ', symbol: '♒', element: 'Air', ruler: 'Saturn/Uranus', end: [2,18] },
    { sign: 'Pisces',     hindi: 'मीन', symbol: '♓', element: 'Water', ruler: 'Jupiter/Neptune', end: [3,20] },
    { sign: 'Aries',      hindi: 'मेष', symbol: '♈', element: 'Fire', ruler: 'Mars', end: [4,19] },
    { sign: 'Taurus',     hindi: 'वृषभ', symbol: '♉', element: 'Earth', ruler: 'Venus', end: [5,20] },
    { sign: 'Gemini',     hindi: 'मिथुन', symbol: '♊', element: 'Air', ruler: 'Mercury', end: [6,20] },
    { sign: 'Cancer',     hindi: 'कर्क', symbol: '♋', element: 'Water', ruler: 'Moon', end: [7,22] },
    { sign: 'Leo',        hindi: 'सिंह', symbol: '♌', element: 'Fire', ruler: 'Sun', end: [8,22] },
    { sign: 'Virgo',      hindi: 'कन्या', symbol: '♍', element: 'Earth', ruler: 'Mercury', end: [9,22] },
    { sign: 'Libra',      hindi: 'तुला', symbol: '♎', element: 'Air', ruler: 'Venus', end: [10,22] },
    { sign: 'Scorpio',    hindi: 'वृश्चिक', symbol: '♏', element: 'Water', ruler: 'Mars/Pluto', end: [11,21] },
    { sign: 'Sagittarius',hindi: 'धनु', symbol: '♐', element: 'Fire', ruler: 'Jupiter', end: [12,21] },
    { sign: 'Capricorn',  hindi: 'मकर', symbol: '♑', element: 'Earth', ruler: 'Saturn', end: [12,31] }
  ];
  for (const s of signs) {
    if (month < s.end[0] || (month === s.end[0] && day <= s.end[1])) return s;
  }
  return signs[0];
}

function getLuckyInfo(lifePath) {
  const lucky = {
    1:  { numbers: [1, 10, 19, 28], colors: 'Gold, Amber & Crimson', day: 'Sunday', gemstone: 'Ruby / Sunstone', deity: 'Surya Dev', affirmation: 'I am the sovereign creator of my destiny. I lead with courage, originality, and truth.' },
    2:  { numbers: [2, 11, 20, 29], colors: 'Silver, Pearl White & Cream', day: 'Monday', gemstone: 'Pearl / Moonstone', deity: 'Chandra Dev', affirmation: 'I radiate gentle harmony, deep intuition, and peaceful understanding to all around me.' },
    3:  { numbers: [3, 12, 21, 30], colors: 'Saffron, Radiant Yellow & Rose', day: 'Thursday', gemstone: 'Yellow Sapphire / Citrine', deity: 'Brihaspati / Saraswati', affirmation: 'My creative expression flows effortlessly, inspiring joy and abundance everywhere I go.' },
    4:  { numbers: [4, 13, 22, 31], colors: 'Forest Green, Khaki & Royal Blue', day: 'Saturday', gemstone: 'Hessonite / Emerald', deity: 'Lord Ganesha', affirmation: 'I build unshakeable foundations of wealth, discipline, and enduring legacy.' },
    5:  { numbers: [5, 14, 23],    colors: 'Emerald Green, Turquoise & Silver', day: 'Wednesday', gemstone: 'Emerald / Aquamarine', deity: 'Budha Dev', affirmation: 'I embrace infinite possibilities, freedom, and divine adventure with total confidence.' },
    6:  { numbers: [6, 15, 24],    colors: 'Rose Pink, Lavender & Royal Indigo', day: 'Friday', gemstone: 'Diamond / Opal', deity: 'Goddess Lakshmi', affirmation: 'I am a magnet for unconditional love, exquisite beauty, and harmonious prosperity.' },
    7:  { numbers: [7, 16, 25],    colors: 'Amethyst Violet, Sea Green & Pure White', day: 'Monday', gemstone: 'Cat\'s Eye / Amethyst', deity: 'Lord Shiva', affirmation: 'Divine wisdom illuminates my mind. I see through all illusions into universal truth.' },
    8:  { numbers: [8, 17, 26],    colors: 'Midnight Blue, Charcoal & Gold', day: 'Saturday', gemstone: 'Blue Sapphire / Lapis Lazuli', deity: 'Lord Shani', affirmation: 'Infinite material and spiritual abundance flows through me as I lead with integrity.' },
    9:  { numbers: [9, 18, 27],    colors: 'Ruby Red, Coral & Saffron Gold', day: 'Tuesday', gemstone: 'Red Coral / Garnet', deity: 'Lord Hanuman', affirmation: 'I release the past with gratitude and uplift humanity through boundless compassion.' },
    11: { numbers: [11, 2, 20, 29], colors: 'Electrifying Silver, Gold & Violet', day: 'Monday', gemstone: 'White Sapphire / Moonstone', deity: 'Universal Light', affirmation: 'I am a direct channel of divine illumination, spiritual vision, and awakening.' },
    22: { numbers: [22, 4, 13, 31], colors: 'Platinum Gold, Jade Green & Coral', day: 'Saturday', gemstone: 'Diamond / Jade', deity: 'Lord Brahma / Vishwakarma', affirmation: 'I turn the grandest visions into tangible reality that elevates the human race.' },
    33: { numbers: [33, 6, 15, 24], colors: 'Luminous Pink, Gold & Turquoise', day: 'Friday', gemstone: 'Kunzite / Diamond', deity: 'Universal Mother', affirmation: 'I embody divine compassion and healing grace, uplifting every soul I touch.' }
  };
  return lucky[lifePath] || lucky[1];
}

// ── MASTER RUN ANALYSIS ────────────────────────────────────
function runFullAnalysis(name, dob, mobile) {
  const lpData = calcLifePathDetailed(dob);
  const dstData = calcDestinyDetailed(name);
  const soulData = calcSoulUrgeDetailed(name);
  const perData = calcPersonalityDetailed(name);
  const mobileVib = calcMobileVibration(mobile);
  const birthDay = calcBirthDay(dob);
  const maturity = calcMaturityNumber(lpData.lifePath, dstData.destiny);
  const zodiac = getZodiacSign(dob);
  const lucky = getLuckyInfo(lpData.lifePath);
  const karmicLessons = calcKarmicLessons(name);
  const planes = calcPlanesOfExpression(name);
  const personalYear = calcPersonalYear(dob, 2026);
  const cycles = calcPinnaclesAndChallenges(dob);

  // Consolidate Karmic Debts from all sources
  const allKarmicDebts = [...lpData.karmicDebts];
  if (dstData.karmic) allKarmicDebts.push({ number: dstData.karmic, source: 'Destiny' });
  if (soulData.karmic) allKarmicDebts.push({ number: soulData.karmic, source: 'Soul Urge' });

  return {
    name, dob, mobile,
    lifePath: lpData.lifePath,
    destiny: dstData.destiny,
    soulUrge: soulData.soulUrge,
    personality: perData.personality,
    mobileVib, birthDay, maturity,
    zodiac, lucky,
    karmicDebts: allKarmicDebts,
    karmicLessons,
    planes,
    personalYear,
    cycles,
    numbers: {
      lifePath: lpData.lifePath,
      destiny: dstData.destiny,
      soulUrge: soulData.soulUrge,
      personality: perData.personality,
      mobileVib, birthDay, maturity,
      personalYear
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PYTHAGOREAN,
    reduceNumber,
    calcLifePathDetailed,
    calcDestinyDetailed,
    calcSoulUrgeDetailed,
    calcPersonalityDetailed,
    calcKarmicLessons,
    calcPlanesOfExpression,
    calcPersonalYear,
    calcPinnaclesAndChallenges,
    calcMobileVibration,
    calcBirthDay,
    calcMaturityNumber,
    getZodiacSign,
    getLuckyInfo,
    runFullAnalysis
  };
}
