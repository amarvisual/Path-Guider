// Horoscope, Lucky Day, Chakra, Meditation, Ayurveda, Fasting — all combined

// ── DAILY HOROSCOPE ───────────────────────────────────────────
const HOROSCOPE_MESSAGES = {
  aries:       ['Today is powerful for new starts. Mars fuels your courage — take that bold step.','Avoid conflicts today. Channel energy into productive work instead.','A financial opportunity is near. Stay alert and trust your instincts.'],
  taurus:      ['Stability is your strength today. Focus on long-term goals, not quick fixes.','Someone close needs your patience. Give them time and space.','Financial matters look favorable. A good day to review savings or investments.'],
  gemini:      ['Communication flows easily today. Express your ideas — people are listening.','Your mind is sharp but scattered. Pick one task and finish it completely.','A new connection today could open unexpected doors for your career.'],
  cancer:      ['Family harmony is highlighted today. Nurture your home relationships.','Your intuition is especially strong — trust your gut feeling completely.','Emotional healing is possible today. Let go of a past hurt.'],
  leo:         ['Your natural charisma shines brightly today. Lead without ego.','Recognition is coming. Your hard work will not go unnoticed much longer.','Avoid being domineering today. Collaboration will get you further than solo effort.'],
  virgo:       ['Detail-oriented work brings rewards today. Excellence in small things matters.','Health and routine are in focus. Start or strengthen a good habit today.','A practical solution to a long-standing problem will reveal itself today.'],
  libra:       ['Balance in relationships is the theme. Seek harmony, not victory.','An important decision needs to be made. Weigh all sides — then act decisively.','Beauty and creativity flow today. Express yourself through art or appearance.'],
  scorpio:     ['Deep transformation is underway. Embrace change rather than resist it.','A hidden truth may surface today. Be prepared to face it with grace.','Your intensity is magnetic today. Use it to attract what you truly desire.'],
  sagittarius: ['Adventure calls! Step outside your routine — even a small change refreshes the soul.','Philosophical clarity comes today. Write down your thoughts and insights.','International or long-distance connections bring good news.'],
  capricorn:   ['Discipline pays off today. Stay on course — the finish line is closer than you think.','Authority figures are favorable toward you. A good day to make important requests.','Slow down slightly to avoid errors. Precision matters more than speed today.'],
  aquarius:    ['Innovation is your superpower today. Think outside the box — your idea matters.','Community and friendships bring joy. Reach out to someone you have not spoken to.','Technology or digital ventures show promise. Explore new tools or platforms.'],
  pisces:      ['Spiritual sensitivity is heightened. Meditate, pray, or spend time in nature.','Creative inspiration is flowing — capture it before it fades.','Compassion for others today will return to you multiplied.'],
};

function getDailyHoroscope(sign) {
  const s = sign.toLowerCase();
  const msgs = HOROSCOPE_MESSAGES[s] || HOROSCOPE_MESSAGES['aries'];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return { sign: s, message: msgs[dayOfYear % msgs.length], date: new Date().toDateString() };
}

