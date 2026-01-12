
import React from 'react';
import { HoroscopeResult } from '../types';

interface AnalysisViewProps {
  result: HoroscopeResult;
  isUnlocked: boolean;
  onUnlockClick: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, isUnlocked, onUnlockClick }) => {
  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 pb-20 animate-fade-in relative px-4">
      {/* 2-Column Overview & Personality Section - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="glass-card p-6 md:p-8 rounded-2xl border-l-4 border-l-yellow-600 shadow-xl">
          <h3 className="text-xl font-serif font-bold mb-4 gold-text">Tổng Quan Vận Mệnh</h3>
          <p className="text-slate-300 leading-relaxed text-sm text-justify whitespace-pre-wrap">{result.overallSummary}</p>
        </section>

        <section className="glass-card p-6 md:p-8 rounded-2xl border-l-4 border-l-yellow-600 shadow-xl">
          <h3 className="text-xl font-serif font-bold mb-4 gold-text">Đặc Điểm Tính Cách</h3>
          <p className="text-slate-300 leading-relaxed text-sm text-justify whitespace-pre-wrap">{result.personalityAnalysis}</p>
        </section>
      </div>

      {/* Detailed Analysis Sections */}
      <div className={`relative ${!isUnlocked ? 'min-h-[400px]' : ''}`}>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${!isUnlocked ? 'blur-md pointer-events-none select-none grayscale' : ''}`}>
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-yellow-600/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💼</span>
              <h4 className="text-xl font-bold text-yellow-500 font-serif">Sự Nghiệp</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{result.careerAnalysis}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-red-600/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">❤️</span>
              <h4 className="text-xl font-bold text-red-400 font-serif">Tình Duyên</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{result.loveAnalysis}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-green-600/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌿</span>
              <h4 className="text-xl font-bold text-green-400 font-serif">Sức Khỏe</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{result.healthAnalysis}</p>
          </div>
        </div>

        {/* Unlock Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm rounded-3xl border border-yellow-600/20 shadow-2xl">
            <div className="mb-6 bg-yellow-600/10 p-4 rounded-full border border-yellow-600/30">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold gold-text mb-4 uppercase tracking-widest">Khai Mở Mệnh Số</h3>
            <p className="text-slate-300 max-w-md mb-8 leading-relaxed text-sm md:text-base">
              Phần luận giải chi tiết về <span className="text-yellow-500 font-bold">Sự nghiệp, Tình duyên và Sức khỏe</span> đang bị ẩn. 
              Vui lòng thanh toán để nhận đầy đủ lời khuyên từ Master Tuệ Nhiên.
            </p>
            
            <button
              onClick={onUnlockClick}
              className="px-10 py-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 hover:from-yellow-600 hover:to-yellow-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(180,140,40,0.4)] uppercase tracking-wider text-sm"
            >
              Xem Luận Giải Chi Tiết (2.000 VNĐ)
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-slate-600 text-xs italic mt-12">
        * Thông tin được Master Tuệ Nhiên chiêm bái dựa trên thuật Tử Vi Đẩu Số truyền thống.
      </div>
    </div>
  );
};

export default AnalysisView;
