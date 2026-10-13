import React, { useState } from 'react';
import {
  Check,
  Copy,
  Heart,
  Lock,
  Send,
  Share2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Trip } from '../types/travel';

interface TripSharingPanelProps {
  trip: Trip | null;
}

export const TripSharingPanel: React.FC<TripSharingPanelProps> = ({ trip }) => {
  const [includeDestination, setIncludeDestination] = useState(true);
  const [includeDates, setIncludeDates] = useState(true);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [includeHotel, setIncludeHotel] = useState(true);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeContactTime, setIncludeContactTime] = useState(true);
  const [includeEmergencyContact, setIncludeEmergencyContact] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!trip) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#EADCCB] text-center text-xs text-[#343C58]/60">
        Em iu hãy tạo một chuyến đi trước để chia sẻ hành trình nhé!
      </div>
    );
  }

  // Generate formatted text summary
  const generateSummaryText = () => {
    const lines: string[] = [];
    lines.push(`🧳 BẢN TÓM TẮT HÀNH TRÌNH CỦA EM IU 🌷`);
    lines.push(`“Đi đâu cũng được, khám phá điều mới mẻ và luôn đặt sự an toàn lên hàng đầu.”`);
    lines.push(`----------------------------------------`);

    if (includeDestination) {
      lines.push(`📍 Chuyến đi: ${trip.name}`);
      lines.push(`✈️ Lộ trình: ${trip.origin} ➔ ${trip.destination}`);
    }

    if (includeDates) {
      lines.push(`📅 Thời gian: Từ ${trip.startDate} đến ${trip.endDate}`);
    }

    if (includeTransport) {
      lines.push(`🚗 Phương tiện chính: ${trip.transport}`);
    }

    if (includeHotel && trip.accommodation?.name) {
      lines.push(`🏨 Nơi lưu trú: ${trip.accommodation.name}`);
      lines.push(`📌 Địa chỉ: ${trip.accommodation.address}`);
      if (trip.accommodation.phone) {
        lines.push(`📞 SĐT khách sạn: ${trip.accommodation.phone}`);
      }
    }

    if (includeContactTime) {
      lines.push(`⏰ Khung giờ Em iu sẽ báo tin định kỳ: 12:00 trưa & 22:00 tối`);
    }

    if (includeEmergencyContact && trip.emergencyContactPhone) {
      lines.push(`🛡️ Người liên hệ khẩn cấp: ${trip.emergencyContactName || 'Anh Thành'} (${trip.emergencyContactPhone})`);
    }

    if (includeSchedule && trip.itinerary?.length > 0) {
      lines.push(`\n🗺️ LỊCH TRÌNH DỰ KIẾN:`);
      trip.itinerary.forEach((day) => {
        lines.push(`\nNgày ${day.dayNumber}: ${day.title}`);
        day.activities.forEach((act) => {
          lines.push(`  - [${act.time}] ${act.name} (${act.transport})`);
        });
      });
    }

    lines.push(`\n----------------------------------------`);
    lines.push(`Được tạo từ Cẩm nang du lịch an toàn cùng bạn 🧳💗`);
    return lines.join('\n');
  };

  const summaryText = generateSummaryText();

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lịch trình chuyến đi của Em iu - ${trip.name}`,
          text: summaryText,
        });
      } catch (err) {
        console.warn('Share cancelled or not supported:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <span>📩 CHIA SẺ HÀNH TRÌNH VỚI NGƯỜI THÂN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Gửi lịch trình để Anh Thành & người thân yên tâm 🌷
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Chủ động chọn thông tin muốn chia sẻ, tạo bản tóm tắt sạch đẹp để gửi qua Zalo, Messenger hoặc SMS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#EADCCB] text-[#343C58] text-xs font-bold hover:bg-[#FFF7ED] transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '✓ Đã sao chép' : 'Sao chép nội dung'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#202534] transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Gửi qua Zalo / SMS</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-[#C8DDCB]/30 border border-[#C8DDCB] flex items-center gap-2.5 text-xs text-[#343C58]/90">
        <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Bảo mật tối đa:</strong> Ứng dụng không bao giờ công khai vị trí thời gian thực hay dữ liệu cá nhân của Em iu lên mạng xã hội. Chỉ gửi thông tin khi Em iu chủ động bấm gửi.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Granular Checkboxes */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#EADCCB] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
            Em iu muốn đưa thông tin nào vào bản tóm tắt?
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDestination}
                onChange={(e) => setIncludeDestination(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Điểm xuất phát & Điểm đến</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDates}
                onChange={(e) => setIncludeDates(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Ngày khởi hành & Ngày trở về</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTransport}
                onChange={(e) => setIncludeTransport(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Phương tiện di chuyển chính</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHotel}
                onChange={(e) => setIncludeHotel(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Tên khách sạn & Địa chỉ lưu trú</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSchedule}
                onChange={(e) => setIncludeSchedule(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Lịch trình chi tiết từng ngày</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContactTime}
                onChange={(e) => setIncludeContactTime(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Khung giờ liên lạc định kỳ</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmergencyContact}
                onChange={(e) => setIncludeEmergencyContact(e.target.checked)}
                className="rounded border-[#EADCCB] text-[#343C58]"
              />
              <span className="font-semibold text-[#343C58]">Thông tin liên hệ khẩn cấp</span>
            </label>
          </div>
        </div>

        {/* Right: Preview Text Block */}
        <div className="lg:col-span-7 bg-[#FFF7ED] rounded-3xl p-5 border border-[#EADCCB] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
              Bản xem trước tin nhắn gửi đi:
            </span>
            <span className="text-[11px] text-[#343C58]/60">Sẵn sàng để copy</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EADCCB] text-xs font-mono text-[#343C58] whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
            {summaryText}
          </div>
        </div>
      </div>
    </div>
  );
};
