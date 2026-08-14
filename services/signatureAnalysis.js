// Signature Analysis Service — Paid (₹79)
// Deep personality, destiny, and fortune reading from signature traits

const SIGNATURE_TRAITS = {

  size_vs_writing: {
    much_larger: {
      title: 'Signature Much Larger Than Writing',
      personality: 'You present a very grand, confident image to the world that may not fully match your private self. You crave recognition, respect, and public status.',
      destiny: 'Your destiny lies in public life — leadership, fame, or influence. You are meant to be seen.',
      fortune: 'Financial success comes through visibility. The more you put yourself out there, the more you attract wealth.',
      love: 'In relationships, you want a partner who admires and respects you. Avoid being too dominant.',
      warning: 'Be careful of overconfidence or ego clashes. Ground yourself regularly.',
      famous_examples: 'Many successful politicians, celebrities, and CEOs have this trait.',
    },
    slightly_larger: {
      title: 'Signature Slightly Larger Than Writing',
      personality: 'You are confident and self-assured. You have healthy self-esteem and present yourself well in social situations.',
      destiny: 'You are destined to lead in your chosen field — not necessarily fame, but respect and authority.',
      fortune: 'Money flows toward you naturally through your confident, trustworthy presentation.',
      love: 'You are attractive to partners. You express love openly and generously.',
      warning: 'Watch that confidence does not become arrogance.',
      famous_examples: 'Successful entrepreneurs, doctors, and teachers often have this signature.',
    },
    same_size: {
      title: 'Signature Same Size as Writing',
      personality: 'You are authentic, consistent, and what you see is what you get. You have no hidden agenda — your public and private selves are the same.',
      destiny: 'Your destiny is built on integrity and honesty. Long-term trust and reputation are your greatest assets.',
      fortune: 'Steady and reliable financial growth. You build wealth slowly but surely through honest work.',
      love: 'Deeply trustworthy in relationships. Your partner always knows where they stand with you.',
      warning: 'You may sometimes lack the spark of unpredictability that keeps life exciting.',
      famous_examples: 'Scientists, teachers, and philosophers often have consistent signatures.',
    },
    smaller: {
      title: 'Signature Smaller Than Writing',
      personality: 'You are more capable than you show the world. You may suffer from low self-esteem or deliberately hide your true abilities from others.',
      destiny: 'Your destiny requires you to step into your power. The world needs what you have to offer — stop shrinking.',
      fortune: 'You may undercharge for your services or avoid asking for what you deserve. Claim your worth.',
      love: 'You may attract dominant partners who overshadow you. Work on self-love first.',
      warning: 'Build confidence. Your humility is a gift, but when extreme, it becomes self-sabotage.',
      famous_examples: 'Many highly skilled introverts show this pattern.',
    },
  },

  slant_direction: {
    right_ascending: {
      title: 'Signature Slants Right and Ascends',
      personality: 'You are ambitious, optimistic, and forward-thinking. You move through life with enthusiasm and confidence.',
      destiny: 'Great success in leadership and entrepreneurship. You are meant to rise.',
      fortune: 'Excellent financial prospects — money follows your ambitious nature.',
      love: 'Passionate and expressive. You wear your heart on your sleeve.',
      warning: 'Impulsiveness — make decisions thoughtfully, not just emotionally.',
      famous_examples: 'Many successful business leaders show this signature.',
    },
    left_descending: {
      title: 'Signature Slants Left and Descends',
      personality: 'You may be holding back, protecting yourself emotionally, or going through a challenging phase in life.',
      destiny: 'Your destiny requires you to face and release past hurts. Transformation awaits on the other side.',
      fortune: 'Financial improvement comes once emotional blockages are cleared.',
      love: 'Past relationships may be affecting present ones. Healing is the first step.',
      warning: 'Seek support — therapy, spirituality, or trusted friends can help you rise again.',
      famous_examples: 'This pattern often appears during difficult life phases and changes after recovery.',
    },
    vertical: {
      title: 'Vertical Signature',
      personality: 'You are rational, independent, and emotionally balanced. You make decisions with your head, not just heart.',
      destiny: 'Success in analytical, technical, or legal fields. You are destined to be a problem-solver.',
      fortune: 'Steady, reliable income. You build wealth through discipline and planning.',
      love: 'Loyal and dependable partner. You may appear cooler emotionally than you feel inside.',
      warning: 'Open up more emotionally — vulnerability is a strength, not a weakness.',
      famous_examples: 'Many judges, scientists, and doctors show vertical signatures.',
    },
  },

  underline: {
    single_underline: {
      title: 'Single Underline Below Signature',
      personality: 'You have confidence in your identity and value yourself highly. You believe in what you do.',
      destiny: 'The underline shows self-emphasis — you are destined for work that carries your personal brand.',
      fortune: 'Financial success through personal branding and reputation.',
      love: 'You need a partner who values your identity and achievements.',
      warning: 'Avoid being too self-focused — relationships require sharing the spotlight.',
      famous_examples: 'Many entrepreneurs and performers underline their signatures.',
    },
    double_underline: {
      title: 'Double Underline Below Signature',
      personality: 'You have an extremely strong sense of self and may be very status-conscious. You want validation and recognition.',
      destiny: 'High ambition — you are destined for positions of authority and respect.',
      fortune: 'Strong financial ambitions. Be careful not to make money your only measure of success.',
      love: 'Need a partner who matches your ambition and respects your status.',
      warning: 'Guard against obsession with status — true respect comes from character, not position.',
      famous_examples: 'Frequently seen in politicians and high-profile executives.',
    },
    no_underline: {
      title: 'No Underline',
      personality: 'You are grounded, humble, and do not feel the need to overemphasize yourself. What you produce speaks for itself.',
      destiny: 'Your work and character will speak louder than your self-promotion.',
      fortune: 'Consistent financial growth through quality work.',
      love: 'Humble and genuine in love — highly attractive quality to the right person.',
      warning: 'Make sure you advocate for yourself in professional settings.',
      famous_examples: 'Many respected scholars and spiritual leaders sign without underlines.',
    },
  },

  encircled: {
    yes: {
      title: 'Encircled / Surrounded Signature',
      personality: 'You are highly self-protective, private, and keep your true self guarded from the world. You may feel the world is not safe.',
      destiny: 'Destiny calls you to open up and trust. Your gifts cannot reach the world if you keep them locked inside.',
      fortune: 'Financial opportunities may be missed due to excessive caution or self-isolation.',
      love: 'Difficulty with vulnerability in love. Work on letting people in.',
      warning: 'The circle is a shield — but shields also keep out good things. Learn to trust.',
      famous_examples: 'Often seen in people who have experienced significant betrayal or trauma.',
    },
    no: {
      title: 'Open Signature (Not Encircled)',
      personality: 'You are open, trusting, and comfortable engaging with the world.',
      destiny: 'Your openness is your gift — it attracts opportunities and connections.',
      fortune: 'Opportunities flow easily to you because of your approachable energy.',
      love: 'Open and giving in relationships. Be sure to also receive love.',
      warning: 'Stay discerning — not everyone deserves your complete trust.',
      famous_examples: 'Common in open-hearted leaders and community builders.',
    },
  },

  dot_after: {
    yes: {
      title: 'Dot After Signature',
      personality: 'You are decisive, careful, and like to have the final word. You are thorough and don\'t leave things unfinished.',
      destiny: 'Your attention to detail and need for closure will serve you well in careers requiring precision.',
      fortune: 'You are careful with money — rarely make impulsive financial decisions.',
      love: 'You like certainty and clarity in relationships. Uncertainty makes you uncomfortable.',
      warning: 'Learn to be comfortable with some ambiguity — not everything in life has a neat ending.',
      famous_examples: 'Often seen in detail-oriented professionals like doctors, lawyers, and accountants.',
    },
    no: {
      title: 'No Dot After Signature',
      personality: 'You are relaxed, open-ended, and comfortable leaving things as they are.',
      destiny: 'Your destiny is one of flow and adaptability — you navigate change well.',
      fortune: 'Your relaxed attitude can be a financial asset or liability depending on your discipline level.',
      love: 'Easy-going and accepting in love — a wonderful trait.',
      warning: 'Ensure important things in life are properly completed and followed through.',
      famous_examples: 'Common in creative professionals and free-spirits.',
    },
  },

  legibility: {
    very_clear: {
      title: 'Very Clear and Legible Signature',
      personality: 'You are transparent, honest, open, and comfortable with who you are. You have nothing to hide.',
      destiny: 'Your destiny is built on trust and authenticity. Long-term success through genuine relationships.',
      fortune: 'Financial growth through reputation and word-of-mouth.',
      love: 'Your partner always knows exactly where they stand — a deeply valued quality.',
      warning: 'In competitive environments, some mystery can be beneficial.',
      famous_examples: 'Scientists, teachers, humanitarians often have clear signatures.',
    },
    partially_legible: {
      title: 'Partially Legible Signature',
      personality: 'You show some of yourself to the world but keep other parts private. You share selectively — a balanced approach.',
      destiny: 'You will succeed in roles that require both public presence and behind-the-scenes work.',
      fortune: 'Balanced financial life — neither too cautious nor too reckless.',
      love: 'Selective and thoughtful about who you let fully in. This creates healthy boundaries.',
      warning: 'Ensure important communications are always clear — especially in professional settings.',
      famous_examples: 'Many successful executives and creative directors show this pattern.',
    },
    illegible: {
      title: 'Illegible / Scrawled Signature',
      personality: 'You are complex, fast-thinking, private, and possibly in too much of a rush. You may not want to be easily read or categorized.',
      destiny: 'Your complexity is your gift — you operate on multiple levels simultaneously.',
      fortune: 'Your quick mind creates financial opportunities, but impulsiveness can also create losses.',
      love: 'You can be mysterious and hard to read — fascinating but sometimes frustrating for partners.',
      warning: 'Slow down. Clarity in communication is essential for healthy relationships and successful business.',
      famous_examples: 'Many highly successful and busy executives and creatives have illegible signatures.',
    },
  },

  first_last_prominence: {
    first_name_larger: {
      title: 'First Name Larger Than Last Name',
      personality: 'You value your individual identity over your family or professional identity. You are self-made and prefer to define yourself on your own terms.',
      destiny: 'You will carve your own path — independent of family tradition or expectations.',
      fortune: 'Financial success through personal initiatives and self-branding.',
      love: 'Independent in relationships. You need a partner who respects your individuality.',
      warning: 'Stay connected to your roots — family and heritage carry wisdom.',
      famous_examples: 'Many self-made entrepreneurs and artists emphasize their first name.',
    },
    last_name_larger: {
      title: 'Last Name Larger Than First Name',
      personality: 'You strongly identify with your family heritage, professional title, or lineage. Family pride and reputation matter deeply to you.',
      destiny: 'You carry family legacy forward and may be destined to honor or build upon it.',
      fortune: 'Business and financial success often connected to family or established institutions.',
      love: 'Family approval matters in relationships. You seek a partner who fits into your larger family picture.',
      warning: 'Don\'t lose your individual identity in the shadow of family expectations.',
      famous_examples: 'Common in people from prominent families or those in family businesses.',
    },
    balanced: {
      title: 'First and Last Name Balanced',
      personality: 'You have a harmonious relationship between your personal identity and your family/professional identity.',
      destiny: 'Success through balance — you honor both your individuality and your responsibilities.',
      fortune: 'Stable, balanced financial approach.',
      love: 'Harmonious relationships — you give equally to personal freedom and partnership.',
      warning: 'Maintain this beautiful balance as life evolves.',
      famous_examples: 'This is the most harmonious signature pattern.',
    },
  },
};

