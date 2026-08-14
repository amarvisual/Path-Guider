// Mantra database with keyword matching
const MANTRAS = [
  {
    name: 'Gayatri Mantra',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।',
    transliteration: 'Om Bhur Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Prachodayāt',
    meaning: 'We meditate on the divine light of the Sun, who enlightens all realms. May that light illuminate our minds.',
    benefits: 'Wisdom, clarity, intelligence, success in studies and career',
    chantTime: 'Sunrise, noon, sunset (Sandhya time)',
    count: '108 times',
    deity: 'Surya / Savitr',
    keywords: ['knowledge','wisdom','study','exam','education','clarity','intelligence','learn','padhai','gyan','seekhna']
  },
  {
    name: 'Maha Mrityunjaya Mantra',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्।',
    transliteration: 'Om Tryambakam Yajaamahe Sugandhim Pushtivardhanam, Urvaarukamiva Bandhanaan Mrityormuksheeya Maamritaat',
    meaning: 'We worship the three-eyed Lord Shiva. Liberate us from death, as a ripe cucumber is freed from its vine.',
    benefits: 'Health recovery, protection from death, healing, long life',
    chantTime: 'Early morning (Brahma Muhurta)',
    count: '108 times',
    deity: 'Lord Shiva',
    keywords: ['health','sick','illness','death','fear','protection','heal','hospital','bimari','mrityu','rog','dawa','sehat']
  },
  {
    name: 'Om Namah Shivaya',
    sanskrit: 'ॐ नमः शिवाय',
    transliteration: 'Om Namah Shivaya',
    meaning: 'I bow to Lord Shiva — the auspicious one, the supreme consciousness within all beings.',
    benefits: 'Inner peace, spiritual growth, removal of negative energy, mental calm',
    chantTime: 'Any time, especially morning and evening',
    count: '108 times',
    deity: 'Lord Shiva',
    keywords: ['peace','stress','anxiety','tension','negative','fear','calm','shanti','darr','chinta','sukoon','pareshan']
  },
  {
    name: 'Hanuman Chalisa',
    sanskrit: 'जय हनुमान ज्ञान गुण सागर। जय कपीश तिहुँ लोक उजागर।।',
    transliteration: 'Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihu Lok Ujagar',
    meaning: 'Glory to Hanuman, ocean of wisdom and virtue. Victory to the Lord of monkeys who illumines the three worlds.',
    benefits: 'Courage, strength, protection from enemies, overcoming obstacles',
    chantTime: 'Tuesday and Saturday mornings',
    count: 'Once or 11 times',
    deity: 'Lord Hanuman',
    keywords: ['courage','strength','fear','obstacle','enemy','weak','brave','problem','himmat','sahas','dushman','mushkil','darr']
  },
  {
    name: 'Lakshmi Mantra',
    sanskrit: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः।',
    transliteration: 'Om Shreem Hreem Shreem Kamale Kamalalaye Praseed Praseed Om Shreem Hreem Shreem Mahalakshmyai Namah',
    meaning: 'O Goddess Lakshmi, who resides in the lotus, please bless me with prosperity and abundance.',
    benefits: 'Wealth, financial prosperity, abundance, business success',
    chantTime: 'Friday evenings',
    count: '108 times',
    deity: 'Goddess Lakshmi',
    keywords: ['money','wealth','finance','poor','business','debt','income','paisa','dhan','karz','garib','kamai','vyapaar']
  },
  {
    name: 'Saraswati Mantra',
    sanskrit: 'ॐ ऐं सरस्वत्यै नमः',
    transliteration: 'Om Aim Saraswatyai Namah',
    meaning: 'I bow to Goddess Saraswati, the bestower of knowledge, wisdom, and the arts.',
    benefits: 'Academic success, creativity, artistic talent, eloquence in speech',
    chantTime: 'Morning before study',
    count: '108 times',
    deity: 'Goddess Saraswati',
    keywords: ['study','exam','creativity','art','music','writing','talent','education','padhai','pariksha','kala','sangeet','vidya']
  },
  {
    name: 'Ganesh Mantra',
    sanskrit: 'ॐ गं गणपतये नमः',
    transliteration: 'Om Gam Ganapataye Namah',
    meaning: 'I bow to Lord Ganesha, the remover of obstacles and the lord of all beginnings.',
    benefits: 'Removes obstacles, new beginnings, success in new ventures',
    chantTime: 'Before any important work or new beginning',
    count: '108 times',
    deity: 'Lord Ganesha',
    keywords: ['obstacle','new','beginning','start','job','business','confusion','decision','problem','naya','shuruaat','mushkil','rasta']
  },
  {
    name: 'Krishna Mantra',
    sanskrit: 'ॐ नमो भगवते वासुदेवाय',
    transliteration: 'Om Namo Bhagavate Vasudevaya',
    meaning: 'I bow to Lord Vasudeva (Krishna), the Supreme Being who dwells in all hearts.',
    benefits: 'Love, devotion, inner joy, relationship harmony, spiritual growth',
    chantTime: 'Any time, especially at dusk',
    count: '108 times',
    deity: 'Lord Krishna',
    keywords: ['love','relationship','devotion','spiritual','peace','joy','lonely','sad','pyar','rishta','bhakti','udaas','tanha']
  },
  {
    name: 'Durga Mantra',
    sanskrit: 'ॐ दुं दुर्गायै नमः',
    transliteration: 'Om Dum Durgayai Namah',
    meaning: 'I bow to Goddess Durga, the invincible one who protects her devotees from all evil.',
    benefits: 'Protection, inner strength, victory over enemies and challenges',
    chantTime: 'Morning, especially on Tuesdays and Fridays',
    count: '108 times',
    deity: 'Goddess Durga',
    keywords: ['protection','enemy','danger','fight','injustice','weak','abuse','violence','shakti','suraksha','dushman','ladai']
  },
  {
    name: 'So Hum Mantra',
    sanskrit: 'सो ऽहम्',
    transliteration: 'So Hum',
    meaning: '"I am That" — a reminder that you are connected to the universal consciousness.',
    benefits: 'Deep meditation, self-realization, inner peace, identity and purpose',
    chantTime: 'During meditation',
    count: 'Sync with breath — inhale "So", exhale "Hum"',
    deity: 'Universal Consciousness',
    keywords: ['meditation','purpose','identity','soul','meaning','who am i','self','dhyan','atma','mann','uddeshya','chetna']
  },
  {
    name: 'Surya Mantra',
    sanskrit: 'ॐ सूर्याय नमः',
    transliteration: 'Om Suryaya Namah',
    meaning: 'I bow to the Sun God, the source of all light, energy, and life.',
    benefits: 'Health, energy, confidence, success, positive attitude',
    chantTime: 'At sunrise, facing the rising sun',
    count: '12 times (one for each name of Surya)',
    deity: 'Sun God (Surya)',
    keywords: ['health','energy','confidence','morning','positive','tired','depression','sehat','taakat','hausla','thakan','sunlight']
  },
  {
    name: 'Shanti Mantra',
    sanskrit: 'ॐ सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु। मा कश्चिद्दुःखभाग्भवेत्।',
    transliteration: 'Om Sarve Bhavantu Sukhinah, Sarve Santu Niramayah, Sarve Bhadrani Pashyantu, Ma Kashcid-Duhkha-Bhag-Bhavet',
    meaning: 'May all beings be happy. May all be free from illness. May all see auspiciousness. May none suffer.',
    benefits: 'Peace of mind, compassion, healing relationships, world peace',
    chantTime: 'Evening prayer',
    count: '3 times',
    deity: 'Universal',
    keywords: ['peace','healing','family','relationship','world','compassion','help','seva','shanti','parivar','madad','dost']
  },
];

function getMantra(problem) {
  const text = (problem || '').toLowerCase();
  let best = null, bestScore = 0;

  for (const mantra of MANTRAS) {
    const score = mantra.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = mantra; }
  }

  // If no match, return Gayatri (universal mantra)
  return best || MANTRAS[0];
}

module.exports = { getMantra, MANTRAS };
