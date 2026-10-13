import React, { useState } from 'react';
import {
  AlertTriangle,
  Anchor,
  Bike,
  Car,
  CheckCircle,
  Compass,
  Footprints,
  HeartHandshake,
  LifeBuoy,
  Mountain,
  Plane,
  Search,
  Shield,
  ShieldAlert,
  Train,
  Truck,
  User,
  Users,
} from 'lucide-react';
import { SAFETY_TOPICS } from '../data/travelData';
import { SafetyTopic } from '../types/travel';

export const SafetyCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopic, setActiveTopic] = useState<SafetyTopic | null>(SAFETY_TOPICS[0]);

  const categories = [
    { id: 'all', label: 'Tất cả chuyên đề', icon: Shield },
    { id: 'personal', label: 'An toàn cá nhân', icon: User },
    { id: 'solo', label: 'Đi một mình (Solo)', icon: Compass },
    { id: 'friends', label: 'Đi cùng bạn bè', icon: Users },
    { id: 'transport', label: 'Giao thông & Xe cộ', icon: Car },
    { id: 'trekking', label: 'Trekking & Rừng núi', icon: Mountain },
    { id: 'beach', label: 'Biển & Sông nước', icon: LifeBuoy },
    { id: 'scam', label: 'Phòng tránh lừa đảo', icon: ShieldAlert },
  ];

  const filteredTopics = SAFETY_TOPICS.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tips.some((tip) => tip.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>TRUNG TÂM AN TOÀN DU LỊCH CHO EM IU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Chủ động phòng ngừa rủi ro & Tự tin trên mọi nẻo đường 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1 max-w-2xl">
            “Em iu luôn có quyền từ chối, thay đổi kế hoạch và rời đi bất cứ lúc nào cảm thấy không an toàn. Trực giác và sự bình an của Em iu là ưu tiên số một!” 🌷
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shrink-0">
          ✓ Dữ liệu khuyến cáo cập nhật
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#343C58] text-white border-[#343C58] shadow-xs'
                  : 'bg-white text-[#343C58]/70 border-[#EADCCB] hover:bg-[#FFF7ED]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#343C58]/40" />
        <input
          type="text"
          placeholder="Tìm kiếm hướng dẫn: xe máy, dòng chảy xa bờ, homestay, bẫy lừa đảo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EADCCB] text-xs text-[#343C58] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTopics.map((topic) => {
            const isSelected = activeTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-4 rounded-3xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#343C58] shadow-md ring-2 ring-[#343C58]/10'
                    : 'bg-white/80 border-[#EADCCB] hover:border-[#F5CAD7] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#343C58]/60 mb-1">
                  <span>Chuyên đề</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {topic.tips.length} lưu ý vàng
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#343C58] leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#343C58]/70 mt-1 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Guide */}
        <div className="lg:col-span-7">
          {activeTopic ? (
            <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Cẩm nang chi tiết
                </span>
                <h2 className="text-xl font-black text-[#343C58] mt-1">
                  {activeTopic.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1 leading-relaxed">
                  {activeTopic.summary}
                </p>
              </div>

              {/* High Contrast Warning Box if any */}
              {activeTopic.warningNotice && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs font-medium leading-relaxed flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-900 font-bold mb-0.5 uppercase tracking-wide">
                      Cảnh báo an toàn quan trọng:
                    </strong>
                    {activeTopic.warningNotice}
                  </div>
                </div>
              )}

              {/* Tips Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
                  Những việc Em iu cần nhớ:
                </h4>
                <div className="space-y-2.5">
                  {activeTopic.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#FFF7ED]/70 border border-[#EADCCB]/60 flex items-start gap-3 text-xs text-[#343C58] leading-relaxed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gentle Encouragement Footer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F5CAD7]/30 to-[#CBE7F5]/30 border border-[#EADCCB]/60 text-xs text-[#343C58] flex items-center gap-3">
                <span className="text-2xl">🌷</span>
                <p className="italic">
                  “Cẩn thận một chút không làm mất đi niềm vui chuyến đi, mà giúp Em iu an tâm tận hưởng trọn vẹn từng khoảnh khắc xinh đẹp!”
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#EADCCB] text-center text-xs text-[#343C58]/60">
              Chọn một chuyên đề ở cột bên trái để xem hướng dẫn chi tiết nha Em iu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