function analyzeSignature(traits) {
  const result = {};
  let allPersonalities = [];
  let allDestinies = [];
  let allFortuneInsights = [];
  let allWarnings = [];
  let allLoveInsights = [];

  for (const [key, value] of Object.entries(traits)) {
    if (SIGNATURE_TRAITS[key] && SIGNATURE_TRAITS[key][value]) {
      const data = SIGNATURE_TRAITS[key][value];
      result[key] = data;
      if (data.personality) allPersonalities.push(data.personality);
      if (data.destiny) allDestinies.push(data.destiny);
      if (data.fortune) allFortuneInsights.push(data.fortune);
      if (data.warning) allWarnings.push(data.warning);
      if (data.love) allLoveInsights.push(data.love);
    }
  }

  return {
    detailed: result,
    overallPersonality: allPersonalities,
    destinyInsights: allDestinies,
    fortuneInsights: allFortuneInsights,
    loveInsights: allLoveInsights,
    warnings: allWarnings,
    summary: `Your signature reveals a ${Object.values(result).map(r => r.title).join(', ')} personality. This comprehensive analysis covers your personality, destiny, fortune, and love life based on the ancient science of graphology.`,
    disclaimer: 'This analysis is based on graphology — the study of handwriting and signatures as indicators of personality. It is for guidance and self-reflection purposes.',
  };
}

function getSignatureOptions() {
  const options = {};
  for (const [cat, vals] of Object.entries(SIGNATURE_TRAITS)) {
    options[cat] = Object.keys(vals).map(k => ({
      value: k,
      label: SIGNATURE_TRAITS[cat][k].title,
    }));
  }
  return options;
}

module.exports = { analyzeSignature, getSignatureOptions, SIGNATURE_TRAITS };
