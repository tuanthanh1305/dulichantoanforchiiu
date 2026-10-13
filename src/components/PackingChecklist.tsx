import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  FileText,
  Filter,
  Heart,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESET_PACKING_ITEMS } from '../data/travelData';
import { PackingItem } from '../types/travel';

interface PackingChecklistProps {
  items: PackingItem[];
  onUpdateItems: (items: PackingItem[]) => void;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  items,
  onUpdateItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('personal');
  const [newItemEssential, setNewItemEssential] = useState(false);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'documents', label: 'Giấy tờ & Tiền' },
    { id: 'gadgets', label: 'Thiết bị công nghệ' },
    { id: 'personal', label: 'Đồ dùng cá nhân' },
    { id: 'health', label: 'Y tế & Sơ cứu' },
  ];

  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;

  const handleToggle = (id: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i));
    onUpdateItems(next);

    const newlyPacked = next.filter((i) => i.packed).length;
    if (newlyPacked === total && total > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleDelete = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `pack-custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      packed: false,
      essential: newItemEssential,
    };

    onUpdateItems([newItem, ...items]);
    setNewItemName('');
    setNewItemEssential(false);
  };

  const handleApplyPreset = (presetKey: string) => {
    const presetNames = PRESET_PACKING_ITEMS[presetKey] || [];
    const newItems: PackingItem[] = [];

    presetNames.forEach((name) => {
      if (!items.some((it) => it.name.toLowerCase() === name.toLowerCase())) {
        newItems.push({
          id: `preset-${presetKey}-${Date.now()}-${Math.random()}`,
          name,
          category: 'personal',
          packed: false,
          essential: false,
        });
      }
    });

    if (newItems.length > 0) {
      onUpdateItems([...items, ...newItems]);
    }
  };

  const filteredItems = items.filter((i) => {
    if (activeCategory === 'all') return true;
    return i.category === activeCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <span>🎒 CHECKLIST HÀNH LÝ CHO EM IU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Gói gọn yêu thương & Chuẩn bị đủ đầy chiếc vali 🧳
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Không sợ quên đồ, phân loại thông minh và tích hợp sẵn bộ sơ cứu y tế thiết yếu.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-[#FFF7ED] p-3 rounded-2xl border border-[#EADCCB] shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#F5CAD7] flex items-center justify-center font-black text-sm text-[#343C58] tabular-nums shadow-xs">
            {percentage}%
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#343C58] block">Tiến độ vali</span>
            <span className="text-[#343C58]/70">
              Đã xếp {packed}/{total} món
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EADCCB]/30 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#F5CAD7] via-rose-300 to-[#C8DDCB] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Preset Quick Fill Buttons */}
      <div className="p-4 rounded-3xl bg-[#FFF7ED] border border-[#EADCCB]/70 space-y-2">
        <span className="text-xs font-bold text-[#343C58] flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Thêm nhanh gợi ý theo loại chuyến đi:</span>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleApplyPreset('beach')}
            className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#343C58] border border-[#EADCCB] hover:border-[#F5CAD7] shadow-2xs transition-all"
          >
            🏖️ Đi biển (Đồ bơi, kem chống nắng, kính râm)
          </button>
          <button
            onClick={() => handleApplyPreset('mountain')}
            className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#343C58] border border-[#EADCCB] hover:border-[#F5CAD7] shadow-2xs transition-all"
          >
            ⛰️ Đi núi / Trekking (Giày bám, gậy, tất chống vắt)
          </button>
          <button
            onClick={() => handleApplyPreset('city')}
            className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#343C58] border border-[#EADCCB] hover:border-[#F5CAD7] shadow-2xs transition-all"
          >
            🏙️ Du lịch thành phố (Túi chống rạch, bản đồ offline)
          </button>
          <button
            onClick={() => handleApplyPreset('solo')}
            className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#343C58] border border-[#EADCCB] hover:border-[#F5CAD7] shadow-2xs transition-all"
          >
            🌷 Đi một mình (Thẻ ICE, còi mini, khóa bảo vệ)
          </button>
        </div>
      </div>

      {/* Add New Custom Item Input */}
      <form onSubmit={handleAddItem} className="bg-white rounded-3xl p-4 border border-[#EADCCB] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <input
          type="text"
          placeholder="Thêm món đồ Em iu cần mang (Ví dụ: Máy sấy tóc mini, Son dưỡng...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EADCCB] text-xs text-[#343C58] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-slate-50 border border-[#EADCCB] text-xs font-semibold text-[#343C58]"
        >
          <option value="personal">Đồ cá nhân</option>
          <option value="documents">Giấy tờ & Tiền</option>
          <option value="gadgets">Thiết bị</option>
          <option value="health">Y tế & Sơ cứu</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs text-[#343C58] font-semibold px-2 cursor-pointer">
          <input
            type="checkbox"
            checked={newItemEssential}
            onChange={(e) => setNewItemEssential(e.target.checked)}
            className="rounded border-[#EADCCB] text-[#343C58]"
          />
          <span>Bắt buộc</span>
        </label>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#232839] transition-all shadow-sm shrink-0"
        >
          + Thêm đồ
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === c.id
                ? 'bg-[#343C58] text-white border-[#343C58] shadow-xs'
                : 'bg-white text-[#343C58]/70 border-[#EADCCB] hover:bg-[#FFF7ED]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Packing Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              item.packed
                ? 'bg-emerald-50/30 border-emerald-200'
                : 'bg-white border-[#EADCCB]/80 hover:border-[#F5CAD7]'
            }`}
          >
            <div
              onClick={() => handleToggle(item.id)}
              className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
            >
              <button
                type="button"
                className="shrink-0 text-[#343C58] focus:outline-none"
              >
                {item.packed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-[#343C58]/30" />
                )}
              </button>

              <div className="min-w-0">
                <span
                  className={`text-xs font-semibold block truncate ${
                    item.packed ? 'line-through text-[#343C58]/40' : 'text-[#343C58]'
                  }`}
                >
                  {item.name}
                </span>
                {item.essential && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                    ★ Bắt buộc
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 text-slate-300 hover:text-rose-500 transition-colors shrink-0"
              title="Xóa món này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Mandatory Safety Note from Section VII */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Lưu ý:</strong> Việc đạt 100% checklist là sự chuẩn bị chu đáo về hành trang vật chất, không đồng nghĩa với việc loại bỏ mọi rủi ro thực tế trên đường đi. Em iu hãy luôn quan sát xung quanh và lắng nghe trực giác nha! 🌷
        </span>
      </div>
    </div>
  );
};
