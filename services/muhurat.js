// Muhurat (Auspicious Time) Finder — no API needed

const ACTIVITIES = {
  marriage: {
    name: 'Vivah (Marriage)',
    bestDays: ['Wednesday', 'Thursday', 'Friday'],
    avoidDays: ['Tuesday', 'Saturday'],
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April', 'May'],
    avoidMonths: ['July', 'August'],
    bestTime: '7:00 AM – 12:00 PM',
    tips: 'Avoid Amavasya (no moon), Shraadh paksha. Consult a pandit for Lagna.',
    icon: '💒'
  },
  business: {
    name: 'Vyapaar (Business Start)',
    bestDays: ['Wednesday', 'Thursday', 'Friday', 'Monday'],
    avoidDays: ['Saturday', 'Tuesday'],
    bestMonths: ['January', 'February', 'March', 'April', 'October', 'November'],
    avoidMonths: ['July', 'August'],
    bestTime: '6:00 AM – 10:00 AM (Brahma Muhurta & morning)',
    tips: 'Best to start on Shukla Paksha (waxing moon). Ganesh puja before starting.',
    icon: '💼'
  },
  griha_pravesh: {
    name: 'Griha Pravesh (Housewarming)',
    bestDays: ['Wednesday', 'Thursday', 'Monday'],
    avoidDays: ['Tuesday', 'Saturday', 'Sunday'],
    bestMonths: ['January', 'February', 'March', 'April', 'May', 'November', 'December'],
    avoidMonths: ['July', 'August', 'September'],
    bestTime: '6:00 AM – 12:00 PM',
    tips: 'Enter with right foot first. Bring Ganga Jal, cow, and fire into house first.',
    icon: '🏠'
  },
  travel: {
    name: 'Yatra (Travel)',
    bestDays: ['Wednesday', 'Thursday', 'Friday', 'Monday'],
    avoidDays: ['Tuesday', 'Saturday'],
    bestMonths: ['All months except Shraadh'],
    avoidMonths: ['During Shraadh (Sept/Oct)'],
    bestTime: '6:00 AM – 9:00 AM',
    tips: 'Face North or East while starting journey. Avoid starting at noon or dusk.',
    icon: '✈️'
  },
  interview_job: {
    name: 'Naukri/Interview',
    bestDays: ['Wednesday', 'Thursday', 'Friday'],
    avoidDays: ['Saturday', 'Tuesday'],
    bestMonths: ['January', 'February', 'March', 'October', 'November'],
    avoidMonths: [],
    bestTime: '9:00 AM – 12:00 PM',
    tips: 'Chant Gayatri Mantra 21 times before leaving. Wear yellow or white.',
    icon: '💼'
  },
  exam: {
    name: 'Pariksha (Exam)',
    bestDays: ['Wednesday', 'Thursday', 'Friday', 'Monday'],
    avoidDays: ['Saturday'],
    bestMonths: ['All months'],
    avoidMonths: [],
    bestTime: '4:00 AM – 6:00 AM (Brahma Muhurta for study)',
    tips: 'Study during Brahma Muhurta (4-6 AM). Pray to Saraswati before exam.',
    icon: '📚'
  },
  vehicle: {
    name: 'Vahan Puja (Vehicle Purchase)',
    bestDays: ['Wednesday', 'Friday', 'Monday', 'Thursday'],
    avoidDays: ['Saturday', 'Tuesday'],
    bestMonths: ['All auspicious months'],
    avoidMonths: ['During eclipses'],
    bestTime: '8:00 AM – 12:00 PM',
    tips: 'Do Ganesh puja before first drive. Put a lemon and chili for protection.',
    icon: '🚗'
  },
  investment: {
    name: 'Nivesh (Investment)',
    bestDays: ['Wednesday', 'Thursday', 'Friday'],
    avoidDays: ['Saturday', 'Tuesday'],
    bestMonths: ['January', 'February', 'October', 'November', 'March'],
    avoidMonths: ['July', 'August'],
    bestTime: '9:00 AM – 11:00 AM',
    tips: 'Start investment on Shukla Paksha Panchami, Dashami, or Poornima.',
    icon: '📈'
  },
};

const DAILY_RAHUKAAL = {
  // Rahu Kaal is inauspicious — avoid starting anything important
  Monday:    '7:30 AM – 9:00 AM',
  Tuesday:   '3:00 PM – 4:30 PM',
  Wednesday: '12:00 PM – 1:30 PM',
  Thursday:  '1:30 PM – 3:00 PM',
  Friday:    '10:30 AM – 12:00 PM',
  Saturday:  '9:00 AM – 10:30 AM',
  Sunday:    '4:30 PM – 6:00 PM',
};

const DAILY_ABHIJIT = {
  // Most auspicious time each day
  Monday:    '11:48 AM – 12:36 PM',
  Tuesday:   '11:48 AM – 12:36 PM',
  Wednesday: '11:48 AM – 12:36 PM',
  Thursday:  '11:48 AM – 12:36 PM',
  Friday:    '11:48 AM – 12:36 PM',
  Saturday:  '11:48 AM – 12:36 PM',
  Sunday:    '11:48 AM – 12:36 PM',
};

function getMuhurat(activity, date) {
  const d = date ? new Date(date) : new Date();
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });

  const actData = ACTIVITIES[activity] || ACTIVITIES['business'];
  const isGoodDay = actData.bestDays.includes(dayName);
  const isBadDay = actData.avoidDays.includes(dayName);
  const isGoodMonth = actData.bestMonths.some(m => monthName.includes(m) || m === 'All months');
  const rahukaal = DAILY_RAHUKAAL[dayName];
  const abhijit = DAILY_ABHIJIT[dayName];

  let verdict, verdictColor;
  if (isGoodDay && isGoodMonth) { verdict = 'Highly Auspicious ✨'; verdictColor = 'green'; }
  else if (isBadDay) { verdict = 'Avoid This Day ⚠️'; verdictColor = 'red'; }
  else { verdict = 'Moderately Auspicious 🌙'; verdictColor = 'yellow'; }

  return {
    activity: actData.name,
    icon: actData.icon,
    date: d.toDateString(),
    day: dayName,
    month: monthName,
    verdict,
    verdictColor,
    bestTime: actData.bestTime,
    rahukaal,
    abhijit,
    tips: actData.tips,
    isGoodDay,
    isBadDay,
  };
}

module.exports = { getMuhurat, ACTIVITIES };
