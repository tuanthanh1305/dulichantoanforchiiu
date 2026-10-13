import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Compass,
  Edit2,
  MapPin,
  Plus,
  Shield,
  Trash2,
  CheckCircle2,
  Circle,
  CloudRain,
  Coffee,
  Navigation,
  ArrowRight,
  Info,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Activity, ItineraryDay, Trip } from '../types/travel';

interface TripPlannerProps {
  trip: Trip | null;
  onUpdateTrip: (trip: Trip) => void;
  onOpenNewTripModal: () => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  trip,
  onUpdateTrip,
  onOpenNewTripModal,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isFlexibleMode, setIsFlexibleMode] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // New activity form state
  const [newActName, setNewActName] = useState('');
  const [newActTime, setNewActTime] = useState('09:00');
  const [newActDuration, setNewActDuration] = useState('2 tiếng');
  const [newActAddress, setNewActAddress] = useState('');
  const [newActTransport, setNewActTransport] = useState('Xe máy');
  const [newActCost, setNewActCost] = useState('100000');
  const [newActPreparation, setNewActPreparation] = useState('Điện thoại đầy pin, nước uống');
  const [newActSafety, setNewActSafety] = useState('Đi đúng tốc độ, quan sát biển báo');
  const [newActBackup, setNewActBackup] = useState('Nếu mưa: Ghé quán cà phê gần đó');

  if (!trip) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-[#EADCCB] shadow-sm max-w-xl mx-auto my-12">
        <div className="text-4xl mb-3">🗺️</div>
        <h2 className="text-xl font-bold text-[#343C58]">Em iu chưa có lịch trình nào!</h2>
        <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1 mb-6">
          Hãy cùng Anh Thành lên kế hoạch cho chuyến đi đầu tiên thật vui và chu đáo nhé.
        </p>
        <button
          onClick={onOpenNewTripModal}
          className="px-5 py-2.5 bg-[#343C58] text-white rounded-xl text-xs font-bold hover:bg-[#252b3f] transition-all shadow-md"
        >
          + Tạo chuyến đi mới
        </button>
      </div>
    );
  }

  const days = trip.itinerary || [];
  const currentDay = days[activeDayIndex] || days[0];

  const handleToggleActivity = (dayIndex: number, actId: string) => {
    const updatedItinerary = [...trip.itinerary];
    const targetDay = { ...updatedItinerary[dayIndex] };
    targetDay.activities = targetDay.activities.map((act) =>
      act.id === actId ? { ...act, completed: !act.completed } : act
    );
    updatedItinerary[dayIndex] = targetDay;
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleDeleteActivity = (dayIndex: number, actId: string) => {
    const updatedItinerary = [...trip.itinerary];
    const targetDay = { ...updatedItinerary[dayIndex] };
    targetDay.activities = targetDay.activities.filter((act) => act.id !== actId);
    updatedItinerary[dayIndex] = targetDay;
    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
  };

  const handleAddDay = () => {
    const newDayNum = days.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: newDayNum,
      date: trip.startDate,
      title: `Ngày ${newDayNum}: Khám phá địa điểm mới`,
      activities: [],
    };
    onUpdateTrip({ ...trip, itinerary: [...days, newDay] });
    setActiveDayIndex(days.length);
  };

  const handleSaveNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName.trim() || !currentDay) return;

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      name: newActName,
      time: newActTime,
      duration: newActDuration,
      address: newActAddress || trip.destination,
      transport: newActTransport,
      cost: Number(newActCost) || 0,
      preparation: newActPreparation,
      safetyNote: newActSafety,
      backupPlan: newActBackup,
      completed: false,
    };

    const updatedItinerary = [...trip.itinerary];
    const targetDay = { ...updatedItinerary[activeDayIndex] };
    targetDay.activities = [...targetDay.activities, newAct];
    updatedItinerary[activeDayIndex] = targetDay;

    onUpdateTrip({ ...trip, itinerary: updatedItinerary });
    setShowAddActivityModal(false);

    // reset fields
    setNewActName('');
    setNewActAddress('');
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#343C58]/70">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5CAD7]/60 text-[#343C58]">
              {trip.style}
            </span>
            <span>·</span>
            <span>
              {trip.startDate} đến {trip.endDate}
            </span>
            <span>·</span>
            <span>{trip.peopleCount} người</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            {trip.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Xuất phát: <strong>{trip.origin}</strong> ➔ Đến: <strong>{trip.destination}</strong> ({trip.transport})
          </p>
        </div>

        {/* Flexible Mode Toggler */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFlexibleMode(!isFlexibleMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              isFlexibleMode
                ? 'bg-amber-100 border-amber-300 text-amber-800 ring-2 ring-amber-200'
                : 'bg-[#FFF7ED] border-[#EADCCB] text-[#343C58] hover:bg-amber-50'
            }`}
          >
            {isFlexibleMode ? (
              <>
                <CloudRain className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                <span>Đang bật: Chế độ linh hoạt</span>
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5 text-[#343C58]" />
                <span>Bật chế độ linh hoạt (Kế hoạch B)</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenNewTripModal}
            className="p-2 rounded-xl text-[#343C58]/70 hover:text-[#343C58] hover:bg-slate-100 transition-colors"
            title="Đổi chuyến đi"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flexible Mode Advice Callout */}
      {isFlexibleMode && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Lời dặn từ Anh Thành: </strong>
            Nếu thời tiết xấu, trời mưa đèo trơn hoặc Em iu cảm thấy mệt mỏi, tụi mình ưu tiên chuyển sang các hoạt động trong nhà, ghé quán cà phê yên tĩnh hoặc về khách sạn nghỉ ngơi nhé. Không khuyến khích cố hoàn thành lịch trình bằng mọi giá! 🌷
          </div>
        </div>
      )}

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d, idx) => (
          <button
            key={d.id}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeDayIndex === idx
                ? 'bg-[#343C58] text-white shadow-sm'
                : 'bg-white text-[#343C58]/70 border border-[#EADCCB] hover:bg-[#FFF7ED]'
            }`}
          >
            Ngày {d.dayNumber}
            <span className="ml-1.5 opacity-70 font-normal">({d.activities?.length || 0})</span>
          </button>
        ))}

        <button
          onClick={handleAddDay}
          className="px-3.5 py-2 rounded-2xl text-xs font-bold text-[#343C58] bg-[#F5CAD7]/60 hover:bg-[#F5CAD7] border border-[#EADCCB] transition-all whitespace-nowrap"
        >
          + Thêm ngày
        </button>
      </div>

      {/* Activities Timeline for Active Day */}
      {currentDay ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#343C58]">
              {currentDay.title}
            </h3>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#343C58] text-white rounded-xl text-xs font-bold hover:bg-[#262c3e] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm hoạt động</span>
            </button>
          </div>

          {currentDay.activities?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-[#EADCCB] text-[#343C58]/60 text-xs">
              Chưa có hoạt động nào trong Ngày {currentDay.dayNumber}. Bấm "Thêm hoạt động" để thêm địa điểm ghé thăm nha Em iu!
            </div>
          ) : (
            <div className="space-y-3">
              {currentDay.activities.map((act, actIdx) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  act.address || act.name
                )}`;

                return (
                  <div
                    key={act.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      act.completed
                        ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                        : 'border-[#EADCCB]/80 hover:border-[#F5CAD7] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleActivity(activeDayIndex, act.id)}
                          className="mt-0.5 text-[#343C58] hover:scale-110 transition-transform"
                          title={act.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
                        >
                          {act.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#343C58]/40" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md tabular-nums">
                              {act.time}
                            </span>
                            <span className="text-xs text-[#343C58]/60">· {act.duration}</span>
                            <span className="text-xs text-[#343C58]/60">· {act.transport}</span>
                            {act.cost > 0 && (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {formatVND(act.cost)}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-base font-bold text-[#343C58] mt-1.5 ${
                              act.completed ? 'line-through text-[#343C58]/50' : ''
                            }`}
                          >
                            {act.name}
                          </h4>

                          <p className="text-xs text-[#343C58]/70 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>{act.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors text-xs flex items-center gap-1"
                          title="Mở chỉ đường Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Chỉ đường</span>
                        </a>

                        <button
                          onClick={() => handleDeleteActivity(activeDayIndex, act.id)}
                          className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa hoạt động này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Cards: Preparation, Safety, Backup */}
                    <div className="mt-4 pt-3 border-t border-[#EADCCB]/40 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FFF7ED] text-[#343C58]/80">
                        <span className="font-bold text-[#343C58] block mb-0.5">
                          🎒 Cần chuẩn bị:
                        </span>
                        <span>{act.preparation || 'Điện thoại đầy pin, nước uống'}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900">
                        <span className="font-bold text-rose-700 flex items-center gap-1 mb-0.5">
                          <Shield className="w-3 h-3" /> Lưu ý an toàn:
                        </span>
                        <span>{act.safetyNote || 'Quan sát đường đi, không đi vào khu vực cấm'}</span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl transition-all ${
                          isFlexibleMode
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-medium'
                            : 'bg-[#CBE7F5]/25 text-[#343C58]/80'
                        }`}
                      >
                        <span className="font-bold text-sky-800 flex items-center gap-1 mb-0.5">
                          <Coffee className="w-3 h-3 text-sky-600" /> Phương án dự phòng:
                        </span>
                        <span>{act.backupPlan || 'Nếu mưa hoặc mệt: Ghé quán cà phê nghỉ ngơi'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#EADCCB] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#343C58] mb-1">
              Thêm hoạt động mới vào Ngày {currentDay?.dayNumber}
            </h3>
            <p className="text-xs text-[#343C58]/60 mb-4">
              Điền thông tin rõ ràng kèm phương án dự phòng cho Em iu nha
            </p>

            <form onSubmit={handleSaveNewActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Tên địa điểm / Hoạt động *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cà phê Túi Mơ To ngắm hoàng hôn"
                  value={newActName}
                  onChange={(e) => setNewActName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Khung giờ dự kiến</label>
                  <input
                    type="time"
                    value={newActTime}
                    onChange={(e) => setNewActTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Thời lượng tham quan</label>
                  <input
                    type="text"
                    placeholder="2 tiếng"
                    value={newActDuration}
                    onChange={(e) => setNewActDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  placeholder="Số nhà, đường, phường, thành phố"
                  value={newActAddress}
                  onChange={(e) => setNewActAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Cách di chuyển</label>
                  <select
                    value={newActTransport}
                    onChange={(e) => setNewActTransport(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                  >
                    <option value="Xe máy">Xe máy</option>
                    <option value="Taxi / Xe công nghệ">Taxi / Xe công nghệ</option>
                    <option value="Đi bộ">Đi bộ</option>
                    <option value="Xe ô tô riêng">Xe ô tô riêng</option>
                    <option value="Xe buýt / Xe khách">Xe buýt / Xe khách</option>
                    <option value="Xe đạp">Xe đạp</option>
                    <option value="Thuyền / Ca nô">Thuyền / Ca nô</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Chi phí dự kiến (VND)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={newActCost}
                    onChange={(e) => setNewActCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Điều cần chuẩn bị</label>
                <input
                  type="text"
                  placeholder="Áo ấm, nước uống, pin sạc dự phòng"
                  value={newActPreparation}
                  onChange={(e) => setNewActPreparation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-700 mb-1">Lưu ý an toàn quan trọng</label>
                <input
                  type="text"
                  placeholder="Đường dốc trơn, không rà phanh liên tục"
                  value={newActSafety}
                  onChange={(e) => setNewActSafety(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block font-bold text-sky-800 mb-1">Phương án dự phòng (mưa / mệt / đóng cửa)</label>
                <input
                  type="text"
                  placeholder="Nếu mưa: Đổi sang quán cà phê trong nhà có lò sưởi"
                  value={newActBackup}
                  onChange={(e) => setNewActBackup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EADCCB]/40">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#252b3f] transition-all shadow-sm"
                >
                  Lưu hoạt động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
