import React from 'react';
import { Calendar, Compass, Home } from 'lucide-react';
import { TravelMode } from '../types/travel';

interface TravelModeSwitcherProps {
  currentMode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
}

export const TravelModeSwitcher: React.FC<TravelModeSwitcherProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'before' as TravelMode,
      label: 'Trước chuyến đi',
      icon: Calendar,
      description: 'Lập kế hoạch & chuẩn bị',
    },
    {
      id: 'during' as TravelMode,
      label: 'Đang vi vu',
      icon: Compass,
      description: 'Đồng hành theo lịch trình',
    },
    {
      id: 'return' as TravelMode,
      label: 'Trở về nhà',
      icon: Home,
      description: 'Tổng kết & nhật ký',
    },
  ];

  return (
    <div className="bg-[#FFF7ED] border border-[#EADCCB]/80 rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1 shadow-sm">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = currentMode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex-1 flex items-center justify-center sm:justify-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-xs font-semibold ${
              isActive
                ? 'bg-white text-[#343C58] shadow-sm ring-1 ring-[#EADCCB]'
                : 'text-[#343C58]/70 hover:text-[#343C58] hover:bg-white/50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive ? 'bg-[#F5CAD7] text-[#343C58]' : 'bg-[#EADCCB]/50 text-[#343C58]/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold truncate">{m.label}</span>
              <span className="text-[10px] text-[#343C58]/60 font-normal hidden sm:block truncate">
                {m.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
