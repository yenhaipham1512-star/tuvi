
import React from 'react';
import { PalaceData } from '../types';

interface PalaceBoxProps {
  palace: PalaceData;
  className?: string;
}

const PalaceBox: React.FC<PalaceBoxProps> = ({ palace, className = "" }) => {
  return (
    <div className={`p-3 min-h-[140px] border border-slate-700/50 flex flex-col justify-between hover:bg-white/5 transition-colors glass-card ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase">{palace.location}</span>
        <span className="text-sm font-bold text-yellow-500 font-serif">{palace.name}</span>
      </div>
      
      <div className="flex-grow space-y-1">
        {palace.stars.mainStars.map((s, idx) => (
          <div key={idx} className="text-xs font-semibold text-red-400 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            {s}
          </div>
        ))}
        {palace.stars.subStars.map((s, idx) => (
          <div key={idx} className="text-[10px] text-blue-300">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PalaceBox;
