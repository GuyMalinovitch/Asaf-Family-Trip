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
      events: []
    },
    {
      id: 'day-2',
      date: isHe ? '21 באוגוסט' : 'Aug 21',
      title: isHe ? 'יום חופשי בבודפשט' : 'Free day in Budapest',
      location: isHe ? 'בודפשט, הונגריה' : 'Budapest, Hungary',
      events: []
    },
    {
      id: 'day-3',
      date: isHe ? '22 באוגוסט' : 'Aug 22',
      title: isHe ? 'נסיעה לסלובקיה' : 'Roadtrip to Slovakia',
      location: isHe ? 'בודפשט ➡️ סלובקיה' : 'Budapest ➡️ Slovakia',
      events: []
    },
    {
      id: 'day-4',
      date: isHe ? '23 באוגוסט' : 'Aug 23',
      title: isHe ? 'פארק המים' : 'Water Park',
      location: isHe ? 'סלובקיה' : 'Slovakia',
      events: []
    },
    {
      id: 'day-5',
      date: isHe ? '24 באוגוסט' : 'Aug 24',
      title: isHe ? 'טיולים בסביבה' : 'Exploring the area',
      location: isHe ? 'סלובקיה' : 'Slovakia',
      events: []
    },
    {
      id: 'day-6',
      date: isHe ? '25 באוגוסט' : 'Aug 25',
      title: isHe ? 'פעילות משפחתית' : 'Family Activity',
      location: isHe ? 'סלובקיה' : 'Slovakia',
      events: []
    },
    {
      id: 'day-7',
      date: isHe ? '26 באוגוסט' : 'Aug 26',
      title: isHe ? 'טיולים בסביבה' : 'Exploring the area',
      location: isHe ? 'סלובקיה' : 'Slovakia',
      events: []
    },
    {
      id: 'day-8',
      date: isHe ? '27 באוגוסט' : 'Aug 27',
      title: isHe ? 'פעילות משפחתית' : 'Family Activity',
      location: isHe ? 'סלובקיה' : 'Slovakia',
      events: []
    },
    {
      id: 'day-9',
      date: isHe ? '28 באוגוסט' : 'Aug 28',
      title: isHe ? 'חזרה לבודפשט' : 'Return to Budapest',
      location: isHe ? 'סלובקיה ➡️ בודפשט' : 'Slovakia ➡️ Budapest',
      events: []
    },
    {
      id: 'day-10',
      date: isHe ? '29 באוגוסט' : 'Aug 29',
      title: isHe ? 'חוזרים הביתה' : 'Heading Home',
      location: isHe ? 'בודפשט ➡️ ישראל' : 'Budapest ➡️ Israel',
      events: []
    }
  ];
};

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', itinerary: 'Itinerary', docs: 'Docs & Info', guidebook: 'Guidebook', recs: 'Recs' },
      home: {
        title: 'Asaf Family Trip', subtitle: 'Budapest & Slovakia',
        forecastTitle: 'Trip Forecast', live: 'Live', est: 'Est', fetching: 'Fetching live forecast...',
        upNext: 'Up Next',
        reportProblem: 'Report an Issue',
        reportModalTitle: 'Report a Problem',
        reportIssueTitle: 'Subject',
        reportIssueDesc: 'Describe the problem or what\'s missing...',
        cancel: 'Cancel', sendReport: 'Send Report', reporting: 'Sending...', reported: 'Reported!',
        weatherDays: { 'Aug 20': 'Aug 20', 'Aug 21': 'Aug 21', 'Aug 22': 'Aug 22', 'Aug 23': 'Aug 23', 'Aug 24': 'Aug 24', 'Aug 25': 'Aug 25', 'Aug 26': 'Aug 26', 'Aug 27': 'Aug 27', 'Aug 28': 'Aug 28', 'Aug 29': 'Aug 29' },
        weatherLocs: { 'Budapest': 'Bud', 'Slovakia': 'Slo' },
        flightDetails: 'Flight Details'
      },
      itinerary: {
        title: 'Itinerary', feedBtn: 'Feed', dailyBtn: 'Daily', weeklyBtn: 'Weekly', addEvent: 'Add Event to', cancel: 'Cancel', add: 'Add Event',
        modalTitle: 'Title', modalDesc: 'Description'
      },
      docs: {
        title: 'Docs & Info', subtitle: 'All important family documents and info',
        noDocs: 'No documents uploaded yet.', uploadTitle: 'Upload Info or Document',
        docTitle: 'Title (e.g. Flight 410)', uploader: 'Your Name',
        cancel: 'Cancel', upload: 'Upload', tapFile: '📄 Tap to select file...',
        cats: { general: 'General', flights: 'Flights', hotels: 'Hotels', cars: 'Rental Cars', insurance: 'Insurance' },
        pleaseSelectFile: 'Please fill out the form.',
        confirmDelete: 'Delete this item?',
        download: 'Download'
      },
      guidebook: {
        title: 'Guidebook & Maps', subtitle: 'Tap any location to instantly open it as a pinned location in your Google Maps app.',
        openMaps: 'Open in Google Maps'
      },
      recommendations: {
        title: 'Recommendations', subtitle: 'Family notes, restaurant ideas, and tips.',
        empty: 'No recommendations yet. Be the first to add one!',
        addTitle: 'Add Recommendation',
        formTitle: 'Title (e.g. Best Gelato)',
        formName: 'Your Name',
        formDesc: 'Write your recommendation here...'
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
      nav: { home: 'ראשי', itinerary: 'לו"ז', docs: 'מידע ומסמכים', guidebook: 'מפות', recs: 'המלצות' },
      home: {
        title: 'הטיול של משפחת אסף', subtitle: 'בודפשט וסלובקיה',
        forecastTitle: 'תחזית מזג אוויר', live: 'חי', est: 'הערכה', fetching: 'מוריד תחזית...',
        upNext: 'הבא בתור',
        reportProblem: 'דווח על בעיה',
        reportModalTitle: 'דיווח על בעיה',
        reportIssueTitle: 'נושא',
        reportIssueDesc: 'תאר את הבעיה או מה שחסר לך...',
        cancel: 'ביטול', sendReport: 'שלח דיווח', reporting: 'שולח...', reported: 'נשלח!',
        weatherDays: { 'Aug 20': '20 באוג', 'Aug 21': '21 באוג', 'Aug 22': '22 באוג', 'Aug 23': '23 באוג', 'Aug 24': '24 באוג', 'Aug 25': '25 באוג', 'Aug 26': '26 באוג', 'Aug 27': '27 באוג', 'Aug 28': '28 באוג', 'Aug 29': '29 באוג' },
        weatherLocs: { 'Budapest': 'בוד', 'Slovakia': 'סלו' },
        flightDetails: 'פרטי טיסות'
      },
      itinerary: {
        title: 'לוח זמנים', feedBtn: 'פיד', dailyBtn: 'יומי', weeklyBtn: 'שבועי', addEvent: 'הוסף אירוע ל-', cancel: 'ביטול', add: 'הוסף',
        modalTitle: 'כותרת', modalDesc: 'תיאור'
      },
      docs: {
        title: 'מידע ומסמכים', subtitle: 'כל המידע והמסמכים של המשפחה',
        noDocs: 'טרם הועלו מסמכים.', uploadTitle: 'הוספת מידע/מסמך',
        docTitle: 'כותרת (לדוגמה: טיסת וויזאייר)', uploader: 'השם שלך',
        cancel: 'ביטול', upload: 'העלאה', tapFile: '📄 לחץ לבחירת קובץ...',
        cats: { general: 'כללי', flights: 'טיסות', hotels: 'מלונות', cars: 'רכבים', insurance: 'ביטוח' },
        pleaseSelectFile: 'נא למלא את הטופס.',
        confirmDelete: 'למחוק את הפריט?',
        download: 'הורדה'
      },
      guidebook: {
        title: 'מפות והמלצות', subtitle: 'לחץ על כל מיקום כדי לפתוח אותו ישירות באפליקציית Google Maps.',
        openMaps: 'פתח ב-Google Maps'
      },
      recommendations: {
        title: 'המלצות', subtitle: 'הערות, רעיונות למסעדות וטיפים למשפחה.',
        empty: 'עדיין אין המלצות. תהיה הראשון להוסיף!',
        addTitle: 'הוסף המלצה',
        formTitle: 'כותרת (לדוגמה: הגלידה הכי טובה)',
        formName: 'השם שלך',
        formDesc: 'כתוב את ההמלצה שלך כאן...'
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