// ── LUCKY DAY FINDER ──────────────────────────────────────────
const LUCKY_DAYS = {
  1: { days:['Sunday','Monday'], months:[1,10], colors:['Red','Orange','Gold'], numbers:[1,10,19,28], avoid:'Saturday', tip:'Start new projects on Sundays. Wear red for important meetings.' },
  2: { days:['Monday','Friday'], months:[2,7], colors:['White','Silver','Cream'], numbers:[2,11,20,29], avoid:'Tuesday', tip:'Monday mornings are magical for you. Fast on Mondays for blessings.' },
  3: { days:['Thursday','Wednesday'], months:[3,12], colors:['Yellow','Purple'], numbers:[3,12,21,30], avoid:'Saturday', tip:'Thursday is your power day. Start learning or travel on Thursdays.' },
  4: { days:['Saturday','Sunday'], months:[4,8], colors:['Blue','Grey'], numbers:[4,13,22,31], avoid:'Thursday', tip:'Saturdays bring stability. Avoid starting new things on Tuesdays.' },
  5: { days:['Wednesday','Friday'], months:[5,9], colors:['Green','Turquoise'], numbers:[5,14,23], avoid:'Monday', tip:'Wednesdays are excellent for business deals and communication.' },
  6: { days:['Friday','Wednesday'], months:[6,9], colors:['Pink','White','Blue'], numbers:[6,15,24], avoid:'Tuesday', tip:'Fridays are blessed for love and money matters. Wear white or pink.' },
  7: { days:['Monday','Sunday'], months:[7,11], colors:['Violet','Purple','White'], numbers:[7,16,25], avoid:'Friday', tip:'Sundays are for spiritual practice. Meditate every Sunday morning.' },
  8: { days:['Saturday','Thursday'], months:[8,12], colors:['Black','Navy','Dark Blue'], numbers:[8,17,26], avoid:'Sunday', tip:'Saturdays are your power days. Chant Shani Mantra every Saturday.' },
  9: { days:['Tuesday','Sunday'], months:[9,3], colors:['Red','Maroon'], numbers:[9,18,27], avoid:'Wednesday', tip:'Tuesdays are excellent for action and courage. Wear red.' },
  11: { days:['Monday','Wednesday'], months:[11,2], colors:['Silver','White','Lavender'], numbers:[11,2,29], avoid:'Saturday', tip:'You are a master number — any day can be lucky with spiritual focus.' },
  22: { days:['Saturday','Thursday'], months:[4,8], colors:['White','Gold'], numbers:[22,4,13], avoid:'Tuesday', tip:'Master Builder — Saturdays and Thursdays carry enormous potential for you.' },
};

function getLuckyDays(lifePath) {
  return LUCKY_DAYS[Number(lifePath)] || LUCKY_DAYS[1];
}

// ── CHAKRA FINDER ─────────────────────────────────────────────
const CHAKRAS = [
  { name:'Root Chakra', sanskrit:'Muladhara', color:'Red', location:'Base of spine', blocked:'Fear, anxiety, insecurity, financial worries, feeling unstable', open:'Grounded, secure, stable, financially comfortable', keywords:['fear','anxiety','insecure','unstable','money','survival','ground'], heal:'Walk barefoot on grass, eat root vegetables, chant LAM', crystal:'Red Jasper, Black Tourmaline', yoga:'Mountain Pose (Tadasana)', number:1 },
  { name:'Sacral Chakra', sanskrit:'Svadhisthana', color:'Orange', location:'Below navel', blocked:'Guilt, shame, creative blocks, relationship issues, low pleasure', open:'Creative, joyful, sexually balanced, emotionally fluid', keywords:['guilt','shame','creative','relationship','pleasure','emotion','feel'], heal:'Dance, swim, eat oranges, chant VAM', crystal:'Carnelian, Orange Calcite', yoga:'Warrior II, Hip openers', number:2 },
  { name:'Solar Plexus', sanskrit:'Manipura', color:'Yellow', location:'Upper abdomen', blocked:'Low self-esteem, powerless, lack of control, anger', open:'Confident, motivated, purposeful, strong willpower', keywords:['confidence','power','control','self esteem','anger','ego','weak'], heal:'Sunbathe, eat yellow foods, chant RAM', crystal:'Citrine, Tiger\'s Eye', yoga:'Boat Pose (Navasana)', number:3 },
  { name:'Heart Chakra', sanskrit:'Anahata', color:'Green', location:'Center of chest', blocked:'Loneliness, heartbreak, grief, unable to give/receive love', open:'Compassionate, loving, joyful, deeply connected', keywords:['love','heartbreak','lonely','grief','compassion','relationship','forgive'], heal:'Spend time in nature, eat greens, chant YAM', crystal:'Rose Quartz, Green Aventurine', yoga:'Camel Pose (Ustrasana)', number:4 },
  { name:'Throat Chakra', sanskrit:'Vishuddha', color:'Blue', location:'Throat area', blocked:'Unable to express, fear of speaking, lies, thyroid issues', open:'Communicates truthfully, creative, good speaker, authentic', keywords:['communication','speak','truth','express','voice','lie','thyroid'], heal:'Sing, chant, drink water, wear blue, chant HAM', crystal:'Blue Lace Agate, Sodalite', yoga:'Fish Pose (Matsyasana)', number:5 },
  { name:'Third Eye', sanskrit:'Ajna', color:'Indigo', location:'Between eyebrows', blocked:'Lack of intuition, confusion, headaches, can\'t see clearly', open:'Intuitive, wise, clear-sighted, spiritually aware', keywords:['intuition','confusion','headache','clarity','vision','wisdom','insight'], heal:'Meditate, star gaze, chant OM', crystal:'Amethyst, Lapis Lazuli', yoga:'Child\'s Pose (Balasana)', number:6 },
  { name:'Crown Chakra', sanskrit:'Sahasrara', color:'Violet/White', location:'Top of head', blocked:'Disconnected from spirituality, purposeless, depressed', open:'Spiritually connected, enlightened, at peace with existence', keywords:['spiritual','purpose','meaning','disconnected','enlightened','divine','god'], heal:'Meditation, fasting, silent prayer, chant silence or OM', crystal:'Clear Quartz, Selenite', yoga:'Lotus Pose (Padmasana)', number:7 },
];

