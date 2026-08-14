const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { console.log(url, 'raw:', d.slice(0,100)); resolve(null); } });
    }).on('error', reject);
  });
}

async function main() {
  const base = 'https://raw.githubusercontent.com/praneshp1org/Bhagavad-Gita-JSON-data/main/';
  console.log('Fetching verses...');
  const [verses, translations] = await Promise.all([
    get(base + 'verse.json'),
    get(base + 'translation.json')
  ]);

  if (!verses) { console.log('verse.json failed'); return; }
  console.log('verses type:', typeof verses, 'isArray:', Array.isArray(verses));
  if (Array.isArray(verses)) console.log('count:', verses.length, 'sample keys:', Object.keys(verses[0]||{}).join(','));
  else console.log('keys:', Object.keys(verses).join(','));

  if (translations) {
    console.log('translations type:', typeof translations, 'isArray:', Array.isArray(translations));
    if(Array.isArray(translations)) console.log('count:', translations.length, 'sample:', Object.keys(translations[0]||{}).join(','));
  }
}
main().catch(console.error);
