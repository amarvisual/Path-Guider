// Handwriting Analysis Service — No API needed
// User selects their handwriting characteristics → personality reading

const TRAITS = {

  // ── SIZE ──────────────────────────────────────────────────────
  size: {
    large: {
      trait: 'Large Handwriting',
      meaning: 'You are outgoing, confident, and love being the center of attention. You think big and dream big. You are generous and expressive.',
      personality: 'Extrovert, confident, ambitious, social',
      career: 'Leadership roles, sales, performing arts, politics',
      strength: 'Charisma, big-picture thinking, enthusiasm',
      weakness: 'May overlook details, can be domineering',
    },
    small: {
      trait: 'Small Handwriting',
      meaning: 'You are highly focused, intelligent, and meticulous. You pay attention to detail and prefer deep thinking over socializing.',
      personality: 'Introvert, analytical, precise, scholarly',
      career: 'Research, science, writing, accounting, technology',
      strength: 'Concentration, detail-orientation, intelligence',
      weakness: 'May be withdrawn, overly self-critical',
    },
    medium: {
      trait: 'Medium Handwriting',
      meaning: 'You are well-balanced and adaptable. You can work independently or in teams. You adjust well to different situations.',
      personality: 'Balanced, flexible, social, practical',
      career: 'Management, teaching, consulting, any field',
      strength: 'Adaptability, balance, good judgment',
      weakness: 'May lack a defining edge in highly competitive situations',
    },
  },

  // ── SLANT ─────────────────────────────────────────────────────
  slant: {
    right: {
      trait: 'Right Slant',
      meaning: 'You are emotionally expressive, warm, and people-oriented. You lean into the future with optimism and love connecting with others.',
      personality: 'Empathetic, social, future-oriented, romantic',
      career: 'Counseling, nursing, sales, teaching, hospitality',
      strength: 'Emotional intelligence, warmth, enthusiasm for life',
      weakness: 'Can be impulsive or overly emotional in decisions',
    },
    left: {
      trait: 'Left Slant',
      meaning: 'You are reserved, introspective, and hold back emotionally. You may be nonconformist or carry unresolved past experiences.',
      personality: 'Independent, private, self-protective, thoughtful',
      career: 'Arts, writing, technical roles, research',
      strength: 'Self-reliance, unique perspective, depth of thought',
      weakness: 'Difficulty trusting others, may suppress emotions',
    },
    vertical: {
      trait: 'Vertical (No Slant)',
      meaning: 'You are logical, independent, and ruled by your head rather than heart. You think before you act and remain calm under pressure.',
      personality: 'Rational, self-controlled, objective, disciplined',
      career: 'Law, medicine, finance, engineering, science',
      strength: 'Clear thinking, emotional control, reliability',
      weakness: 'May appear cold or emotionally unavailable',
    },
  },

  // ── PRESSURE ──────────────────────────────────────────────────
  pressure: {
    heavy: {
      trait: 'Heavy Pressure',
      meaning: 'You have strong emotions, high energy, and deep commitment. You take life seriously and feel things intensely. You leave a strong impression.',
      personality: 'Passionate, determined, intense, committed',
      career: 'Sports, military, entrepreneurship, performance',
      strength: 'Determination, emotional depth, resilience',
      weakness: 'Can be aggressive or hold grudges',
    },
    light: {
      trait: 'Light Pressure',
      meaning: 'You are sensitive, spiritual, and empathetic. You are not easily bothered by material concerns and prefer a gentler approach to life.',
      personality: 'Sensitive, spiritual, easy-going, flexible',
      career: 'Arts, spirituality, healing, writing, counseling',
      strength: 'Sensitivity, adaptability, empathy',
      weakness: 'May lack energy or resolve in tough situations',
    },
    medium: {
      trait: 'Medium Pressure',
      meaning: 'You are emotionally balanced and consistent. You handle stress well and maintain energy levels throughout the day.',
      personality: 'Balanced, consistent, reliable, calm',
      career: 'Any field — you adapt naturally',
      strength: 'Consistency, reliability, balance',
      weakness: 'May not stand out strongly in either direction',
    },
  },

  // ── BASELINE ──────────────────────────────────────────────────
  baseline: {
    ascending: {
      trait: 'Ascending Baseline (Goes upward)',
      meaning: 'You are optimistic, ambitious, and full of hope. You see life as full of possibilities and naturally motivate others around you.',
      personality: 'Optimistic, energetic, ambitious, enthusiastic',
      career: 'Entrepreneurship, motivation, sales, sports, leadership',
      strength: 'Positive outlook, drive, inspiring others',
      weakness: 'May overlook risks, unrealistic at times',
    },
    descending: {
      trait: 'Descending Baseline (Goes downward)',
      meaning: 'You may be feeling tired, pessimistic, or overwhelmed. This can be temporary fatigue or a deeper tendency toward negative thinking.',
      personality: 'Cautious, realistic, sometimes pessimistic',
      career: 'Best when rested and in supportive environments',
      strength: 'Realistic, careful, thorough',
      weakness: 'Can slide into depression or discouragement',
    },
    straight: {
      trait: 'Straight Baseline',
      meaning: 'You are disciplined, reliable, and emotionally steady. You maintain control even in difficult situations and are seen as dependable.',
      personality: 'Disciplined, reliable, self-controlled, consistent',
      career: 'Management, law, medicine, finance, teaching',
      strength: 'Stability, trustworthiness, self-discipline',
      weakness: 'Can be inflexible or too rigid',
    },
    wavy: {
      trait: 'Wavy Baseline',
      meaning: 'You have a versatile and changeable personality. Your moods fluctuate and you can be creative and unpredictable.',
      personality: 'Creative, moody, versatile, unpredictable',
      career: 'Arts, entertainment, creative industries',
      strength: 'Creativity, versatility, spontaneity',
      weakness: 'Inconsistency, emotional swings',
    },
  },

  // ── SPACING ───────────────────────────────────────────────────
  spacing: {
    wide: {
      trait: 'Wide Letter/Word Spacing',
      meaning: 'You value freedom, personal space, and independence. You may feel isolated or prefer not to be too close to others emotionally.',
      personality: 'Independent, freedom-loving, private, sometimes lonely',
      career: 'Freelance, entrepreneurship, research, arts',
      strength: 'Independence, clear boundaries, self-sufficiency',
      weakness: 'Difficulty with close relationships, can isolate',
    },
    narrow: {
      trait: 'Narrow Letter/Word Spacing',
      meaning: 'You crave closeness, warmth, and human connection. You may crowd others or struggle with personal boundaries.',
      personality: 'Social, warm, people-dependent, clingy at times',
      career: 'Social work, nursing, teaching, customer service',
      strength: 'Warmth, sociability, team player',
      weakness: 'Poor boundaries, fear of being alone',
    },
    even: {
      trait: 'Even Spacing',
      meaning: 'You are organized, methodical, and value clarity. You think clearly and communicate in a structured manner.',
      personality: 'Organized, methodical, fair, structured',
      career: 'Management, law, science, accounting, planning',
      strength: 'Organization, clarity, structured thinking',
      weakness: 'May be too rigid or inflexible',
    },
  },

  // ── LETTER CONNECTION ─────────────────────────────────────────
  connection: {
    connected: {
      trait: 'Connected Letters',
      meaning: 'You are logical, systematic, and prefer completing one thought before moving to the next. You are a good planner and think sequentially.',
      personality: 'Logical, systematic, decisive, pragmatic',
      career: 'Engineering, management, law, strategy',
      strength: 'Logic, planning, follow-through',
      weakness: 'May be inflexible or miss creative leaps',
    },
    disconnected: {
      trait: 'Disconnected Letters',
      meaning: 'You are highly intuitive and creative. You get insights that seem to come from nowhere. You are imaginative and think in leaps.',
      personality: 'Intuitive, creative, independent, imaginative',
      career: 'Arts, writing, design, spirituality, innovation',
      strength: 'Intuition, creativity, original thinking',
      weakness: 'May be inconsistent or lack follow-through',
    },
    mixed: {
      trait: 'Mixed Connection',
      meaning: 'You blend logic with intuition. You can move between analytical and creative thinking, making you highly adaptable.',
      personality: 'Adaptable, balanced, versatile, open-minded',
      career: 'Any creative-analytical hybrid field',
      strength: 'Versatility, balance, open-mindedness',
      weakness: 'May struggle to commit to one approach',
    },
  },

  // ── LOOPS IN LETTERS ──────────────────────────────────────────
  loops: {
    large_upper: {
      trait: 'Large Upper Loops (l, h, b)',
      meaning: 'You are idealistic, imaginative, and spiritually inclined. You have a rich inner life and love exploring ideas, philosophy, and dreams.',
      personality: 'Idealistic, spiritual, imaginative, intellectual',
      career: 'Philosophy, writing, spirituality, arts, education',
      strength: 'Imagination, spiritual depth, idealism',
      weakness: 'May be impractical or live in fantasy',
    },
    large_lower: {
      trait: 'Large Lower Loops (g, y, p)',
      meaning: 'You have strong physical desires, material ambitions, and a deep connection to the practical world. You are grounded and action-oriented.',
      personality: 'Energetic, materialistic, physical, action-oriented',
      career: 'Sports, business, entrepreneurship, physical trades',
      strength: 'Physical energy, drive, practicality',
      weakness: 'May be too focused on material needs',
    },
    small_loops: {
      trait: 'Small or Retraced Loops',
      meaning: 'You are cautious, reserved, and may suppress your feelings. You are selective about what you share with others.',
      personality: 'Reserved, cautious, private, selective',
      career: 'Research, analysis, technical work, writing',
      strength: 'Discretion, caution, self-containment',
      weakness: 'Repression of feelings, difficulty opening up',
    },
  },

  // ── SIGNATURE ─────────────────────────────────────────────────
  signature: {
    larger_than_writing: {
      trait: 'Signature Larger Than Writing',
      meaning: 'You project more confidence to the world than you truly feel inside. You want to be seen as important and successful.',
      personality: 'Ambitious, image-conscious, confident on surface',
      strength: 'Strong public presence, ambition',
      weakness: 'May feel like an imposter privately',
    },
    smaller_than_writing: {
      trait: 'Signature Smaller Than Writing',
      meaning: 'You are more modest and humble than your actual abilities. You underestimate yourself publicly.',
      personality: 'Humble, modest, self-doubting',
      strength: 'Humility, sincerity, approachability',
      weakness: 'Low self-esteem, undervaluing yourself',
    },
    underlined: {
      trait: 'Underlined Signature',
      meaning: 'You strongly emphasize your own identity and want recognition. You have a strong ego and need validation.',
      personality: 'Strong ego, self-promoting, needs recognition',
      strength: 'Strong self-identity, confidence',
      weakness: 'Vanity, need for external approval',
    },
    illegible: {
      trait: 'Illegible Signature',
      meaning: 'You are private, complex, and often in a hurry. You may not want others to easily read or understand you.',
      personality: 'Private, complex, fast-thinking, mysterious',
      strength: 'Mystery, complexity, privacy',
      weakness: 'May be seen as untrustworthy or careless',
    },
    clear: {
      trait: 'Clear and Legible Signature',
      meaning: 'You are open, honest, and comfortable with who you are. You have nothing to hide and present yourself authentically.',
      personality: 'Honest, open, self-assured, transparent',
      strength: 'Trustworthiness, authenticity, clarity',
      weakness: 'May be too transparent in competitive situations',
    },
  },
};

