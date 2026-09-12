const https = require('https');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.resolve(__dirname, '../server/.env'), 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

console.log('Testing with API Key prefix:', apiKey ? apiKey.slice(0, 10) + '...' : 'NONE');

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log('Available Models:');
        parsed.models.forEach(m => {
          if (m.supportedGenerationMethods?.includes('generateContent')) {
            console.log('-', m.name);
          }
        });
      } else {
        console.log('Response:', parsed);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
}).on('error', console.error);
