import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Compass,
  Heart,
  Home,
  MapPin,
  Package,
  Settings,
  Shield,
  Sparkles,
  Wallet,
  CloudSun,
  Hotel,
  Bot,
  Share2,
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { TravelModeSwitcher } from './components/TravelModeSwitcher';
import { TravelDashboard } from './components/TravelDashboard';
import { TripPlanner } from './components/TripPlanner';
import { InteractiveMap } from './components/InteractiveMap';
import { SafetyCenter } from './components/SafetyCenter';
import { EmergencyCenter } from './components/EmergencyCenter';
import { PackingChecklist } from './components/PackingChecklist';
import { WeatherRiskPanel } from './components/WeatherRiskPanel';
import { BudgetPlanner } from './components/BudgetPlanner';
import { AccommodationChecker } from './components/AccommodationChecker';
import { ScamSimulator } from './components/ScamSimulator';
import { AITravelAssistant } from './components/AITravelAssistant';
import { TravelDocumentWallet } from './components/TravelDocumentWallet';
import { TripSharingPanel } from './components/TripSharingPanel';
import { SoloTravelMode } from './components/SoloTravelMode';
import { TravelJournal } from './components/TravelJournal';
import { GroupCoordination } from './components/GroupCoordination';
import { TravelCompanionGames } from './components/TravelCompanionGames';
import { PostcardModal } from './components/PostcardModal';
import { NewTripModal } from './components/NewTripModal';
import { SettingsModal } from './components/SettingsModal';

