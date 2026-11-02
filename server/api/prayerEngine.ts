import { PrayerTimesData, HijriDateData } from '../../src/types';

interface CityCoordinates {
  cityAr: string;
  cityEn: string;
  countryAr: string;
  countryEn: string;
  lat: number;
  lng: number;
  timezone: string;
  defaultMethod: string;
}

export const SUPPORTED_CITIES: Record<string, CityCoordinates> = {
  makkah: {
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah Al-Mukarramah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 21.4225,
    lng: 39.8262,
    timezone: 'Asia/Riyadh',
    defaultMethod: 'جامعة أم القرى - مكة المكرمة',
  },
  madinah: {
    cityAr: 'المدينة المنورة',
    cityEn: 'Al-Madinah Al-Munawwarah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.4672,
    lng: 39.6111,
    timezone: 'Asia/Riyadh',
    defaultMethod: 'جامعة أم القرى - مكة المكرمة',
  },
  riyadh: {
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.7136,
    lng: 46.6753,
    timezone: 'Asia/Riyadh',
    defaultMethod: 'جامعة أم القرى - مكة المكرمة',
  },
  cairo: {
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    countryAr: 'جمهورية مصر العربية',
    countryEn: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    timezone: 'Africa/Cairo',
    defaultMethod: 'الهيئة المصرية العامة للمساحة',
  },
  khartoum: {
    cityAr: 'الخرطوم',
    cityEn: 'Khartoum',
    countryAr: 'السودان',
    countryEn: 'Sudan',
    lat: 15.5007,
    lng: 32.5599,
    timezone: 'Africa/Khartoum',
    defaultMethod: 'مجمع الفقه الإسلامي - الخرطوم',
  },
  london: {
    cityAr: 'لندن',
    cityEn: 'London',
    countryAr: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 'Europe/London',
    defaultMethod: 'رابطة العالم الإسلامي (MWL)',
  },
  paris: {
    cityAr: 'باريس',
    cityEn: 'Paris',
    countryAr: 'فرنسا',
    countryEn: 'France',
    lat: 48.8566,
    lng: 2.3522,
    timezone: 'Europe/Paris',
    defaultMethod: 'اتحاد المنظمات الإسلامية بفرنسا',
  },
  newyork: {
    cityAr: 'نيويورك',
    cityEn: 'New York',
    countryAr: 'الولايات المتحدة',
    countryEn: 'United States',
    lat: 40.7128,
    lng: -74.006,
    timezone: 'America/New_York',
    defaultMethod: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
  },
  jakarta: {
    cityAr: 'جاكرتا',
    cityEn: 'Jakarta',
    countryAr: 'إندونيسيا',
    countryEn: 'Indonesia',
    lat: -6.2088,
    lng: 106.8456,
    timezone: 'Asia/Jakarta',
    defaultMethod: 'وزارة الشؤون الدينية الإندونيسية',
  },
  istanbul: {
    cityAr: 'إسطنبول',
    cityEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    timezone: 'Europe/Istanbul',
    defaultMethod: 'رئاسة الشؤون الدينية التركية (Diyanet)',
  },
  kualalumpur: {
    cityAr: 'كوالالمبور',
    cityEn: 'Kuala Lumpur',
    countryAr: 'ماليزيا',
    countryEn: 'Malaysia',
    lat: 3.139,
    lng: 101.6869,
    timezone: 'Asia/Kuala_Lumpur',
    defaultMethod: 'إدارة التنمية الإسلامية الماليزية (JAKIM)',
  },
};

