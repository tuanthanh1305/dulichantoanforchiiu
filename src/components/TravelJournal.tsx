import React, { useState } from 'react';
import {
  Calendar,
  Coffee,
  Heart,
  MapPin,
  Plus,
  Smile,
  Sparkles,
  Trash2,
  Utensils,
  Wallet,
} from 'lucide-react';
import { JournalEntry, Trip } from '../types/travel';
import { Storage } from '../utils/storage';

interface TravelJournalProps {
  trip: Trip | null;
}

export const TravelJournal: React.FC<TravelJournalProps> = ({ trip }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(Storage.getJournalEntries());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [places, setPlaces] = useState('');
  const [food, setFood] = useState('');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [actualCost, setActualCost] = useState('350000');
  const [nextTimeWish, setNextTimeWish] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('happy');
  const [sticker, setSticker] = useState('🌷');

  const stickers = ['🌷', '☕', '🌅', '📸', '🍜', '🌲', '🏖️', '🎒', '✨'];

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      tripId: trip?.id,
      title: title.trim(),
      date,
      places: places.trim(),
      food: food.trim(),
      favoriteMoment: favoriteMoment.trim(),
      actualCost: Number(actualCost) || 0,
      nextTimeWish: nextTimeWish.trim(),
      mood,
      sticker,
    };

    const nextEntries = [newEntry, ...entries];
    setEntries(nextEntries);
    Storage.saveJournalEntries(nextEntries);
    setShowAddModal(false);

    // Reset form
    setTitle('');
    setPlaces('');
    setFood('');
    setFavoriteMoment('');
    setNextTimeWish('');
  };

  const handleDeleteEntry = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    Storage.saveJournalEntries(next);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <span>📔 NHẬT KÝ HÀNH TRÌNH CỦA EM IU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Lưu giữ từng kỷ niệm & Khoảnh khắc đáng yêu 🌷
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Ghi lại những món ăn ngon, những góc quán đẹp và những nụ cười rạng rỡ của Em iu.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#222736] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Viết trang nhật ký mới</span>
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EADCCB] text-[#343C58]/60 text-xs">
            Em iu chưa có trang nhật ký nào. Hãy bấm "Viết trang nhật ký mới" để lưu giữ chuyến đi nha! 🌷
          </div>
        ) : (
          entries.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-[#EADCCB] hover:border-[#F5CAD7] transition-all shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] flex items-center justify-center text-2xl shadow-2xs">
                    {item.sticker || '🌷'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#343C58]/60">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                      <span>·</span>
                      <span className="text-rose-600 font-bold">Tâm trạng: {item.mood}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#343C58] mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEntry(item.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                  title="Xóa nhật ký này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {item.places && (
                  <div className="p-3 rounded-2xl bg-[#FFF7ED]/70 border border-[#EADCCB]/60 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#343C58]">Địa điểm đã ghé:</strong>
                      <span className="text-[#343C58]/80">{item.places}</span>
                    </div>
                  </div>
                )}

                {item.food && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-900">Món ngon đã thử:</strong>
                      <span className="text-amber-800">{item.food}</span>
                    </div>
                  </div>
                )}
              </div>

              {item.favoriteMoment && (
                <div className="p-3.5 rounded-2xl bg-[#F5CAD7]/20 border border-[#F5CAD7] text-xs text-[#343C58] leading-relaxed">
                  <strong className="block font-bold text-rose-800 mb-0.5">
                    💗 Khoảnh khắc yêu thích nhất:
                  </strong>
                  <span>{item.favoriteMoment}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EADCCB]/40 text-xs text-[#343C58]/70">
                {item.nextTimeWish && (
                  <span className="italic">
                    🌟 Lần sau sẽ: <strong>{item.nextTimeWish}</strong>
                  </span>
                )}
                {item.actualCost > 0 && (
                  <span className="font-bold text-[#343C58]">
                    Chi phí ngày này: {formatVND(item.actualCost)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#EADCCB] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#343C58] mb-1">
              Ghi lại khoảnh khắc đáng nhớ hôm nay 📔
            </h3>
            <p className="text-xs text-[#343C58]/60 mb-4">
              Lưu giữ niềm vui của Em iu trong chuyến đi nhé
            </p>

            <form onSubmit={handleSaveEntry} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Tiêu đề ngày hôm nay *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng hôn tím trên đồi thông mộng mơ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Ngày ghi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Sticker tâm trạng</label>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {stickers.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSticker(s)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                          sticker === s ? 'bg-[#F5CAD7] scale-110 shadow-xs' : 'bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Địa điểm đã ghé</label>
                <input
                  type="text"
                  placeholder="Quán cà phê Túi Mơ To, Hồ Xuân Hương..."
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Món ăn ngon đã thử</label>
                <input
                  type="text"
                  placeholder="Lẩu gà lá é, Bánh tráng nướng, Cacao nóng..."
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Khoảnh khắc Em iu thích nhất</label>
                <textarea
                  rows={2}
                  placeholder="Cảm xúc, ánh nắng, gió se se lạnh, điều làm Em iu thấy bình yên..."
                  value={favoriteMoment}
                  onChange={(e) => setFavoriteMoment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Chi phí ngày này (VND)</label>
                  <input
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Muốn khám phá lần sau</label>
                  <input
                    type="text"
                    placeholder="Dậy sớm hái dâu, chèo SUP..."
                    value={nextTimeWish}
                    onChange={(e) => setNextTimeWish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#EADCCB]/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#202534] transition-all"
                >
                  Lưu nhật ký 🌷
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
