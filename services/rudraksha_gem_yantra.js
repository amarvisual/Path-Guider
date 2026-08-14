// Rudraksha Guide
const RUDRAKSHAS = {
  1: { mukhi:1, name:'Ek Mukhi', deity:'Lord Shiva', benefits:'Spiritual awakening, moksha, focus, removes all sins', wearFor:['spiritual growth','enlightenment','concentration','purpose'], mantra:'Om Hreem Namah', wear:'Monday morning, string in white thread' },
  2: { mukhi:2, name:'Do Mukhi', deity:'Ardhanarishwar', benefits:'Harmony in relationships, unity, emotional balance', wearFor:['relationship','marriage','love','harmony','family'], mantra:'Om Namah', wear:'Silver chain, Monday' },
  3: { mukhi:3, name:'Teen Mukhi', deity:'Agni (Fire God)', benefits:'Removes past karma, boosts confidence, good for students', wearFor:['confidence','karma','study','past trauma','guilt'], mantra:'Om Kleem Namah', wear:'Red thread, Monday morning' },
  4: { mukhi:4, name:'Chaar Mukhi', deity:'Lord Brahma', benefits:'Enhances creativity, intelligence, speech, knowledge', wearFor:['creativity','study','communication','knowledge','intelligence'], mantra:'Om Hreem Namah', wear:'Gold/silver chain, Wednesday' },
  5: { mukhi:5, name:'Paanch Mukhi', deity:'Kaalagni Rudra', benefits:'Peace of mind, health, freedom from fear, spiritual growth', wearFor:['peace','health','fear','anxiety','stress','general wellbeing'], mantra:'Om Hreem Namah', wear:'Any day, most common/universal' },
  6: { mukhi:6, name:'Chhe Mukhi', deity:'Lord Kartikeya', benefits:'Willpower, learning, focus, grounding', wearFor:['willpower','discipline','focus','children','study','laziness'], mantra:'Om Hreem Hum Namah', wear:'Gold thread, Monday' },
  7: { mukhi:7, name:'Saat Mukhi', deity:'Goddess Mahalakshmi', benefits:'Wealth, prosperity, business success, financial luck', wearFor:['money','business','wealth','finance','prosperity','debt'], mantra:'Om Hum Namah', wear:'Saturday, gold thread' },
  8: { mukhi:8, name:'Aath Mukhi', deity:'Lord Ganesha', benefits:'Removes obstacles, success in new ventures, wisdom', wearFor:['obstacle','new beginning','success','confusion','problem'], mantra:'Om Hum Namah', wear:'Wednesday or any day' },
  9: { mukhi:9, name:'Nau Mukhi', deity:'Goddess Durga', benefits:'Power, protection, energy, fearlessness, courage', wearFor:['courage','protection','strength','enemy','abuse','power'], mantra:'Om Hreem Hum Namah', wear:'Monday morning' },
  10: { mukhi:10, name:'Das Mukhi', deity:'Lord Vishnu', benefits:'Protection from evil eye, negative energy, spirits', wearFor:['negative energy','black magic','protection','evil eye','fear'], mantra:'Om Hreem Namah Namah', wear:'Any day, silver chain' },
  11: { mukhi:11, name:'Gyarah Mukhi', deity:'Indra', benefits:'Adventurous nature, courage, wisdom, meditation', wearFor:['adventure','courage','meditation','travel','wisdom'], mantra:'Om Hreem Hum Namah', wear:'Monday or Wednesday' },
  12: { mukhi:12, name:'Barah Mukhi', deity:'Lord Surya (Sun)', benefits:'Confidence, leadership, radiance, removes diseases', wearFor:['health','leadership','confidence','government job','career'], mantra:'Om Kraum Sraum Raum Namah', wear:'Sunday morning, gold chain' },
  14: { mukhi:14, name:'Chaudah Mukhi', deity:'Hanuman', benefits:'Intuition, decision making, protection, third eye', wearFor:['decision','intuition','spiritual power','protection'], mantra:'Om Namah', wear:'Saturday or Monday' },
};

function getRudraksha(problem) {
  const text = (problem||'').toLowerCase();
  let best = RUDRAKSHAS[5]; // default is 5 mukhi (universal)
  let bestScore = 0;
  for (const r of Object.values(RUDRAKSHAS)) {
    const score = r.wearFor.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = r; }
  }
  return best;
}

