const fs = require('fs');
const https = require('https');

async function run() {
  const data = JSON.parse(fs.readFileSync('events.json', 'utf8'));
  const docs = data.documents || [];
  
  const titleMap = {};
  
  for (const doc of docs) {
    const title = doc.fields?.title?.stringValue;
    if (!title) continue;
    
    if (!titleMap[title]) titleMap[title] = [];
    titleMap[title].push(doc);
  }
  
  for (const [title, items] of Object.entries(titleMap)) {
    if (items.length > 1) {
      console.log(`Title "${title}" has ${items.length} instances`);
      // keep the one that looks better (e.g. has dayId)
      items.sort((a, b) => {
        const aHasDay = a.fields?.dayId?.stringValue ? 1 : 0;
        const bHasDay = b.fields?.dayId?.stringValue ? 1 : 0;
        return bHasDay - aHasDay; // descending
      });
      
      // items[0] is the keeper
      for (let i = 1; i < items.length; i++) {
        const name = items[i].name;
        console.log(`Deleting duplicate: ${name}`);
        await deleteDoc(name);
      }
    }
  }
}

async function deleteDoc(name) {
  return new Promise((resolve, reject) => {
    const req = https.request(`https://firestore.googleapis.com/v1/${name}`, { method: 'DELETE' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}

run();
