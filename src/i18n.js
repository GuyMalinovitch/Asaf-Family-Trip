import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Shared itinerary structure to avoid repeating IDs/Times where possible
const getItinerary = (lang) => {
  const isHe = lang === 'he';
  return [
    {
      id: 'day-1',
      date: isHe ? '20 באוגוסט' : 'Aug 20',
      title: isHe ? 'הגעה לבודפשט' : 'Arrival in Budapest',
      location: isHe ? 'בודפשט, הונגריה' : 'Budapest, Hungary',
      events: [
        {
          id: 'e1', time: '10:10', duration: 150,
          title: isHe ? 'טיסת W62508 (תל אביב ➡️ בודפשט)' : 'Flight W62508 (TLV ➡️ BUD)',
          description: isHe ? 'טיסת וויזאייר יוצאת מנתב"ג (טרמינל 3) ב-10:10, נוחתת בבודפשט (טרמינל 2B) ב-12:40. אישור: JI5ZUV' : 'Wizz Air flight departing TLV (Terminal 3) at 10:10, arriving at Budapest BUD (Terminal 2B) at 12:40. Confirmation: JI5ZUV',
          icon: '✈️'
        },
        {
          id: 'e2', time: '14:00', duration: 90,
          title: isHe ? 'צ\'ק-אין: Gozsdu Court Budapest' : 'Check-in: Gozsdu Court Budapest',
          description: isHe ? 'כניסה למלון ל-2 לילות! הוזמנו 3 חדרים ל-7 מבוגרים ו-6 ילדים.' : 'Check into the hotel for our 2-night stay! We have 3 rooms booked for 7 adults and 6 kids.',
          icon: '🏨'
        },
        {
          id: 'e2b', time: '18:30', duration: 120,
          title: isHe ? 'ארוחת ערב ב-The Magic II' : 'Dinner at The Magic II',
          description: isHe ? 'הזמנה ל-15 אנשים! (יש לשלוח הזמנות מראש 2-3 ימים לפני). תפריט: www.themagic2.hu/etlap' : 'Reservation for 15 people! (Need to send meal orders 2-3 days prior). Menu: www.themagic2.hu/etlap',
          icon: '🪄'
        }
      ]
    },
    {
      id: 'day-3',
      date: isHe ? '22 באוגוסט' : 'Aug 22',
      title: isHe ? 'נסיעה לסלובקיה' : 'Roadtrip to Slovakia',
      location: isHe ? 'בודפשט ➡️ סלובקיה' : 'Budapest ➡️ Slovakia',
      events: [
        {
          id: 'e4b', time: '09:00', duration: 60,
          title: isHe ? 'צ\'ק-אאוט: Gozsdu Court' : 'Check-out: Gozsdu Court',
          description: isHe ? 'אורזים ועוזבים את המלון לפני איסוף הרכבים.' : 'Pack up and check out of the hotel before grabbing the cars.',
          icon: '🧳'
        },
        {
          id: 'e6', time: '16:00', duration: 90,
          title: isHe ? 'צ\'ק-אין: Holiday Village Tatralandia' : 'Check-in: Holiday Village Tatralandia',
          description: isHe ? 'הזמנה #2313114 ע"ש עינת מלינוביץ. 4 חדרים. כולל ארוחת בוקר וכניסה לפארק המים.' : 'Reservation #2313114 under Einat Malinovitch. 4 rooms. Breakfast & water park passes included.',
          icon: '🎢'
        }
      ]
    },
    {
      id: 'day-9',
      date: isHe ? '28 באוגוסט' : 'Aug 28',
      title: isHe ? 'חזרה לבודפשט' : 'Return to Budapest',
      location: isHe ? 'סלובקיה ➡️ בודפשט' : 'Slovakia ➡️ Budapest',
      events: [
        {
          id: 'e12', time: '10:00', duration: 240,
          title: isHe ? 'צ\'ק-אאוט ונסיעה להונגריה' : 'Check-out & Drive back to Hungary',
          description: isHe ? 'עזיבת Holiday Village Tatralandia עד 10:00 בבוקר ויציאה לדרך לכיוון בודפשט.' : 'Check out of Holiday Village Tatralandia by 10:00 AM and hit the road to Budapest.',
          icon: '🚗'
        }
      ]
    },
    {
      id: 'day-10',
      date: isHe ? '29 באוגוסט' : 'Aug 29',
      title: isHe ? 'חוזרים הביתה' : 'Heading Home',
      location: isHe ? 'בודפשט ➡️ ישראל' : 'Budapest ➡️ Israel',
      events: [
        {
          id: 'e14', time: '13:40', duration: 195,
          title: isHe ? 'טיסת W62327 (בודפשט ➡️ תל אביב)' : 'Flight W62327 (BUD ➡️ TLV)',
          description: isHe ? 'טיסת וויזאייר יוצאת מבודפשט ב-13:40, נוחתת בנתב"ג ב-17:55. אישור: PIJRVV' : 'Wizz Air flight departing Budapest BUD (Terminal 2B) at 13:40, arriving in TLV (Terminal 3) at 17:55. Confirmation: PIJRVV',
          icon: '✈️'
        }
      ]
    }
  ];
};

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', itinerary: 'Itinerary', docs: 'Docs', guidebook: 'Guidebook' },
      home: {
        title: 'Asaf Family Trip', subtitle: 'Budapest & Slovakia',
        forecastTitle: 'Trip Forecast', live: 'Live', est: 'Est', fetching: 'Fetching live forecast...',
        upNext: 'Up Next',
        weatherDays: { 'Aug 20': 'Aug 20', 'Aug 21': 'Aug 21', 'Aug 22': 'Aug 22', 'Aug 23': 'Aug 23', 'Aug 24': 'Aug 24', 'Aug 25': 'Aug 25', 'Aug 26': 'Aug 26', 'Aug 27': 'Aug 27', 'Aug 28': 'Aug 28', 'Aug 29': 'Aug 29' },
        weatherLocs: { 'Budapest': 'Bud', 'Slovakia': 'Slo' }
      },
      itinerary: {
        title: 'Itinerary', feedBtn: 'Feed', calBtn: 'Calendar', addEvent: 'Add Event to', cancel: 'Cancel', add: 'Add Event',
        modalTitle: 'Title', modalDesc: 'Description'
      },
      docs: {
        title: 'Docs & Logistics', subtitle: 'All important family documents',
        noDocs: 'No documents uploaded yet.', uploadTitle: 'Upload Document',
        docTitle: 'Document Title (e.g. Flight 410)', uploader: 'Your Name',
        cancel: 'Cancel', upload: 'Upload', tapFile: '📄 Tap to select file...',
        cats: { general: 'General', flights: 'Flights', hotels: 'Hotels', cars: 'Rental Cars', insurance: 'Insurance' }
      },
      guidebook: {
        title: 'Guidebook & Maps', subtitle: 'Tap any location to instantly open it as a pinned location in your Google Maps app.',
        openMaps: 'Open in Google Maps'
      },
      itineraryData: getItinerary('en'),
      docsData: [
        { id: 1, title: 'Flight W62508 (TLV->BUD) [JI5ZUV]', uploader: 'Asaf', category: 'Flights', icon: '✈️' },
        { id: 2, title: 'Flight W62327 (BUD->TLV) [PIJRVV]', uploader: 'Asaf', category: 'Flights', icon: '✈️' },
        { id: 3, title: 'Tatralandia Booking [2313114]', uploader: 'Einat', category: 'Hotels', icon: '🏨' },
        { id: 4, title: 'Gozsdu Court Booking (Budapest)', uploader: 'Einat', category: 'Hotels', icon: '🏨' }
      ],
      guideData: [
        { title: 'Gozsdu Court Budapest', type: 'Hotel', desc: 'Our Budapest stay for the first and last leg of the trip. Right in the heart of the city.', query: 'Gozsdu+Court+Budapest', icon: '🏨' },
        { title: 'Holiday Village Tatralandia', type: 'Resort', desc: 'The main resort in Slovakia! Featuring cottages, a massive water park, and saunas.', query: 'Holiday+Village+Tatralandia+Slovakia', icon: '🎢' },
        { title: 'The Magic II', type: 'Restaurant', desc: 'Magical-themed family dinner reservation for 15 people.', query: 'The+Magic+II+Budapest', icon: '🪄' }
      ]
    }
  },
  he: {
    translation: {
      nav: { home: 'ראשי', itinerary: 'לו"ז', docs: 'מסמכים', guidebook: 'מפות' },
      home: {
        title: 'הטיול של משפחת אסף', subtitle: 'בודפשט וסלובקיה',
        forecastTitle: 'תחזית מזג אוויר', live: 'חי', est: 'הערכה', fetching: 'מוריד תחזית...',
        upNext: 'הבא בתור',
        weatherDays: { 'Aug 20': '20 באוג', 'Aug 21': '21 באוג', 'Aug 22': '22 באוג', 'Aug 23': '23 באוג', 'Aug 24': '24 באוג', 'Aug 25': '25 באוג', 'Aug 26': '26 באוג', 'Aug 27': '27 באוג', 'Aug 28': '28 באוג', 'Aug 29': '29 באוג' },
        weatherLocs: { 'Budapest': 'בוד', 'Slovakia': 'סלו' }
      },
      itinerary: {
        title: 'לוח זמנים', feedBtn: 'פיד', calBtn: 'יומן', addEvent: 'הוסף אירוע ל-', cancel: 'ביטול', add: 'הוסף',
        modalTitle: 'כותרת', modalDesc: 'תיאור'
      },
      docs: {
        title: 'מסמכים ולוגיסטיקה', subtitle: 'כל המסמכים החשובים של המשפחה',
        noDocs: 'טרם הועלו מסמכים.', uploadTitle: 'העלאת מסמך',
        docTitle: 'כותרת המסמך (לדוגמה: טיסת וויזאייר)', uploader: 'השם שלך',
        cancel: 'ביטול', upload: 'העלאה', tapFile: '📄 לחץ לבחירת קובץ...',
        cats: { general: 'כללי', flights: 'טיסות', hotels: 'מלונות', cars: 'רכבים', insurance: 'ביטוח' }
      },
      guidebook: {
        title: 'מפות והמלצות', subtitle: 'לחץ על כל מיקום כדי לפתוח אותו ישירות באפליקציית Google Maps.',
        openMaps: 'פתח ב-Google Maps'
      },
      itineraryData: getItinerary('he'),
      docsData: [
        { id: 1, title: 'טיסת W62508 (ת"א->בודפשט) [JI5ZUV]', uploader: 'אסף', category: 'טיסות', icon: '✈️' },
        { id: 2, title: 'טיסת W62327 (בודפשט->ת"א) [PIJRVV]', uploader: 'אסף', category: 'טיסות', icon: '✈️' },
        { id: 3, title: 'הזמנת Holiday Village Tatralandia [2313114]', uploader: 'עינת', category: 'מלונות', icon: '🏨' },
        { id: 4, title: 'הזמנת Gozsdu Court (בודפשט)', uploader: 'עינת', category: 'מלונות', icon: '🏨' }
      ],
      guideData: [
        { title: 'Gozsdu Court Budapest', type: 'מלון', desc: 'המלון שלנו בבודפשט בחלק הראשון והאחרון של הטיול. ממש בלב העיר.', query: 'Gozsdu+Court+Budapest', icon: '🏨' },
        { title: 'Holiday Village Tatralandia', type: 'כפר נופש', desc: 'הריזורט המרכזי בסלובקיה! כולל בקתות, פארק מים ענק ומתחם סאונות.', query: 'Holiday+Village+Tatralandia+Slovakia', icon: '🎢' },
        { title: 'The Magic II', type: 'מסעדה', desc: 'מסעדת קונספט קסמים - הוזמן מקום ל-15 אנשים.', query: 'The+Magic+II+Budapest', icon: '🪄' }
      ]
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'he', // default to Hebrew
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