function getBlockedChakra(symptoms) {
  const text = (symptoms||'').toLowerCase();
  let best = CHAKRAS[0], bestScore = 0;
  for (const c of CHAKRAS) {
    const score = c.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best;
}

// ── MEDITATION GUIDE ──────────────────────────────────────────
const MEDITATION_GUIDES = {
  5:  { duration:5,  title:'Quick Calm', steps:['Sit comfortably, spine straight','Close your eyes, take 3 deep breaths','Count each inhale 1 to 5, then exhale 5 to 1','Repeat for 5 minutes','Open eyes slowly, carry the peace with you'] },
  10: { duration:10, title:'Morning Focus', steps:['Sit in Sukhasana (easy pose)','Set a gentle timer for 10 minutes','Focus on the space between your eyebrows (Ajna)','When mind wanders, gently return to the spot','Chant Om mentally with each breath','End with gratitude — name 3 things you are grateful for'] },
  20: { duration:20, title:'Deep Healing', steps:['Lie down or sit — be completely comfortable','Close eyes, breathe naturally','Scan your body from head to toes — relax each part','Visualize golden light entering on each inhale','Release darkness and tension on each exhale','Stay in this golden light for 15 minutes','Slowly return, wiggle fingers and toes','Journal your experience'] },
  30: { duration:30, title:'Transcendental', steps:['Sit in Padmasana or Siddhasana','Breathe deeply for 2 minutes to settle','Choose your mantra: Om Namah Shivaya or So Hum','Silently repeat mantra with each breath','Do not force — let the mantra flow naturally','If thoughts arise, gently return to mantra','After 25 minutes — sit in silence for 5 minutes','This is the state beyond thought — pure awareness'] },
};

function getMeditationGuide(minutes) {
  const m = parseInt(minutes) || 10;
  if (m <= 5) return MEDITATION_GUIDES[5];
  if (m <= 10) return MEDITATION_GUIDES[10];
  if (m <= 20) return MEDITATION_GUIDES[20];
  return MEDITATION_GUIDES[30];
}

// ── AYURVEDA DOSHA ────────────────────────────────────────────
const DOSHAS = {
  vata: { name:'Vata', elements:'Air + Space', traits:'Creative, quick-thinking, enthusiastic, light, dry', balanced:'Energetic, creative, flexible, joyful', imbalanced:'Anxious, fearful, dry skin, constipation, insomnia', diet:['Warm cooked foods','Ghee and oils','Sweet, sour, salty tastes','Avoid cold raw foods and caffeine'], lifestyle:['Regular routine is essential','Oil massage (Abhyanga) daily','Yoga: slow gentle poses','Sleep by 10 PM'], avoid:'Cold, dry, raw, irregular schedule' },
  pitta:{ name:'Pitta', elements:'Fire + Water', traits:'Intelligent, focused, ambitious, competitive, intense', balanced:'Sharp, confident, warm, good digestion', imbalanced:'Anger, inflammation, acid reflux, skin rashes', diet:['Cool and refreshing foods','Coconut water, cucumber, mint','Sweet, bitter, astringent tastes','Avoid spicy, oily, alcohol'], lifestyle:['Avoid midday sun','Moon-bathing at night','Yoga: cooling poses like moon salutation','Avoid overworking'], avoid:'Spicy food, heat, excess competition' },
  kapha:{ name:'Kapha', elements:'Earth + Water', traits:'Stable, nurturing, patient, strong, slow', balanced:'Calm, loving, grounded, strong immunity', imbalanced:'Lethargy, weight gain, depression, congestion', diet:['Light dry foods','Spicy ginger tea','Bitter, pungent, astringent tastes','Avoid heavy oily dairy foods'], lifestyle:['Wake before 6 AM','Vigorous daily exercise essential','Yoga: energizing sun salutations','New activities and challenges regularly'], avoid:'Daytime sleep, cold foods, heavy meals' },
};

function getDoshaReading(answers) {
  // answers = {vata: score, pitta: score, kapha: score}
  const dominant = Object.entries(answers).sort((a,b)=>b[1]-a[1])[0][0];
  return { dominant, dosha: DOSHAS[dominant], all: DOSHAS };
}

// ── FASTING GUIDE ─────────────────────────────────────────────
const FASTS = {
  ekadashi: { name:'Ekadashi', frequency:'Twice a month (11th day of each lunar fortnight)', deity:'Lord Vishnu', benefits:'Spiritual merit, cleansing body and mind, removes sins', rules:['Avoid rice, grains, and beans','Eat fruits, milk, nuts, and root vegetables only','Stay awake at night chanting Vishnu\'s names','Break fast next morning after sunrise'], mantra:'Om Namo Bhagavate Vasudevaya', bestFor:'Moksha, spiritual growth, removing past karma' },
  monday: { name:'Somvar Vrat', frequency:'Every Monday', deity:'Lord Shiva', benefits:'Good marriage, relief from sorrows, health, peace', rules:['Eat once in the day','Avoid non-veg, alcohol','Offer milk, bel patra to Shiva','Chant Om Namah Shivaya 108 times'], mantra:'Om Namah Shivaya', bestFor:'Marriage, love life, peace, health' },
  tuesday: { name:'Mangalvar Vrat', frequency:'Every Tuesday', deity:'Lord Hanuman / Mangal Dev', benefits:'Courage, overcome enemies, property, marriage (for girls)', rules:['Eat once — red colored food preferred','Offer red flowers to Hanuman','Read Hanuman Chalisa','Wear red clothes'], mantra:'Om Hanumate Namah', bestFor:'Courage, Mars doshas, enemies, property disputes' },
  saturday: { name:'Shanivar Vrat', frequency:'Every Saturday', deity:'Lord Shani', benefits:'Remove Saturn\'s malefic effects, career success, health', rules:['Eat once — black/dark colored food preferred','Offer mustard oil to Shani Dev idol','Feed crows (Shani\'s vehicle)','Wear black or dark blue'], mantra:'Om Shanaishcharaya Namah', bestFor:'Career, justice, removing Sade Sati effects' },
  navratri: { name:'Navratri Fast', frequency:'Twice a year (Chaitra & Sharadiya)', deity:'Goddess Durga (9 forms)', benefits:'Immense spiritual merit, fulfillment of wishes, protection', rules:['No grains, onion, garlic for 9 days','Eat Saatvik food only','Kanya Pujan on Ashtami','Perform Durga Aarti morning and evening'], mantra:'Om Dum Durgayai Namah', bestFor:'All wishes, protection, spiritual power' },
  pradosh: { name:'Pradosh Vrat', frequency:'13th day (Trayodashi) of each lunar fortnight', deity:'Lord Shiva and Parvati', benefits:'Removes all sins, grants all desires, blesses marriage', rules:['Fast until sunset','Offer bel patra and milk to Shiva','Chant Shiva Panchakshara','Break fast after pradosh time (1.5 hrs after sunset)'], mantra:'Om Namah Shivaya', bestFor:'Sins removal, marital harmony, health' },
};

function getFastingGuide(type) {
  return FASTS[type] || null;
}

function getAllFasts() {
  return Object.entries(FASTS).map(([key, f]) => ({ key, name: f.name, deity: f.deity, bestFor: f.bestFor }));
}

module.exports = {
  getDailyHoroscope,
  getLuckyDays,
  getBlockedChakra, CHAKRAS,
  getMeditationGuide,
  getDoshaReading, DOSHAS,
  getFastingGuide, getAllFasts, FASTS,
};
