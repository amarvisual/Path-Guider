const RASHIS = {
  aries:       { hindi:'मेष', symbol:'♈', dates:'Mar 21–Apr 19', ruler:'Mars', element:'Fire', traits:'Courageous, energetic, pioneering, impulsive', lucky:{ color:'Red', number:9, stone:'Red Coral', day:'Tuesday' }, strengths:'Leadership, enthusiasm, confidence', weakness:'Impatience, aggression' },
  taurus:      { hindi:'वृष', symbol:'♉', dates:'Apr 20–May 20', ruler:'Venus', element:'Earth', traits:'Reliable, patient, practical, determined, stubborn', lucky:{ color:'Green', number:6, stone:'Diamond', day:'Friday' }, strengths:'Loyalty, persistence, sensuality', weakness:'Stubbornness, possessiveness' },
  gemini:      { hindi:'मिथुन', symbol:'♊', dates:'May 21–Jun 20', ruler:'Mercury', element:'Air', traits:'Curious, adaptable, witty, communicative, restless', lucky:{ color:'Yellow', number:5, stone:'Emerald', day:'Wednesday' }, strengths:'Intelligence, communication, flexibility', weakness:'Inconsistency, anxiety' },
  cancer:      { hindi:'कर्क', symbol:'♋', dates:'Jun 21–Jul 22', ruler:'Moon', element:'Water', traits:'Intuitive, emotional, protective, nurturing, moody', lucky:{ color:'White/Silver', number:2, stone:'Pearl', day:'Monday' }, strengths:'Empathy, loyalty, imagination', weakness:'Moodiness, over-sensitivity' },
  leo:         { hindi:'सिंह', symbol:'♌', dates:'Jul 23–Aug 22', ruler:'Sun', element:'Fire', traits:'Generous, warm, dramatic, proud, creative, dominant', lucky:{ color:'Gold/Orange', number:1, stone:'Ruby', day:'Sunday' }, strengths:'Charisma, generosity, confidence', weakness:'Arrogance, stubbornness' },
  virgo:       { hindi:'कन्या', symbol:'♍', dates:'Aug 23–Sep 22', ruler:'Mercury', element:'Earth', traits:'Analytical, precise, hardworking, modest, critical', lucky:{ color:'Brown/Green', number:5, stone:'Emerald', day:'Wednesday' }, strengths:'Intelligence, diligence, reliability', weakness:'Over-criticism, worry' },
  libra:       { hindi:'तुला', symbol:'♎', dates:'Sep 23–Oct 22', ruler:'Venus', element:'Air', traits:'Diplomatic, charming, idealistic, social, indecisive', lucky:{ color:'Blue/Pink', number:6, stone:'Diamond/Opal', day:'Friday' }, strengths:'Justice, charm, cooperation', weakness:'Indecision, avoidance' },
  scorpio:     { hindi:'वृश्चिक', symbol:'♏', dates:'Oct 23–Nov 21', ruler:'Mars/Pluto', element:'Water', traits:'Passionate, resourceful, intense, secretive, loyal', lucky:{ color:'Dark Red', number:8, stone:'Blue Sapphire', day:'Tuesday' }, strengths:'Determination, insight, courage', weakness:'Jealousy, obsession' },
  sagittarius: { hindi:'धनु', symbol:'♐', dates:'Nov 22–Dec 21', ruler:'Jupiter', element:'Fire', traits:'Optimistic, adventurous, honest, philosophical, restless', lucky:{ color:'Purple/Yellow', number:3, stone:'Yellow Sapphire', day:'Thursday' }, strengths:'Freedom, wisdom, humor', weakness:'Tactlessness, inconsistency' },
  capricorn:   { hindi:'मकर', symbol:'♑', dates:'Dec 22–Jan 19', ruler:'Saturn', element:'Earth', traits:'Disciplined, responsible, ambitious, practical, reserved', lucky:{ color:'Black/Dark Blue', number:8, stone:'Blue Sapphire', day:'Saturday' }, strengths:'Ambition, patience, discipline', weakness:'Rigidity, pessimism' },
  aquarius:    { hindi:'कुम्भ', symbol:'♒', dates:'Jan 20–Feb 18', ruler:'Saturn/Uranus', element:'Air', traits:'Independent, innovative, humanitarian, eccentric, intellectual', lucky:{ color:'Electric Blue', number:4, stone:'Blue Sapphire/Amethyst', day:'Saturday' }, strengths:'Originality, intelligence, idealism', weakness:'Detachment, stubbornness' },
  pisces:      { hindi:'मीन', symbol:'♓', dates:'Feb 19–Mar 20', ruler:'Jupiter/Neptune', element:'Water', traits:'Compassionate, artistic, intuitive, dreamy, emotional', lucky:{ color:'Sea Green', number:3, stone:'Yellow Sapphire/Aquamarine', day:'Thursday' }, strengths:'Empathy, creativity, spirituality', weakness:'Over-sensitivity, escapism' },
};

const ZODIAC_BY_DATE = [
  { sign:'capricorn',   start:[1,1],  end:[1,19] },
  { sign:'aquarius',    start:[1,20], end:[2,18] },
  { sign:'pisces',      start:[2,19], end:[3,20] },
  { sign:'aries',       start:[3,21], end:[4,19] },
  { sign:'taurus',      start:[4,20], end:[5,20] },
  { sign:'gemini',      start:[5,21], end:[6,20] },
  { sign:'cancer',      start:[6,21], end:[7,22] },
  { sign:'leo',         start:[7,23], end:[8,22] },
  { sign:'virgo',       start:[8,23], end:[9,22] },
  { sign:'libra',       start:[9,23], end:[10,22] },
  { sign:'scorpio',     start:[10,23],end:[11,21] },
  { sign:'sagittarius', start:[11,22],end:[12,21] },
  { sign:'capricorn',   start:[12,22],end:[12,31] },
];

function getRashiByDate(dob) {
  const d = new Date(dob);
  const m = d.getMonth() + 1, day = d.getDate();
  for (const z of ZODIAC_BY_DATE) {
    const [sm,sd]=z.start, [em,ed]=z.end;
    if ((m===sm&&day>=sd)||(m===em&&day<=ed)) return { sign:z.sign, ...RASHIS[z.sign] };
  }
  return { sign:'capricorn', ...RASHIS['capricorn'] };
}

function getRashiByName(sign) {
  const s = sign.toLowerCase();
  return RASHIS[s] ? { sign:s, ...RASHIS[s] } : null;
}

module.exports = { getRashiByDate, getRashiByName, RASHIS };
