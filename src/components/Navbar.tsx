import React, { useState } from 'react';
import {
  AlertCircle,
  Compass,
  Heart,
  Menu,
  Shield,
  Sparkles,
  Users,
  Gamepad2,
  X,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenPostcard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenPostcard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Tổng quan' },
    { id: 'planner', label: 'Lịch trình' },
    { id: 'group', label: '👥 Phân công & Tiền nhóm', highlight: true },
    { id: 'games', label: '🎲 Game cùng bạn', highlight: true },
    { id: 'safety', label: 'An toàn' },
    { id: 'packing', label: 'Hành lý' },
    { id: 'budget', label: 'Ngân sách' },
  ];

  const allToolsList = [
    { id: 'dashboard', label: 'Trang chủ Tổng quan', icon: '🧳' },
    { id: 'planner', label: 'Lịch trình chi tiết', icon: '🗺️' },
    { id: 'group', label: 'Phân công & Đồ dùng & Chia tiền', icon: '👥' },
    { id: 'games', label: 'Trò chơi vi vu cùng bạn bè', icon: '🎲' },
    { id: 'safety', label: 'Cẩm nang an toàn & Cảnh báo', icon: '🛡️' },
    { id: 'packing', label: 'Checklist hành lý vali', icon: '🎒' },
    { id: 'budget', label: 'Quản lý ngân sách du lịch', icon: '💰' },
    { id: 'map', label: 'Bản đồ các điểm đến', icon: '📍' },
    { id: 'weather', label: 'Thời tiết & Phòng ngừa rủi ro', icon: '🌦️' },
    { id: 'accommodation', label: 'Kiểm tra phòng & Nơi ở', icon: '🏨' },
    { id: 'scam', label: 'Giả lập 20 tình huống lừa đảo', icon: '🕵️' },
    { id: 'assistant', label: 'Trợ lý AI thông minh', icon: '🤖' },
    { id: 'wallet', label: 'Ví giấy tờ offline an toàn', icon: '📂' },
    { id: 'share', label: 'Chia sẻ hành trình cho người thân', icon: '📩' },
    { id: 'solo', label: 'Chế độ an tâm khi đi một mình', icon: '🌷' },
    { id: 'journal', label: 'Nhật ký lưu giữ kỷ niệm', icon: '📔' },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F5]/95 backdrop-blur-md border-b border-[#EADCCB]/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSelectTab('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5CAD7] rounded-lg p-0.5"
          >
            <span className="w-8 h-8 rounded-full bg-[#F5CAD7] flex items-center justify-center text-base shadow-xs group-hover:scale-105 transition-transform shrink-0">
              🧳
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-[#343C58] truncate">
                Cẩm nang du lịch an toàn cùng bạn
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-rose-500 -mt-0.5 flex items-center gap-1">
                dành cho Em iu <Heart className="w-2.5 h-2.5 inline fill-current text-rose-500" />
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold text-[#343C58]/80">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`whitespace-nowrap transition-colors py-1 px-1 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5CAD7] rounded ${
                  isActive
                    ? 'text-[#343C58] font-black'
                    : item.highlight
                    ? 'text-rose-600 font-bold hover:text-rose-700'
                    : 'text-[#343C58]/70 hover:text-[#343C58]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#343C58] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenPostcard}
            title="Tấm thiệp gửi Em iu từ Anh Thành"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-[#343C58] bg-[#F5CAD7]/60 hover:bg-[#F5CAD7] rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Thư Anh Thành</span>
            <span className="md:hidden">💌</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-xl shadow-xs shadow-rose-600/20 whitespace-nowrap"
          >
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            <span className="hidden sm:inline">Cần trợ giúp 🚨</span>
            <span className="sm:hidden">Cứu trợ</span>
          </button>

          {/* Quick Menu Button for Mobile & Tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[#EADCCB] bg-white hover:bg-[#FFF7ED] text-[#343C58] transition-colors"
            title="Danh mục tất cả công cụ"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Dropdown Menu for All Tools */}
      {mobileMenuOpen && (
        <div className="border-t border-[#EADCCB] bg-white/98 backdrop-blur-lg px-4 py-4 max-h-[80vh] overflow-y-auto shadow-xl animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EADCCB]/60">
              <span className="text-xs font-bold text-[#343C58]/60 uppercase tracking-wider">
                Tất cả 16 công cụ du lịch an toàn:
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-rose-600 font-bold"
              >
                Đóng ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
              {allToolsList.map((tool) => {
                const isActive = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTab(tool.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-[#343C58] text-white font-bold shadow-xs'
                        : 'bg-[#FFF7ED]/50 hover:bg-rose-50 border border-[#EADCCB]/60 text-[#343C58]'
                    }`}
                  >
                    <span className="text-base">{tool.icon}</span>
                    <span className="font-semibold">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
