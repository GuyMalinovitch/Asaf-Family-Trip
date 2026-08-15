const fs = require('fs');
const https = require('https');

const PROJECT_ID = 'family-trip-e19ea';

async function fetchAll() {
  return new Promise((resolve, reject) => {
    https.get(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/itinerary_events?pageSize=300`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function updateDoc(name, fields) {
  const payload = JSON.stringify({ fields });
  return new Promise((resolve, reject) => {
    const req = https.request(`https://firestore.googleapis.com/v1/${name}?updateMask.fieldPaths=category`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  const data = await fetchAll();
  const docs = data.documents || [];
  
  let updated = 0;
  for (const doc of docs) {
    const title = doc.fields.title?.stringValue || '';
    if (title.includes('טיסת') || title.toLowerCase().includes('flight')) {
      console.log(`Updating category for: ${title}`);
      
      const newFields = {
        ...doc.fields,
        category: { stringValue: 'Flight' }
      };
      
      await updateDoc(doc.name, newFields);
      updated++;
    }
  }
  console.log(`Updated ${updated} flights.`);
}

run();
