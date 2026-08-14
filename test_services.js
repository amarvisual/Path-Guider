const http = require('http');

function get(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', e => resolve({ error: e.message }));
  });
}

function post(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({ hostname: 'localhost', port: 3000, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== TESTING ALL NEW SERVICES ===\n');

  // 1. Daily Verse
  const dv = await get('/daily-verse');
  console.log('📖 Daily Verse:', dv.success ? `Ch.${dv.verse.chapter} Verse ${dv.verse.verse} ✅` : '❌ ' + dv.error);

  // 2. Mantra
  const m = await post('/mantra', { problem: 'I am scared and anxious' });
  console.log('📿 Mantra:', m.success ? `${m.mantra.name} ✅` : '❌ ' + m.error);

  // 3. Numerology
  const n = await post('/numerology', { name: 'Arjun Sharma', dob: '1995-08-15' });
  console.log('🔢 Numerology:', n.success ? `Life Path ${n.reading.numbers.lifePath} — ${n.reading.lifePathData.title} ✅` : '❌ ' + n.error);

  // 4. Muhurat
  const mh = await post('/muhurat', { activity: 'business', date: '2026-05-08' });
  console.log('📅 Muhurat:', mh.success ? `${mh.muhurat.verdict} (${mh.muhurat.day}) ✅` : '❌ ' + mh.error);

  // 5. Puja List
  const pl = await get('/puja');
  console.log('🙏 Puja List:', pl.success ? `${pl.pujas.length} pujas available ✅` : '❌ ' + pl.error);

  // 6. Specific Puja
  const pg = await get('/puja/ganesh');
  console.log('🐘 Ganesh Puja:', pg.success ? `${pg.guide.steps.length} steps ✅` : '❌ ' + pg.error);

  console.log('\n=== ALL SERVICES READY ===');
}
main();
