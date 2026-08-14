// Numerology calculator — pure math, no API needed

const LIFE_PATH_MEANINGS = {
  1: { title: 'The Leader', traits: 'Independent, ambitious, pioneering, original', career: 'Entrepreneur, CEO, Politician, Inventor', love: 'Strong-willed partner who respects your independence', challenge: 'Learn to cooperate and listen to others', lucky: [1, 10, 19, 28], color: 'Red', gemstone: 'Ruby' },
  2: { title: 'The Peacemaker', traits: 'Diplomatic, sensitive, cooperative, intuitive', career: 'Counselor, Teacher, Diplomat, Nurse, Artist', love: 'Deeply loving and loyal; needs emotional security', challenge: 'Build confidence and stop being a people-pleaser', lucky: [2, 11, 20, 29], color: 'Orange', gemstone: 'Moonstone' },
  3: { title: 'The Creative', traits: 'Expressive, joyful, artistic, social, optimistic', career: 'Writer, Actor, Designer, Musician, Speaker', love: 'Romantic and fun; needs freedom and excitement', challenge: 'Focus your scattered energies on one goal', lucky: [3, 12, 21, 30], color: 'Yellow', gemstone: 'Topaz' },
  4: { title: 'The Builder', traits: 'Practical, disciplined, reliable, hardworking, stable', career: 'Engineer, Accountant, Manager, Architect, Doctor', love: 'Loyal and committed; needs stability and routine', challenge: 'Be more flexible and open to change', lucky: [4, 13, 22, 31], color: 'Green', gemstone: 'Emerald' },
  5: { title: 'The Explorer', traits: 'Adventurous, versatile, freedom-loving, curious', career: 'Journalist, Traveler, Marketer, Sales, Tourism', love: 'Exciting partner; needs freedom and variety', challenge: 'Commit to decisions without running away', lucky: [5, 14, 23], color: 'Turquoise', gemstone: 'Aquamarine' },
  6: { title: 'The Nurturer', traits: 'Caring, responsible, loving, protective, family-oriented', career: 'Teacher, Doctor, Social Worker, Chef, Interior Designer', love: 'Devoted and protective; home and family first', challenge: 'Stop sacrificing yourself for others too much', lucky: [6, 15, 24], color: 'Blue', gemstone: 'Pearl' },
  7: { title: 'The Seeker', traits: 'Analytical, spiritual, introspective, wise, mystical', career: 'Researcher, Philosopher, Scientist, Spiritual Leader', love: 'Private and selective; needs deep intellectual connection', challenge: 'Open up emotionally and trust people', lucky: [7, 16, 25], color: 'Violet', gemstone: 'Amethyst' },
  8: { title: 'The Achiever', traits: 'Ambitious, authoritative, business-minded, powerful', career: 'Business Owner, Banker, Investor, Executive, Real Estate', love: 'Driven partner; needs success and respect', challenge: 'Balance material success with spiritual growth', lucky: [8, 17, 26], color: 'Black/Navy', gemstone: 'Blue Sapphire' },
  9: { title: 'The Humanitarian', traits: 'Compassionate, generous, idealistic, spiritual, artistic', career: 'NGO Work, Healer, Artist, Philosopher, Spiritual Guide', love: 'Selfless and romantic; needs meaningful connection', challenge: 'Let go of the past and forgive', lucky: [9, 18, 27], color: 'Gold', gemstone: 'Red Coral' },
  11: { title: 'The Visionary (Master)', traits: 'Highly intuitive, inspirational, spiritual, sensitive', career: 'Spiritual Leader, Inventor, Psychic, Artist, Life Coach', love: 'Deeply spiritual connection; needs understanding partner', challenge: 'Ground your visions into practical reality', lucky: [11, 2, 20, 29], color: 'Silver', gemstone: 'Moonstone' },
  22: { title: 'The Master Builder', traits: 'Visionary, powerful, practical, ambitious on large scale', career: 'Architect, Diplomat, Global Business Leader, Philanthropist', love: 'Dedicated partner who shares your big vision', challenge: 'Manage your enormous potential without burning out', lucky: [22, 4, 13], color: 'White', gemstone: 'Diamond' },
  33: { title: 'The Master Teacher', traits: 'Compassionate, wise, nurturing, highly spiritual', career: 'Healer, Spiritual Teacher, Artist, Humanitarian Leader', love: 'Unconditional love; devoted to family and humanity', challenge: 'Avoid martyrdom — take care of yourself too', lucky: [33, 6, 15], color: 'Rose Gold', gemstone: 'Rose Quartz' },
};

const DESTINY_MEANINGS = {
  1: 'Your destiny is to lead. You are here to create, innovate, and inspire others.',
  2: 'Your destiny is to unite. You are here to bring peace, balance, and harmony.',
  3: 'Your destiny is to create. You are here to express yourself and spread joy.',
  4: 'Your destiny is to build. You are here to create lasting foundations.',
  5: 'Your destiny is to liberate. You are here to experience freedom and change.',
  6: 'Your destiny is to serve. You are here to nurture, heal, and protect.',
  7: 'Your destiny is to discover. You are here to seek truth and spiritual wisdom.',
  8: 'Your destiny is to achieve. You are here to master the material world.',
  9: 'Your destiny is to give. You are here to serve humanity with compassion.',
};

function reduceToSingleDigit(num) {
  // Keep master numbers 11, 22, 33
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
}

function calculateLifePath(dob) {
  // dob format: YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
  const digits = dob.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const sum = digits.split('').reduce((a, b) => a + parseInt(b), 0);
  return reduceToSingleDigit(sum);
}

function calculateDestinyNumber(name) {
  // Pythagorean numerology chart
  const chart = {
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
  };
  const letters = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = letters.split('').reduce((a, b) => a + (chart[b] || 0), 0);
  return reduceToSingleDigit(sum);
}

function calculateSoulUrge(name) {
  // Only vowels
  const vowels = { a:1, e:5, i:9, o:6, u:3 };
  const letters = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = letters.split('').reduce((a, b) => a + (vowels[b] || 0), 0);
  return reduceToSingleDigit(sum);
}

function calculatePersonality(name) {
  // Only consonants
  const chart = {
    b:2,c:3,d:4,f:6,g:7,h:8,j:1,k:2,l:3,m:4,
    n:5,p:7,q:8,r:9,s:1,t:2,v:4,w:5,x:6,y:7,z:8
  };
  const letters = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = letters.split('').reduce((a, b) => a + (chart[b] || 0), 0);
  return reduceToSingleDigit(sum);
}

function getNumerologyReading(name, dob) {
  const lifePath = calculateLifePath(dob);
  const destiny = calculateDestinyNumber(name);
  const soulUrge = calculateSoulUrge(name);
  const personality = calculatePersonality(name);

  const lpData = LIFE_PATH_MEANINGS[lifePath] || LIFE_PATH_MEANINGS[1];
  const destinyMeaning = DESTINY_MEANINGS[destiny] || DESTINY_MEANINGS[1];

  return {
    name,
    dob,
    numbers: { lifePath, destiny, soulUrge, personality },
    lifePathData: lpData,
    destinyMeaning,
    soulUrgeNote: `Your Soul Urge number ${soulUrge} reveals your inner desires and what truly motivates your heart.`,
    personalityNote: `Your Personality number ${personality} shows how others perceive you at first glance.`,
    luckyNumbers: lpData.lucky,
    luckyColor: lpData.color,
    luckyGemstone: lpData.gemstone,
  };
}

module.exports = { getNumerologyReading };
