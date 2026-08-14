// Festival Calendar 2026, Vrat Calendar, Kundli Doshas, Temple Guide, Spiritual Quiz

// ── FESTIVAL CALENDAR 2026 ────────────────────────────────────
const FESTIVALS_2026 = [
  { date:'2026-01-14', name:'Makar Sankranti', hindi:'मकर संक्रांति', significance:'Sun enters Capricorn — harvest festival, kite flying, til-gur', puja:'Surya Puja at sunrise, donate sesame seeds', states:'All India — Pongal in South, Lohri in Punjab' },
  { date:'2026-01-26', name:'Republic Day', hindi:'गणतंत्र दिवस', significance:'National holiday', puja:'Patriotic observance', states:'All India' },
  { date:'2026-02-14', name:'Basant Panchami', hindi:'बसंत पंचमी', significance:'Goddess Saraswati birthday — spring begins', puja:'Saraswati Puja, wear yellow, keep books for blessing', states:'All India' },
  { date:'2026-02-26', name:'Maha Shivratri', hindi:'महाशिवरात्रि', significance:'Lord Shiva\'s great night — most powerful Shiva festival', puja:'All-night jagran, Rudrabhishek, fast, chant Om Namah Shivaya', states:'All India' },
  { date:'2026-03-14', name:'Holi', hindi:'होली', significance:'Festival of colors — victory of good over evil (Prahlad-Holika)', puja:'Holika Dahan night before, Rangwali Holi next day', states:'North & Central India primarily' },
  { date:'2026-03-25', name:'Chaitra Navratri Begins', hindi:'चैत्र नवरात्रि', significance:'9 nights of Goddess Durga worship in spring', puja:'Daily Durga Aarti, fast, Kanya Pujan on Day 8', states:'All India' },
  { date:'2026-04-02', name:'Ram Navami', hindi:'रामनवमी', significance:'Lord Rama\'s birthday — end of Chaitra Navratri', puja:'Ram Katha, fast, Rama Puja, distribute Prasad', states:'All India' },
  { date:'2026-04-06', name:'Hanuman Jayanti', hindi:'हनुमान जयंती', significance:'Lord Hanuman\'s birthday', puja:'Hanuman Puja, Chalisa 5x, offer sindoor and ladoo', states:'All India' },
  { date:'2026-04-14', name:'Baisakhi / Tamil New Year', hindi:'बैसाखी', significance:'Harvest festival, Sikh New Year, Punjabi New Year', puja:'Gurudwara visit, bhangra, community feast', states:'Punjab, Haryana, Tamil Nadu' },
  { date:'2026-05-15', name:'Buddha Purnima', hindi:'बुद्ध पूर्णिमा', significance:'Gautam Buddha\'s birth, enlightenment, and death anniversary', puja:'Meditation, visit Buddha temples, donate to poor', states:'All India' },
  { date:'2026-07-11', name:'Jagannath Rath Yatra', hindi:'रथ यात्रा', significance:'Lord Jagannath\'s chariot procession', puja:'Pull the chariot rope for blessings, attend procession', states:'Odisha (Puri) primarily, celebrated across India' },
  { date:'2026-08-09', name:'Nag Panchami', hindi:'नाग पंचमी', significance:'Worship of serpent deities — protection from snakes and Nag dosha', puja:'Offer milk to snake idols, chant Nag mantra', states:'All India' },
  { date:'2026-08-23', name:'Raksha Bandhan', hindi:'रक्षाबंधन', significance:'Bond of protection between brothers and sisters', puja:'Sister ties Rakhi on brother\'s wrist, brother gives gift', states:'All India' },
  { date:'2026-08-31', name:'Janmashtami', hindi:'जन्माष्टमी', significance:'Lord Krishna\'s birthday — midnight celebration', puja:'Fast until midnight, Krishna Puja at 12 AM, Dahi Handi', states:'All India — Mathura-Vrindavan is special' },
  { date:'2026-09-18', name:'Ganesh Chaturthi', hindi:'गणेश चतुर्थी', significance:'Lord Ganesha\'s birthday — 10-day festival', puja:'Ganesh idol installation, daily Aarti, Visarjan on Day 10', states:'Maharashtra, Karnataka, Andhra — celebrated across India' },
  { date:'2026-10-01', name:'Sharad Navratri Begins', hindi:'शारदीय नवरात्रि', significance:'9 nights of Goddess Durga — most celebrated Navratri', puja:'Garba, dandiya, daily Aarti, fast, Kanya Pujan', states:'All India' },
  { date:'2026-10-09', name:'Dussehra / Vijayadashami', hindi:'दशहरा', significance:'Victory of Lord Rama over Ravana — good over evil', puja:'Ravana effigy burning, Ramlila, Shami tree worship', states:'All India' },
  { date:'2026-10-28', name:'Karva Chauth', hindi:'करवा चौथ', significance:'Wives fast for husbands\' long life — moonrise breaking of fast', puja:'Fast from sunrise, see moon through sieve, break fast', states:'North India primarily' },
  { date:'2026-11-07', name:'Dhanteras', hindi:'धनतेरस', significance:'Festival of wealth — Goddess Lakshmi and Lord Dhanvantari', puja:'Buy gold/silver, Lakshmi Puja in evening, light diyas', states:'All India' },
  { date:'2026-11-08', name:'Naraka Chaturdashi (Chhoti Diwali)', hindi:'छोटी दीवाली', significance:'Victory of Krishna over demon Narakasura', puja:'Oil bath before sunrise, light 14 diyas', states:'All India' },
  { date:'2026-11-09', name:'Diwali', hindi:'दीवाली 🪔', significance:'Festival of lights — Rama\'s return to Ayodhya, Lakshmi Puja', puja:'Lakshmi-Ganesh Puja at sunset, fireworks, sweets, diyas', states:'All India — biggest festival!' },
  { date:'2026-11-11', name:'Bhai Dooj', hindi:'भाई दूज', significance:'Sisters pray for brothers\' long life', puja:'Tilak ceremony, sister feeds brother and prays', states:'All India' },
  { date:'2026-12-25', name:'Christmas', hindi:'क्रिसमस', significance:'Birthday of Jesus Christ', puja:'Church visit, charity, gift-giving', states:'All India' },
];

