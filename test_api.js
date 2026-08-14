const { GoogleGenerativeAI } = require('@google/generative-ai');

const KEYS = [
  'AIzaSyCd6_5_pBegOcPw9wLr5c095BniKQORdPI',
  'AIzaSyCaMil5-qsFudruvY3CmclCas3Vdr5ocBk',
  'AIzaSyCdi3-C4RpOf-JTe6e8GPtxYRUrIOz5I40'
];

// Each model has its OWN separate daily quota!
const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
];

async function test(key, keyIdx, model) {
  const genAI = new GoogleGenerativeAI(key);
  const m = genAI.getGenerativeModel({ model });
  try {
    const result = await m.generateContent('Say hello');
    console.log(`✅ Key ${keyIdx+1} + ${model} WORKS! Response: ${result.response.text().slice(0,30)}`);
    return true;
  } catch(e) {
    console.log(`❌ Key ${keyIdx+1} + ${model}: ${e.status}`);
    return false;
  }
}

async function main() {
  console.log('Testing all key + model combinations...\n');
  for (const model of MODELS) {
    for (let i = 0; i < KEYS.length; i++) {
      const ok = await test(KEYS[i], i, model);
      if (ok) { console.log('\n🎉 FOUND WORKING COMBINATION!'); return; }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log('\n⏰ All combinations exhausted. Wait until tomorrow 6AM IST for reset.');
}
main();
