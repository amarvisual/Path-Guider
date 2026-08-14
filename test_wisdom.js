const { getGitaWisdom } = require('./gitaWisdom.js');

const tests = [
  ['Raj',   'I am feeling very worried and tensed about my future'],
  ['Priya', 'mujhe bahut darr lag raha hai'],           // Hindi - fear
  ['Amit',  'I was betrayed by my best friend'],         // stemming: betrayed→betray
  ['Sita',  'log kya kahenge meri padhai ke baare mein'], // Hinglish mix
  ['Arjun', 'I keep procrastinating and feel unmotivated'], // stem: procrastinating
  ['Meera', 'mera business dub gaya paisa sab kho diya'],  // Hindi business loss
  ['Dev',   'I am drowning in problems'],                // no keyword - random
  ['Kiran', 'mere dost ne dhoka diya aur main toot gaya'], // Hindi betrayal
  ['Ravi',  'I feel jealous of my colleague success'],   // multi-word
  ['Anita', 'shaadi ka pressure ghar walon ki taraf se'], // Hinglish marriage
];

console.log('=== SMART MATCHING TEST ===\n');
tests.forEach(([name, q]) => {
  const result = getGitaWisdom(name, q);
  const ref = result.match(/---REFERENCE---\n(.+)/)?.[1] || 'unknown';
  console.log(`Q: "${q.slice(0,50)}"`);
  console.log(`→ ${ref}\n`);
});
