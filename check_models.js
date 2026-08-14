const https = require('https');
const key = 'AIzaSyCd6_5_pBegOcPw9wLr5c095BniKQORdPI';
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const d = JSON.parse(data);
    d.models.filter(m => m.name.includes('flash')).forEach(m => console.log(m.name));
  });
}).on('error', console.error);
