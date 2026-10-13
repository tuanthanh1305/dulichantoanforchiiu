import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  Heart,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Trip } from '../types/travel';

interface SoloTravelModeProps {
  trip: Trip | null;
}

export const SoloTravelMode: React.FC<SoloTravelModeProps> = ({ trip }) => {
  const [checkInterval, setCheckInterval] = useState('4');
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('Chưa bấm check-in hôm nay');

  const [soloChecklist, setSoloChecklist] = useState<Record<string, boolean>>({
    s1: false,
    s2: false,
    s3: false,
    s4: false,
    s5: false,
    s6: false,
  });

  const toggleCheck = (id: string) => {
    setSoloChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckInNow = () => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastCheckedTime(`Đã check-in lúc ${timeStr}`);
  };

  const soloGoldenRules = [
    {
      title: '1. Luôn sạc đầy pin dự phòng',
      desc: 'Điện thoại là cứu cánh quan trọng nhất của người đi solo; không để pin xuống dưới 20%.',
    },
    {
      title: '2. Nguyên tắc người liên hệ dự phòng',
      desc: 'Báo cho Anh Thành hoặc bạn thân biết Em iu chuẩn bị đi đâu và dự kiến mấy giờ về lại phòng.',
    },
    {
      title: '3. Giữ vẻ tự tin khi đi trên phố',
      desc: 'Nếu bị lạc, hãy bước vào một quán cà phê hoặc cửa hàng tiện lợi xem bản đồ, tránh đứng ngơ ngác giữa ngã ba đường.',
    },
    {
      title: '4. Câu trả lời chuẩn khi người lạ hỏi han',
      desc: 'Luôn nói "Em đi cùng bạn, bạn em đang chờ ở đằng kia" nếu có người lạ hỏi Em iu đi với ai.',
    },
    {
      title: '5. Tin tưởng tuyệt đối vào trực giác',
      desc: 'Nếu có bất kỳ điều gì khiến Em iu cảm thấy khó chịu hay bất an, hãy rời đi ngay lập tức không cần do dự!',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#DDD2F4]/40 via-white to-[#FFF7ED] rounded-3xl p-6 border border-[#DDD2F4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
            <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span>SOLO TRAVEL MODE — DÀNH RIÊNG CHO EM IU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Tự tin khám phá thế giới theo cách của riêng Em iu 🌷
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1 max-w-2xl leading-relaxed">
            “Đi một mình cũng có thể là một trải nghiệm tuyệt đẹp. Em iu hãy chuẩn bị theo điều kiện thực tế, lắng nghe cảm xúc của mình và thoải mái thay đổi kế hoạch khi cần nhé.”
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white border border-[#DDD2F4] text-xs font-bold text-purple-900 shadow-xs shrink-0">
          ✨ Tự do & An tâm
        </div>
      </div>

      {/* Check-in Interval Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DDD2F4]/50 flex items-center justify-center text-xl shrink-0">
            ⏰
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#343C58]">
              Nhắc nhở báo tin định kỳ cho Anh Thành / Người thân
            </h3>
            <p className="text-xs text-[#343C58]/60 mt-0.5">
              Trạng thái: <strong>{lastCheckedTime}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={checkInterval}
            onChange={(e) => setCheckInterval(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FFF7ED] border border-[#EADCCB] text-xs font-bold text-[#343C58]"
          >
            <option value="2">Mỗi 2 tiếng</option>
            <option value="4">Mỗi 4 tiếng</option>
            <option value="6">Mỗi 6 tiếng</option>
            <option value="night">Trước khi đi ngủ</option>
          </select>

          <button
            onClick={handleCheckInNow}
            className="px-4 py-2 bg-[#343C58] hover:bg-[#202534] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            Bấm "Em an toàn" ✓
          </button>
        </div>
      </div>

      {/* Golden Solo Rules Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#343C58] flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>5 Nguyên tắc vàng khi Em iu đi du lịch một mình</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {soloGoldenRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FFF7ED]/70 border border-[#EADCCB]/70 space-y-1 text-xs"
            >
              <h4 className="font-bold text-[#343C58] text-xs">{rule.title}</h4>
              <p className="text-[#343C58]/70 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Solo Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#343C58] uppercase tracking-wider">
          Checklist chuẩn bị trước khi ra khỏi phòng một mình:
        </h3>

        <div className="space-y-2 text-xs">
          {[
            { id: 's1', label: 'Điện thoại trên 80% pin + mang theo pin sạc dự phòng' },
            { id: 's2', label: 'Có sẵn 200k-500k tiền mặt trong túi riêng' },
            { id: 's3', label: 'Lưu địa chỉ khách sạn trong phần ghi chú / ảnh chụp' },
            { id: 's4', label: 'Cài sẵn ứng dụng đặt xe có định vị (Grab/Be)' },
            { id: 's5', label: 'Đã báo lịch trình buổi hôm nay cho người thân' },
            { id: 's6', label: 'Mang bình nước nhỏ và áo khoác gió' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                soloChecklist[item.id]
                  ? 'bg-purple-50/40 border-purple-200 text-purple-900'
                  : 'bg-white border-[#EADCCB] text-[#343C58]'
              }`}
            >
              <button type="button" className="shrink-0 focus:outline-none">
                {soloChecklist[item.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </button>
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
