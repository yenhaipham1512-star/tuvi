
import React, { useMemo, useEffect, useState, useRef } from 'react';

interface PaymentModalProps {
  fullName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Cấu hình SePay - Token này nên được bảo mật ở Backend trong thực tế
const SEPAY_API_TOKEN = "PJHQJ4QNWWINEHFDUDAX1STZAYYX6XR1GAKUZQ3JBIM0N80CJOFPLKN2K5YUEVRZ";
const ACCOUNT_NUMBER = "0690132886888";
const BANK_NAME = "MB Bank";
const BANK_ID = "MB";
const ACCOUNT_NAME = "LA NGOC PHUONG TRINH";
const AMOUNT = 2000;

/**
 * Danh sách các Proxy CORS công cộng đa dạng hơn.
 * Một số proxy có thể trả về 403 nếu bị quá tải hoặc bị chặn.
 */
const PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`
];

const PaymentModal: React.FC<PaymentModalProps> = ({ fullName, onClose, onSuccess }) => {
  const [status, setStatus] = useState("Đang kết nối ngân hàng...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<{ message: string; detail: string } | null>(null);
  const pollingRef = useRef<number | null>(null);
  const [proxyIndex, setProxyIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const transactionCode = useMemo(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TVTN ${result}`;
  }, []);

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-compact2.png?amount=${AMOUNT}&addInfo=${encodeURIComponent(transactionCode)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const checkPayment = async () => {
    if (isSuccess) return;

    try {
      const baseApiUrl = `https://my.sepay.vn/api/transactions/list`;
      const queryParams = `account_number=${ACCOUNT_NUMBER}&limit=10&api_key=${SEPAY_API_TOKEN}&_=${Date.now()}`;
      const fullTargetUrl = `${baseApiUrl}?${queryParams}`;
      
      const proxyUrl = PROXIES[proxyIndex](fullTargetUrl);

      const response = await fetch(proxyUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      // Nếu gặp 403 hoặc lỗi khác, chuyển ngay sang proxy tiếp theo
      if (response.status === 403 || !response.ok) {
        throw new Error(`Cổng ${proxyIndex + 1} bị chặn (Lỗi ${response.status}).`);
      }

      const text = await response.text();
      
      // Nếu text trả về là HTML (do proxy hoặc server đích chặn)
      if (text.trim().startsWith('<')) {
        throw new Error("Dữ liệu không hợp lệ (HTML). Đang đổi cổng...");
      }

      let data: any;
      try {
        const json = JSON.parse(text);
        // Xử lý logic riêng của AllOrigins (proxyIndex 0)
        if (proxyIndex === 0 && json.contents) {
          if (json.contents.trim().startsWith('<')) {
             throw new Error("Nội dung bọc là HTML.");
          }
          data = JSON.parse(json.contents);
        } else {
          data = json;
        }
      } catch (e) {
        throw new Error("Lỗi phân tích dữ liệu. Đang thử cổng khác...");
      }

      if (data && (data.status === 200 || Array.isArray(data.transactions))) {
        setError(null);
        const transactions = data.transactions || [];
        
        const match = transactions.find((t: any) => {
          const content = (t.transaction_content || "").toUpperCase();
          const cleanCode = transactionCode.replace(/\s/g, "").toUpperCase();
          const amountIn = parseFloat(t.amount_in || "0");
          return content.includes(cleanCode) && amountIn >= AMOUNT;
        });

        if (match) {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          setIsSuccess(true);
          setStatus("Thanh toán thành công!");
          setTimeout(onSuccess, 1500);
        } else {
          setStatus("Đang chờ tín hiệu ngân hàng...");
        }
      } else {
        throw new Error(data?.error || data?.message || "Hệ thống đang bận.");
      }
    } catch (err: any) {
      console.warn(`[Proxy ${proxyIndex}] Failed:`, err.message);
      
      // Luân chuyển proxy
      const nextIndex = (proxyIndex + 1) % PROXIES.length;
      setProxyIndex(nextIndex);
      setRetryCount(prev => prev + 1);

      let msg = "Đang đổi cổng kết nối...";
      let detail = err.message;
      
      if (err.message === "Failed to fetch") {
        msg = "Kết nối bị chặn (403/CORS)";
        detail = "Trình duyệt hoặc mạng đang chặn yêu cầu. Vui lòng tắt Adblock hoặc VPN.";
      }

      setError({ message: msg, detail: detail });
      setStatus(`Đang thử cổng ${nextIndex + 1}/${PROXIES.length}...`);
    }
  };

  useEffect(() => {
    checkPayment();
    // Tăng thời gian polling lên một chút để tránh bị proxy rate limit (6 giây)
    pollingRef.current = window.setInterval(checkPayment, 6000);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
  }, [transactionCode, proxyIndex]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-yellow-600/30">
        
        {!isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-20 text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="p-8">
          {isSuccess ? (
            <div className="py-10 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold gold-text mb-2">Thanh Toán Xong!</h2>
              <p className="text-slate-400">Master Tuệ Nhiên đang khai mở lá số cho bạn...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Khai Mở Mệnh Số</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                   <div className="h-[1px] w-8 bg-yellow-600/50"></div>
                   <p className="text-[10px] text-yellow-600 font-bold tracking-[2px] uppercase">Kết nối bảo mật</p>
                   <div className="h-[1px] w-8 bg-yellow-600/50"></div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl mb-6 shadow-xl mx-auto w-fit border-2 border-slate-800">
                <img src={qrUrl} alt="QR Thanh Toán" className="w-[180px] h-[180px]" />
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] text-red-400 font-bold uppercase">{error.message}</span>
                  </div>
                  <p className="text-[8px] text-slate-500 leading-tight font-mono break-all">{error.detail}</p>
                </div>
              )}

              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Số tiền</span>
                  <span className="text-lg text-yellow-500 font-bold">2.000 VNĐ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nội dung</span>
                  <span className="text-sm text-yellow-400 font-mono font-bold tracking-widest bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">{transactionCode}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Người nhận: <span className="text-slate-300">{ACCOUNT_NAME}</span></p>
                  <p className="text-[9px] text-slate-400">{BANK_NAME} • {ACCOUNT_NUMBER}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 border border-white/10 shadow-inner">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(202,138,4,0.8)]"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[2px]">
                    {status}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setProxyIndex(prev => (prev + 1) % PROXIES.length);
                    checkPayment();
                  }}
                  className="text-[9px] text-slate-500 hover:text-yellow-600 transition-colors uppercase font-bold tracking-[1px] border-b border-slate-800"
                >
                  Đổi cổng kết nối thủ công
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
