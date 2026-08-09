export const itineraryData = [
  {
    id: 'day-1',
    date: 'Aug 20',
    title: 'Arrival in Budapest',
    location: 'Budapest, Hungary',
    events: [
      {
        id: 'e1',
        time: '10:10',
        duration: 150, // 2h 30m
        title: 'Flight W62508 (TLV ➡️ BUD)',
        description: 'Wizz Air flight departing TLV (Terminal 3) at 10:10, arriving at Budapest BUD (Terminal 2B) at 12:40. Confirmation: JI5ZUV',
        icon: '✈️'
      },
      {
        id: 'e2',
        time: '14:00',
        duration: 90,
        title: 'Check-in: Gozsdu Court Budapest',
        description: 'Check into the hotel for our 2-night stay! We have 3 rooms booked for 7 adults and 6 kids.',
        icon: '🏨'
      },
      {
        id: 'e2b',
        time: '18:30',
        duration: 120,
        title: 'Dinner at The Magic II',
        description: 'Reservation for 15 people! (Need to send meal orders 2-3 days prior). Menu: www.themagic2.hu/etlap',
        icon: '🪄'
      }
    ]
  },
  {
    id: 'day-2',
    date: 'Aug 21',
    title: 'Exploring Budapest',
    location: 'Budapest, Hungary',
    events: []
  },
  {
    id: 'day-3',
    date: 'Aug 22',
    title: 'Roadtrip to Slovakia',
    location: 'Budapest ➡️ Slovakia',
    events: [
      {
        id: 'e4b',
        time: '09:00',
        duration: 60,
        title: 'Check-out: Gozsdu Court',
        description: 'Pack up and check out of the hotel before grabbing the cars.',
        icon: '🧳'
      },
      {
        id: 'e6',
        time: '16:00',
        duration: 90,
        title: 'Check-in: Holiday Village Tatralandia',
        description: 'Reservation #2313114 under Einat Malinovitch. 4 rooms (Suite/Cottage deluxe). Breakfast & water park passes included.',
        icon: '🎢'
      }
    ]
  },
  {
    id: 'day-4',
    date: 'Aug 23',
    title: 'Tatralandia Fun',
    location: 'Slovakia',
    events: []
  },
  {
    id: 'day-5',
    date: 'Aug 24',
    title: 'Tatralandia Fun',
    location: 'Slovakia',
    events: []
  },
  {
    id: 'day-6',
    date: 'Aug 25',
    title: 'Tatralandia Fun',
    location: 'Slovakia',
    events: []
  },
  {
    id: 'day-7',
    date: 'Aug 26',
    title: 'Tatralandia Fun',
    location: 'Slovakia',
    events: []
  },
  {
    id: 'day-8',
    date: 'Aug 27',
    title: 'Tatralandia Fun',
    location: 'Slovakia',
    events: []
  },
  {
    id: 'day-9',
    date: 'Aug 28',
    title: 'Return to Budapest',
    location: 'Slovakia ➡️ Budapest',
    events: [
      {
        id: 'e12',
        time: '10:00',
        duration: 240, // 4 hours drive back
        title: 'Check-out & Drive back to Hungary',
        description: 'Check out of Holiday Village Tatralandia by 10:00 AM and hit the road to Budapest.',
        icon: '🚗'
      }
    ]
  },
  {
    id: 'day-10',
    date: 'Aug 29',
    title: 'Heading Home',
    location: 'Budapest ➡️ Israel',
    events: [
      {
        id: 'e14',
        time: '13:40',
        duration: 195, // 3h 15m
        title: 'Flight W62327 (BUD ➡️ TLV)',
        description: 'Wizz Air flight departing Budapest BUD (Terminal 2B) at 13:40, arriving in TLV (Terminal 3) at 17:55. Confirmation: PIJRVV',
        icon: '✈️'
      }
    ]
  }
];
