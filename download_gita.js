const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    }).on('error', reject);
  });
}

async function main() {
  const base = 'https://raw.githubusercontent.com/praneshp1org/Bhagavad-Gita-JSON-data/main/';
  console.log('Downloading all 700 Gita verses...');
  const [verses, translations] = await Promise.all([
    get(base + 'verse.json'),
    get(base + 'translation.json')
  ]);

  if (!verses) { console.log('Failed to fetch verses'); return; }

  // Build translation lookup: verse_id -> english translation
  const transMap = {};
  if (Array.isArray(translations)) {
    translations.forEach(t => {
      if (t.verse_id && !transMap[t.verse_id]) {
        transMap[t.verse_id] = t.description;
      }
    });
  }

  // Build final dataset
  const result = verses.map(v => ({
    chapter: v.chapter_number,
    verse: v.verse_number,
    sloka: v.text || '',
    transliteration: v.transliteration || '',
    hindi: v.word_meanings || '',
    english: transMap[v.id] || transMap[v.verse_id] || v.word_meanings || ''
  })).filter(v => v.chapter && v.verse);

  const OUT = path.join(__dirname, 'gita_full.json');
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`✅ Saved ${result.length} verses to gita_full.json`);
  console.log('Sample:', JSON.stringify(result[0], null, 2));
}

main().catch(console.error);
