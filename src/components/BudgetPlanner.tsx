import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  PieChart,
  Plus,
  Shield,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { BudgetItem, Trip } from '../types/travel';

interface BudgetPlannerProps {
  trip: Trip | null;
  items: BudgetItem[];
  onUpdateItems: (items: BudgetItem[]) => void;
  onUpdateTripBudget: (budget: number) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  trip,
  items,
  onUpdateItems,
  onUpdateTripBudget,
}) => {
  const [totalTargetBudget, setTotalTargetBudget] = useState<number>(
    trip?.estimatedBudget || 6000000
  );
  const [peopleCount, setPeopleCount] = useState<number>(trip?.peopleCount || 2);
  const [daysCount, setDaysCount] = useState<number>(3);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetItem['category']>('food');
  const [newEstimated, setNewEstimated] = useState('200000');
  const [newActual, setNewActual] = useState('0');
  const [newNotes, setNewNotes] = useState('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const totalEstimated = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalActual = items.reduce((acc, curr) => acc + curr.actualCost, 0);
  const remainingBudget = totalTargetBudget - totalActual;
  const reserveFund =
    items.find((i) => i.category === 'emergency')?.estimatedCost || 0;

  const costPerPerson = peopleCount > 0 ? Math.round(totalEstimated / peopleCount) : 0;
  const costPerDay = daysCount > 0 ? Math.round(totalEstimated / daysCount) : 0;

  const isOverBudget = totalActual > totalTargetBudget;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BudgetItem = {
      id: `budget-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      estimatedCost: Number(newEstimated) || 0,
      actualCost: Number(newActual) || 0,
      notes: newNotes.trim(),
    };

    onUpdateItems([...items, newItem]);
    setNewTitle('');
    setNewEstimated('100000');
    setNewActual('0');
    setNewNotes('');
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const handleBudgetChange = (val: number) => {
    setTotalTargetBudget(val);
    onUpdateTripBudget(val);
  };

  const categoryLabels: Record<string, string> = {
    transport: 'Di chuyển',
    hotel: 'Lưu trú',
    food: 'Ăn uống',
    tickets: 'Vé tham quan',
    rental: 'Thuê thiết bị',
    extra: 'Phát sinh',
    emergency: 'Quỹ dự phòng khẩn cấp',
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
            <span>💰 QUẢN LÝ NGÂN SÁCH DU LỊCH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Chi tiêu thông minh & Luôn có quỹ dự phòng 💵
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Dễ dàng đối chiếu dự kiến và thực tế, tự động chia đều theo người và theo ngày.
          </p>
        </div>

        {/* Target Budget Input */}
        <div className="bg-[#FFF7ED] p-3 rounded-2xl border border-[#EADCCB] text-xs">
          <label className="block text-[11px] font-bold text-[#343C58]/70 uppercase">
            Hạn mức ngân sách đặt ra:
          </label>
          <input
            type="number"
            step="100000"
            value={totalTargetBudget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="text-lg font-black text-[#343C58] bg-transparent border-b border-[#EADCCB] focus:outline-none w-40 tabular-nums"
          />
        </div>
      </div>

      {/* Over budget alert if any */}
      {isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            Cảnh báo: Tổng chi thực tế ({formatVND(totalActual)}) đã vượt ngân sách dự trù ban đầu ({formatVND(totalTargetBudget)})! Em iu nên cân nhắc giảm bớt các khoản mua sắm phát sinh nhé.
          </span>
        </div>
      )}

      {/* Metrics Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#EADCCB] shadow-xs">
          <div className="text-[10px] font-bold text-[#343C58]/60 uppercase">Tổng dự kiến</div>
          <div className="text-lg sm:text-xl font-black text-[#343C58] mt-1 tabular-nums">
            {formatVND(totalEstimated)}
          </div>
          <div className="text-[11px] text-[#343C58]/60 mt-0.5">
            Mục tiêu: {formatVND(totalTargetBudget)}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#EADCCB] shadow-xs">
          <div className="text-[10px] font-bold text-[#343C58]/60 uppercase">Đã chi thực tế</div>
          <div className="text-lg sm:text-xl font-black text-rose-600 mt-1 tabular-nums">
            {formatVND(totalActual)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            Còn lại: {formatVND(remainingBudget)}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#EADCCB] shadow-xs">
          <div className="text-[10px] font-bold text-[#343C58]/60 uppercase">Bình quân / người</div>
          <div className="text-lg sm:text-xl font-black text-[#343C58] mt-1 tabular-nums">
            {formatVND(costPerPerson)}
          </div>
          <div className="text-[11px] text-[#343C58]/60 mt-0.5">
            Chia cho {peopleCount} người
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#EADCCB] shadow-xs">
          <div className="text-[10px] font-bold text-[#343C58]/60 uppercase">Quỹ dự phòng</div>
          <div className="text-lg sm:text-xl font-black text-emerald-700 mt-1 tabular-nums">
            {formatVND(reserveFund)}
          </div>
          <div className="text-[11px] text-[#343C58]/60 mt-0.5">
            Cho tình huống khẩn cấp
          </div>
        </div>
      </div>

      {/* People & Days Adjusters */}
      <div className="bg-[#FFF7ED] p-4 rounded-3xl border border-[#EADCCB] flex flex-wrap items-center gap-4 text-xs font-semibold text-[#343C58]">
        <div className="flex items-center gap-2">
          <span>Số người tham gia:</span>
          <input
            type="number"
            min="1"
            max="50"
            value={peopleCount}
            onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
            className="w-16 px-2 py-1 rounded-lg bg-white border border-[#EADCCB] text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Số ngày đi:</span>
          <input
            type="number"
            min="1"
            max="60"
            value={daysCount}
            onChange={(e) => setDaysCount(Math.max(1, Number(e.target.value)))}
            className="w-16 px-2 py-1 rounded-lg bg-white border border-[#EADCCB] text-center"
          />
        </div>
        <div className="text-[#343C58]/70 text-[11px]">
          Ước tính khoảng: <strong>{formatVND(costPerDay)}</strong> / ngày
        </div>
      </div>

      {/* Add New Expense Form */}
      <form onSubmit={handleAddItem} className="bg-white rounded-3xl p-5 border border-[#EADCCB] shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-[#343C58] text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-rose-500" />
          <span>Thêm khoản chi tiêu mới</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#343C58] mb-1">Tên khoản chi *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Bữa tối hải sản, Vé cáp treo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB] focus:ring-2 focus:ring-[#F5CAD7]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Hạng mục</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
            >
              <option value="transport">Di chuyển</option>
              <option value="hotel">Lưu trú</option>
              <option value="food">Ăn uống</option>
              <option value="tickets">Vé tham quan</option>
              <option value="rental">Thuê thiết bị</option>
              <option value="extra">Phát sinh</option>
              <option value="emergency">Quỹ dự phòng khẩn cấp</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#343C58] mb-1">Dự kiến (VND)</label>
            <input
              type="number"
              value={newEstimated}
              onChange={(e) => setNewEstimated(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EADCCB]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <input
            type="text"
            placeholder="Ghi chú thêm (tùy chọn)..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#EADCCB]"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#212638] transition-all shadow-sm shrink-0"
          >
            + Lưu khoản chi
          </button>
        </div>
      </form>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-[#EADCCB] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#EADCCB] bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
            Bảng chi tiết các khoản chi ({items.length})
          </h3>
          <span className="text-[11px] text-[#343C58]/60">Đơn vị: VND</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7ED] text-[#343C58] font-bold border-b border-[#EADCCB]">
              <tr>
                <th className="p-3">Hạng mục</th>
                <th className="p-3">Khoản chi</th>
                <th className="p-3 text-right">Dự kiến</th>
                <th className="p-3 text-right">Thực tế</th>
                <th className="p-3 text-right">Chênh lệch</th>
                <th className="p-3 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADCCB]/40">
              {items.map((it) => {
                const diff = it.actualCost - it.estimatedCost;
                return (
                  <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-[11px]">
                        {categoryLabels[it.category] || it.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#343C58]">
                      {it.title}
                      {it.notes && (
                        <span className="block text-[10px] text-[#343C58]/60 font-normal">
                          {it.notes}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right tabular-nums font-medium">
                      {formatVND(it.estimatedCost)}
                    </td>
                    <td className="p-3 text-right tabular-nums font-bold text-[#343C58]">
                      {formatVND(it.actualCost)}
                    </td>
                    <td className="p-3 text-right tabular-nums font-semibold">
                      {it.actualCost === 0 ? (
                        <span className="text-slate-400">-</span>
                      ) : diff > 0 ? (
                        <span className="text-rose-600">+{formatVND(diff)}</span>
                      ) : (
                        <span className="text-emerald-600">{formatVND(diff)}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteItem(it.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
