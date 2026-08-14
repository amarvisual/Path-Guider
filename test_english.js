const { getGitaWisdom } = require('./gitaWisdom.js');

const englishTests = [
  ['Raj',   'I am feeling very depressed and hopeless'],
  ['Sara',  'I am angry at my boss and want to quit'],
  ['Mike',  'I failed my exam and feel like a loser'],
  ['Anita', 'My boyfriend broke up with me and I am heartbroken'],
  ['John',  'I have no purpose in life, what am I doing here'],
  ['Priya', 'I am so jealous of my friends who are more successful'],
  ['Tom',   'I cannot sleep at night, I keep overthinking everything'],
  ['Riya',  'My business failed and I lost all my money'],
];

console.log('=== ENGLISH MESSAGE TEST ===\n');
englishTests.forEach(([name, q]) => {
  const result = getGitaWisdom(name, q);
  const ref  = result.match(/---REFERENCE---\n(.+)/)?.[1] || '';
  const eng  = result.match(/---ENGLISH---\n([\s\S]+?)---GUIDANCE---/)?.[1]?.trim()?.slice(0,80) || '';
  console.log(`Q: "${q}"`);
  console.log(`→ ${ref}`);
  console.log(`→ "${eng}..."\n`);
});