function analyzeHandwriting(selections) {
  // selections = { size, slant, pressure, baseline, spacing, connection, loops, signature }
  const result = {};
  let allTraits = [];
  let allStrengths = [];
  let allWeaknesses = [];

  for (const [category, value] of Object.entries(selections)) {
    if (TRAITS[category] && TRAITS[category][value]) {
      const data = TRAITS[category][value];
      result[category] = data;
      allTraits.push(data.personality || '');
      if (data.strength) allStrengths.push(data.strength);
      if (data.weakness) allWeaknesses.push(data.weakness);
    }
  }

  // Generate summary
  const traitWords = [...new Set(allTraits.join(', ').split(', ').filter(Boolean))].slice(0, 8);
  const summary = `Based on your handwriting analysis, you are a ${traitWords.join(', ')} person. Your writing reveals unique insights about your inner world, emotional patterns, and natural tendencies.`;

  return {
    analysis: result,
    summary,
    topStrengths: [...new Set(allStrengths)].slice(0, 5),
    areasToImprove: [...new Set(allWeaknesses)].slice(0, 4),
    overallProfile: traitWords,
  };
}

function getTraitOptions() {
  const options = {};
  for (const [cat, vals] of Object.entries(TRAITS)) {
    options[cat] = Object.keys(vals).map(k => ({
      value: k,
      label: TRAITS[cat][k].trait,
    }));
  }
  return options;
}

module.exports = { analyzeHandwriting, getTraitOptions, TRAITS };
