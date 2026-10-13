import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Share2,
  DollarSign,
  Package,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GroupBill, GroupMember, GroupTask, SharedGearItem, SettlementTransfer } from '../types/travel';
import { Storage } from '../utils/storage';

interface GroupCoordinationProps {
  onNotify?: (msg: string) => void;
}

export const GroupCoordination: React.FC<GroupCoordinationProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'gear' | 'bills'>('tasks');

  // State
  const [members, setMembers] = useState<GroupMember[]>(() => Storage.getGroupMembers());
  const [tasks, setTasks] = useState<GroupTask[]>(() => Storage.getGroupTasks());
  const [gear, setGear] = useState<SharedGearItem[]>(() => Storage.getSharedGear());
  const [bills, setBills] = useState<GroupBill[]>(() => Storage.getGroupBills());

  // Filters & Dialogs
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddGearOpen, setIsAddGearOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Form states
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('🌟');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<GroupTask['category']>('itinerary');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>(members[0]?.id || 'all');
  const [newTaskPriority, setNewTaskPriority] = useState<GroupTask['priority']>('normal');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const [newGearName, setNewGearName] = useState('');
  const [newGearCategory, setNewGearCategory] = useState<SharedGearItem['category']>('electronics');
  const [newGearAssignee, setNewGearAssignee] = useState<string>(members[0]?.id || '');
  const [newGearNotes, setNewGearNotes] = useState('');

  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillCategory, setNewBillCategory] = useState<GroupBill['category']>('food');
  const [newBillAmount, setNewBillAmount] = useState<string>('');
  const [newBillPaidBy, setNewBillPaidBy] = useState<string>(members[0]?.id || '');
  const [newBillSplitWith, setNewBillSplitWith] = useState<string[]>(members.map((m) => m.id));
  const [newBillNotes, setNewBillNotes] = useState('');

  // Currency Formatter
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Handlers for Members
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newM: GroupMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      avatar: newMemberAvatar || '🌟',
      roleTitle: newMemberRole.trim() || 'Thành viên đồng hành',
      phone: newMemberPhone.trim(),
    };
    const updated = [...members, newM];
    setMembers(updated);
    Storage.saveGroupMembers(updated);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberPhone('');
    setIsAddMemberOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    if (members.length <= 1) {
      alert('Nhóm cần ít nhất 1 thành viên!');
      return;
    }
    if (confirm('Xóa thành viên này khỏi nhóm? Các công việc liên quan sẽ được chuyển về nhóm.')) {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      Storage.saveGroupMembers(updated);
      if (selectedMemberFilter === id) setSelectedMemberFilter('all');
    }
  };

  // Handlers for Tasks
  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus: GroupTask['status'] =
          t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'todo';
        if (nextStatus === 'done') {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        }
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    Storage.saveGroupTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: GroupTask = {
      id: `gt-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      assigneeId: newTaskAssignee,
      deadline: newTaskDeadline || undefined,
      priority: newTaskPriority,
      status: 'todo',
      notes: newTaskNotes.trim() || undefined,
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    Storage.saveGroupTasks(updated);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskDeadline('');
    setIsAddTaskOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    Storage.saveGroupTasks(updated);
  };

  // Handlers for Shared Gear
  const handleToggleGearPacked = (gearId: string) => {
    const updated = gear.map((g) => {
      if (g.id === gearId) {
        const nextPacked = !g.packed;
        if (nextPacked) {
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
        }
        return { ...g, packed: nextPacked };
      }
      return g;
    });
    setGear(updated);
    Storage.saveSharedGear(updated);
  };

  const handleAddGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGearName.trim()) return;
    const item: SharedGearItem = {
      id: `sg-${Date.now()}`,
      name: newGearName.trim(),
      category: newGearCategory,
      responsibleMemberId: newGearAssignee || members[0]?.id || 'm-1',
      packed: false,
      notes: newGearNotes.trim() || undefined,
    };
    const updated = [item, ...gear];
    setGear(updated);
    Storage.saveSharedGear(updated);
    setNewGearName('');
    setNewGearNotes('');
    setIsAddGearOpen(false);
  };

  const handleDeleteGear = (id: string) => {
    const updated = gear.filter((g) => g.id !== id);
    setGear(updated);
    Storage.saveSharedGear(updated);
  };

  // Handlers for Group Bills
  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(newBillAmount.replace(/\D/g, ''), 10);
    if (!newBillTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;
    if (newBillSplitWith.length === 0) {
      alert('Vui lòng chọn ít nhất 1 người chia tiền!');
      return;
    }

    const bill: GroupBill = {
      id: `gb-${Date.now()}`,
      title: newBillTitle.trim(),
      category: newBillCategory,
      totalAmount: amountNum,
      paidById: newBillPaidBy || members[0]?.id,
      splitWithIds: newBillSplitWith,
      date: new Date().toISOString().split('T')[0],
      notes: newBillNotes.trim() || undefined,
    };
    const updated = [bill, ...bills];
    setBills(updated);
    Storage.saveGroupBills(updated);
    setNewBillTitle('');
    setNewBillAmount('');
    setNewBillNotes('');
    setIsAddBillOpen(false);
  };

  const handleDeleteBill = (id: string) => {
    const updated = bills.filter((b) => b.id !== id);
    setBills(updated);
    Storage.saveGroupBills(updated);
  };

  // Calculate Debt Settlement algorithm
  const calculateSettlements = (): {
    balances: Record<string, { paid: number; share: number; net: number }>;
    transfers: SettlementTransfer[];
    totalSpent: number;
  } => {
    const balances: Record<string, { paid: number; share: number; net: number }> = {};

    members.forEach((m) => {
      balances[m.id] = { paid: 0, share: 0, net: 0 };
    });

    let totalSpent = 0;

    bills.forEach((b) => {
      totalSpent += b.totalAmount;
      if (!balances[b.paidById]) {
        balances[b.paidById] = { paid: 0, share: 0, net: 0 };
      }
      balances[b.paidById].paid += b.totalAmount;

      const splitCount = b.splitWithIds.length;
      if (splitCount > 0) {
        const perPerson = b.totalAmount / splitCount;
        b.splitWithIds.forEach((mId) => {
          if (!balances[mId]) {
            balances[mId] = { paid: 0, share: 0, net: 0 };
          }
          balances[mId].share += perPerson;
        });
      }
    });

    // Net balance = paid - share
    Object.keys(balances).forEach((mId) => {
      balances[mId].net = Math.round(balances[mId].paid - balances[mId].share);
    });

    // Simplify debts using greedy balancing
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, bal]) => {
      if (bal.net < -500) {
        debtors.push({ id, amount: -bal.net });
      } else if (bal.net > 500) {
        creditors.push({ id, amount: bal.net });
      }
    });

    const transfers: SettlementTransfer[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      if (settleAmount > 0) {
        const debtorName = members.find((m) => m.id === debtor.id)?.name || 'Thành viên';
        const creditorName = members.find((m) => m.id === creditor.id)?.name || 'Thành viên';

        transfers.push({
          fromMemberId: debtor.id,
          fromName: debtorName,
          toMemberId: creditor.id,
          toName: creditorName,
          amount: Math.round(settleAmount),
        });

        debtor.amount -= settleAmount;
        creditor.amount -= settleAmount;
      }

      if (debtor.amount <= 500) dIdx++;
      if (creditor.amount <= 500) cIdx++;
    }

    return { balances, transfers, totalSpent };
  };

  const { balances, transfers, totalSpent } = calculateSettlements();

  const handleCopySettlement = () => {
    let summary = `🧾 BẢNG QUYẾT TOÁN TIỀN CHUYẾN ĐI (${members.map((m) => m.name).join(', ')})\n`;
    summary += `💰 Tổng chi tiêu: ${formatVND(totalSpent)}\n\n`;
    summary += `📊 Chi tiết đóng góp:\n`;
    members.forEach((m) => {
      const b = balances[m.id];
      if (b) {
        summary += `- ${m.name}: Đã trả ${formatVND(b.paid)} | Phần cần chịu ${formatVND(b.share)} | ${
          b.net >= 0 ? `Được nhận lại ${formatVND(b.net)}` : `Cần chuyển bù ${formatVND(-b.net)}`
        }\n`;
      }
    });

    summary += `\n🤝 CHUYỂN KHOẢN THANH TOÁN GỌN LẸ:\n`;
    if (transfers.length === 0) {
      summary += `Mọi người đã chi tiêu hoàn toàn bằng nhau! 🎉\n`;
    } else {
      transfers.forEach((t, i) => {
        summary += `${i + 1}. ${t.fromName} ➜ chuyển ${formatVND(t.amount)} cho ${t.toName}\n`;
      });
    }

    summary += `\nChúc chuyến đi của chúng mình thật trọn vẹn và an toàn! 💖`;

    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Helper getters
  const getMemberName = (id: string) => {
    if (id === 'all') return 'Cả nhóm';
    const m = members.find((item) => item.id === id);
    return m ? `${m.avatar} ${m.name}` : 'Chưa phân công';
  };

  // Filtered views
  const filteredTasks = tasks.filter((t) => {
    if (selectedMemberFilter === 'all') return true;
    return t.assigneeId === selectedMemberFilter || t.assigneeId === 'all';
  });

  const filteredGear = gear.filter((g) => {
    if (selectedMemberFilter === 'all') return true;
    return g.responsibleMemberId === selectedMemberFilter;
  });

  // Stats
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const packedGearCount = gear.filter((g) => g.packed).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF7ED] via-white to-[#F5CAD7]/30 border border-[#EADCCB]/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EADCCB] text-xs font-bold text-[#343C58] mb-2 shadow-xs">
              <Users className="w-3.5 h-3.5 text-rose-500" />
              <span>Đồng Hành Nhóm & Phân Công Nhiệm Vụ</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#343C58] tracking-tight">
              Phân công việc & Chia sẻ chuyến đi cùng Bạn 👥✨
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#343C58]/70 max-w-2xl">
              Không lo sót đồ dùng chung, không cãi nhau chuyện ai trả tiền, mọi người đều nắm rõ nhiệm vụ để chuyến đi của Em iu và các bạn luôn vui vẻ, nhàn tênh!
            </p>
          </div>

          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 border border-[#EADCCB] hover:border-rose-300 text-[#343C58] rounded-2xl text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4 text-rose-500" />
            <span>Thêm bạn đồng hành</span>
          </button>
        </div>

        {/* Member Avatars Grid (Không dùng dạng kéo) */}
        <div className="mt-6 pt-5 border-t border-[#EADCCB]/60 space-y-2">
          <span className="text-xs font-bold text-[#343C58]/70 block">
            Thành viên nhóm ({members.length} người):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white border border-[#EADCCB] shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{m.avatar}</span>
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold text-[#343C58] truncate leading-tight">{m.name}</div>
                    <div className="text-[10px] text-[#343C58]/60 truncate leading-none mt-0.5">{m.roleTitle}</div>
                  </div>
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="text-xs text-[#343C58]/30 hover:text-rose-500 p-1 shrink-0"
                    title="Xóa thành viên"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADCCB] pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'tasks'
                ? 'bg-[#343C58] text-white shadow-xs'
                : 'bg-white text-[#343C58]/70 hover:bg-[#FFF7ED] border border-[#EADCCB]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Phân công việc ({completedTasksCount}/{tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gear')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'gear'
                ? 'bg-[#343C58] text-white shadow-xs'
                : 'bg-white text-[#343C58]/70 hover:bg-[#FFF7ED] border border-[#EADCCB]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>2. Đồ dùng chung ({packedGearCount}/{gear.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bills')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === 'bills'
                ? 'bg-[#343C58] text-white shadow-xs'
                : 'bg-white text-[#343C58]/70 hover:bg-[#FFF7ED] border border-[#EADCCB]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Chia tiền & Quyết toán</span>
          </button>
        </div>

        {/* Member Filter Dropdown for Tasks/Gear */}
        {activeSubTab !== 'bills' && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#343C58]/60" />
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#EADCCB] rounded-xl text-xs font-bold text-[#343C58] focus:outline-none focus:ring-1 focus:ring-rose-300"
            >
              <option value="all">Xem tất cả thành viên</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  Chỉ xem: {m.avatar} {m.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: TASKS DELEGATION */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          {/* Quick template suggestions */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EADCCB] flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#343C58] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gợi ý việc cần chia:
            </span>
            {[
              { title: 'Đặt vé máy bay khứ hồi', cat: 'booking' as const },
              { title: 'Thuê 2 xe máy tay ga phanh đĩa tốt', cat: 'logistics' as const },
              { title: 'Đặt phòng homestay có ban công', cat: 'booking' as const },
              { title: 'Chuẩn bị túi thuốc y tế sơ cứu', cat: 'health' as const },
              { title: 'Lập quỹ tiền mặt chuyến đi', cat: 'booking' as const },
              { title: 'Tìm 5 quán ăn ngon nổi tiếng', cat: 'food' as const },
            ].map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNewTaskTitle(tmpl.title);
                  setNewTaskCategory(tmpl.cat);
                  setIsAddTaskOpen(true);
                }}
                className="px-2.5 py-1 bg-[#FFF7ED] hover:bg-rose-100/60 text-[#343C58] rounded-xl font-medium transition-colors border border-[#EADCCB]/60 text-[11px]"
              >
                + {tmpl.title}
              </button>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#343C58]/70">
              Hiển thị <span className="font-bold text-[#343C58]">{filteredTasks.length}</span> việc{' '}
              {selectedMemberFilter !== 'all' && (
                <span>của {getMemberName(selectedMemberFilter)}</span>
              )}
            </div>

            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Giao việc mới</span>
            </button>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full p-8 bg-white rounded-3xl border border-[#EADCCB] text-center text-xs text-[#343C58]/60">
                Chưa có nhiệm vụ nào cho mục này. Bấm "Giao việc mới" để thêm nhé!
              </div>
            ) : (
              filteredTasks.map((t) => {
                const isDone = t.status === 'done';
                const isInProgress = t.status === 'in_progress';

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                      isDone
                        ? 'bg-[#F0FDF4] border-emerald-200 opacity-80'
                        : isInProgress
                        ? 'bg-[#FFFBEB] border-amber-200 shadow-2xs'
                        : 'bg-white border-[#EADCCB] shadow-2xs hover:border-rose-300'
                    }`}
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            t.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : t.priority === 'normal'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {t.priority === 'urgent'
                            ? 'Ưu tiên gấp'
                            : t.priority === 'normal'
                            ? 'Bình thường'
                            : 'Làm nếu kịp'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleTaskStatus(t.id)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : isInProgress
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {isDone
                              ? '✓ Đã xong'
                              : isInProgress
                              ? '⏳ Đang làm'
                              : '○ Chưa làm'}
                          </button>

                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="text-[#343C58]/30 hover:text-rose-500 p-1 text-xs"
                            title="Xóa việc"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-sm font-bold text-[#343C58] ${
                          isDone ? 'line-through text-[#343C58]/60' : ''
                        }`}
                      >
                        {t.title}
                      </h3>

                      {t.notes && (
                        <p className="mt-1 text-xs text-[#343C58]/70 line-clamp-2">
                          {t.notes}
                        </p>
                      )}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="mt-4 pt-3 border-t border-[#EADCCB]/50 flex items-center justify-between text-[11px] text-[#343C58]/70">
                      <div className="flex items-center gap-1 font-semibold text-[#343C58]">
                        <span>Người phụ trách:</span>
                        <span className="text-rose-600 font-bold">{getMemberName(t.assigneeId)}</span>
                      </div>

                      {t.deadline && (
                        <div className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Hạn: {t.deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SHARED GEAR */}
      {activeSubTab === 'gear' && (
        <div className="space-y-4">
          {/* Awareness Banner */}
          <div className="p-4 rounded-3xl bg-[#FFF7ED] border border-[#EADCCB] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎒</span>
              <div>
                <h3 className="text-xs font-bold text-[#343C58]">
                  Nguyên tắc: Mỗi người 1 món - Không mang trùng lặp
                </h3>
                <p className="text-[11px] text-[#343C58]/70">
                  Phân công rõ ai chịu trách nhiệm mang vật dụng chung (loa, bàn là, sấy tóc, túi thuốc) để vali của cả nhóm luôn nhẹ tênh!
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-extrabold text-emerald-600">
                {Math.round((packedGearCount / (gear.length || 1)) * 100)}%
              </div>
              <div className="text-[10px] text-[#343C58]/60">Đã chuẩn bị</div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#343C58]/70">
              Có <span className="font-bold text-[#343C58]">{filteredGear.length}</span> món đồ dùng chung
            </div>

            <button
              onClick={() => setIsAddGearOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm đồ dùng chung</span>
            </button>
          </div>

          {/* Gear List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGear.map((g) => (
              <div
                key={g.id}
                onClick={() => handleToggleGearPacked(g.id)}
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  g.packed
                    ? 'bg-[#F0FDF4] border-emerald-200'
                    : 'bg-white border-[#EADCCB] hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      g.packed
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-[#EADCCB] bg-white'
                    }`}
                  >
                    {g.packed ? '✓' : ''}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold text-[#343C58] truncate ${
                        g.packed ? 'line-through text-[#343C58]/60' : ''
                      }`}
                    >
                      {g.name}
                    </div>
                    <div className="text-[11px] text-[#343C58]/60 flex items-center gap-1 mt-0.5">
                      <span>Người mang:</span>
                      <span className="font-bold text-emerald-700">
                        {getMemberName(g.responsibleMemberId)}
                      </span>
                    </div>
                    {g.notes && (
                      <div className="text-[10px] text-amber-700 italic mt-0.5 truncate">
                        {g.notes}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGear(g.id);
                  }}
                  className="text-[#343C58]/30 hover:text-rose-500 p-1 text-xs shrink-0"
                  title="Xóa món"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BILL SPLITTER & SETTLEMENT */}
      {activeSubTab === 'bills' && (
        <div className="space-y-6">
          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#EADCCB] shadow-2xs">
              <span className="text-xs text-[#343C58]/70 block font-medium">Tổng chi cả chuyến:</span>
              <span className="text-xl sm:text-2xl font-black text-[#343C58] mt-1 block">
                {formatVND(totalSpent)}
              </span>
              <span className="text-[10px] text-[#343C58]/50 mt-1 block">
                {bills.length} khoản chi đã ghi lại
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EADCCB] shadow-2xs">
              <span className="text-xs text-[#343C58]/70 block font-medium">Trung bình mỗi người:</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 mt-1 block">
                {formatVND(totalSpent / (members.length || 1))}
              </span>
              <span className="text-[10px] text-[#343C58]/50 mt-1 block">
                Chia đều {members.length} người
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#F0FDF4] to-white border border-emerald-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold block">
                  Cân bằng nợ tự động 💡
                </span>
                <span className="text-xs text-emerald-700/80 mt-1 block">
                  {transfers.length === 0
                    ? 'Không có nợ tồn đọng!'
                    : `Chỉ cần ${transfers.length} giao dịch là xong`}
                </span>
              </div>

              <button
                onClick={handleCopySettlement}
                className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép vào bộ nhớ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép gửi Zalo/Mess</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transfers / Who owes whom */}
          <div className="p-5 rounded-3xl bg-white border border-[#EADCCB] shadow-2xs">
            <h3 className="text-sm font-bold text-[#343C58] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🤝 Hướng dẫn thanh toán nợ tối ưu (Campuchia Bill)</span>
            </h3>

            {transfers.length === 0 ? (
              <div className="text-xs text-emerald-700 p-4 bg-emerald-50 rounded-2xl text-center font-medium">
                Tuyệt vời! Hiện tại mọi người đã đóng góp cân bằng nhau, không ai nợ ai. 🎉
              </div>
            ) : (
              <div className="space-y-2">
                {transfers.map((tr, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB]/80 text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 font-bold text-[#343C58]">
                      <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700">
                        {tr.fromName}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#343C58]/40" />
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700">
                        {tr.toName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-[11px] text-[#343C58]/60">Cần chuyển:</span>
                      <span className="text-sm font-black text-rose-600">
                        {formatVND(tr.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Balance Breakdown */}
          <div className="p-5 rounded-3xl bg-white border border-[#EADCCB] shadow-2xs">
            <h3 className="text-sm font-bold text-[#343C58] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <span>📊 Tình hình ví tiền từng thành viên</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EADCCB] text-[#343C58]/60">
                    <th className="pb-2 font-bold">Thành viên</th>
                    <th className="pb-2 font-bold">Đã chi trả</th>
                    <th className="pb-2 font-bold">Phần cần chịu</th>
                    <th className="pb-2 font-bold text-right">Trạng thái ròng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADCCB]/40">
                  {members.map((m) => {
                    const b = balances[m.id] || { paid: 0, share: 0, net: 0 };
                    return (
                      <tr key={m.id} className="py-2.5">
                        <td className="py-2.5 font-bold text-[#343C58] flex items-center gap-1.5">
                          <span>{m.avatar}</span>
                          <span>{m.name}</span>
                        </td>
                        <td className="py-2.5 text-[#343C58] font-semibold">
                          {formatVND(b.paid)}
                        </td>
                        <td className="py-2.5 text-[#343C58]/70">{formatVND(b.share)}</td>
                        <td className="py-2.5 text-right font-black">
                          {b.net > 500 ? (
                            <span className="text-emerald-600">+{formatVND(b.net)} (Nhận)</span>
                          ) : b.net < -500 ? (
                            <span className="text-rose-600">-{formatVND(-b.net)} (Trả)</span>
                          ) : (
                            <span className="text-gray-500">Đã cân bằng</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bills History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#343C58] uppercase tracking-wider">
                Lịch sử các hóa đơn chi tiêu ({bills.length})
              </h3>

              <button
                onClick={() => setIsAddBillOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm hóa đơn mới</span>
              </button>
            </div>

            <div className="space-y-2">
              {bills.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#EADCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#343C58]">{b.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#343C58]/70 border border-[#EADCCB]/60">
                        {b.category === 'food'
                          ? 'Ăn uống'
                          : b.category === 'transport'
                          ? 'Đi lại'
                          : b.category === 'hotel'
                          ? 'Khách sạn'
                          : 'Khác'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#343C58]/60 mt-1 flex items-center gap-2">
                      <span>Người thanh toán: <strong>{getMemberName(b.paidById)}</strong></span>
                      <span>·</span>
                      <span>Chia cho: {b.splitWithIds.length} người</span>
                      {b.notes && (
                        <>
                          <span>·</span>
                          <span className="italic">{b.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm font-black text-[#343C58]">
                      {formatVND(b.totalAmount)}
                    </span>

                    <button
                      onClick={() => handleDeleteBill(b.id)}
                      className="text-[#343C58]/30 hover:text-rose-500 p-1"
                      title="Xóa hóa đơn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD MEMBER */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EADCCB] shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#343C58]">Thêm bạn đồng hành 👥</h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Tên hoặc biệt danh *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Em iu, Nam, Bé Na..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Biểu tượng Avatar</label>
                <div className="flex gap-2">
                  {['🌷', '🛵', '📸', '👑', '🌟', '👒', '☕', '🕶️'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewMemberAvatar(em)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border ${
                        newMemberAvatar === em
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-[#EADCCB] bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Vai trò trong chuyến đi</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thủ quỹ, Chụp ảnh, Lái xe..."
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Số điện thoại liên lạc</label>
                <input
                  type="tel"
                  placeholder="09xx xxx xxx"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-xs"
                >
                  Lưu thành viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TASK */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EADCCB] shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#343C58]">Giao việc mới cho chuyến đi 📋</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Nhiệm vụ cần làm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đặt vé máy bay khứ hồi, Thuê xe máy..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Giao cho ai</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                  >
                    <option value="all">👥 Cả nhóm cùng làm</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Mức độ ưu tiên</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                  >
                    <option value="urgent">🔴 Ưu tiên gấp</option>
                    <option value="normal">🔵 Bình thường</option>
                    <option value="nice_to_have">⚪ Nếu kịp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Nhóm công việc</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                  >
                    <option value="booking">Đặt chỗ (vé, phòng)</option>
                    <option value="logistics">Di chuyển & Xe</option>
                    <option value="health">Sức khỏe & Y tế</option>
                    <option value="food">Ăn uống & Quán xá</option>
                    <option value="gear">Hành lý & Thiết bị</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Hạn hoàn thành</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  placeholder="Lưu ý về giờ giấc, yêu cầu cụ thể..."
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-xs"
                >
                  Lưu nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD GEAR */}
      {isAddGearOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EADCCB] shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#343C58]">Thêm đồ dùng chung 🎒</h3>
              <button
                onClick={() => setIsAddGearOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGear} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Tên món đồ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Loa Bluetooth, Máy sấy tóc..."
                  value={newGearName}
                  onChange={(e) => setNewGearName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Ai chịu trách nhiệm mang?</label>
                <select
                  value={newGearAssignee}
                  onChange={(e) => setNewGearAssignee(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Ghi chú</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Để trong túi xách ngoài, sạc đầy trước..."
                  value={newGearNotes}
                  onChange={(e) => setNewGearNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGearOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-xs"
                >
                  Lưu món đồ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD BILL */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EADCCB] shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#343C58]">Ghi nhận chi tiêu nhóm 💵</h3>
              <button
                onClick={() => setIsAddBillOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#343C58] mb-1">Nội dung chi *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bữa tối lẩu gà lá é, Tiền phòng..."
                  value={newBillTitle}
                  onChange={(e) => setNewBillTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Số tiền (VND) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    placeholder="480000"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#343C58] mb-1">Ai là người trả trước?</label>
                  <select
                    value={newBillPaidBy}
                    onChange={(e) => setNewBillPaidBy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Chia khoản này cho ai?</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {members.map((m) => {
                    const isChecked = newBillSplitWith.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            if (newBillSplitWith.length > 1) {
                              setNewBillSplitWith(newBillSplitWith.filter((id) => id !== m.id));
                            }
                          } else {
                            setNewBillSplitWith([...newBillSplitWith, m.id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-rose-50 border-rose-400 text-rose-700'
                            : 'bg-gray-50 border-[#EADCCB] text-gray-500'
                        }`}
                      >
                        <span>{isChecked ? '✓' : '○'}</span>
                        <span>{m.avatar} {m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#343C58] mb-1">Ghi chú</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bao gồm cả đồ uống, hóa đơn quán..."
                  value={newBillNotes}
                  onChange={(e) => setNewBillNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EADCCB] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-xs"
                >
                  Lưu hóa đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