import { BudgetItem, PackingItem, TravelMode, Trip } from './types/travel';
import { Storage } from './utils/storage';
import { PRESET_TRIPS, TRIP_BA_VI, TRIP_TAM_DAO } from './data/travelData';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [travelMode, setTravelMode] = useState<TravelMode>('before');

  // Core Persistent State
  const [trip, setTrip] = useState<Trip | null>(Storage.getActiveTrip());
  const [packingList, setPackingList] = useState<PackingItem[]>(Storage.getPackingList());
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(Storage.getBudgetItems());

  // Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state on change
  const handleUpdateTrip = (updated: Trip) => {
    setTrip(updated);
    Storage.saveTrip(updated);
  };

  const handleUpdatePacking = (updated: PackingItem[]) => {
    setPackingList(updated);
    Storage.savePackingList(updated);
  };

  const handleUpdateBudget = (updated: BudgetItem[]) => {
    setBudgetItems(updated);
    Storage.saveBudgetItems(updated);
  };

  const handleUpdateTripBudget = (val: number) => {
    if (trip) {
      const updated = { ...trip, estimatedBudget: val };
      setTrip(updated);
      Storage.saveTrip(updated);
    }
  };

  const handleDataReset = () => {
    setTrip(Storage.getActiveTrip());
    setPackingList(Storage.getPackingList());
    setBudgetItems(Storage.getBudgetItems());
  };

  // Scroll to top when changing tab
  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBaVi = trip?.destination.toLowerCase().includes('ba vì') || trip?.id.includes('bavi');
  const isTamDao = trip?.destination.toLowerCase().includes('tam đảo') || trip?.id.includes('tamdao');

  const handleSelectPresetDestination = (dest: 'bavi' | 'tamdao') => {
    const selected = dest === 'bavi' ? TRIP_BA_VI : TRIP_TAM_DAO;
    setTrip(selected);
    Storage.saveTrip(selected);
  };

  const toolsGrid = [
    { id: 'dashboard', label: 'Tổng quan', sub: 'Trang chủ', icon: '🧳' },
    { id: 'planner', label: 'Lịch trình', sub: 'Theo ngày giờ', icon: '🗺️' },
    { id: 'group', label: 'Phân công nhóm', sub: 'Việc & Chia tiền', icon: '👥', highlight: true, badge: 'Mới' },
    { id: 'games', label: 'Game cùng bạn', sub: '5 trò chơi vui', icon: '🎲', highlight: true, badge: 'Hot' },
    { id: 'safety', label: 'Cẩm nang an toàn', sub: 'Kinh nghiệm đèo', icon: '🛡️' },
    { id: 'packing', label: 'Hành lý vali', sub: 'Đồ cần mang', icon: '🎒' },
    { id: 'budget', label: 'Ngân sách', sub: 'Thu chi dự kiến', icon: '💰' },
    { id: 'map', label: 'Bản đồ điểm đến', sub: 'Chỉ đường & Lưu', icon: '📍' },
    { id: 'weather', label: 'Thời tiết & Rủi ro', sub: 'Mưa dông & Đèo', icon: '🌦️' },
    { id: 'accommodation', label: 'Kiểm tra nơi ở', sub: 'Homestay an toàn', icon: '🏨' },
    { id: 'scam', label: 'Bẫy lừa đảo', sub: '20 tình huống', icon: '🕵️' },
    { id: 'assistant', label: 'Trợ lý AI', sub: 'Hỏi đáp chu đáo', icon: '🤖' },
    { id: 'wallet', label: 'Ví thông tin', sub: 'Giấy tờ offline', icon: '📂' },
    { id: 'share', label: 'Chia sẻ hành trình', sub: 'Gửi người thân', icon: '📩' },
    { id: 'solo', label: 'Đi một mình', sub: 'An tâm khám phá', icon: '🌷' },
    { id: 'journal', label: 'Nhật ký', sub: 'Lưu kỷ niệm đẹp', icon: '📔' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#343C58] flex flex-col selection:bg-[#F5CAD7] selection:text-[#343C58]">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenPostcard={() => setIsPostcardOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Destination Switcher Banner: Ba Vì hoặc Tam Đảo */}
        <div className="bg-gradient-to-r from-[#FFF7ED] via-white to-[#F5CAD7]/35 border border-[#EADCCB] rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#EADCCB] text-[11px] font-bold text-rose-600 mb-1.5 shadow-2xs">
                <span>📍 ĐIỂM ĐẾN DÀNH RIÊNG CHO EM IU</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#343C58] tracking-tight">
                Em iu chọn vi vu <span className="text-emerald-700">Ba Vì</span> hay săn mây <span className="text-purple-700">Tam Đảo</span>? 🌲☁️
              </h2>
              <p className="text-xs text-[#343C58]/70 mt-0.5">
                Chạm để đổi ngay toàn bộ lịch trình, kinh nghiệm lái xe đèo dốc và món ngon đặc sản tương ứng!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => handleSelectPresetDestination('bavi')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-3 active:scale-95 ${
                  isBaVi
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300/80 scale-102'
                    : 'bg-white text-[#343C58] border-[#EADCCB] hover:bg-emerald-50/70'
                }`}
              >
                <span className="text-2xl">🌲</span>
                <div>
                  <div className="text-xs sm:text-sm font-black leading-tight">1. Ba Vì (Hà Nội)</div>
                  <div className={`text-[10px] mt-0.5 ${isBaVi ? 'text-emerald-100 font-medium' : 'text-[#343C58]/60'}`}>
                    Vườn Quốc Gia · Sữa tươi
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectPresetDestination('tamdao')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-3 active:scale-95 ${
                  isTamDao
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm ring-2 ring-purple-300/80 scale-102'
                    : 'bg-white text-[#343C58] border-[#EADCCB] hover:bg-purple-50/70'
                }`}
              >
                <span className="text-2xl">☁️</span>
                <div>
                  <div className="text-xs sm:text-sm font-black leading-tight">2. Tam Đảo (Vĩnh Phúc)</div>
                  <div className={`text-[10px] mt-0.5 ${isTamDao ? 'text-purple-100 font-medium' : 'text-[#343C58]/60'}`}>
                    Săn mây · Su su xào tỏi
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Travel Mode Switcher Banner (Before, During, Return) */}
        <TravelModeSwitcher
          currentMode={travelMode}
          onModeChange={(m) => setTravelMode(m)}
        />

        {/* CÁC CHỨC NĂNG DƯỚI DẠNG LƯỚI TRỰC QUAN (KHÔNG DẠNG KÉO) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EADCCB] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#EADCCB]/60">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-600">
                ⊞
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[#343C58]">
                Bảng danh mục 16 công cụ du lịch an toàn (Dạng lưới trực quan)
              </span>
            </div>
            <span className="text-[11px] text-[#343C58]/60 font-semibold">
              Chạm trực tiếp vào thẻ · Hiển thị toàn diện không cần kéo trượt
            </span>
          </div>

          {/* Grid Layout: 2 cột trên điện thoại nhỏ, 4 cột trên máy tính bảng, 8 cột trên màn hình rộng */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {toolsGrid.map((tool) => {
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleNavigateTab(tool.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-[74px] group active:scale-95 ${
                    isActive
                      ? 'bg-[#343C58] text-white border-[#343C58] shadow-sm ring-2 ring-[#343C58]/20 scale-102'
                      : tool.highlight
                      ? 'bg-rose-50/70 hover:bg-rose-100 text-[#343C58] border-rose-300 font-bold'
                      : 'bg-[#FFF9F5]/70 hover:bg-white text-[#343C58] border-[#EADCCB] hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </span>
                    {tool.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold truncate leading-tight ${
                        isActive ? 'text-white' : 'text-[#343C58]'
                      }`}
                    >
                      {tool.label}
                    </div>
                    <div
                      className={`text-[10px] truncate mt-0.5 leading-none ${
                        isActive ? 'text-white/70' : 'text-[#343C58]/60'
                      }`}
                    >
                      {tool.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <TravelDashboard
            trip={trip}
            packingList={packingList}
            budgetItems={budgetItems}
            onNavigateTab={handleNavigateTab}
            onOpenNewTripModal={() => setIsNewTripOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenPostcard={() => setIsPostcardOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlanner
            trip={trip}
            onUpdateTrip={handleUpdateTrip}
            onOpenNewTripModal={() => setIsNewTripOpen(true)}
          />
        )}

        {activeTab === 'safety' && <SafetyCenter />}

        {activeTab === 'packing' && (
          <PackingChecklist
            items={packingList}
            onUpdateItems={handleUpdatePacking}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            trip={trip}
            items={budgetItems}
            onUpdateItems={handleUpdateBudget}
            onUpdateTripBudget={handleUpdateTripBudget}
          />
        )}

        {activeTab === 'map' && <InteractiveMap trip={trip} />}

        {activeTab === 'weather' && <WeatherRiskPanel trip={trip} />}

        {activeTab === 'accommodation' && (
          <AccommodationChecker
            trip={trip}
            onUpdateAccommodation={(acc) => {
              if (trip) {
                handleUpdateTrip({ ...trip, accommodation: acc });
              }
            }}
          />
        )}

        {activeTab === 'scam' && <ScamSimulator />}

        {activeTab === 'assistant' && <AITravelAssistant trip={trip} />}

        {activeTab === 'group' && <GroupCoordination />}

        {activeTab === 'games' && <TravelCompanionGames />}

        {activeTab === 'wallet' && <TravelDocumentWallet trip={trip} />}

        {activeTab === 'share' && <TripSharingPanel trip={trip} />}

        {activeTab === 'solo' && <SoloTravelMode trip={trip} />}

        {activeTab === 'journal' && <TravelJournal trip={trip} />}
      </main>

      {/* Floating Bottom Nav for Mobile Thumb Ergonomics */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EADCCB] px-1 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNavigateTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] ${
            activeTab === 'dashboard' ? 'text-[#343C58] font-bold' : 'text-[#343C58]/60'
          }`}
        >
          <span className="text-base">🧳</span>
          <span className="text-[9px] mt-0.5 leading-none">Trang chủ</span>
        </button>

        <button
          onClick={() => handleNavigateTab('planner')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] ${
            activeTab === 'planner' ? 'text-[#343C58] font-bold' : 'text-[#343C58]/60'
          }`}
        >
          <span className="text-base">🗺️</span>
          <span className="text-[9px] mt-0.5 leading-none">Lịch trình</span>
        </button>

        <button
          onClick={() => handleNavigateTab('group')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] ${
            activeTab === 'group' ? 'text-rose-600 font-bold' : 'text-[#343C58]/60'
          }`}
        >
          <span className="text-base">👥</span>
          <span className="text-[9px] mt-0.5 leading-none">Phân công</span>
        </button>

        <button
          onClick={() => handleNavigateTab('games')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] ${
            activeTab === 'games' ? 'text-purple-600 font-bold' : 'text-[#343C58]/60'
          }`}
        >
          <span className="text-base">🎲</span>
          <span className="text-[9px] mt-0.5 leading-none">Mini Game</span>
        </button>

        <button
          onClick={() => handleNavigateTab('safety')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] ${
            activeTab === 'safety' ? 'text-[#343C58] font-bold' : 'text-[#343C58]/60'
          }`}
        >
          <span className="text-base">🛡️</span>
          <span className="text-[9px] mt-0.5 leading-none">An toàn</span>
        </button>

        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[44px] text-rose-600 font-bold"
        >
          <span className="text-base animate-pulse">🚨</span>
          <span className="text-[9px] mt-0.5 leading-none">Cứu trợ</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#EADCCB]/60 bg-[#FFF7ED]/50 py-8 px-4 text-center text-xs text-[#343C58]/70 pb-20 md:pb-8">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="font-extrabold text-[#343C58] text-sm sm:text-base">
            “Khám phá thật nhiều. Chuẩn bị thật kỹ. Trở về bình an. 🌏💗”
          </p>
          <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
            <a
              href="https://tt.edu.vn"
              target="_blank"
              rel="noreferrer"
              className="text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>TT iu Chi nhìu lắm</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            </a>
          </div>
          <p className="text-xs text-[#343C58]/80 font-medium">
            Cẩm nang du lịch an toàn cùng bạn — Made with care by Anh Thành dành tặng Em iu.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsPostcardOpen(true)}
              className="font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>💌 Đọc thư gửi Em iu</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="font-semibold text-[#343C58]/80 hover:text-[#343C58] flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cài đặt & Dữ liệu</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isEmergencyOpen && <EmergencyCenter onClose={() => setIsEmergencyOpen(false)} />}
      {isPostcardOpen && <PostcardModal onClose={() => setIsPostcardOpen(false)} />}
      {isNewTripOpen && (
        <NewTripModal
          onClose={() => setIsNewTripOpen(false)}
          onCreateTrip={handleUpdateTrip}
        />
      )}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onDataReset={handleDataReset}
        />
      )}
    </div>
  );
}

export default App;
