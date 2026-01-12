
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import HoroscopeChart from './components/HoroscopeChart';
import AnalysisView from './components/AnalysisView';
import PaymentModal from './components/PaymentModal';
import { UserInfo, HoroscopeResult } from './types';
import { getHoroscopeAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleFormSubmit = async (data: UserInfo) => {
    setLoading(true);
    setCurrentUser(data);
    setIsUnlocked(false); // Always locked for new submission
    try {
      const response = await getHoroscopeAnalysis(data);
      setResult(response);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (error) {
      console.error("Lỗi khi lập lá số:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setShowPayment(false);
    alert("Cảm ơn bạn! Luận giải chi tiết đã được khai mở.");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0c]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]"></div>
          <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-yellow-900 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-8 text-center px-4">
        <div className="inline-block p-2 mb-4 group cursor-pointer" onClick={() => {setResult(null); setIsUnlocked(false);}}>
           <svg className="w-12 h-12 mx-auto text-yellow-500 transform group-hover:rotate-180 transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20" />
              <path d="M12 12l7-7M12 12l-7 7M12 12l7 7M12 12l-7-7" />
              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
           </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold gold-text mb-2 tracking-tighter">Tử Vi Tuệ Nhiên</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light tracking-[0.2em] px-4 uppercase">
          Tinh Hoa Lý Số - Khai Thông Vận Mệnh
        </p>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-12">
        {!result || loading ? (
          <div className="pb-24">
            <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>
        ) : (
          <div className="space-y-12 pb-24">
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => { setResult(null); setCurrentUser(null); setIsUnlocked(false); }}
                className="text-slate-500 hover:text-yellow-500 flex items-center gap-2 text-xs transition-all border-b border-transparent hover:border-yellow-500 pb-1 uppercase tracking-widest"
              >
                ← Trở lại nhập thông tin
              </button>
            </div>
            
            {result && currentUser && (
              <div className="flex flex-col items-center">
                <HoroscopeChart result={result} user={currentUser} />
                <AnalysisView 
                  result={result} 
                  isUnlocked={isUnlocked} 
                  onUnlockClick={() => setShowPayment(true)} 
                />
              </div>
            )}
          </div>
        )}
      </main>

      {showPayment && currentUser && (
        <PaymentModal 
          fullName={currentUser.fullName} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      <footer className="relative z-10 py-12 border-t border-white/5 bg-black/60 text-center text-slate-500 text-[10px] uppercase tracking-[3px]">
        <p>© 2024 Tử Vi Tuệ Nhiên</p>
        <p className="mt-2 text-slate-700">Master Tuệ Nhiên • MB Bank 0690132886888</p>
      </footer>
    </div>
  );
};

export default App;