// Gemstone Recommender
const GEMSTONES = {
  ruby:        { name:'Ruby (Manik)', planet:'Sun', hindi:'माणिक', benefits:'Leadership, confidence, health, vitality, name & fame', wearOn:'Ring finger, Sunday morning, gold setting', mantra:'Om Suryaya Namah', caution:'Avoid if Leo is afflicted', lifePaths:[1,4,10,19,28] },
  pearl:       { name:'Pearl (Moti)', planet:'Moon', hindi:'मोती', benefits:'Peace, emotional balance, intuition, mother relationship', wearOn:'Little finger, Monday morning, silver', mantra:'Om Chandraya Namah', caution:'Avoid during high fever', lifePaths:[2,11,20,29] },
  coral:       { name:'Red Coral (Moonga)', planet:'Mars', hindi:'मूंगा', benefits:'Courage, energy, health, overcoming enemies', wearOn:'Ring finger, Tuesday morning, gold', mantra:'Om Mangalaya Namah', caution:'Avoid if Mars is weak in chart', lifePaths:[9,18,27] },
  emerald:     { name:'Emerald (Panna)', planet:'Mercury', hindi:'पन्ना', benefits:'Intelligence, business, communication, creativity', wearOn:'Little finger, Wednesday morning, gold', mantra:'Om Budhaya Namah', caution:'Not for very emotional people', lifePaths:[5,14,23] },
  yellow_sapphire: { name:'Yellow Sapphire (Pukhraj)', planet:'Jupiter', hindi:'पुखराज', benefits:'Wisdom, wealth, marriage, children, spiritual growth', wearOn:'Index finger, Thursday morning, gold', mantra:'Om Guruve Namah', caution:'Most universally beneficial', lifePaths:[3,12,21,30] },
  diamond:     { name:'Diamond (Heera)', planet:'Venus', hindi:'हीरा', benefits:'Luxury, love, beauty, creativity, marital harmony', wearOn:'Middle finger, Friday morning, gold/platinum', mantra:'Om Shukraya Namah', caution:'Not for ascetics or spiritual seekers', lifePaths:[6,15,24] },
  blue_sapphire: { name:'Blue Sapphire (Neelam)', planet:'Saturn', hindi:'नीलम', benefits:'Discipline, career growth, justice, spiritual wisdom', wearOn:'Middle finger, Saturday, silver', mantra:'Om Shanaishcharaya Namah', caution:'Test for 3 days before wearing permanently', lifePaths:[8,17,26] },
  hessonite:   { name:'Hessonite (Gomed)', planet:'Rahu', hindi:'गोमेद', benefits:'Career clarity, removes Rahu doshas, confidence', wearOn:'Middle finger, Saturday night, silver/ashtadhatu', mantra:'Om Rahave Namah', caution:'Consult astrologer first', lifePaths:[4,13,22,31] },
  cats_eye:    { name:"Cat's Eye (Lahsuniya)", planet:'Ketu', hindi:'लहसुनिया', benefits:'Spiritual growth, moksha, removes Ketu doshas', wearOn:'Middle finger, Tuesday night, silver', mantra:'Om Ketave Namah', caution:'Very powerful — consult astrologer', lifePaths:[7,16,25] },
};

function getGemstone(lifePath) {
  for (const gem of Object.values(GEMSTONES)) {
    if (gem.lifePaths.includes(Number(lifePath))) return gem;
  }
  return GEMSTONES['yellow_sapphire']; // default
}

// Yantra Guide
const YANTRAS = {
  sri:       { name:'Sri Yantra', deity:'Goddess Lakshmi/Tripura Sundari', purpose:'Wealth, prosperity, happiness, all desires', activate:'Place facing East, offer kumkum and flowers, chant Om Shreem Hreem Shreem Kamale...', keywords:['wealth','money','prosperity','happiness','desire','abundance'] },
  ganesh:    { name:'Ganesh Yantra', deity:'Lord Ganesha', purpose:'Remove obstacles, new beginnings, success in business', activate:'Wednesday, offer durva grass, chant Om Gam Ganapataye Namah', keywords:['obstacle','new beginning','business','success','problem'] },
  kali:      { name:'Kali Yantra', deity:'Goddess Kali', purpose:'Protection from evil, negative energy, enemies', activate:'Tuesday midnight, offer red flowers, chant Om Kring Kalikayai Namah', keywords:['protection','enemy','negative','evil','black magic'] },
  kuber:     { name:'Kuber Yantra', deity:'Lord Kuber', purpose:'Financial gains, debt clearance, business growth', activate:'North direction, Thursday, offer yellow flowers', keywords:['debt','finance','loan','money','business'] },
  surya:     { name:'Surya Yantra', deity:'Sun God', purpose:'Health, confidence, government success, leadership', activate:'Sunday sunrise, offer red flowers and water to Sun', keywords:['health','confidence','government','career','leadership'] },
  hanuman:   { name:'Baglamukhi Yantra', deity:'Goddess Baglamukhi', purpose:'Victory in court, silence enemies, win arguments', activate:'Tuesday, wear yellow, chant Om Hleem Baglamukhi Sarvadushtanam', keywords:['court','enemy','argument','win','legal'] },
  navgraha:  { name:'Navgraha Yantra', deity:'Nine Planets', purpose:'Balance all planetary influences, overall harmony', activate:'Saturday, offer flowers to all 9 planets, light 9 diyas', keywords:['planets','horoscope','graha','balance','harmony'] },
};

function getYantra(problem) {
  const text = (problem||'').toLowerCase();
  let best = null, bestScore = 0;
  for (const y of Object.values(YANTRAS)) {
    const score = y.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = y; }
  }
  return best || YANTRAS['sri'];
}

module.exports = { getRudraksha, RUDRAKSHAS, getGemstone, GEMSTONES, getYantra, YANTRAS };
