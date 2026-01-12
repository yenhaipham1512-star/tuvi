import { GoogleGenAI, Type } from "@google/genai";
import { UserInfo, HoroscopeResult } from "../types";

export const getHoroscopeAnalysis = async (user: UserInfo): Promise<HoroscopeResult> => {
  // Sử dụng process.env.API_KEY theo yêu cầu để đảm bảo tính bảo mật và tự động injection
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Không tìm thấy API Key. Vui lòng kiểm tra lại cấu hình Environment Variables.");
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

  try {
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

    const text = response.text;
    if (!text) throw new Error("Mô hình không trả về dữ liệu.");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};