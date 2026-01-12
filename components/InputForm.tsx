
import React, { useState } from 'react';
import { UserInfo, Gender } from '../types';
import { HOUR_NAMES } from '../constants';

interface InputFormProps {
  onSubmit: (data: UserInfo) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInfo>({
    fullName: '',
    birthDate: '',
    gender: Gender.MALE,
    birthHour: '12:00',
    hourName: 'Ngọ'
  });

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hourName = e.target.value;
    const hourData = HOUR_NAMES.find(h => h.name === hourName);
    if (hourData) {
      setFormData(prev => ({ 
        ...prev, 
        hourName: hourName,
        birthHour: hourData.range.split(' - ')[0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-8 glass-card rounded-2xl shadow-2xl border-t border-white/10">
      <h2 className="text-3xl font-serif font-bold text-center mb-8 gold-text uppercase tracking-widest">Khởi Tạo Mệnh Số</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Họ và Tên</label>
        <input
          type="text"
          placeholder="Nhập họ tên của bạn..."
          className="w-full bg-black/40 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600 transition-colors"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Ngày sinh (Dương lịch)</label>
          <input
            type="date"
            className="w-full bg-black/40 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600"
            value={formData.birthDate}
            onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Giới tính</label>
          <select
            className="w-full bg-black/40 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600 appearance-none"
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
          >
            <option value={Gender.MALE}>Nam</option>
            <option value={Gender.FEMALE}>Nữ</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Giờ sinh</label>
        <select
          className="w-full bg-black/40 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600 appearance-none"
          value={formData.hourName}
          onChange={handleHourChange}
        >
          {HOUR_NAMES.map(h => (
            <option key={h.name} value={h.name}>{`Giờ ${h.name} (${h.range})`}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang Chiêm Tinh...
          </>
        ) : 'Lập Lá Số'}
      </button>
    </form>
  );
};

export default InputForm;