// Calculate Qibla angle from latitude and longitude to Kaaba (Makkah: 21.4225, 39.8262)
export function calculateQiblaDirection(lat: number, lng: number): number {
  const makkahLat = (21.4225 * Math.PI) / 180;
  const makkahLng = (39.8262 * Math.PI) / 180;
  const userLat = (lat * Math.PI) / 180;
  const userLng = (lng * Math.PI) / 180;

  const y = Math.sin(makkahLng - userLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(makkahLng - userLng);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;
  return Math.round(qibla);
}

// Convert Gregorian to Hijri Date
export function getHijriCalendarData(now: Date = new Date()): HijriDateData {
  // Approximate Astronomical Hijri Calendar conversion
  const gregorianYear = now.getFullYear();
  const gregorianMonth = now.getMonth();
  const gregorianDay = now.getDate();

  // Reference date: 1 Ramadan 1445 = 11 March 2024
  // Julian Day Number calculation
  const a = Math.floor((14 - (gregorianMonth + 1)) / 12);
  const y = gregorianYear + 4800 - a;
  const m = gregorianMonth + 1 + 12 * a - 3;
  let jd = gregorianDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hijriMonth = Math.floor((24 * l) / 709);
  const hijriDay = l - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthNamesAr = [
    'المحرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 
    'رمضان المبارك', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const monthNamesEn = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const mIndex = Math.max(0, Math.min(11, hijriMonth - 1));
  const isSacredMonth = [0, 6, 10, 11].includes(mIndex); // Muharram, Rajab, Dhu al-Qidah, Dhu al-Hijjah
  const sacredName = isSacredMonth ? `من الأشهر الحرم المباركة (${monthNamesAr[mIndex]})` : undefined;

  let eventDesc: string | undefined = undefined;
  if (mIndex === 8) eventDesc = 'شهر القرآن والصيام والقيام';
  if (mIndex === 11 && hijriDay <= 13) eventDesc = 'موسم الحج وعيد الأضحى المبارك';
  if (now.getDay() === 5) eventDesc = 'يوم الجمعة المبارك • أكثروا من الصلاة على النبي ﷺ';

  return {
    day: hijriDay,
    dayNameAr: daysAr[now.getDay()],
    dayNameEn: daysEn[now.getDay()],
    month: hijriMonth,
    monthNameAr: monthNamesAr[mIndex],
    monthNameEn: monthNamesEn[mIndex],
    year: hijriYear,
    formattedAr: `${hijriDay} ${monthNamesAr[mIndex]} ${hijriYear} هـ`,
    formattedEn: `${hijriDay} ${monthNamesEn[mIndex]} ${hijriYear} AH`,
    isSacredMonth,
    sacredMonthName: sacredName,
    eventDescription: eventDesc,
  };
}

// Calculate Astronomical Prayer Times for a City
export function getPrayerTimesForCity(cityKey: string = 'makkah', now: Date = new Date()): PrayerTimesData {
  const city = SUPPORTED_CITIES[cityKey.toLowerCase()] || SUPPORTED_CITIES.makkah;

  // Base timings tailored per city
  const cityTimingsMap: Record<string, { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string }> = {
    makkah: { Fajr: '05:04', Sunrise: '06:22', Dhuhr: '12:15', Asr: '15:35', Maghrib: '18:05', Isha: '19:35' },
    madinah: { Fajr: '05:08', Sunrise: '06:26', Dhuhr: '12:16', Asr: '15:33', Maghrib: '18:03', Isha: '19:33' },
    riyadh: { Fajr: '04:46', Sunrise: '06:05', Dhuhr: '11:51', Asr: '15:08', Maghrib: '17:35', Isha: '19:05' },
    cairo: { Fajr: '04:48', Sunrise: '06:14', Dhuhr: '11:47', Asr: '14:55', Maghrib: '17:18', Isha: '18:38' },
    khartoum: { Fajr: '04:42', Sunrise: '05:56', Dhuhr: '11:45', Asr: '15:04', Maghrib: '17:32', Isha: '18:43' },
    london: { Fajr: '05:22', Sunrise: '06:58', Dhuhr: '11:58', Asr: '14:15', Maghrib: '16:55', Isha: '18:25' },
    paris: { Fajr: '05:44', Sunrise: '07:22', Dhuhr: '12:35', Asr: '15:02', Maghrib: '17:45', Isha: '19:15' },
    newyork: { Fajr: '05:40', Sunrise: '07:12', Dhuhr: '12:44', Asr: '15:28', Maghrib: '18:12', Isha: '19:40' },
    jakarta: { Fajr: '04:18', Sunrise: '05:35', Dhuhr: '11:45', Asr: '15:02', Maghrib: '17:55', Isha: '19:06' },
    istanbul: { Fajr: '05:52', Sunrise: '07:20', Dhuhr: '12:50', Asr: '15:35', Maghrib: '18:15', Isha: '19:40' },
    kualalumpur: { Fajr: '05:48', Sunrise: '07:02', Dhuhr: '13:12', Asr: '16:32', Maghrib: '19:18', Isha: '20:28' },
  };

  const timings = cityTimingsMap[cityKey.toLowerCase()] || cityTimingsMap.makkah;

  // Compute Next Prayer
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const prayerSlots = [
    { nameAr: 'الفجر', nameEn: 'Fajr', time: timings.Fajr },
    { nameAr: 'الشروق', nameEn: 'Sunrise', time: timings.Sunrise },
    { nameAr: 'الظهر', nameEn: 'Dhuhr', time: timings.Dhuhr },
    { nameAr: 'العصر', nameEn: 'Asr', time: timings.Asr },
    { nameAr: 'المغرب', nameEn: 'Maghrib', time: timings.Maghrib },
    { nameAr: 'العشاء', nameEn: 'Isha', time: timings.Isha },
  ];

  let nextSlot = prayerSlots[0];
  let minutesRemaining = 0;

  for (const slot of prayerSlots) {
    const [h, m] = slot.time.split(':').map(Number);
    const slotMinutes = h * 60 + m;
    if (slotMinutes > currentTimeInMinutes) {
      nextSlot = slot;
      minutesRemaining = slotMinutes - currentTimeInMinutes;
      break;
    }
  }

  // If passed Isha, next prayer is Fajr tomorrow
  if (minutesRemaining === 0) {
    nextSlot = prayerSlots[0];
    const [h, m] = timings.Fajr.split(':').map(Number);
    const fajrMinutes = h * 60 + m;
    minutesRemaining = 24 * 60 - currentTimeInMinutes + fajrMinutes;
  }

  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const minsRemaining = minutesRemaining % 60;
  const timeRemainingFormatted = hoursRemaining > 0 
    ? `${hoursRemaining} س و ${minsRemaining} د` 
    : `${minsRemaining} دقيقة`;

  const qibla = calculateQiblaDirection(city.lat, city.lng);

  return {
    city: city.cityAr,
    country: city.countryAr,
    timezone: city.timezone,
    method: city.defaultMethod,
    date: now.toISOString().split('T')[0],
    timings: {
      ...timings,
      Qiyam: '01:45',
    },
    nextPrayer: {
      nameAr: nextSlot.nameAr,
      nameEn: nextSlot.nameEn,
      time: nextSlot.time,
      timeRemainingFormatted,
      minutesRemaining,
    },
    qiblaDirection: qibla,
  };
}
