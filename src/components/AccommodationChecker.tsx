import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Hotel,
  Info,
  MapPin,
  Navigation,
  Phone,
  Save,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { AccommodationInfo, Trip } from '../types/travel';

interface AccommodationCheckerProps {
  trip: Trip | null;
  onUpdateAccommodation: (acc: AccommodationInfo) => void;
}

export const AccommodationChecker: React.FC<AccommodationCheckerProps> = ({
  trip,
  onUpdateAccommodation,
}) => {
  const [accData, setAccData] = useState<AccommodationInfo>(
    trip?.accommodation || {
      name: 'Bavi An Vui Lodge & Villa',
      address: 'Thôn Muồng Cháu, Xã Vân Hòa, Huyện Ba Vì, Hà Nội',
      phone: '0989123456',
      bookingCode: 'BAVI-ANVUI-EMIU',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      pricePerNight: 850000,
      notes: 'Khuôn viên xanh mát, gần Vườn Quốc Gia Ba Vì, có bếp BBQ và lò sưởi ấm.',
      verifiedChecklist: {},
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const checklistCriteria = [
    { id: 'c1', title: '1. Địa chỉ rõ ràng, định vị được trên Google Maps', desc: 'Có số nhà cụ thể, không mập mờ "gần trung tâm" hay "gần hồ".' },
    { id: 'c2', title: '2. Số điện thoại hotline xác minh được', desc: 'Đã thử gọi điện có người bắt máy tư vấn trực tiếp.' },
    { id: 'c3', title: '3. Chính sách đặt cọc và hủy phòng minh bạch', desc: 'Có phiếu xác nhận hoặc xác nhận qua email/tin nhắn lưu bằng chứng.' },
    { id: 'c4', title: '4. Đánh giá đa nguồn (Google, Agoda, Booking, FB)', desc: 'Xem kỹ các bình luận 1 sao và 2 sao xem có phàn nàn về an ninh hay trộm cắp không.' },
    { id: 'c5', title: '5. Vị trí an toàn, không nằm sâu trong hẻm tối', desc: 'Đường vào có đèn đường, xe ô tô hoặc taxi có thể đón tận cửa.' },
    { id: 'c6', title: '6. Có người trực đêm hoặc khóa cổng trong chắc chắn', desc: 'Hỏi rõ homestay có lễ tân trực 24/7 hay gửi chìa khóa cổng riêng.' },
    { id: 'c7', title: '7. Quy định giờ Check-in / Check-out cụ thể', desc: 'Tránh trường hợp đến nơi sáng sớm không có phòng phải bơ vơ ngoài đường.' },
    { id: 'c8', title: '8. Kiểm tra chốt cửa trong và mắt thần khi nhận phòng', desc: 'Đảm bảo cửa phòng có chốt cài phía trong không ai mở từ ngoài được.' },
    { id: 'c9', title: '9. Vị trí lối thoát hiểm & bình cứu hỏa PCCC', desc: 'Quan sát sơ đồ thoát hiểm gắn sau cửa phòng hoặc hành lang.' },
    { id: 'c10', title: '10. Có đường dây nóng liên hệ quản lý khẩn cấp', desc: 'Lưu số quản lý homestay vào danh bạ điện thoại của Em iu.' },
  ];

  const checkedCount = Object.values(accData.verifiedChecklist || {}).filter(Boolean).length;

  const toggleCheck = (id: string) => {
    const nextList = { ...(accData.verifiedChecklist || {}), [id]: !accData.verifiedChecklist?.[id] };
    const updated = { ...accData, verifiedChecklist: nextList };
    setAccData(updated);
    onUpdateAccommodation(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccommodation(accData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${accData.name} ${accData.address}`
  )}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <span>🏨 KIỂM TRA NƠI LƯU TRÚ AN TOÀN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Đánh giá khách sạn & homestay trước khi cọc 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Bộ 10 tiêu chuẩn vàng đảm bảo nơi ở an ninh, tiện nghi và chuẩn xác thông tin.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] text-xs font-bold text-[#343C58] shrink-0">
          Đạt tiêu chuẩn: <strong className="text-rose-600 tabular-nums">{checkedCount}/10</strong>
        </div>
      </div>

      {/* Accommodation Card & Edit Form */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#343C58] flex items-center gap-2 uppercase tracking-wider">
            <Hotel className="w-4 h-4 text-rose-500" />
            <span>Thông tin nơi lưu trú đã chọn</span>
          </h3>
          <div className="flex items-center gap-2">
            {accData.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Xem trên bản đồ</span>
              </a>
            )}
            {accData.phone && (
              <a
                href={`tel:${accData.phone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi khách sạn</span>
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#343C58] mb-1">Tên khách sạn / Homestay *</label>
            <input
              type="text"
              required
              value={accData.name}
              onChange={(e) => setAccData({ ...accData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#343C58] mb-1">Địa chỉ chi tiết *</label>
            <input
              type="text"
              required
              value={accData.address}
              onChange={(e) => setAccData({ ...accData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Số điện thoại liên hệ *</label>
            <input
              type="text"
              value={accData.phone}
              onChange={(e) => setAccData({ ...accData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Mã đặt phòng (Booking Code)</label>
            <input
              type="text"
              value={accData.bookingCode || ''}
              onChange={(e) => setAccData({ ...accData, bookingCode: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Giờ Check-in / Check-out</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Vào: 14:00"
                value={accData.checkInTime || ''}
                onChange={(e) => setAccData({ ...accData, checkInTime: e.target.value })}
                className="w-full px-2 py-2 rounded-xl border border-[#EADCCB] text-center"
              />
              <input
                type="text"
                placeholder="Ra: 12:00"
                value={accData.checkOutTime || ''}
                onChange={(e) => setAccData({ ...accData, checkOutTime: e.target.value })}
                className="w-full px-2 py-2 rounded-xl border border-[#EADCCB] text-center"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-bold text-[#343C58] mb-1">Ghi chú cá nhân (lối đi, khóa cổng, tiện nghi)</label>
            <input
              type="text"
              value={accData.notes || ''}
              onChange={(e) => setAccData({ ...accData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="text-emerald-700 font-bold">✓ Đã lưu thành công!</span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#252a3b] transition-all shadow-sm"
            >
              Lưu thông tin nơi ở
            </button>
          </div>
        </form>
      </div>

      {/* 10-Point Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#343C58] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>10 Tiêu chí xác minh an toàn trước khi chuyển cọc phòng</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklistCriteria.map((c) => {
            const isChecked = Boolean(accData.verifiedChecklist?.[c.id]);
            return (
              <div
                key={c.id}
                onClick={() => toggleCheck(c.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-[#EADCCB] hover:border-[#F5CAD7]'
                }`}
              >
                <button type="button" className="mt-0.5 text-[#343C58] focus:outline-none shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                <div>
                  <h4
                    className={`text-xs font-bold leading-snug ${
                      isChecked ? 'text-emerald-900' : 'text-[#343C58]'
                    }`}
                  >
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-[#343C58]/70 mt-0.5 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Note from Section X */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Nhắc nhở:</strong> Ứng dụng không khẳng định một nơi lưu trú an toàn tuyệt đối chỉ dựa trên điểm đánh giá online. Em iu hãy luôn chủ động kiểm tra thực tế khi nhận phòng nha!
          </span>
        </div>
      </div>
    </div>
  );
};
