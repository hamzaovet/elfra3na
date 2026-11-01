export interface ZoneItem {
  id?: string;
  code?: string;
  nameEn: string;
  nameAr: string;
  branch: string;
  fee: number;
  timeMinutes: number;
  isActive?: boolean;
}

export const ELFRA3NA_DELIVERY_ZONES: ZoneItem[] = [
  // فيصل والهرم
  { code: "FAISAL-MAIN", nameAr: "فيصل والمطبعة والعشرين وحسن محمد", nameEn: "Faisal & El-Matba'a", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 20.0, timeMinutes: 30 },
  { code: "HARAM-GIZA", nameAr: "شارع الهرم والمريوطية وميدان الجيزة", nameEn: "El-Haram & Maryouteya & Giza", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 25.0, timeMinutes: 35 },
  { code: "HADAYEK-AHRAM", nameAr: "حدائق الأهرام وهضبة الأهرام والرماية", nameEn: "Hadayek El-Ahram & Remaya", branch: "فرع فيصل الرئيسي (المطبعة)", fee: 35.0, timeMinutes: 45 },
  
  // ألف مسكن وشرق القاهرة
  { code: "ALF-MASKAN", nameAr: "ألف مسكن ونادي الشمس وجسر السويس", nameEn: "Alf Maskan & Gesr El-Suez", branch: "فرع ألف مسكن (جسر السويس)", fee: 20.0, timeMinutes: 30 },
  { code: "HELIOPOLIS-ROXY", nameAr: "مصر الجديدة والنزهة وروكسي والكوربة", nameEn: "Heliopolis & Nozha & Roxy", branch: "فرع ألف مسكن (جسر السويس)", fee: 30.0, timeMinutes: 40 },
  { code: "NASR-CITY", nameAr: "مدينة نصر (مكرم عبيد وعباس العقاد)", nameEn: "Nasr City", branch: "فرع ألف مسكن (جسر السويس)", fee: 35.0, timeMinutes: 45 },
  { code: "NEW-CAIRO", nameAr: "التجمع الخامس والقاهرة الجديدة", nameEn: "New Cairo & 5th Settlement", branch: "فرع ألف مسكن (جسر السويس)", fee: 50.0, timeMinutes: 55 },

  // 6 أكتوبر والشيخ زايد
  { code: "OCT-HOSARY", nameAr: "6 أكتوبر - ميدان الحصري والأحياء 1-12", nameEn: "6th of October Central", branch: "فرع 6 أكتوبر (الحصري)", fee: 25.0, timeMinutes: 35 },
  { code: "SHEIKH-ZAYED", nameAr: "الشيخ زايد والهايبر ووصلة دهشور", nameEn: "Sheikh Zayed & Dahshur", branch: "فرع 6 أكتوبر (الحصري)", fee: 35.0, timeMinutes: 45 },
  { code: "OCT-GARDENS", nameAr: "حدائق أكتوبر وزويل وسكن مصر", nameEn: "October Gardens", branch: "فرع 6 أكتوبر (الحصري)", fee: 35.0, timeMinutes: 45 },

  // حدائق القبة ووسط القاهرة
  { code: "HADAYEK-KOBBA", nameAr: "حدائق القبة ومصر والسودان والعباسية", nameEn: "Hadayek El-Kobba & Abbasiya", branch: "فرع حدائق القبة", fee: 25.0, timeMinutes: 35 },
  { code: "SHUBRA-DOWNTOWN", nameAr: "شبرا والساحل ووسط البلد", nameEn: "Shubra & Downtown", branch: "فرع حدائق القبة", fee: 30.0, timeMinutes: 40 },

  // زهراء المعادي وجنوب القاهرة
  { code: "MAADI-DEGLA", nameAr: "المعادي القديمة ودجلة وثكنات المعادي", nameEn: "Old Maadi & Degla", branch: "فرع زهراء المعادي", fee: 25.0, timeMinutes: 35 },
  { code: "ZAHRAA-MAADI", nameAr: "زهراء المعادي وشارع الخمسين وكارفور هب", nameEn: "Zahraa El-Maadi & Hub", branch: "فرع زهراء المعادي", fee: 20.0, timeMinutes: 30 },
  { code: "MOKATTAM", nameAr: "المقطم والهضبة الوسطى والأوتوستراد", nameEn: "Mokattam & Autostrad", branch: "فرع زهراء المعادي", fee: 35.0, timeMinutes: 45 },
];

export const ALL_DELIVERY_ZONES: ZoneItem[] = ELFRA3NA_DELIVERY_ZONES;
export const DEFAULT_ZONE: ZoneItem = ALL_DELIVERY_ZONES[0];

export function findZone(nameOrCode?: string): ZoneItem {
  if (!nameOrCode) return DEFAULT_ZONE;
  const clean = nameOrCode.trim().toLowerCase();
  const match = ALL_DELIVERY_ZONES.find(
    (z) =>
      (z.code && z.code.toLowerCase() === clean) ||
      z.nameAr.toLowerCase().includes(clean) ||
      z.nameEn.toLowerCase().includes(clean) ||
      clean.includes(z.nameAr.toLowerCase()) ||
      clean.includes(z.nameEn.toLowerCase())
  );
  return match || DEFAULT_ZONE;
}