// ── VRAT CALENDAR 2026 ────────────────────────────────────────
const EKADASHIS_2026 = [
  { date:'2026-01-10', name:'Pausha Putrada Ekadashi', benefit:'Bless couples seeking children, remove sins' },
  { date:'2026-01-25', name:'Shattila Ekadashi', benefit:'Donate sesame — get moksha and fulfil all desires' },
  { date:'2026-02-09', name:'Jaya Ekadashi', benefit:'Remove sinful karmas, grant moksha' },
  { date:'2026-02-24', name:'Vijaya Ekadashi', benefit:'Victory in all endeavors, remove enemies' },
  { date:'2026-03-10', name:'Amalaki Ekadashi', benefit:'Amla tree worship — health, prosperity' },
  { date:'2026-03-25', name:'Papamochani Ekadashi', benefit:'Removes all sins — very powerful' },
  { date:'2026-04-09', name:'Kamada Ekadashi', benefit:'Fulfills all wishes, removes Nag dosha' },
  { date:'2026-04-24', name:'Varuthini Ekadashi', benefit:'Charity and fasting give immense merit' },
  { date:'2026-05-08', name:'Mohini Ekadashi', benefit:'Removes confusion and illusion, grants clarity' },
  { date:'2026-05-23', name:'Apara Ekadashi', benefit:'Removes all sins, especially Brahmin offenses' },
  { date:'2026-06-07', name:'Nirjala Ekadashi', benefit:'Most powerful — fast without even water, merit of all 24 Ekadashis' },
  { date:'2026-06-22', name:'Yogini Ekadashi', benefit:'Removes diseases, grants good health' },
  { date:'2026-07-06', name:'Devshayani Ekadashi', benefit:'Vishnu goes to sleep — begin 4 month Chaturmas' },
  { date:'2026-07-21', name:'Kamika Ekadashi', benefit:'Dear to Vishnu, grants moksha and removes sins' },
  { date:'2026-08-05', name:'Shravana Putrada Ekadashi', benefit:'Blesses childless couples with offspring' },
  { date:'2026-08-20', name:'Aja Ekadashi', benefit:'Frees from all sins of multiple lifetimes' },
  { date:'2026-09-03', name:'Parsva Ekadashi', benefit:'Vishnu turns sides — very auspicious' },
  { date:'2026-09-18', name:'Indira Ekadashi', benefit:'Liberates ancestors from hell, removes pitru dosha' },
  { date:'2026-10-03', name:'Papankusha Ekadashi', benefit:'Destroys all accumulated sins' },
  { date:'2026-10-18', name:'Rama Ekadashi', benefit:'Devotion to Rama, remove all afflictions' },
  { date:'2026-11-01', name:'Devutthana Ekadashi', benefit:'Vishnu wakes up — Tulsi Vivah, marriages begin' },
  { date:'2026-11-16', name:'Utpanna Ekadashi', benefit:'Origin of Ekadashi — very sacred' },
  { date:'2026-12-01', name:'Mokshada Ekadashi', benefit:'Bhagavad Gita day — grants moksha' },
  { date:'2026-12-16', name:'Saphala Ekadashi', benefit:'Makes all efforts successful' },
];

