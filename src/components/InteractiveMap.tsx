import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Heart,
  MapPin,
  Navigation,
  Plus,
  Search,
  Shield,
  Star,
  Trash2,
  Info,
} from 'lucide-react';
import { VIETNAM_POPULAR_DESTINATIONS } from '../data/travelData';
import { Trip } from '../types/travel';

interface InteractiveMapProps {
  trip: Trip | null;
}

interface SavedSpot {
  id: string;
  name: string;
  category: string;
  address: string;
  notes: string;
  isBackup: boolean;
  isFavorite: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ trip }) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'Bắc' | 'Trung' | 'Nam' | 'Tây Nguyên'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpot, setActiveSpot] = useState<any>(null);

  // Custom user spots stored in component state
  const [customSpots, setCustomSpots] = useState<SavedSpot[]>([
    {
      id: 'spot-1',
      name: 'Nhà thờ đổ Ba Vì (Cốt 800)',
      category: 'Điểm check-in nổi tiếng',
      address: 'Cốt 800, Vườn Quốc Gia Ba Vì, Hà Nội',
      notes: 'Rêu phong cổ kính, ánh nắng xuyên qua tán thông cực đẹp vào buổi sáng 08:30 - 10:00.',
      isBackup: false,
      isFavorite: true,
    },
    {
      id: 'spot-2',
      name: 'Quán Gió Tam Đảo (Săn mây)',
      category: 'Cà phê view biển mây',
      address: 'Dốc đèo phía Tây, Thị trấn Tam Đảo, Vĩnh Phúc',
      notes: 'Hoàng hôn từ 16:30 - 17:30 rất lãng mạn, nhớ mang áo ấm dày vì gió đèo lạnh.',
      isBackup: false,
      isFavorite: true,
    },
    {
      id: 'spot-3',
      name: 'Nhà thờ đá cổ Tam Đảo & Quảng trường',
      category: 'Kiến trúc & Di tích',
      address: 'Trung tâm thị trấn Tam Đảo, Vĩnh Phúc',
      notes: 'Thềm đá cao nhìn xuống thung lũng sương, buổi tối có đèn lung linh.',
      isBackup: false,
      isFavorite: true,
    },
    {
      id: 'spot-4',
      name: 'Đền Thượng đỉnh Vua Ba Vì (1.296m)',
      category: 'Tâm linh & Chinh phục',
      address: 'Cốt 1100 Vườn Quốc Gia Ba Vì',
      notes: 'Phương án dã ngoại leo 500 bậc thang, không khí trong lành tuyệt đối.',
      isBackup: true,
      isFavorite: false,
    },
  ]);

  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotAddress, setNewSpotAddress] = useState('');
  const [newSpotNotes, setNewSpotNotes] = useState('');
  const [newSpotIsBackup, setNewSpotIsBackup] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredDestinations = VIETNAM_POPULAR_DESTINATIONS.filter((d) => {
    const matchesRegion =
      selectedRegion === 'all' ||
      (selectedRegion === 'Bắc' && (d.region.includes('Bắc') || d.region.includes('Hà Nội'))) ||
      (selectedRegion === 'Trung' && d.region.includes('Trung')) ||
      (selectedRegion === 'Nam' && d.region.includes('Nam')) ||
      (selectedRegion === 'Tây Nguyên' && d.region.includes('Tây Nguyên'));

    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.highlight.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesSearch;
  });

  const handleAddSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName.trim()) return;

    const newSpot: SavedSpot = {
      id: `spot-${Date.now()}`,
      name: newSpotName,
      category: newSpotIsBackup ? 'Dự phòng (Kế hoạch B)' : 'Điểm tham quan',
      address: newSpotAddress || trip?.destination || '',
      notes: newSpotNotes,
      isBackup: newSpotIsBackup,
      isFavorite: false,
    };

    setCustomSpots([...customSpots, newSpot]);
    setShowAddModal(false);
    setNewSpotName('');
    setNewSpotAddress('');
    setNewSpotNotes('');
    setNewSpotIsBackup(false);
  };

  const toggleFavorite = (id: string) => {
    setCustomSpots(
      customSpots.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const deleteSpot = (id: string) => {
    setCustomSpots(customSpots.filter((s) => s.id !== id));
  };

  const getGoogleMapsSearchUrl = (query: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <span>📍 BẢN ĐỒ HÀNH TRÌNH & ĐIỂM ĐẾN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Khám phá những miền đất xinh đẹp cùng Em iu 🗺️
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Tra cứu địa điểm, lưu danh sách dự phòng và mở chỉ đường Google Maps nhanh chóng.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#23293c] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Lưu địa điểm mới</span>
        </button>
      </div>

      {/* Privacy Notice from Prompt Section IV */}
      <div className="p-3.5 rounded-2xl bg-[#CBE7F5]/30 border border-[#CBE7F5] flex items-center gap-2.5 text-xs text-[#343C58]/80">
        <Shield className="w-4 h-4 text-sky-700 shrink-0" />
        <span>
          <strong>Cam kết quyền riêng tư:</strong> Ứng dụng không tự động theo dõi vị trí nền của Em iu. Toàn bộ vị trí đều do Em iu chủ động nhập và tra cứu qua Google Maps chính thức.
        </span>
      </div>

      {/* Interactive Map Visual Mock Canvas */}
      <div className="bg-gradient-to-br from-[#FFF7ED] via-white to-[#F5CAD7]/30 rounded-3xl p-6 border border-[#EADCCB] relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-xs font-bold text-[#343C58] flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-500" />
            <span>BẢN ĐỒ KHÁM PHÁ VIỆT NAM (BẮC - TRUNG - NAM)</span>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EADCCB] text-xs">
            {(['all', 'Bắc', 'Trung', 'Nam', 'Tây Nguyên'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedRegion === r
                    ? 'bg-[#343C58] text-white shadow-xs'
                    : 'text-[#343C58]/70 hover:text-[#343C58]'
                }`}
              >
                {r === 'all' ? 'Tất cả' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#343C58]/40" />
          <input
            type="text"
            placeholder="Tìm kiếm thành phố, đèo, biển hoặc điểm tham quan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#EADCCB] text-xs text-[#343C58] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
          />
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl p-4 border border-[#EADCCB]/70 hover:border-[#F5CAD7] transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {dest.region}
                  </span>
                  <span className="text-[10px] text-[#343C58]/60">{dest.bestMonths}</span>
                </div>

                <h3 className="text-base font-black text-[#343C58] mt-2">
                  {dest.name}
                </h3>
                <p className="text-xs text-[#343C58]/70 mt-1 line-clamp-2 leading-relaxed">
                  {dest.highlight}
                </p>

                <div className="mt-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900 leading-snug">
                  <strong>Lưu ý: </strong>
                  {dest.safetyTips}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#EADCCB]/40 flex items-center justify-between">
                <span className="text-[10px] text-[#343C58]/60 font-mono">
                  {dest.lat.toFixed(2)}°N, {dest.lng.toFixed(2)}°E
                </span>
                <a
                  href={getGoogleMapsSearchUrl(`${dest.name} Việt Nam`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Saved Spots & Backup List */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#343C58] flex items-center gap-2">
              <span>📌 Danh sách địa điểm đã lưu & Phương án dự phòng của Em iu</span>
            </h3>
            <p className="text-xs text-[#343C58]/60 mt-0.5">
              Các quán cà phê, nhà hàng và phương án B khi thời tiết thay đổi
            </p>
          </div>
          <span className="text-xs font-bold text-[#343C58] bg-[#FFF7ED] px-3 py-1 rounded-xl border border-[#EADCCB]">
            {customSpots.length} địa điểm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {customSpots.map((spot) => (
            <div
              key={spot.id}
              className={`p-4 rounded-2xl border transition-all ${
                spot.isBackup
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-[#EADCCB] hover:border-[#F5CAD7]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      spot.isBackup
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#CBE7F5]/50 text-sky-800'
                    }`}
                  >
                    {spot.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#343C58] mt-1.5">{spot.name}</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(spot.id)}
                    className="p-1 text-rose-500 hover:scale-110 transition-transform"
                    title="Yêu thích"
                  >
                    <Heart
                      className={`w-4 h-4 ${spot.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                    />
                  </button>
                  <button
                    onClick={() => deleteSpot(spot.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#343C58]/70 mt-1 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                <span>{spot.address}</span>
              </p>

              {spot.notes && (
                <p className="text-xs text-[#343C58]/80 bg-[#FFF7ED] p-2 rounded-xl mt-2 leading-relaxed">
                  {spot.notes}
                </p>
              )}

              <div className="mt-3 pt-2 border-t border-[#EADCCB]/40 flex justify-end">
                <a
                  href={getGoogleMapsSearchUrl(`${spot.name} ${spot.address}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Mở Google Maps chỉ đường</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#EADCCB]">
            <h3 className="text-base font-bold text-[#343C58] mb-1">
              Lưu địa điểm mới cho Em iu 📍
            </h3>
            <p className="text-xs text-[#343C58]/60 mb-4">
              Nhập tên quán cà phê, điểm chụp ảnh hoặc điểm dự phòng khi trời mưa
            </p>

            <form onSubmit={handleAddSpot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Tên địa điểm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cà phê Túi Mơ To"
                  value={newSpotName}
                  onChange={(e) => setNewSpotName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  placeholder="Hẻm 31 Sào Nam, Phường 11, Đà Lạt"
                  value={newSpotAddress}
                  onChange={(e) => setNewSpotAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Ghi chú hoặc lời nhắc</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Hoàng hôn 17:00 rất thơ, mang áo ấm vì đồi gió lạnh"
                  value={newSpotNotes}
                  onChange={(e) => setNewSpotNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isBackupCheck"
                  checked={newSpotIsBackup}
                  onChange={(e) => setNewSpotIsBackup(e.target.checked)}
                  className="rounded border-[#EADCCB] text-[#343C58] focus:ring-[#F5CAD7]"
                />
                <label htmlFor="isBackupCheck" className="text-xs font-semibold text-[#343C58]">
                  Đánh dấu là Điểm dự phòng (Phương án B khi mưa/mệt)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EADCCB]/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#222839] transition-all"
                >
                  Lưu địa điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
