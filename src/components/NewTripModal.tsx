import React, { useState } from 'react';
import { Compass, Sparkles, X } from 'lucide-react';
import { TravelStyle, Trip } from '../types/travel';

interface NewTripModalProps {
  onClose: () => void;
  onCreateTrip: (trip: Trip) => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({
  onClose,
  onCreateTrip,
}) => {
  const [name, setName] = useState('Chuyến vi vu Đà Lạt cuối tuần');
  const [origin, setOrigin] = useState('Hà Nội');
  const [destination, setDestination] = useState('Đà Lạt');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-22');
  const [peopleCount, setPeopleCount] = useState(2);
  const [transport, setTransport] = useState('Máy bay & Xe máy');
  const [style, setStyle] = useState<TravelStyle>('relax');
  const [estimatedBudget, setEstimatedBudget] = useState(6000000);
  const [specialNotes, setSpecialNotes] = useState('Em iu thích chụp ảnh đồi thông, ăn bánh căn nóng và đi dạo buổi tối.');
  const [emergencyContactName, setEmergencyContactName] = useState('Anh Thành');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('0988776655');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name: name.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      peopleCount: Number(peopleCount) || 1,
      transport,
      style,
      estimatedBudget: Number(estimatedBudget) || 3000000,
      specialNotes: specialNotes.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      createdAt: new Date().toISOString(),
      accommodation: {
        name: `Khách sạn / Homestay tại ${destination}`,
        address: `Trung tâm ${destination}`,
        phone: '0912345678',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        pricePerNight: 600000,
        notes: 'Chốt cửa an toàn, kiểm tra bình nóng lạnh khi nhận phòng.',
      },
      itinerary: [
        {
          id: `day-1-${Date.now()}`,
          dayNumber: 1,
          date: startDate,
          title: `Ngày 1: Đến ${destination} & Nhận phòng nghỉ ngơi`,
          activities: [
            {
              id: `act-1-${Date.now()}`,
              name: `Di chuyển đến ${destination} & Về nơi lưu trú`,
              time: '10:00',
              duration: '2 tiếng',
              address: `Trung tâm ${destination}`,
              transport,
              cost: 150000,
              preparation: 'Điện thoại đầy pin, cất giữ giấy tờ CCCD cẩn thận.',
              safetyNote: 'Đón taxi chính hãng hoặc xe công nghệ kiểm tra đúng biển số.',
              backupPlan: 'Nếu mệt: Về phòng nghỉ ngơi trước, không vội đi tham quan.',
              completed: false,
            },
            {
              id: `act-2-${Date.now()}`,
              name: `Ăn trưa đặc sản & Thư giãn tại quán cà phê`,
              time: '13:00',
              duration: '2.5 tiếng',
              address: `${destination}`,
              transport: 'Xe máy / Đi bộ',
              cost: 120000,
              preparation: 'Áo khoác nhẹ, nón mũ che nắng.',
              safetyNote: 'Quan sát giao thông khi qua đường.',
              backupPlan: 'Nếu trời mưa: Chọn quán cà phê có mái che ấm cúng.',
              completed: false,
            },
          ],
        },
        {
          id: `day-2-${Date.now()}`,
          dayNumber: 2,
          date: endDate,
          title: `Ngày 2: Khám phá địa điểm nổi tiếng & Mua quà lưu niệm`,
          activities: [
            {
              id: `act-3-${Date.now()}`,
              name: `Tham quan danh lam thắng cảnh chính`,
              time: '08:30',
              duration: '3 tiếng',
              address: `Khu du lịch ${destination}`,
              transport: 'Xe máy',
              cost: 200000,
              preparation: 'Giày thể thao êm chân bám tốt, chai nước cá nhân.',
              safetyNote: 'Tuân thủ biển báo an toàn, không leo trèo mép vách đá nguy hiểm.',
              backupPlan: 'Đổi sang bảo tàng hoặc khu triển lãm trong nhà nếu thời tiết xấu.',
              completed: false,
            },
          ],
        },
      ],
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EADCCB] my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">
              Smart Travel Planner
            </span>
            <h2 className="text-xl font-bold text-[#343C58] mt-0.5">
              Tạo chuyến đi mới cho Em iu 🧳
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#343C58] mb-1">Tên chuyến đi *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Điểm xuất phát *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Điểm đến *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Ngày khởi hành</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Ngày trở về</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Số người tham gia</label>
              <input
                type="number"
                min="1"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Phương tiện di chuyển</label>
              <input
                type="text"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Phong cách du lịch</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              >
                <option value="relax">Nghỉ dưỡng & Chill</option>
                <option value="nature">Thiên nhiên & Núi đồi</option>
                <option value="culture">Văn hóa & Phố cổ</option>
                <option value="city">Du lịch thành phố</option>
                <option value="beach">Đi biển & Đảo</option>
                <option value="trekking">Leo núi & Trekking</option>
                <option value="weekend">Du lịch cuối tuần ngắn ngày</option>
                <option value="budget">Tiết kiệm</option>
                <option value="solo">Đi một mình (Solo)</option>
                <option value="friends">Cùng bạn bè</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#343C58] mb-1">Ngân sách dự kiến (VND)</label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-rose-700 mb-1">Người liên hệ khẩn cấp</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200"
              />
            </div>
            <div>
              <label className="block font-bold text-rose-700 mb-1">SĐT liên hệ khẩn cấp</label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Sở thích / Nhu cầu đặc biệt</label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#EADCCB]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#202534] transition-all shadow-sm"
            >
              Khởi tạo chuyến đi 🧳
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