// ── KUNDLI DOSHAS ─────────────────────────────────────────────
const DOSHAS_KUNDLI = {
  mangal: {
    name:'Mangal Dosha (Manglik)',
    also:'Kuja Dosha, Bhom Dosha',
    cause:'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house',
    effects:['Delay in marriage','Conflicts in married life','Possible partner health issues','Financial challenges after marriage'],
    remedies:['Marry another Manglik','Kumbha Vivah (marry a banana tree or Vishnu idol first)','Wear red coral (Moonga) after consulting astrologer','Chant Mangal Mantra 108 times on Tuesdays','Visit Navagraha temple on Tuesdays','Hanuman Chalisa every Tuesday'],
    mantra:'Om Kram Krim Kraum Sah Bhaumaya Namah',
    severity:'High — consult astrologer for exact position',
  },
  kaal_sarp: {
    name:'Kaal Sarp Dosha',
    also:'Kala Sarpa Yoga',
    cause:'All 7 planets between Rahu and Ketu',
    effects:['Struggle in life despite hard work','Repeated failures','Fear and anxiety','Delays in career and marriage','Ancestors\' unfulfilled wishes'],
    remedies:['Kaal Sarp Puja at Trimbakeshwar (Nashik) or Ujjain','Wear Nagendra Har (serpent necklace)','Rudrabhishek on Nag Panchami','Feed milk to snakes (at temple)','Chant Rahu-Ketu mantras','Help ancestors — Pind Daan at Gaya or Prayagraj'],
    mantra:'Om Rahu Rahave Namah | Om Kem Ketave Namah',
    severity:'Moderate to High — depends on exact Rahu-Ketu positions',
  },
  shani_sade_sati: {
    name:'Shani Sade Sati',
    also:'7.5 years of Saturn',
    cause:'Saturn transiting over natal Moon sign (3 rounds of 2.5 years each)',
    effects:['Delays and obstacles in career','Health challenges','Financial pressures','Relationship difficulties','Tests of character and patience'],
    remedies:['Chant Shani Mantra every Saturday','Offer mustard oil at Shani temple on Saturdays','Feed crows (Shani\'s vehicle)','Wear black on Saturdays','Read Shani Chalisa','Donate black sesame seeds on Saturdays','Be honest and hardworking — Saturn rewards karma'],
    mantra:'Om Sham Shanaishcharaya Namah',
    severity:'Moderate — Sade Sati is a test, not a curse. It builds character.',
  },
  pitru: {
    name:'Pitru Dosha',
    also:'Ancestor Dosha',
    cause:'Unresolved karmas of ancestors, not performing Shraddha rites',
    effects:['Family disputes','Financial instability','Health issues in family','Problems with children','Repeated misfortunes'],
    remedies:['Perform Shraddha during Pitru Paksha (every year)','Pind Daan at Gaya (Bihar) or Prayagraj','Offer water to ancestors daily (Tarpan)','Feed crows and cows','Chant Pitru Tarpan Mantra','Donate food and clothes to Brahmins'],
    mantra:'Om Pitribhyah Namah, Om Somaya Pitru-Mate Namah',
    severity:'Moderate — cleared through Shraddha and charitable acts',
  },
};

