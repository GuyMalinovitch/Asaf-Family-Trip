const events = [
  {
    dayId: "day-1", time: "10:10", duration: 150, icon: "✈️",
    title: "טיסת W62508 (תל אביב ➡️ בודפשט)",
    description: "טיסת וויזאייר יוצאת מנתב\"ג (טרמינל 3) ב-10:10, נוחתת בבודפשט (טרמינל 2B) ב-12:40. אישור: JI5ZUV"
  },
  {
    dayId: "day-1", time: "14:00", duration: 90, icon: "🏨",
    title: "צ'ק-אין: Gozsdu Court Budapest",
    description: "כניסה למלון ל-2 לילות! הוזמנו 3 חדרים ל-7 מבוגרים ו-6 ילדים."
  },
  {
    dayId: "day-1", time: "18:30", duration: 120, icon: "🪄",
    title: "ארוחת ערב ב-The Magic II",
    description: "הזמנה ל-15 אנשים! (יש לשלוח הזמנות מראש 2-3 ימים לפני). תפריט: www.themagic2.hu/etlap"
  },
  {
    dayId: "day-3", time: "09:00", duration: 60, icon: "🧳",
    title: "צ'ק-אאוט: Gozsdu Court",
    description: "אורזים ועוזבים את המלון לפני איסוף הרכבים."
  },
  {
    dayId: "day-3", time: "16:00", duration: 90, icon: "🎢",
    title: "צ'ק-אין: Holiday Village Tatralandia",
    description: "הזמנה #2313114 ע\"ש עינת מלינוביץ. 4 חדרים. כולל ארוחת בוקר וכניסה לפארק המים."
  },
  {
    dayId: "day-9", time: "10:00", duration: 240, icon: "🚗",
    title: "צ'ק-אאוט ונסיעה להונגריה",
    description: "עזיבת Holiday Village Tatralandia עד 10:00 בבוקר ויציאה לדרך לכיוון בודפשט."
  },
  {
    dayId: "day-10", time: "13:40", duration: 195, icon: "✈️",
    title: "טיסת W62327 (בודפשט ➡️ תל אביב)",
    description: "טיסת וויזאייר יוצאת מבודפשט ב-13:40, נוחתת בנתב\"ג ב-17:55. אישור: PIJRVV"
  }
];

const PROJECT_ID = "family-trip-e19ea";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/itinerary_events`;

async function seed() {
  for (const ev of events) {
    const payload = {
      fields: {
        dayId: { stringValue: ev.dayId },
        time: { stringValue: ev.time },
        duration: { integerValue: ev.duration.toString() },
        title: { stringValue: ev.title },
        description: { stringValue: ev.description },
        icon: { stringValue: ev.icon },
        id: { stringValue: 'e' + Date.now() + Math.floor(Math.random() * 1000) }
      }
    };

    const res = await fetch(firestoreUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log(`Seeded: ${ev.title}`);
    } else {
      console.error(`Failed to seed ${ev.title}:`, await res.text());
    }
  }
  console.log("Done seeding!");
}

seed();
