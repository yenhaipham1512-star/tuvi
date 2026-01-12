
import { GoogleGenAI, Type } from "@google/genai";
import { UserInfo, HoroscopeResult } from "../types";

// Cách lấy API Key an toàn cho cả môi trường Vite (build) và môi trường runtime
const getApiKey = () => {
  // 1. Thử lấy từ Vite env (thường dùng cho các nền tảng như Netlify/Vercel)
  const viteKey = (import.meta as any).env?.VITE_API_KEY;
  if (viteKey) return viteKey;

  // 2. Thử lấy từ process.env (phải kiểm tra sự tồn tại của process trước để tránh crash)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Bỏ qua nếu process không tồn tại
  }

  return null;
};

export const getHoroscopeAnalysis = async (user: UserInfo): Promise<HoroscopeResult> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Không tìm thấy API Key. Vui lòng cấu hình VITE_API_KEY trong Site Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Hãy đóng vai một chuyên gia Tử Vi Đẩu Số (Master Tuệ Nhiên). 
  Hãy lập lá số Tử Vi cho người này:
  Họ tên: ${user.fullName}
  Ngày sinh dương lịch: ${user.birthDate}
  Giới tính: ${user.gender}
  Giờ sinh: ${user.birthHour} (${user.hourName})
  
  Yêu cầu:
  1. Chuyển đổi sang ngày âm lịch tương ứng.
  2. Xác định Can Chi của năm, tháng, ngày, giờ sinh.
  3. Phân bổ các chính tinh và phụ tinh vào 12 cung (Mệnh, Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Phu, Huynh).
  4. Cung cấp luận giải chi tiết bằng tiếng Việt:
     - overallSummary: Tóm tắt vận mệnh tổng quan.
     - personalityAnalysis: Phân tích tính cách, ưu nhược điểm.
     - careerAnalysis: Luận về công danh sự nghiệp.
     - loveAnalysis: Luận về tình duyên gia đạo.
     - healthAnalysis: Luận về sức khỏe và tai ách.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lunarDate: { type: Type.STRING },
          canChi: { type: Type.STRING },
          overallSummary: { type: Type.STRING },
          personalityAnalysis: { type: Type.STRING },
          careerAnalysis: { type: Type.STRING },
          loveAnalysis: { type: Type.STRING },
          healthAnalysis: { type: Type.STRING },
          palaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                stars: {
                  type: Type.OBJECT,
                  properties: {
                    mainStars: { type: Type.ARRAY, items: { type: Type.STRING } },
                    subStars: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["mainStars", "subStars"]
                }
              },
              required: ["name", "location", "stars"]
            }
          }
        },
        required: ["lunarDate", "canChi", "overallSummary", "personalityAnalysis", "careerAnalysis", "loveAnalysis", "healthAnalysis", "palaces"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return result;
};