// ── TEMPLE GUIDE ──────────────────────────────────────────────
const TEMPLES = {
  delhi: [
    { name:'Akshardham Temple', deity:'Swaminarayan/Vishnu', significance:'Largest Hindu temple complex in the world', bestTime:'All year except Mondays (closed)', offering:'Lotus flowers, tulsi' },
    { name:'Lotus Temple (Bahai)', deity:'Universal', significance:'Architectural masterpiece — open to all faiths', bestTime:'All year except Mondays', offering:'Prayers of all faiths' },
    { name:'Chattarpur Temple', deity:'Goddess Katyayani (Durga)', significance:'One of largest temples in India', bestTime:'Navratri', offering:'Red flowers, sindoor' },
  ],
  mumbai: [
    { name:'Siddhivinayak Temple', deity:'Lord Ganesha', significance:'Most powerful Ganesh temple — wishes fulfilled', bestTime:'Tuesday mornings', offering:'Modak, red flowers, durva grass' },
    { name:'Mahalakshmi Temple', deity:'Goddess Lakshmi', significance:'Ancient Lakshmi temple — wealth blessings', bestTime:'Fridays, Diwali', offering:'Lotus flowers, coins' },
    { name:'Haji Ali Dargah', deity:'Saint Haji Ali', significance:'Famous sufi shrine on an island', bestTime:'Thursdays and Fridays', offering:'Chaadar, flowers' },
  ],
  varanasi: [
    { name:'Kashi Vishwanath Temple', deity:'Lord Shiva (Vishwanath)', significance:'One of 12 Jyotirlingas — most sacred Shiva temple', bestTime:'Maha Shivratri, Mondays', offering:'Bel patra, milk, Ganga water' },
    { name:'Sankat Mochan Temple', deity:'Lord Hanuman', significance:'Famous for removing all troubles and sorrows', bestTime:'Tuesdays and Saturdays', offering:'Sindoor, ladoo, flowers' },
    { name:'Durga Temple (Monkey Temple)', deity:'Goddess Durga', significance:'Ancient temple with sacred tank', bestTime:'Navratri', offering:'Red flowers, sindoor' },
  ],
  tirupati: [
    { name:'Tirumala Venkateswara Temple', deity:'Lord Venkateswara (Vishnu)', significance:'Richest and most visited temple in the world', bestTime:'All year — book darshan online in advance', offering:'Hair donation (tonsure), ladoo prasad' },
  ],
  shirdi: [
    { name:'Sai Baba Temple', deity:'Sai Baba of Shirdi', significance:'Saint who transcended Hindu-Muslim divide', bestTime:'Thursdays', offering:'Flowers, dasakshari, donate at temple' },
  ],
  mathura_vrindavan: [
    { name:'Banke Bihari Temple', deity:'Lord Krishna', significance:'Most beloved Krishna temple — darshan is magical', bestTime:'Janmashtami, Holi', offering:'Butter, flowers, tulsi' },
    { name:'ISKCON Vrindavan', deity:'Radha-Krishna', significance:'International Krishna temple — beautiful architecture', bestTime:'All year', offering:'Tulsi, flowers' },
  ],
};

