// ============================================================
// PATH GUIDER — Master Numerology Database v3.0
// Comprehensive interpretations for Core Numbers, Karmic Debts,
// Karmic Lessons, Personal Year 2026, and Mobile Vibrations
// ============================================================

const READINGS = {

  // ── 1. LIFE PATH READINGS ──────────────────────────────────
  lifePathReadings: {
    1: {
      title: "The Visionary Leader",
      symbol: "☀️",
      color: "#FFD700",
      element: "Fire",
      rulingPlanet: "Sun",
      tagline: "Born to pioneer, destined to lead from the front.",
      personality: "You are an unstoppable force of independence, innovation, and original thought. Driven by an innate desire to break new ground, you refuse to walk in anyone else's shadow. Your magnetic willpower and self-reliance inspire others to follow, even when the path is completely uncharted. You thrive in autonomy and command situations with natural authority.",
      nature: "Courageous, bold, and fiercely self-motivated. You possess high endurance and decisiveness. While others hesitate, you act. Though your high standards can sometimes be mistaken for impatience, your drive is what turns impossible dreams into reality.",
      skills: "Executive leadership, strategic pioneering, entrepreneurship, inventive innovation, risk management, and rapid execution.",
      career: "CEO, Founder & Tech Entrepreneur, Political Leader, Surgeon, Military Strategist, Creative Director, or Pioneer Consultant.",
      wealthMagnetism: "High wealth creation potential through independent enterprise, intellectual property, and commanding high-value leadership positions. Money flows when you take calculated risks.",
      love: "Passionate, protective, and deeply loyal. You seek an intellectually confident partner who maintains their own independence while respecting your sovereign drive.",
      compatibleNumbers: [1, 3, 5, 7],
      challengingNumbers: [4, 6],
      shadowSide: "Ego rigidity, intolerance for delays, overbearing independence, and a tendency to resist asking for help when overwhelmed.",
      lifePurpose: "To demonstrate authentic courage, forge new pathways, and empower humanity to embrace sovereign self-leadership.",
      powerAffirmation: "I am the sovereign creator of my destiny. I lead with courage, originality, and truth."
    },
    2: {
      title: "The Master Diplomat",
      symbol: "🌙",
      color: "#E0E0E0",
      element: "Water",
      rulingPlanet: "Moon",
      tagline: "The intuitive force that weaves harmony across the universe.",
      personality: "Deeply empathetic, intuitive, and perceptive, you are the cosmic peacemaker. You possess a rare sixth sense that perceives unsaid words and subtle emotional undercurrents. People naturally open their hearts in your presence because you hold sacred space without judgment. You achieve greatness not through force, but through graceful collaboration.",
      nature: "Gentle, patient, and exquisitely detail-conscious. You excel at observing nuance, resolving disputes, and bringing equilibrium to volatile situations. Your quiet strength is often the foundation upon which whole communities thrive.",
      skills: "Intuitive mediation, emotional intelligence, diplomacy, counseling, harmonious negotiation, strategic alliance building, and soulful artistic listening.",
      career: "Diplomat, Master Counselor, Therapist, Arbitrator, HR Executive, Medical Healer, Musician, or Non-Profit Strategic Leader.",
      wealthMagnetism: "Prosperity blossoms through collaborative joint ventures, partnerships, loyal networks, and service-oriented enterprises that create emotional peace.",
      love: "The quintessential romantic. You pour your whole heart into relationships, seeking deep spiritual intimacy, devotion, and soulful vulnerability.",
      compatibleNumbers: [2, 4, 6, 8, 9],
      challengingNumbers: [1, 5],
      shadowSide: "People-pleasing, fear of confrontation, self-doubt, and absorbing emotional toxins from ungrounded environments.",
      lifePurpose: "To heal divisions, nurture unity, and remind the world of the profound power of compassion and intuitive wisdom.",
      powerAffirmation: "I radiate gentle harmony, deep intuition, and peaceful understanding to all around me."
    },
    3: {
      title: "The Creative Luminary",
      symbol: "⭐",
      color: "#FF69B4",
      element: "Air",
      rulingPlanet: "Jupiter",
      tagline: "Where imagination awakens, the world lights up with joy.",
      personality: "Exuberant, charismatic, and endlessly creative, you are gifted with the sacred power of self-expression. Your words, art, and vibrant presence can shift the energy of any room. You perceive life in brilliant colors and possess an extraordinary ability to turn abstract inspiration into uplifting cultural and artistic experiences.",
      nature: "Enthusiastic, socially magnetic, and naturally optimistic. You possess an ageless childlike wonder and infectious charisma. You synthesize humor with profound philosophy effortlessly.",
      skills: "Artistic expression, writing, oratory, humor, brand storytelling, performing arts, creative direction, and inspirational teaching.",
      career: "Author, Keynote Speaker, Creative Director, Filmmaker, Performer, Marketing Visionary, Designer, or Media Producer.",
      wealthMagnetism: "Abundance arrives through monetization of creative intellect, public visibility, artistic assets, media platforms, and uplifting communication.",
      love: "Playful, charming, and romantic. You need a partner who celebrates your spontaneity and gives you intellectual and emotional space to create.",
      compatibleNumbers: [1, 3, 5, 9],
      challengingNumbers: [4, 8],
      shadowSide: "Scattered focus, emotional restlessness, superficial distractions, and using humor to deflect deep emotional vulnerability.",
      lifePurpose: "To awaken the hearts of others through radiant creative expression, joy, and the eternal beauty of authentic storytelling.",
      powerAffirmation: "My creative expression flows effortlessly, inspiring joy and abundance everywhere I go."
    },
    4: {
      title: "The Architect of Reality",
      symbol: "🏛️",
      color: "#8B4513",
      element: "Earth",
      rulingPlanet: "Uranus / Rahu",
      tagline: "Foundations engineered to stand for generations.",
      personality: "Disciplined, pragmatic, and unshakeable, you are the cornerstone upon which great enterprises and legacies are constructed. You possess an instinct for systems, structure, and operational excellence. Where others see chaos, you see blueprints waiting to be organized and executed with precision.",
      nature: "Honest, steadfast, and exceptionally loyal. You value duty, punctuality, and concrete outcomes. Your word is your bond, and your resilience in the face of long-term obstacles is unmatched.",
      skills: "Systems architecture, structural engineering, financial management, operational scaling, project management, and unwavering execution.",
      career: "Architect, Civil Engineer, Chief Financial Officer, Data Scientist, Operations Director, Military Commander, or Real Estate Magnate.",
      wealthMagnetism: "Consistent, compounding wealth accumulation through hard assets, structured investing, real estate, and long-term equity growth.",
      love: "Steadfast, protective, and dedicated. You express devotion through deeds, stability, and providing unwavering security for your loved ones.",
      compatibleNumbers: [2, 4, 6, 8],
      challengingNumbers: [1, 3, 5],
      shadowSide: "Stubbornness, fear of sudden change, excessive workaholism, and emotional conservatism that resists creative vulnerability.",
      lifePurpose: "To manifest enduring order, build sustainable structures, and provide stability for society to flourish safely.",
      powerAffirmation: "I build unshakeable foundations of wealth, discipline, and enduring legacy."
    },
    5: {
      title: "The Dynamic Explorer",
      symbol: "🌍",
      color: "#FF6347",
      element: "Air / Fire",
      rulingPlanet: "Mercury",
      tagline: "Freedom is your true compass, transformation your fuel.",
      personality: "Adventurous, magnetic, and versatile, you are the catalyst of change in the universe. Routine suffocates your spirit; you are designed to cross borders, absorb diverse cultures, and connect disparate ideas. You adapt to shifts in life with fluid ease and awaken others to the thrill of living fully in the present moment.",
      nature: "Curious, witty, and deeply charismatic. You experience reality with all five senses awakened. Your quick mind processes complex scenarios instantly.",
      skills: "Cross-cultural communication, rapid adaptation, crisis negotiation, travel journalism, high-speed sales, and visionary market disruption.",
      career: "International Entrepreneur, Travel Journalist, Global Correspondent, Public Relations Strategist, Pilot, or Venture Scout.",
      wealthMagnetism: "Rapid wealth generation through dynamic deal-making, multi-stream businesses, international trade, and capitalizing on emerging trends.",
      love: "Exciting, passionate, and magnetic. You thrive with an adventurous partner who shares your thirst for discovery and values mutual freedom.",
      compatibleNumbers: [1, 3, 5, 7],
      challengingNumbers: [2, 4, 6],
      shadowSide: "Impatience, sensual overindulgence, fear of routine commitments, and restlessness that leaves projects half-finished.",
      lifePurpose: "To champion human freedom, bridge cultural divides, and show humanity how to embrace evolution without fear.",
      powerAffirmation: "I embrace infinite possibilities, freedom, and divine adventure with total confidence."
    },
    6: {
      title: "The Cosmic Guardian",
      symbol: "💚",
      color: "#2ECC71",
      element: "Earth / Water",
      rulingPlanet: "Venus",
      tagline: "Love embodied in sacred action, beauty, and unconditional care.",
      personality: "Nurturing, balanced, and aesthetically gifted, you are the cosmic caregiver and protector. You possess an innate instinct to create harmony, sanctuary, and warmth wherever you reside. Your soul feels a deep calling toward justice, family, healing, and elevating the quality of human life.",
      nature: "Generous, responsible, and emotionally mature. You have an eye for exquisite design and cannot overlook anyone in distress. You are the dependable rock in any crisis.",
      skills: "Holistic healing, interior & environmental design, family counseling, community stewardship, aesthetic refinement, and conflict resolution.",
      career: "Physician, Holistic Healer, Interior Architect, High-Court Judge, Educator, Social Welfare Director, or Culinary Master.",
      wealthMagnetism: "Abundance flows through service-based enterprises, wellness, hospitality, interior luxury, and creating safe environments for growth.",
      love: "Deeply committed, devoted, and romantic. Family and home are your highest values. You nurture your partner with unmatched loyalty and warmth.",
      compatibleNumbers: [2, 4, 6, 9],
      challengingNumbers: [1, 5, 7],
      shadowSide: "Martyr complex, over-interfering in others' life lessons, taking on burdens that belong to others, and perfectionist self-criticism.",
      lifePurpose: "To radiate unconditional love, elevate human dignity, and cultivate sacred harmony in homes, communities, and workplaces.",
      powerAffirmation: "I am a magnet for unconditional love, exquisite beauty, and harmonious prosperity."
    },
    7: {
      title: "The Mystic Philosopher",
      symbol: "🔮",
      color: "#9B59B6",
      element: "Water / Ether",
      rulingPlanet: "Neptune / Ketu",
      tagline: "Truth is your holy obsession, wisdom your eternal reward.",
      personality: "Introspective, analytical, and deeply mystical, you are the spiritual researcher and sage. You are equipped with a penetrating intellect that slices through superficial falsehoods. Small talk exhausts you; you crave conversations about the nature of consciousness, sacred geometry, quantum reality, and the unseen realms.",
      nature: "Private, contemplative, and profoundly intuitive. You need sacred solitude to recharge your mind. You bridge the empirical scientific method with mystical gnosis.",
      skills: "Metaphysical analysis, advanced scientific research, philosophical synthesis, cryptography, spiritual teaching, and pattern decoding.",
      career: "Astrophysicist, Data Theorist, Spiritual Author, Graphologist, Investigative Analyst, Psychologist, or High-Level Strategist.",
      wealthMagnetism: "Wealth manifests through specialized deep expertise, scientific inventions, intellectual patents, high-level advisory, and spiritual products.",
      love: "Selective and slow to reveal vulnerabilities, but profoundly devoted once trust is cemented. You need an intellectually refined partner who respects solitude.",
      compatibleNumbers: [1, 5, 7, 11],
      challengingNumbers: [2, 6, 8],
      shadowSide: "Cynicism, emotional detachment, aloofness, paranoia, and intellectual isolation that cuts off human connection.",
      lifePurpose: "To uncover hidden cosmic truths, decode universal laws, and serve as a beacon of light in an era of illusion.",
      powerAffirmation: "Divine wisdom illuminates my mind. I see through all illusions into universal truth."
    },
    8: {
      title: "The Sovereign Powerhouse",
      symbol: "💎",
      color: "#2C3E50",
      element: "Earth / Fire",
      rulingPlanet: "Saturn",
      tagline: "Mastery of material reality, infinite abundance, and legacy.",
      personality: "Authoritative, ambitious, and visionary, you are engineered for large-scale manifestation and material mastery. You perceive the grand board of commerce, power, and resources with exceptional clarity. You do not merely participate in the world — you lead, organize, and build institutions that outlast generations.",
      nature: "Resilient, strategic, and commanding. Setbacks only fortify your resolve. You understand the profound spiritual law of cause and effect: what you sow with integrity, you harvest in abundance.",
      skills: "Corporate governance, macro-financial strategy, executive authority, real estate development, high-stakes negotiation, and capital allocation.",
      career: "Venture Capitalist, Chief Executive Officer, Investment Banker, Real Estate Mogul, Supreme Court Judge, or Industrial Magnate.",
      wealthMagnetism: "Extraordinary wealth attraction through ownership, scaling operations, compound investing, and directing large financial ecosystems.",
      love: "Loyal, generous, and fiercely protective. You desire an equally driven, accomplished partner who shares your ambition and honors your commitments.",
      compatibleNumbers: [2, 4, 6, 8, 22],
      challengingNumbers: [3, 7, 9],
      shadowSide: "Obsession with status, authoritarian control, measuring human worth solely by financial output, and neglecting emotional wellbeing.",
      lifePurpose: "To master the material realm in service of the highest good, generating ethical wealth that lifts thousands out of limitation.",
      powerAffirmation: "Infinite material and spiritual abundance flows through me as I lead with integrity."
    },
    9: {
      title: "The Universal Humanitarian",
      symbol: "🌟",
      color: "#E74C3C",
      element: "Fire / Ether",
      rulingPlanet: "Mars",
      tagline: "Born to serve humanity, destined to complete karmic cycles.",
      personality: "Wise, compassionate, and globally conscious, you are an old soul standing at the culmination of the single-digit numerological journey. You carry deep soul memories of universal empathy and understand both profound ecstasy and deep human sorrow. Your life is dedicated to completing karmic debts and uplifting the global collective.",
      nature: "Selfless, charismatic, and visionary. You see beyond race, nationality, and dogma, viewing all beings as part of one divine family.",
      skills: "Global philanthropy, transformative art, philosophical leadership, crisis counseling, intercultural healing, and environmental advocacy.",
      career: "Global NGO Leader, Humanitarian Diplomat, Transformational Author, International Artist, Environmental Pioneer, or Spiritual Guide.",
      wealthMagnetism: "Wealth flows abundantly when your enterprise is tied to a noble humanitarian purpose. The more you give and elevate others, the more returns to you.",
      love: "Deep, soulful, and unconditional. You give your whole heart, but must maintain healthy personal boundaries to avoid emotional exhaustion.",
      compatibleNumbers: [2, 3, 6, 9],
      challengingNumbers: [4, 8],
      shadowSide: "Resentment when sacrifices go unacknowledged, moodiness, clinging to completed life cycles, and dramatic emotional martyrdom.",
      lifePurpose: "To release outdated karmic patterns, model universal forgiveness, and anchor unconditional love across the earth.",
      powerAffirmation: "I release the past with gratitude and uplift humanity through boundless compassion."
    },
    11: {
      title: "The Divine Illuminator (Master 11)",
      symbol: "✨",
      color: "#00CED1",
      element: "Air / Ether",
      rulingPlanet: "Moon / Uranus",
      tagline: "A master channel of intuition, inspiration, and cosmic light.",
      personality: "As the first Master Number, you operate on a high-frequency spiritual vibration. You are an intuitive antenna, receiving divine downloads, prophetic visions, and profound insights. You often felt different from childhood because your nervous system senses realities that others cannot yet perceive.",
      nature: "Highly sensitive, visionary, and intensely charismatic. You carry double the creative power of a 1, balanced with the deep empathy of a 2. Your challenge is mastering your sensitive nervous system.",
      skills: "Intuitive illumination, spiritual awakening, transformational counseling, psychic vision, visionary art, and motivational transmission.",
      career: "Spiritual Teacher, Intuitive Strategist, Visionary Filmmaker, Quantum Consciousness Researcher, Motivational Leader, or Master Healer.",
      wealthMagnetism: "Abundance blooms when you trust your intuitive hunches and build platforms that elevate human consciousness.",
      love: "You seek a spiritual soulmate connection — someone who honors your intense energetic world and holds sacred space for your vision.",
      compatibleNumbers: [2, 7, 11, 22, 33],
      challengingNumbers: [4, 8],
      shadowSide: "Nervous anxiety, psychic overwhelm, self-doubt, and retreating into isolation when the world's energy feels too harsh.",
      lifePurpose: "To bridge the unseen spiritual realms with daily physical life, awakening humanity to higher dimensions of love and consciousness.",
      powerAffirmation: "I am a direct channel of divine illumination, spiritual vision, and awakening."
    },
    22: {
      title: "The Master Architect (Master 22)",
      symbol: "🏗️",
      color: "#DAA520",
      element: "Earth / Ether",
      rulingPlanet: "Uranus / Saturn",
      tagline: "The most powerful number: turning grandest visions into tangible reality.",
      personality: "Master Number 22 combines the intuitive illumination of the 11 with the grounded, methodical execution of the 4. You possess an almost supernatural ability to visualize complex global initiatives and construct the exact operational roadmap to manifest them into physical reality.",
      nature: "Vast in perspective, unshakeably practical, and destined for historic impact. You think in continents, decades, and monumental legacies.",
      skills: "Mega-scale architectural planning, global institution founding, international commerce, systems innovation, and monumental manifesting.",
      career: "Global Infrastructure Pioneer, Founding Director of International Organizations, Master Sustainable Architect, or World Peace Strategist.",
      wealthMagnetism: "Infinite wealth potential tied directly to massive projects that revolutionize industries and create generational prosperity.",
      love: "Deeply committed and dependable, though your mission demands high energy. You need a partner who stands beside your vision with total trust.",
      compatibleNumbers: [4, 8, 11, 22, 33],
      challengingNumbers: [3, 5],
      shadowSide: "Crushing pressure from self-expectations, fear of failure on a public stage, and slipping into rigid control.",
      lifePurpose: "To construct enduring physical and economic systems that elevate living standards and spiritual freedom for all of humanity.",
      powerAffirmation: "I turn the grandest visions into tangible reality that elevates the human race."
    },
    33: {
      title: "The Master Avatar (Master 33)",
      symbol: "🕊️",
      color: "#FF1493",
      element: "Water / Ether",
      rulingPlanet: "Venus / Neptune",
      tagline: "The Master Teacher: love incarnate and healing at the highest level.",
      personality: "The rarest and most spiritually potent of all numbers, Master Number 33 is known as the Master Teacher. You carry the compassionate nurturing of a 6 amplified to a cosmic scale, coupled with the expressive brilliance of a 3. You are here to embody unconditional divine love and heal deep spiritual wounds.",
      nature: "Deeply loving, self-sacrificing, and radiant. Your presence alone acts as an emotional and energetic balm to suffering souls.",
      skills: "Universal spiritual teaching, profound energy healing, master counseling, world peacemaking, and selfless transformative devotion.",
      career: "Spiritual Avatar, Master Healer, Humanitarian Icon, Legendary Mystic Artist, or International Peacemaker.",
      wealthMagnetism: "Divine abundance provides for every need effortlessly as long as your actions remain anchored in pure selfless service.",
      love: "Universal and transcendent. You love with the depth of an ocean. Your journey is learning to receive the same sacred care that you pour into others.",
      compatibleNumbers: [6, 9, 11, 22, 33],
      challengingNumbers: [1, 5, 8],
      shadowSide: "Emotional burnout, taking on the suffering of the world, and neglecting personal physical health.",
      lifePurpose: "To embody divine unconditional love in human form, teaching the soul of humanity how to heal and awaken through grace.",
      powerAffirmation: "I embody divine compassion and healing grace, uplifting every soul I touch."
    }
  },

  // ── 2. KARMIC DEBT NUMBERS ─────────────────────────────────
  karmicDebtReadings: {
    13: {
      title: "Karmic Debt 13/4 — Debt of Focus & Sacred Work",
      origin: "In past incarnations, you may have avoided hard work, taken shortcuts, or left duties to others.",
      lesson: "In this lifetime, success requires continuous discipline, order, and avoiding procrastination. There are no shortcuts for you — but your earned achievements will be unshakeable.",
      remedy: "Embrace daily structure, finish whatever you begin, and view hard work as a spiritual practice of refinement."
    },
    14: {
      title: "Karmic Debt 14/5 — Debt of Freedom & Moderation",
      origin: "In past cycles, personal freedom may have been abused through sensual excesses, unpredictability, or ignoring the rights of others.",
      lesson: "You will face sudden changes and temptations. Your soul lesson is learning moderation, inner commitment, and using freedom responsibly without escaping.",
      remedy: "Practice emotional grounding, establish healthy daily routines, and avoid falling into addictive escapism."
    },
    16: {
      title: "Karmic Debt 16/7 — Debt of Spiritual Awakening & Ego Transformation",
      origin: "Past life misuse of love, emotional betrayal, or excessive intellectual pride and vanity.",
      lesson: "You may experience sudden 'tower moments' where false ego attachments collapse so that your true spiritual self can be born. It is the path of the Phoenix.",
      remedy: "Cultivate genuine spiritual humility, forgive past betrayals, and build your life on eternal truths rather than material illusions."
    },
    19: {
      title: "Karmic Debt 19/1 — Debt of Sovereign Interdependence",
      origin: "Past life abuse of personal power, extreme selfishness, or refusing to accept guidance from others.",
      lesson: "You are called to stand on your own feet, but you must learn that true strength includes receiving help, listening to others, and leading with humility.",
      remedy: "Learn to ask for support gracefully, share credit with your team, and lead through empowering others rather than dominating."
    }
  },

  // ── 3. KARMIC LESSONS (MISSING NUMBERS 1-9 IN NAME) ────────
  karmicLessonReadings: {
    1: "Missing 1: You must develop inner self-confidence, initiative, and the courage to stand alone without seeking outside validation.",
    2: "Missing 2: You must cultivate patience, active listening, teamwork, and sensitivity to others' emotional rhythms.",
    3: "Missing 3: You are challenged to express your genuine feelings openly, avoid self-criticism, and allow your creativity to shine.",
    4: "Missing 4: You need to build grounded discipline, punctuality, and respect for structured systems and physical health.",
    5: "Missing 5: You are learning to embrace change, welcome new experiences, and overcome the fear of the unknown.",
    6: "Missing 6: Your soul lesson is embracing commitment, family responsibility, and learning unconditional love without controlling outcomes.",
    7: "Missing 7: You must cultivate faith, spend time in reflective solitude, and seek spiritual wisdom beyond material logic.",
    8: "Missing 8: You are challenged to master financial acumen, understand the spiritual power of money, and exercise authority with integrity.",
    9: "Missing 9: You are learning universal compassion, letting go of personal grievances, and seeing yourself in all of humanity."
  },

  // ── 4. PERSONAL YEAR 2026 FORECASTS ─────────────────────────
  personalYearReadings: {
    1: {
      theme: "New Beginnings, Planting Seeds & Fresh Leadership",
      forecast: "2026 marks the first year of your brand new 9-year cycle! This is the time to start new projects, take bold career leaps, and redefine your identity. What you initiate this year sets the trajectory for the next decade.",
      advice: "Be bold. Trust your instincts. Do not wait for others to give you permission."
    },
    2: {
      theme: "Patience, Alliances & Inner Growth",
      forecast: "After the rapid push of Year 1, 2026 is a year of gentle cultivation, partnerships, and emotional refinement. Progress happens behind the scenes. Focus on collaboration, diplomacy, and nurturing connections.",
      advice: "Practice patience. Avoid forcing outcomes. Let relationships deepen naturally."
    },
    3: {
      theme: "Creative Expansion, Social Joy & Self-Expression",
      forecast: "A vibrant, expressive, and joyful year! Your social life expands, creative inspiration flows, and your communication reaches wider audiences. Great for travel, publishing, art, and networking.",
      advice: "Stay focused on your primary goals so your creative energy does not scatter into too many directions."
    },
    4: {
      theme: "Foundations, Hard Work & Building Security",
      forecast: "2026 demands discipline, organization, and practical effort. This is your foundation-building year — putting solid systems, financial savings, and structural stability into your life and career.",
      advice: "Put your head down and build. The effort you invest in 2026 will reward you with lifelong security."
    },
    5: {
      theme: "Dynamic Change, Freedom & Rapid Expansion",
      forecast: "Expect the unexpected! 2026 brings pivotal transformations, new travel opportunities, career shifts, and exciting adventures. You are breaking free from outdated routines.",
      advice: "Stay adaptable and open-minded. Ride the wave of change with courage."
    },
    6: {
      theme: "Family, Domestic Harmony & Sacred Commitments",
      forecast: "A deeply fulfilling year centered on home, relationships, marriage, family healing, and community responsibility. Your focus turns toward creating beauty, comfort, and emotional sanctuary.",
      advice: "Be there for loved ones, but maintain healthy boundaries to protect your personal energy."
    },
    7: {
      theme: "Introspection, Spiritual Awakening & Deep Study",
      forecast: "A sacred year of inner reflection, spiritual study, research, and self-discovery. Material pursuits take a backseat as you seek deeper answers about your soul's true purpose.",
      advice: "Schedule quiet retreats, read transformative books, and prioritize mental peace."
    },
    8: {
      theme: "Power, Material Harvest & Financial Manifestation",
      forecast: "The harvest year of your cycle! 2026 brings major opportunities for career promotion, financial abundance, business expansion, and public recognition. Step into your authority.",
      advice: "Manage wealth and power with integrity and clear long-term strategy."
    },
    9: {
      theme: "Culmination, Forgiveness & Sacred Completion",
      forecast: "The final year of your 9-year cycle. It is time to clear out outdated relationships, complete unfinished business, forgive past hurts, and release what no longer serves your highest good.",
      advice: "Let go gracefully to make clean space for the magnificent new cycle beginning next year."
    }
  },

  // ── 5. MOBILE VIBRATIONS ───────────────────────────────────
  mobileVibrations: {
    1: {
      title: "1 — The Sun Leader Vibration",
      description: "Carries the solar frequency of authority, fresh starts, and pioneer leadership. Amplifies decision-making and attracts career advancement.",
      effect: "Boosts entrepreneurial ventures, authoritative communication, and personal recognition.",
      lucky: "Ideal for CEOs, Founders, Independent Consultants & Directors."
    },
    2: {
      title: "2 — The Lunar Harmony Vibration",
      description: "Vibrates with peace, diplomacy, and emotional resonance. Strengthens client trust, partnerships, and cooperative agreements.",
      effect: "Encourages smooth collaborations, calm negotiations, and emotional rapport.",
      lucky: "Ideal for Counselors, HR Managers, Mediators, Healers & Diplomats."
    },
    3: {
      title: "3 — The Jovian Expressive Vibration",
      description: "Pushes creative charisma, sales magnetism, and social expansion. Amplifies your speaking and writing resonance.",
      effect: "Magnetizes social opportunities, media visibility, and creative deals.",
      lucky: "Ideal for Marketers, Writers, Content Creators, Performers & Public Speakers."
    },
    4: {
      title: "4 — The Earth Anchor Vibration",
      description: "Anchors your energy in reliability, systems, and disciplined structure. Perfect for managing complex logistics and operations.",
      effect: "Attracts dependable clients, long-term contracts, and steady financial stability.",
      lucky: "Ideal for Engineers, Accountants, Builders, Financial Planners & Operations Heads."
    },
    5: {
      title: "5 — The Mercurial Speed Vibration",
      description: "Full of rapid movement, networking, and dynamic change. Keeps communication vibrant and generates constant incoming inquiries.",
      effect: "Expands travel opportunities, fast-moving transactions, and market versatility.",
      lucky: "Ideal for Sales Professionals, Real Estate Brokers, Travelers & Traders."
    },
    6: {
      title: "6 — The Venusian Nurture Vibration",
      description: "Radiates warmth, aesthetic beauty, and domestic protection. Deepens customer loyalty and emotional security.",
      effect: "Strengthens relationships, creates welcoming energy, and attracts luxury/wellness clients.",
      lucky: "Ideal for Doctors, Interior Designers, Hospitality Leaders & Teachers."
    },
    7: {
      title: "7 — The Mystical Wisdom Vibration",
      description: "Resonates with analytical depth, research, and intuitive protection. Filters out superficial noise.",
      effect: "Sharpens intellect, attracts high-value consulting inquiries, and deepens concentration.",
      lucky: "Ideal for Scientists, Astrologers, Researchers, Psychologists & Tech Architects."
    },
    8: {
      title: "8 — The Saturnine Abundance Vibration",
      description: "The most powerful financial frequency. Magnetizes large-scale deals, executive authority, and material wealth.",
      effect: "Attracts high-net-worth clients, capital investments, and corporate prestige.",
      lucky: "Ideal for Business Tycoons, Bankers, Real Estate Developers & Corporate Lawyers."
    },
    9: {
      title: "9 — The Universal Humanitarian Vibration",
      description: "Carries global resonance, wisdom, and philanthropic impact. Connects your voice to large communities.",
      effect: "Inspires deep trust, global reach, and purpose-driven initiatives.",
      lucky: "Ideal for NGO Leaders, International Consultants, Healers & Educators."
    }
  },

  // ── 6. SOUL URGE DESCRIPTIONS ──────────────────────────────
  soulUrgeDescriptions: {
    1: "Your soul's deepest hunger is sovereign independence and pioneer achievement. You crave the freedom to chart your own course without restriction.",
    2: "Your inner heart longs for profound love, emotional harmony, and soulful companionship. Peace and intimate connection are your true sanctuary.",
    3: "Your soul yearns for joyful creative expression, laughter, and uplifting the world through art, storytelling, and authentic charisma.",
    4: "Your deepest soul desire is unshakeable security, order, and building an enduring legacy that provides safety for generations.",
    5: "Freedom, travel, and unfiltered exploration are your soul's bread and wine. You crave change, sensory richness, and breaking free from monotony.",
    6: "Your soul longs to nurture, love, and create exquisite sanctuary. You are fulfilled when your loved ones and community are secure and thriving.",
    7: "Your soul seeks the ultimate truth of the cosmos. You crave quiet contemplation, spiritual depth, and understanding the mysteries of consciousness.",
    8: "Material mastery, executive power, and large-scale accomplishment drive your soul. You yearn to leave an indelible mark of authority upon the world.",
    9: "Your soul desires universal service and global healing. You crave the deep fulfillment of transforming lives and leaving the earth better than you found it.",
    11: "Your soul craves spiritual illumination and cosmic awakening. You yearn to be an open channel for divine light and higher consciousness.",
    22: "Your soul desires monumental manifestation — constructing world-changing institutions, structures, and systems that elevate humanity.",
    33: "Your soul longs to be a pure vessel of divine unconditional love, healing the emotional and spiritual suffering of humanity."
  },

  // ── 7. PERSONALITY DESCRIPTIONS ───────────────────────────
  personalityDescriptions: {
    1: "You project an aura of magnetic authority, strength, and pioneering confidence. People immediately recognize you as someone who takes charge.",
    2: "You appear gentle, approachable, trustworthy, and empathetic. Others feel safe confiding their deepest feelings in your calming presence.",
    3: "You radiate charm, sparkling wit, and infectious enthusiasm. You light up any environment with your artistic elegance and warm social grace.",
    4: "You project solid reliability, integrity, and disciplined competence. People view you as an unshakeable rock who always honors commitments.",
    5: "You appear magnetic, adventurous, and delightfully unpredictable. People are energized by your quick wit and adventurous spirit.",
    6: "You radiate maternal/paternal warmth, beauty, and responsible care. Others view you as a pillar of protection and generous sanctuary.",
    7: "You project an aura of intellectual mystery, wisdom, and philosophical depth. People sense you see far beyond surface appearances.",
    8: "You project executive authority, power, and high-status confidence. People instinctively take you seriously and respect your command.",
    9: "You appear worldly, compassionate, and deeply wise. People sense your old soul energy and are drawn to your inclusive, noble presence.",
    11: "You radiate an ethereal, otherworldly luminescence. People sense a special divine spark and inspirational energy in your presence.",
    22: "You project extraordinary capability, grounded power, and monumental vision. People sense you can manifest impossible goals at scale.",
    33: "You radiate pure healing grace and unconditional love. Others feel cleansed and comforted simply by standing near your field."
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { READINGS };
}
