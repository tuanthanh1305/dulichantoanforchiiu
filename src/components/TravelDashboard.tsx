import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Compass,
  Heart,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Wallet,
  CloudSun,
  AlertTriangle,
  FileText,
  Share2,
  UserCheck,
  Bot,
  Search,
} from 'lucide-react';
import { ANH_THANH_TIPS } from '../data/travelData';
import { BudgetItem, PackingItem, Trip } from '../types/travel';
import { PreparationScore } from './PreparationScore';

interface TravelDashboardProps {
  trip: Trip | null;
  packingList: PackingItem[];
  budgetItems: BudgetItem[];
  onNavigateTab: (tab: string) => void;
  onOpenNewTripModal: () => void;
  onOpenEmergency: () => void;
  onOpenPostcard: () => void;
}

export const TravelDashboard: React.FC<TravelDashboardProps> = ({
  trip,
  packingList,
  budgetItems,
  onNavigateTab,
  onOpenNewTripModal,
  onOpenEmergency,
  onOpenPostcard,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % ANH_THANH_TIPS.length);
  };

  // Packing stats
  const packedCount = packingList.filter((i) => i.packed).length;
  const totalPacking = packingList.length;
  const packingPercent = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  // Budget stats
  const totalEstimatedBudget = budgetItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalActualCost = budgetItems.reduce((acc, curr) => acc + curr.actualCost, 0);
  const reserveFund = budgetItems.find((b) => b.category === 'emergency')?.estimatedCost || 0;

  // Countdown days
  let daysLeft = 0;
  if (trip?.startDate) {
    const start = new Date(trip.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5CAD7]/60 via-[#FFF7ED] to-[#CBE7F5]/50 border border-[#EADCCB]/70 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#EADCCB]/80 text-xs font-semibold text-[#343C58] mb-3 shadow-xs">
            <span className="text-rose-500">🌷</span>
            <span>Dành riêng cho Em iu của Anh Thành</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#343C58] tracking-tight leading-snug">
            Em iu ơi, chuẩn bị cho một chuyến đi thật vui nhé! 🌷
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#343C58]/80 font-medium leading-relaxed">
            “Khám phá những vùng đất mới, lưu giữ kỷ niệm đẹp và đừng quên chăm sóc bản thân trên mỗi chặng đường.”
          </p>

          <p className="mt-1 text-xs sm:text-sm text-[#343C58]/70 italic">
            “Em iu cứ tự tin khám phá thế giới theo cách của mình. Chuẩn bị kỹ một chút, hiểu rõ hành trình một chút và luôn giữ cho bản thân an toàn nhé.”
          </p>

          {/* Time & Date bar */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#343C58]/80 font-medium">
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-[#EADCCB]/60">
              <Calendar className="w-3.5 h-3.5 text-[#343C58]" />
              <span>
                {currentTime.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-[#EADCCB]/60 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-[#343C58]" />
              <span>
                {currentTime.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Stamps & Motifs */}
        <div className="absolute right-3 top-3 sm:right-6 sm:top-6 opacity-20 sm:opacity-30 pointer-events-none select-none text-8xl sm:text-9xl">
          🧳
        </div>
      </div>

      {/* Lời nhắc hôm nay từ Anh Thành */}
      <div className="rounded-3xl bg-white border border-[#F5CAD7] p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5CAD7]/60 flex items-center justify-center shrink-0 text-xl shadow-xs">
              💌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Anh Thành nhắc Em iu hôm nay
                </span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              </div>
              <p className="mt-1 text-sm font-semibold text-[#343C58] leading-relaxed">
                {ANH_THANH_TIPS[tipIndex]}
              </p>
            </div>
          </div>

          <button
            onClick={nextTip}
            title="Đổi lời nhắc khác"
            className="p-2 rounded-xl text-[#343C58]/60 hover:text-[#343C58] hover:bg-[#FFF7ED] transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upcoming Trip Card or Create Trip Banner */}
      {trip ? (
        <div className="bg-white rounded-3xl border border-[#EADCCB]/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EADCCB]/50">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#343C58]/70">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {trip.origin} ➔ <strong className="text-[#343C58]">{trip.destination}</strong>
                </span>
                <span>·</span>
                <span>{trip.transport}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1 tracking-tight">
                {trip.name}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:self-start">
              {daysLeft >= 0 ? (
                <div className="px-3.5 py-1.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] text-center">
                  <div className="text-[10px] text-[#343C58]/60 font-semibold uppercase">Còn lại</div>
                  <div className="text-lg font-black text-rose-600 tabular-nums">
                    {daysLeft === 0 ? 'Hôm nay!' : `${daysLeft} ngày`}
                  </div>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-2xl bg-slate-100 text-xs font-bold text-slate-600">
                  Đã hoàn thành
                </div>
              )}
              <button
                onClick={() => onNavigateTab('planner')}
                className="px-4 py-2.5 rounded-xl bg-[#343C58] hover:bg-[#2b324a] text-white text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Chi tiết lịch trình
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div
              onClick={() => onNavigateTab('packing')}
              className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB]/60 cursor-pointer hover:border-[#F5CAD7] transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#343C58]/70 mb-1">
                <span>Hành lý</span>
                <Package className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-xl font-black text-[#343C58] tabular-nums">
                {packingPercent}%
              </div>
              <div className="text-[10px] text-[#343C58]/60 mt-0.5 truncate">
                {packedCount}/{totalPacking} món đã xếp
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('budget')}
              className="p-3.5 rounded-2xl bg-[#CBE7F5]/25 border border-[#CBE7F5] cursor-pointer hover:border-sky-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#343C58]/70 mb-1">
                <span>Ngân sách dự kiến</span>
                <Wallet className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-lg font-black text-[#343C58] tabular-nums truncate">
                {formatVND(trip.estimatedBudget || totalEstimatedBudget)}
              </div>
              <div className="text-[10px] text-[#343C58]/60 mt-0.5 truncate">
                Dự phòng: {formatVND(reserveFund)}
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('weather')}
              className="p-3.5 rounded-2xl bg-[#C8DDCB]/25 border border-[#C8DDCB] cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#343C58]/70 mb-1">
                <span>Thời tiết {trip.destination}</span>
                <CloudSun className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-[#343C58] truncate">
                Cần xác minh
              </div>
              <div className="text-[10px] text-[#343C58]/60 mt-0.5 truncate">
                Bấm xem dự báo khí tượng
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('safety')}
              className="p-3.5 rounded-2xl bg-[#DDD2F4]/30 border border-[#DDD2F4] cursor-pointer hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#343C58]/70 mb-1">
                <span>Cẩm nang an toàn</span>
                <Shield className="w-3.5 h-3.5 text-purple-700" />
              </div>
              <div className="text-base font-bold text-[#343C58]">
                8 chuyên đề
              </div>
              <div className="text-[10px] text-[#343C58]/60 mt-0.5 truncate">
                Bao gồm xe máy, biển, rừng
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-[#EADCCB] p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FFF7ED] flex items-center justify-center mx-auto text-2xl mb-3">
            🗺️
          </div>
          <h3 className="text-lg font-bold text-[#343C58]">
            Em iu chưa có chuyến đi nào sắp tới!
          </h3>
          <p className="text-xs sm:text-sm text-[#343C58]/70 max-w-md mx-auto mt-1 mb-5">
            Hãy bắt đầu lên kế hoạch cho chuyến vi vu tiếp theo ngay nào. Tụi mình sẽ cùng Em iu chuẩn bị từ A tới Z thật an toàn và chu đáo!
          </p>
          <button
            onClick={onOpenNewTripModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold shadow-md hover:bg-[#252b3f] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo chuyến đi mới ngay</span>
          </button>
        </div>
      )}

      {/* Preparation Score Indicator */}
      <PreparationScore
        packingPercentage={packingPercent}
        hasItinerary={Boolean(trip?.itinerary && trip.itinerary.length > 0)}
        hasAccommodation={Boolean(trip?.accommodation?.name)}
        hasWeatherChecked={true}
        hasEmergencyContact={Boolean(trip?.emergencyContactPhone)}
        hasReserveFund={reserveFund > 0}
        onNavigateTab={onNavigateTab}
      />

      {/* Quick Action Grid */}
      <div>
        <h3 className="text-sm font-bold text-[#343C58] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-rose-500" />
          <span>Hành động nhanh cho Em iu</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab('planner')}
            className="p-3.5 bg-white rounded-2xl border border-[#EADCCB]/70 hover:border-[#F5CAD7] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🗺️</span>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Lập lịch trình</div>
              <div className="text-[10px] text-[#343C58]/60">Theo ngày & giờ</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('safety')}
            className="p-3.5 bg-white rounded-2xl border border-[#EADCCB]/70 hover:border-[#F5CAD7] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Kiểm tra an toàn</div>
              <div className="text-[10px] text-[#343C58]/60">Phòng ngừa rủi ro</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('packing')}
            className="p-3.5 bg-white rounded-2xl border border-[#EADCCB]/70 hover:border-[#F5CAD7] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🎒</span>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Chuẩn bị vali</div>
              <div className="text-[10px] text-[#343C58]/60">{packingPercent}% xong</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('map')}
            className="p-3.5 bg-white rounded-2xl border border-[#EADCCB]/70 hover:border-[#F5CAD7] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📍</span>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Bản đồ hành trình</div>
              <div className="text-[10px] text-[#343C58]/60">Điểm đến & chỉ đường</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('scam')}
            className="p-3.5 bg-white rounded-2xl border border-[#EADCCB]/70 hover:border-[#F5CAD7] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🕵️</span>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Nhận diện lừa đảo</div>
              <div className="text-[10px] text-[#343C58]/60">20 tình huống giả lập</div>
            </div>
          </button>

          <button
            onClick={onOpenEmergency}
            className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 hover:border-rose-400 hover:shadow-xs transition-all text-left flex flex-col justify-between h-28 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🚨</span>
            <div>
              <div className="text-xs font-bold text-rose-700">Hỗ trợ khẩn cấp</div>
              <div className="text-[10px] text-rose-600/80">112, 113, 114, 115</div>
            </div>
          </button>
        </div>
      </div>

      {/* Group & Game Companion Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phân công & Đồng hành cùng bạn */}
        <div
          onClick={() => onNavigateTab('group')}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#FFF7ED] via-white to-[#F5CAD7]/30 border border-[#EADCCB]/90 hover:border-rose-300 transition-all cursor-pointer shadow-xs flex items-center justify-between group hover:shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100/70 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shadow-2xs">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#343C58]">Phân công & Quản lý nhóm</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">Mới</span>
              </div>
              <div className="text-[11px] text-[#343C58]/70 mt-0.5">
                Chia việc rõ ràng, chia đồ dùng chung tránh trùng lặp & quyết toán tiền nợ gọn lẹ!
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
            Mở ➔
          </span>
        </div>

        {/* Trò chơi vui cùng bạn bè & Em iu */}
        <div
          onClick={() => onNavigateTab('games')}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#DDD2F4]/30 via-white to-[#CBE7F5]/30 border border-[#EADCCB]/90 hover:border-purple-300 transition-all cursor-pointer shadow-xs flex items-center justify-between group hover:shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100/70 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shadow-2xs">
              🎲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#343C58]">Trò chơi vi vu cùng bạn</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">Vui nhộn</span>
              </div>
              <div className="text-[11px] text-[#343C58]/70 mt-0.5">
                Vòng quay ăn gì, Thật hay Thách 3D, Bingo du lịch, Ai dễ làm nhất & Đố vui địa danh!
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
            Chơi ngay ➔
          </span>
        </div>
      </div>

      {/* Secondary Companion Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trợ lý AI */}
        <div
          onClick={() => onNavigateTab('assistant')}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#FFF7ED] to-white border border-[#EADCCB]/70 hover:border-[#F5CAD7] transition-all cursor-pointer shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5CAD7]/50 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Trợ lý du lịch thông minh</div>
              <div className="text-[11px] text-[#343C58]/60">Gợi ý lịch trình, đồ mang, thời tiết</div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600">Mở ➔</span>
        </div>

        {/* Ví thông tin du lịch */}
        <div
          onClick={() => onNavigateTab('wallet')}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#CBE7F5]/20 to-white border border-[#EADCCB]/70 hover:border-[#CBE7F5] transition-all cursor-pointer shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CBE7F5]/50 flex items-center justify-center text-lg">
              📂
            </div>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Ví thông tin du lịch</div>
              <div className="text-[11px] text-[#343C58]/60">Mã đặt phòng, vé máy bay offline</div>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-700">Mở ➔</span>
        </div>

        {/* Solo Travel Mode */}
        <div
          onClick={() => onNavigateTab('solo')}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#DDD2F4]/20 to-white border border-[#EADCCB]/70 hover:border-[#DDD2F4] transition-all cursor-pointer shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDD2F4]/50 flex items-center justify-center text-lg">
              🌷
            </div>
            <div>
              <div className="text-xs font-bold text-[#343C58]">Chế độ du lịch một mình</div>
              <div className="text-[11px] text-[#343C58]/60">Nhắc check-in, an tâm khám phá</div>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700">Mở ➔</span>
        </div>
      </div>
    </div>
  );
};