// ── SPIRITUAL QUIZ ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { id:1, q:'Who narrated the Bhagavad Gita?', options:['Lord Vishnu','Lord Shiva','Lord Krishna','Lord Brahma'], answer:2, explanation:'Lord Krishna narrated the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra.' },
  { id:2, q:'How many chapters are in the Bhagavad Gita?', options:['14','16','18','21'], answer:2, explanation:'The Bhagavad Gita has 18 chapters (Adhyayas) containing 700 verses (shlokas).' },
  { id:3, q:'What does "Karma" mean in the Gita?', options:['Fate','Action/Duty','Destiny','Worship'], answer:1, explanation:'Karma means action or duty. The Gita teaches Nishkama Karma — action without attachment to results.' },
  { id:4, q:'What is the meaning of "Yoga" in the Gita?', options:['Exercise','Path/Union with the Divine','Meditation only','Prayer'], answer:1, explanation:'In the Gita, Yoga means the path or method of union with the Divine — including Karma, Jnana, and Bhakti Yoga.' },
  { id:5, q:'Who was Arjuna\'s charioteer in the Mahabharata war?', options:['Bheema','Nakula','Krishna','Yudhishthira'], answer:2, explanation:'Lord Krishna himself served as Arjuna\'s charioteer — symbolizing the Divine as the guide of the human soul.' },
  { id:6, q:'What does "Dharma" mean?', options:['Religion only','Righteous duty/cosmic order','Prayer','Ritual'], answer:1, explanation:'Dharma means righteous duty, moral order, and one\'s sacred responsibility in life.' },
  { id:7, q:'Which chapter of the Gita discusses devotion (Bhakti)?', options:['Chapter 3','Chapter 6','Chapter 12','Chapter 18'], answer:2, explanation:'Chapter 12 — Bhakti Yoga — is dedicated to the path of devotion and love for God.' },
  { id:8, q:'What are the three Gunas (qualities) of nature?', options:['Dharma, Karma, Moksha','Sattva, Rajas, Tamas','Body, Mind, Soul','Truth, Love, Peace'], answer:1, explanation:'The three Gunas are Sattva (purity), Rajas (passion/activity), and Tamas (inertia/darkness).' },
  { id:9, q:'How many verses (shlokas) does the Gita contain?', options:['500','600','700','800'], answer:2, explanation:'The Bhagavad Gita contains exactly 700 verses (shlokas) across 18 chapters.' },
  { id:10, q:'What is "Moksha"?', options:['Heaven','Liberation from the cycle of birth and death','Material success','Divine grace'], answer:1, explanation:'Moksha is liberation — freedom from the cycle of birth, death, and rebirth (Samsara). It is the highest goal of human life.' },
  { id:11, q:'Which battlefield is the setting of the Bhagavad Gita?', options:['Ayodhya','Lanka','Kurukshetra','Dwarka'], answer:2, explanation:'The Bhagavad Gita takes place on the battlefield of Kurukshetra (in present-day Haryana, India).' },
  { id:12, q:'What does "Atman" refer to?', options:['The body','The mind','The individual soul/self','God'], answer:2, explanation:'Atman refers to the individual soul or self — the eternal, unchanging essence within every being.' },
  { id:13, q:'What is "Nishkama Karma"?', options:['Working for money','Selfless action without attachment to results','Prayer without words','Meditation in silence'], answer:1, explanation:'Nishkama Karma is the Gita\'s central teaching — doing your duty selflessly, without desire for personal gain or reward.' },
  { id:14, q:'Who were the two warring families in Mahabharata?', options:['Ramayana and Lanka','Pandavas and Kauravas','Vrishnis and Yadavas','Devas and Asuras'], answer:1, explanation:'The Mahabharata war was fought between the Pandavas (5 brothers including Arjuna) and the Kauravas (100 brothers led by Duryodhana).' },
  { id:15, q:'What is the meaning of "Om" (ॐ)?', options:['Peace','The sound of the Universe/Brahman','God','Love'], answer:1, explanation:'Om (Aum) is the primordial sound of the universe — representing Brahman (the ultimate reality). It encompasses past, present, and future.' },
];

module.exports = {
  FESTIVALS_2026, EKADASHIS_2026,
  DOSHAS_KUNDLI,
  TEMPLES,
  QUIZ_QUESTIONS,
};
