
export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ'
}

export interface UserInfo {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  birthHour: string; // HH:mm format
  hourName: string; // e.g. "Giờ Dần"
}

export interface PalaceData {
  name: string; // Mệnh, Phụ Mẫu, Phúc Đức...
  stars: {
    mainStars: string[];
    subStars: string[];
  };
  location: string; // Tý, Sửu, Dần...
}

export interface HoroscopeResult {
  lunarDate: string;
  canChi: string;
  palaces: PalaceData[];
  overallSummary: string;
  personalityAnalysis: string;
  careerAnalysis: string;
  loveAnalysis: string;
  healthAnalysis: string;
}
