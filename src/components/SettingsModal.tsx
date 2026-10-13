import React, { useState } from 'react';
import { Download, RefreshCw, Shield, Trash2, Upload, X } from 'lucide-react';
import { Storage } from '../utils/storage';

interface SettingsModalProps {
  onClose: () => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onDataReset,
}) => {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExport = () => {
    const json = Storage.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chi_iu_cam_nang_du_lich_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('✓ Đã tải xuống tệp sao lưu JSON!');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = Storage.importAllData(importText);
    if (ok) {
      setStatusMessage('✓ Đã khôi phục dữ liệu thành công!');
      onDataReset();
      setTimeout(onClose, 1000);
    } else {
      setStatusMessage('✗ Định dạng JSON không hợp lệ, Em iu kiểm tra lại nhé.');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Em iu có chắc chắn muốn xóa toàn bộ dữ liệu cá nhân trên thiết bị này không?')) {
      Storage.clearAllData();
      onDataReset();
      setStatusMessage('✓ Đã xóa sạch dữ liệu cục bộ!');
      setTimeout(onClose, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EADCCB] my-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#343C58]">
              Cài đặt & Dữ liệu cá nhân ⚙️
            </h3>
            <p className="text-xs text-[#343C58]/60 mt-0.5">
              Toàn bộ dữ liệu của Em iu được lưu trữ an toàn ngay trên máy của Em iu
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 mb-3 rounded-xl bg-slate-100 text-xs font-semibold text-[#343C58]">
            {statusMessage}
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Export JSON */}
          <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] space-y-2">
            <span className="font-bold text-[#343C58] block">Sao lưu dữ liệu (Backup)</span>
            <p className="text-[#343C58]/70 leading-relaxed">
              Tải toàn bộ chuyến đi, hành lý, ngân sách và nhật ký về máy tính/điện thoại.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#202534] transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file sao lưu JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-[#343C58] block">Khôi phục từ file sao lưu</span>
            <textarea
              rows={3}
              placeholder="Dán nội dung JSON đã sao lưu vào đây..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full p-2 bg-white rounded-xl border border-slate-200 font-mono text-[11px]"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-800 transition-all disabled:opacity-40"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu</span>
            </button>
          </div>

          {/* Delete All Data */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <span className="font-bold text-rose-800 block">Xóa dữ liệu cá nhân</span>
            <p className="text-rose-900/80 leading-relaxed">
              Xóa sạch các chuyến đi, mã đặt phòng và nhật ký trên trình duyệt này.
            </p>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa sạch toàn bộ dữ liệu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
