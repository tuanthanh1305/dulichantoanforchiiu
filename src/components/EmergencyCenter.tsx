import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Copy,
  Edit2,
  Heart,
  MapPin,
  Phone,
  PhoneCall,
  Save,
  Shield,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { VIETNAM_EMERGENCY_HOTLINES } from '../data/travelData';
import { EmergencyProfile } from '../types/travel';
import { EmergencyAudio } from '../utils/audioAlert';
import { Storage } from '../utils/storage';

interface EmergencyCenterProps {
  onClose: () => void;
}

export const EmergencyCenter: React.FC<EmergencyCenterProps> = ({ onClose }) => {
  const [profile, setProfile] = useState<EmergencyProfile>(Storage.getEmergencyProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('threatened');
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [isFlashingSOS, setIsFlashingSOS] = useState(false);
  const [copiedSOS, setCopiedSOS] = useState(false);

  // Clean up audio when unmounting
  useEffect(() => {
    return () => {
      EmergencyAudio.stop();
    };
  }, []);

  // SOS screen flashing interval
  useEffect(() => {
    let interval: any = null;
    if (isFlashingSOS) {
      interval = setInterval(() => {
        const el = document.getElementById('sos-flash-overlay');
        if (el) {
          el.style.backgroundColor =
            el.style.backgroundColor === 'rgb(225, 29, 72)' ? '#ffffff' : 'rgb(225, 29, 72)';
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isFlashingSOS]);

  const toggleSiren = () => {
    if (isPlayingSiren) {
      EmergencyAudio.stop();
      setIsPlayingSiren(false);
    } else {
      EmergencyAudio.playSiren();
      setIsPlayingSiren(true);
    }
  };

  const toggleWhistle = () => {
    if (isPlayingSiren) {
      EmergencyAudio.stop();
      setIsPlayingSiren(false);
    } else {
      EmergencyAudio.playWhistle();
      setIsPlayingSiren(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    Storage.saveEmergencyProfile(profile);
    setIsEditingProfile(false);
  };

  const scenarios = [
    {
      id: 'threatened',
      title: 'Cảm thấy bị đe dọa hoặc bất an',
      badge: 'Khẩn cấp',
      steps: [
        'Đánh giá tình hình: Nếu đang bị bám theo hoặc cảm thấy bất an, KHÔNG đi vào ngõ tối hay vắng vẻ.',
        'Di chuyển ngay vào nơi sáng đèn, đông người (cửa hàng tiện lợi 24/7, tiệm thuốc, khách sạn lớn, cây xăng).',
        'Nói rõ với nhân viên hoặc bảo vệ: "Em đang cần hỗ trợ, có người lạ bám theo em".',
        'Gọi ngay cho Anh Thành / người thân đáng tin cậy hoặc bấm gọi 113 nếu tình hình nghiêm trọng.',
        'Em iu có quyền từ chối, yêu cầu dừng xe hoặc rời đi ngay lập tức khi linh tính mách bảo điều nguy hiểm!',
      ],
      hotline: '113',
    },
    {
      id: 'lost',
      title: 'Bị lạc đường hoặc tách đoàn',
      badge: 'Cần bình tĩnh',
      steps: [
        'Dừng lại ngay tại vị trí có đèn sáng, có mái che an toàn; không hoảng loạn đi lang thang làm lạc sâu hơn.',
        'Bật chế độ tiết kiệm pin trên điện thoại ngay lập tức.',
        'Mở Google Maps xác định vị trí hiện tại hoặc nhìn tên biển hiệu cửa hàng/số nhà lớn gần nhất.',
        'Gửi 1 tin nhắn vị trí chính xác cho nhóm hoặc Anh Thành.',
        'Nếu hết pin, bước vào cửa hàng lớn xin nhờ sạc pin hoặc nhờ gọi điện thoại cho người thân.',
      ],
      hotline: '112',
    },
    {
      id: 'lost-phone',
      title: 'Mất điện thoại hoặc giấy tờ tùy thân',
      badge: 'Bảo vệ tài sản',
      steps: [
        'Mượn điện thoại người uy tín (lễ tân khách sạn) gọi khóa thẻ ngân hàng và đổi mật khẩu tài khoản quan trọng.',
        'Đến công an phường/xã gần nhất để trình báo và xin Giấy xác nhận mất giấy tờ (dùng để đi tàu xe/máy bay về).',
        'Khách sạn: Cung cấp ảnh chụp CCCD/Hộ chiếu lưu trên Google Drive hoặc gửi người thân gửi ảnh sang.',
        'Liên hệ Anh Thành hoặc người thân hỗ trợ tiền mặt khẩn cấp qua lễ tân khách sạn.',
      ],
      hotline: '113',
    },
    {
      id: 'traffic-accident',
      title: 'Gặp tai nạn giao thông',
      badge: 'Y tế & An ninh',
      steps: [
        'Kiểm tra cơ thể: Nếu cảm thấy đau vùng cổ, lưng hoặc chảy máu nhiều, hạn chế cử động đột ngột.',
        'Nếu còn tỉnh táo, di chuyển vào lề đường an toàn để tránh va chạm liên hoàn.',
        'Gọi ngay 115 (Cấp cứu) nếu có người bị thương nặng, hoặc 113 (Công an) để bảo vệ hiện trường.',
        'Chụp ảnh hiện trường, biển số xe liên quan nếu điều kiện cho phép và an toàn.',
        'Báo ngay cho người liên hệ khẩn cấp trong ứng dụng.',
      ],
      hotline: '115',
    },
    {
      id: 'weather-danger',
      title: 'Nguy hiểm do thời tiết (mưa lũ, sạt lở, dông sét)',
      badge: 'Thiên tai',
      steps: [
        'Tuyệt đối không cố vượt qua ngầm tràn có nước xiết hoặc cung đèo đang có đất đá rơi.',
        'Tìm nơi trú ẩn kiên cố, tránh xa gốc cây to, cột điện và mép vực taluy dương có nguy cơ trượt đất.',
        'Nếu mắc kẹt trên đèo, gọi 112 (Cứu nạn cứu hộ quốc gia) để báo tọa độ vị trí.',
        'Báo tình hình cho người thân và giữ pin điện thoại.',
      ],
      hotline: '112',
    },
    {
      id: 'medical',
      title: 'Cần trợ giúp y tế (ngộ độc, dị ứng nặng, chấn thương)',
      badge: 'Cấp cứu',
      steps: [
        'Nếu khó thở, sưng môi mắt (dị ứng cấp tính) hoặc đau bụng dữ dội: Gọi ngay 115 hoặc nhờ lễ tân gọi taxi đưa đi cấp cứu bệnh viện đa khoa gần nhất.',
        'Uống nhiều nước ấm nếu nghi ngờ ngộ độc thực phẩm nhẹ.',
        'Mang theo thẻ BHYT / CCCD và thông báo cho bác sĩ tiền sử dị ứng thuốc (nếu có).',
        'Gọi người liên hệ khẩn cấp đến hỗ trợ.',
      ],
      hotline: '115',
    },
    {
      id: 'scammed',
      title: 'Bị lừa đảo hoặc mất cắp tài sản',
      badge: 'Pháp luật',
      steps: [
        'Khóa tài khoản ngân hàng / ví điện tử ngay lập tức nếu bị lộ thông tin hoặc mất thẻ.',
        'Chụp màn hình toàn bộ tin nhắn, số tài khoản kẻ gian, biên lai chuyển tiền làm bằng chứng.',
        'Đến cơ quan công an địa phương gần nhất trình báo sự việc.',
        'Không để bản thân quá hoảng sợ; tài sản có thể kiếm lại, an toàn và tinh thần của Em iu là quan trọng nhất.',
      ],
      hotline: '113',
    },
    {
      id: 'separated',
      title: 'Không liên lạc được người đi cùng / Mất sóng',
      badge: 'Tìm kiếm',
      steps: [
        'Quay trở lại điểm hẹn tập trung ban đầu mà cả nhóm đã thống nhất trước đó.',
        'Chờ tại quầy lễ tân khách sạn hoặc điểm bán vé chính thức của khu du lịch.',
        'Gửi tin nhắn SMS truyền thống (SMS vẫn có thể gửi được khi mạng 4G chập chờn).',
        'Nếu sau 2 tiếng không thể liên lạc tại vùng rừng núi hẻo lánh, báo ngay cho ban quản lý khu du lịch.',
      ],
      hotline: '112',
    },
  ];

  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const sosText = `[KHẨN CẤP] Em là ${profile.fullName || 'Em iu'}. Em đang cần hỗ trợ gấp!
Địa chỉ/Vị trí: ${profile.accommodationAddress || 'Chưa cập nhật'}
Số liên hệ: ${profile.trustedContactPhone || '0988776655'}
Ghi chú y tế: Nhóm máu ${profile.bloodType || 'O'}, ${profile.allergies || 'Không dị ứng'}.`;

  const copySOSToClipboard = () => {
    navigator.clipboard.writeText(sosText);
    setCopiedSOS(true);
    setTimeout(() => setCopiedSOS(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      {/* Flashing screen overlay if active */}
      {isFlashingSOS && (
        <div
          id="sos-flash-overlay"
          onClick={() => setIsFlashingSOS(false)}
          className="fixed inset-0 z-60 cursor-pointer flex items-center justify-center p-8 transition-colors duration-200"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="text-center font-black text-3xl sm:text-5xl text-black bg-white/90 p-8 rounded-3xl shadow-2xl">
            🚨 ĐANG PHÁT TÍN HIỆU CẦU CỨU SOS
            <span className="block text-base sm:text-xl font-bold mt-4 text-slate-800">
              (Chạm vào màn hình để tắt đèn chớp)
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-4xl w-full border-2 border-rose-500 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Emergency Action Header */}
        <div className="bg-rose-600 text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center text-xl font-black shrink-0 animate-pulse">
              🚨
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                TRUNG TÂM HỖ TRỢ KHẨN CẤP
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                Dành riêng cho Em iu — Bình tĩnh, Anh Thành luôn ở bên cạnh Em iu!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-rose-700/80 hover:bg-rose-800 flex items-center justify-center transition-colors text-white shrink-0"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Siren & Strobe Controls */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Phát tín hiệu báo động tại chỗ
              </span>
              <span className="text-xs text-rose-900/80">
                Tạo tiếng còi hú lớn hoặc chớp màn hình để thu hút sự chú ý khi ở nơi vắng
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSiren}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 ${
                  isPlayingSiren
                    ? 'bg-rose-700 text-white animate-pulse'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {isPlayingSiren ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingSiren ? 'Tắt còi hú' : 'Phát còi báo động 📢'}</span>
              </button>

              <button
                onClick={toggleWhistle}
                className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>Còi thổi</span>
              </button>

              <button
                onClick={() => setIsFlashingSOS(true)}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Đèn chớp SOS</span>
              </button>
            </div>
          </div>

          {/* Hotline Quick Call Grid */}
          <div>
            <h3 className="text-xs font-bold text-[#343C58] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Đường dây nóng khẩn cấp tại Việt Nam (Bấm để gọi ngay)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VIETNAM_EMERGENCY_HOTLINES.map((h) => (
                <a
                  key={h.number}
                  href={h.tel}
                  className="p-3.5 rounded-2xl bg-white border-2 border-rose-300 hover:border-rose-600 hover:shadow-md transition-all text-center group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      {h.badge}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 tabular-nums group-hover:scale-105 transition-transform">
                      {h.number}
                    </div>
                    <div className="text-xs font-bold text-[#343C58] mt-0.5 leading-snug">
                      {h.name}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-[#343C58]/60 line-clamp-2">
                    {h.description}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Step-by-Step Priority Scenarios */}
          <div className="bg-white rounded-3xl border border-[#EADCCB] p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#343C58] uppercase tracking-wider mb-3">
              Quy trình xử lý theo tình huống thực tế
            </h3>

            {/* Scenario buttons bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeScenarioId === sc.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-[#343C58]/80 border-[#EADCCB] hover:bg-rose-50'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>

            {/* Selected Scenario Action Steps */}
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  {currentScenario.title}
                </h4>
                <a
                  href={`tel:${currentScenario.hotline}`}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-rose-700"
                >
                  <Phone className="w-3 h-3" />
                  <span>Gọi {currentScenario.hotline} ngay</span>
                </a>
              </div>

              <div className="space-y-2 text-xs text-slate-800">
                {currentScenario.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contact Card (ICE) */}
          <div className="bg-[#FFF7ED] rounded-3xl p-5 border border-[#EADCCB]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                <h3 className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
                  Thẻ thông tin khẩn cấp (In Case of Emergency - ICE)
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs font-bold text-[#343C58] flex items-center gap-1 hover:text-rose-600"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Hủy sửa' : 'Chỉnh sửa'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#343C58] mb-1">Họ tên của Em iu</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADCCB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#343C58] mb-1">Nhóm máu / Dị ứng</label>
                    <input
                      type="text"
                      value={profile.allergies}
                      onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADCCB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#343C58] mb-1">Người tin cậy (Anh Thành / Bố Mẹ)</label>
                    <input
                      type="text"
                      value={profile.trustedContactName}
                      onChange={(e) =>
                        setProfile({ ...profile, trustedContactName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADCCB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#343C58] mb-1">Số điện thoại khẩn cấp *</label>
                    <input
                      type="text"
                      value={profile.trustedContactPhone}
                      onChange={(e) =>
                        setProfile({ ...profile, trustedContactPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADCCB]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#343C58] mb-1">Địa chỉ khách sạn / nơi lưu trú</label>
                    <input
                      type="text"
                      value={profile.accommodationAddress}
                      onChange={(e) =>
                        setProfile({ ...profile, accommodationAddress: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EADCCB]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#343C58] text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu thẻ ICE</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                  <span className="text-[10px] text-[#343C58]/60 font-semibold block">Họ tên & Y tế</span>
                  <div className="font-bold text-[#343C58] mt-0.5">{profile.fullName || 'Em iu'}</div>
                  <div className="text-[#343C58]/70 mt-0.5">Nhóm máu: {profile.bloodType || 'O'}</div>
                  <div className="text-rose-600 mt-0.5 truncate">{profile.allergies || 'Không dị ứng'}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                  <span className="text-[10px] text-[#343C58]/60 font-semibold block">Người liên hệ tin cậy</span>
                  <div className="font-bold text-[#343C58] mt-0.5">{profile.trustedContactName || 'Anh Thành'}</div>
                  <a
                    href={`tel:${profile.trustedContactPhone}`}
                    className="inline-flex items-center gap-1 font-bold text-rose-600 mt-1 hover:underline text-xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{profile.trustedContactPhone || '0988776655'}</span>
                  </a>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                  <span className="text-[10px] text-[#343C58]/60 font-semibold block">Địa chỉ lưu trú</span>
                  <div className="font-semibold text-[#343C58] mt-0.5 text-xs line-clamp-2">
                    {profile.accommodationAddress || 'Chưa cập nhật địa chỉ'}
                  </div>
                  {profile.hotelPhone && (
                    <div className="text-[11px] text-[#343C58]/70 mt-0.5">
                      Hotline: {profile.hotelPhone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick SMS / SOS Message Copy */}
            <div className="mt-4 pt-3 border-t border-[#EADCCB]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#343C58]/70">
                Soạn tin nhắn khẩn cấp gửi người thân kèm thông tin ICE
              </span>
              <button
                onClick={copySOSToClipboard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#EADCCB] text-[#343C58] rounded-xl font-bold hover:bg-slate-50 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5 text-rose-600" />
                <span>{copiedSOS ? '✓ Đã sao chép tin nhắn!' : 'Sao chép tin nhắn SOS'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
