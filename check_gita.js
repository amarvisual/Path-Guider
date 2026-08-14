const d = require('./gita_full.json');
console.log('Total verses:', d.length);
const chapters = [...new Set(d.map(v => v.chapter))].sort((a,b)=>a-b);
console.log('Chapters covered:', chapters.join(', '));
console.log('Per chapter:');
chapters.forEach(c => console.log('  Ch.' + c + ':', d.filter(v=>v.chapter===c).length + ' verses'));
