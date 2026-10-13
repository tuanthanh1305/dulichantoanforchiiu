import React, { useState } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Plus,
  Shield,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Trip } from '../types/travel';

interface WalletDoc {
  id: string;
  title: string;
  type: 'booking' | 'ticket' | 'contact' | 'note';
  content: string;
  code?: string;
}

interface TravelDocumentWalletProps {
  trip: Trip | null;
}

export const TravelDocumentWallet: React.FC<TravelDocumentWalletProps> = ({ trip }) => {
  const [docs, setDocs] = useState<WalletDoc[]>([
    {
      id: 'doc-1',
      title: 'Xác nhận Homestay Bavi An Vui Lodge / 90s Tam Đảo',
      type: 'booking',
      content: 'Căn phòng view đồi mây xanh. Đã chuyển khoản cọc qua tài khoản chính thức. Check-in 14:00.',
      code: 'BAVI-TAMDAO-2026-EMIU',
    },
    {
      id: 'doc-2',
      title: 'Vé tham quan Vườn Quốc Gia Ba Vì & Cầu Mây Tam Đảo',
      type: 'ticket',
      content: 'Vé Cốt 400 - Cốt 1100 Vườn Quốc Gia Ba Vì (60k/vé) + Cầu Mây Studio Tam Đảo (30k/vé).',
      code: 'VQG-BAVI-ENTRY-9823',
    },
    {
      id: 'doc-3',
      title: 'Hotline Cứu hộ giao thông & Vá xe đèo 24/7',
      type: 'contact',
      content: 'Đội cứu hộ xe máy đèo Ba Vì - Tam Đảo: 0988.776.655 (Hỗ trợ kéo xe, vá xăm, xăng dự phòng khi gặp sự cố đèo).',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<WalletDoc['type']>('booking');
  const [newCode, setNewCode] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: WalletDoc = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      code: newCode.trim(),
      content: newContent.trim(),
    };

    setDocs([newDoc, ...docs]);
    setShowAddForm(false);
    setNewTitle('');
    setNewCode('');
    setNewContent('');
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
            <span>📂 VÍ THÔNG TIN DU LỊCH OFFLINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Lưu trữ mã vé & địa chỉ nơi ở tiện lợi 🎫
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Truy cập nhanh kể cả khi mất sóng Internet hoặc mạng 4G chập chờn.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#202534] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Lưu thông tin mới</span>
        </button>
      </div>

      {/* Security Banner from Prompt Section XIII */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Bảo mật thông tin: </strong>
          Toàn bộ thông tin được lưu hoàn toàn cục bộ trên thiết bị của Em iu. Tuyệt đối không lưu mật khẩu ngân hàng, mã OTP hay thông tin nhạy cảm vào ví này nha Em iu!
        </div>
      </div>

      {/* Add Document Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-3xl p-5 border border-[#EADCCB] shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-[#343C58] text-sm">Thêm mục lưu trữ mới</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#343C58] mb-1">Tiêu đề *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Mã vé tàu hỏa Hà Nội - Huế"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#343C58] mb-1">Loại mục</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
              >
                <option value="booking">Mã đặt phòng</option>
                <option value="ticket">Vé tàu / Máy bay / Xe</option>
                <option value="contact">Số điện thoại cần nhớ</option>
                <option value="note">Ghi chú quan trọng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Mã xác nhận / Code (nếu có)</label>
            <input
              type="text"
              placeholder="Ví dụ: SE1-2026-TOA5"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Nội dung chi tiết</label>
            <textarea
              rows={2}
              placeholder="Giờ khởi hành, địa chỉ bến xe, hướng dẫn nhận phòng..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#202534] transition-all"
            >
              Lưu vào ví
            </button>
          </div>
        </form>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-5 border border-[#EADCCB] hover:border-[#F5CAD7] transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {doc.type}
                </span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-[#343C58] mt-2 leading-snug">
                {doc.title}
              </h3>

              {doc.code && (
                <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 font-mono text-xs font-bold text-[#343C58]">
                  <span className="truncate">{doc.code}</span>
                  <button
                    onClick={() => handleCopy(doc.code!, doc.id)}
                    className="p-1 text-slate-500 hover:text-[#343C58]"
                    title="Sao chép mã"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-[#343C58]/80 mt-2.5 leading-relaxed bg-[#FFF7ED]/50 p-2.5 rounded-xl border border-[#EADCCB]/40">
                {doc.content}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#EADCCB]/40 flex justify-end">
              <button
                onClick={() => handleCopy(`${doc.title}\n${doc.code ? `Mã: ${doc.code}\n` : ''}${doc.content}`, doc.id)}
                className="text-[11px] font-bold text-[#343C58] hover:text-rose-600 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedId === doc.id ? '✓ Đã chép' : 'Sao chép tất cả'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
