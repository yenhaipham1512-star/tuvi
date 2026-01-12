
import React from 'react';
import { HoroscopeResult, UserInfo } from '../types';
import PalaceBox from './PalaceBox';

interface HoroscopeChartProps {
  result: HoroscopeResult;
  user: UserInfo;
}

const HoroscopeChart: React.FC<HoroscopeChartProps> = ({ result, user }) => {
  const getPalaceAtLocation = (loc: string) => {
    return result.palaces.find(p => p.location.includes(loc)) || result.palaces[0];
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-16 animate-fade-in px-2">
      <div className="grid grid-cols-4 gap-1 md:gap-2 p-1 md:p-3 bg-slate-900/40 rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-yellow-600/10">
        
        {/* Row 1 */}
        <PalaceBox palace={getPalaceAtLocation("Tỵ")} />
        <PalaceBox palace={getPalaceAtLocation("Ngọ")} />
        <PalaceBox palace={getPalaceAtLocation("Mùi")} />
        <PalaceBox palace={getPalaceAtLocation("Thân")} />

        {/* Row 2 */}
        <PalaceBox palace={getPalaceAtLocation("Thìn")} />
        
        {/* THIÊN BÀN - CENTER */}
        <div className="col-span-2 row-span-2 flex flex-col items-center justify-center p-6 bg-black/40 text-center border border-yellow-600/10 rounded-2xl relative overflow-hidden">
          {/* Subtle circular background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
             <div className="w-48 h-48 border-4 border-yellow-500 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-yellow-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10">
            <h2 className="gold-text font-serif text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg">{user.fullName}</h2>
            <div className="text-[10px] text-yellow-500/50 mb-4 uppercase tracking-[4px] font-bold">Thiên Bàn</div>
            
            <div className="space-y-3">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] text-slate-500 uppercase font-medium">Bản Mệnh</span>
                 <span className="text-sm text-slate-300 font-serif">{result.canChi}</span>
               </div>
               
               <div className="flex flex-col items-center">
                 <span className="text-[10px] text-slate-500 uppercase font-medium">Âm Lịch</span>
                 <span className="text-sm text-slate-300 font-serif">{result.lunarDate}</span>
               </div>

               <div className="pt-2">
                  <div className="inline-block px-3 py-1 rounded-full border border-yellow-600/20 bg-yellow-600/5 text-yellow-500 text-[9px] uppercase tracking-widest font-bold">
                    Tuệ Nhiên Chiêm Tinh
                  </div>
               </div>
            </div>
          </div>
        </div>

        <PalaceBox palace={getPalaceAtLocation("Dậu")} />

        {/* Row 3 */}
        <PalaceBox palace={getPalaceAtLocation("Mão")} />
        <PalaceBox palace={getPalaceAtLocation("Tuất")} />

        {/* Row 4 */}
        <PalaceBox palace={getPalaceAtLocation("Dần")} />
        <PalaceBox palace={getPalaceAtLocation("Sửu")} />
        <PalaceBox palace={getPalaceAtLocation("Tý")} />
        <PalaceBox palace={getPalaceAtLocation("Hợi")} />
      </div>
    </div>
  );
};

export default HoroscopeChart;
