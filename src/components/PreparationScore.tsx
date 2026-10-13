import React from 'react';
import { CheckCircle2, CircleDashed, Info } from 'lucide-react';

interface PreparationScoreProps {
  packingPercentage: number;
  hasItinerary: boolean;
  hasAccommodation: boolean;
  hasWeatherChecked: boolean;
  hasEmergencyContact: boolean;
  hasReserveFund: boolean;
  onNavigateTab: (tab: string) => void;
}

export const PreparationScore: React.FC<PreparationScoreProps> = ({
  packingPercentage,
  hasItinerary,
  hasAccommodation,
  hasWeatherChecked,
  hasEmergencyContact,
  hasReserveFund,
  onNavigateTab,
}) => {
  const items = [
    {
      title: 'Checklist hành lý',
      status: packingPercentage >= 80,
      score: Math.min(25, Math.round((packingPercentage / 100) * 25)),
      weight: 25,
      tab: 'packing',
      hint: `${packingPercentage}% đã xếp vào vali`,
    },
    {
      title: 'Lịch trình chi tiết',
      status: hasItinerary,
      score: hasItinerary ? 20 : 0,
      weight: 20,
      tab: 'planner',
      hint: hasItinerary ? 'Đã có lịch trình theo ngày' : 'Chưa thêm hoạt động',
    },
    {
      title: 'Xác minh nơi lưu trú',
      status: hasAccommodation,
      score: hasAccommodation ? 15 : 0,
      weight: 15,
      tab: 'accommodation',
      hint: hasAccommodation ? 'Đã lưu địa chỉ & số khách sạn' : 'Chưa lưu thông tin phòng',
    },
    {
      title: 'Kiểm tra thời tiết & rủi ro',
      status: hasWeatherChecked,
      score: hasWeatherChecked ? 15 : 0,
      weight: 15,
      tab: 'weather',
      hint: hasWeatherChecked ? 'Đã rà soát dự báo thời tiết' : 'Chưa kiểm tra thời tiết',
    },
    {
      title: 'Danh bạ khẩn cấp (ICE)',
      status: hasEmergencyContact,
      score: hasEmergencyContact ? 15 : 0,
      weight: 15,
      tab: 'emergency',
      hint: hasEmergencyContact ? 'Đã lưu số Anh Thành/người thân' : 'Chưa điền danh bạ',
    },
    {
      title: 'Quỹ dự phòng khẩn cấp',
      status: hasReserveFund,
      score: hasReserveFund ? 10 : 0,
      weight: 10,
      tab: 'budget',
      hint: hasReserveFund ? 'Đã trích quỹ phòng ngừa' : 'Chưa có khoản dự phòng',
    },
  ];

  const totalScore = items.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EADCCB]/70 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#343C58] flex items-center gap-2">
            🧭 Mức độ chuẩn bị chuyến đi
          </h3>
          <p className="text-xs text-[#343C58]/70 mt-0.5">
            Thước đo giúp Em iu kiểm tra đã sẵn sàng lên đường chưa
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#343C58] tabular-nums">
            {totalScore}%
          </span>
          <span className="block text-[10px] text-[#343C58]/60 font-medium">hoàn tất</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EADCCB]/30 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-[#F5CAD7] via-[#C8DDCB] to-[#CBE7F5] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Item Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((it, idx) => (
          <button
            key={idx}
            onClick={() => onNavigateTab(it.tab)}
            className={`flex items-start gap-2.5 p-2.5 rounded-2xl border text-left transition-all hover:scale-[1.01] ${
              it.status
                ? 'bg-[#C8DDCB]/20 border-[#C8DDCB]/60 text-[#343C58]'
                : 'bg-[#FFF7ED]/50 border-[#EADCCB]/60 text-[#343C58]/80 hover:bg-[#FFF7ED]'
            }`}
          >
            {it.status ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <CircleDashed className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">{it.title}</div>
              <div className="text-[11px] text-[#343C58]/60 mt-0.5 leading-snug truncate">
                {it.hint}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mandatory Disclaimer from Prompt */}
      <div className="mt-4 pt-3 border-t border-[#EADCCB]/40 flex items-center gap-2 text-[11px] text-[#343C58]/60">
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>
          Lưu ý: Đây là mức độ hoàn thành công việc chuẩn bị cá nhân, không đại diện cho điểm số an toàn thực tế trên đường đi.
        </span>
      </div>
    </div>
  );
};
