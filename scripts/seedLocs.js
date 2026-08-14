const locations = [
  { title: 'Gozsdu Court Budapest', type: 'Hotel', desc: 'Our Budapest stay for the first and last leg of the trip. Right in the heart of the city.', query: 'Gozsdu+Court+Budapest', icon: '🏨' },
  { title: 'Holiday Village Tatralandia', type: 'Resort', desc: 'The main resort in Slovakia! Featuring cottages, a massive water park, and saunas.', query: 'Holiday+Village+Tatralandia+Slovakia', icon: '🎢' },
  { title: 'The Magic II', type: 'Restaurant', desc: 'Magical-themed family dinner reservation for 15 people.', query: 'The+Magic+II+Budapest', icon: '🪄' }
];

const PROJECT_ID = "family-trip-e19ea";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/locations`;

async function seed() {
  for (const loc of locations) {
    const payload = {
      fields: {
        title: { stringValue: loc.title },
        type: { stringValue: loc.type },
        desc: { stringValue: loc.desc },
        query: { stringValue: loc.query },
        icon: { stringValue: loc.icon },
        id: { stringValue: 'L' + Date.now() + Math.floor(Math.random() * 1000) }
      }
    };

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log(`Seeded location: ${loc.title}`);
    } else {
      console.error(`Failed to seed ${loc.title}:`, await res.text());
    }
  }
  console.log("Done seeding locations!");
}

seed();
