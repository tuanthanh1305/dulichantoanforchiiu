import { DEFAULT_PACKING_ITEMS, PRESET_TRIPS, SAMPLE_TRIP } from '../data/travelData';
import {
  BudgetItem,
  EmergencyProfile,
  GroupBill,
  GroupMember,
  GroupTask,
  JournalEntry,
  PackingItem,
  SharedGearItem,
  Trip,
} from '../types/travel';

const KEYS = {
  TRIPS: 'chi_trips_v1',
  ACTIVE_TRIP_ID: 'chi_active_trip_id_v1',
  PACKING_LIST: 'chi_packing_list_v1',
  BUDGET_ITEMS: 'chi_budget_items_v1',
  EMERGENCY_PROFILE: 'chi_emergency_profile_v1',
  JOURNAL_ENTRIES: 'chi_journal_entries_v1',
  CHECKLIST_PROGRESS: 'chi_checklist_progress_v1',
  COMPLETED_SCAMS: 'chi_completed_scams_v1',
  SOLO_CHECKIN_TIME: 'chi_solo_checkin_time_v1',
  GROUP_MEMBERS: 'travel_group_members_v1',
  GROUP_TASKS: 'travel_group_tasks_v1',
  SHARED_GEAR: 'travel_shared_gear_v1',
  GROUP_BILLS: 'travel_group_bills_v1',
  BINGO_CARD: 'travel_bingo_card_v1',
};


function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const Storage = {
  getTrips(): Trip[] {
    const trips = safeGet<Trip[]>(KEYS.TRIPS, PRESET_TRIPS);
    return trips;
  },
  saveTrips(trips: Trip[]) {
    safeSet(KEYS.TRIPS, trips);
  },
  getActiveTrip(): Trip | null {
    const trips = this.getTrips();
    const activeId = safeGet<string>(KEYS.ACTIVE_TRIP_ID, SAMPLE_TRIP.id);
    const found = trips.find((t) => t.id === activeId);
    return found || trips[0] || null;
  },
  setActiveTripId(id: string) {
    safeSet(KEYS.ACTIVE_TRIP_ID, id);
  },
  saveTrip(trip: Trip) {
    const trips = this.getTrips();
    const idx = trips.findIndex((t) => t.id === trip.id);
    if (idx >= 0) {
      trips[idx] = trip;
    } else {
      trips.unshift(trip);
    }
    this.saveTrips(trips);
    this.setActiveTripId(trip.id);
  },
  deleteTrip(tripId: string) {
    const trips = this.getTrips().filter((t) => t.id !== tripId);
    this.saveTrips(trips);
    if (trips.length > 0) {
      this.setActiveTripId(trips[0].id);
    }
  },

  getPackingList(): PackingItem[] {
    return safeGet<PackingItem[]>(KEYS.PACKING_LIST, DEFAULT_PACKING_ITEMS);
  },
  savePackingList(items: PackingItem[]) {
    safeSet(KEYS.PACKING_LIST, items);
  },

  getBudgetItems(): BudgetItem[] {
    const defaultBudget: BudgetItem[] = [
      { id: 'b-1', category: 'transport', title: 'Vé máy bay khứ hồi', estimatedCost: 2400000, actualCost: 2350000 },
      { id: 'b-2', category: 'hotel', title: 'Homestay 2 đêm view đồi', estimatedCost: 1500000, actualCost: 1500000 },
      { id: 'b-3', category: 'rental', title: 'Thuê xe máy 2 ngày + xăng', estimatedCost: 350000, actualCost: 330000 },
      { id: 'b-4', category: 'food', title: 'Ăn uống đặc sản & cà phê', estimatedCost: 1200000, actualCost: 950000 },
      { id: 'b-5', category: 'tickets', title: 'Vé tham quan & check-in', estimatedCost: 300000, actualCost: 200000 },
      { id: 'b-6', category: 'emergency', title: 'Quỹ dự phòng khẩn cấp', estimatedCost: 1000000, actualCost: 0, notes: 'Không đụng đến trừ trường hợp phát sinh' },
    ];
    return safeGet<BudgetItem[]>(KEYS.BUDGET_ITEMS, defaultBudget);
  },
  saveBudgetItems(items: BudgetItem[]) {
    safeSet(KEYS.BUDGET_ITEMS, items);
  },

  getEmergencyProfile(): EmergencyProfile {
    const defaultProfile: EmergencyProfile = {
      fullName: 'Em iu',
      bloodType: 'O',
      allergies: 'Không dị ứng thuốc',
      trustedContactName: 'Anh Thành',
      trustedContactPhone: '0988776655',
      accommodationAddress: 'Bavi An Vui Lodge (Ba Vì) / 90s Homestay (Tam Đảo)',
      hotelPhone: '0989123456',
      notes: 'Có mang theo áo ấm, thuốc dị ứng, dầu gió và sạc dự phòng trong túi xách.',
    };
    return safeGet<EmergencyProfile>(KEYS.EMERGENCY_PROFILE, defaultProfile);
  },
  saveEmergencyProfile(profile: EmergencyProfile) {
    safeSet(KEYS.EMERGENCY_PROFILE, profile);
  },

  getJournalEntries(): JournalEntry[] {
    const defaultEntries: JournalEntry[] = [
      {
        id: 'j-1',
        date: '2026-11-20',
        title: 'Hoàng hôn trong lành giữa rừng thông Ba Vì 🌲☕🌅',
        places: 'Vườn Quốc Gia Ba Vì, Nhà thờ đổ rêu phong',
        food: 'Gà đồi nướng lu, Sữa chua nếp cẩm Ba Vì',
        favoriteMoment: 'Ngắm ánh hoàng hôn buông xuống thung lũng thông reo, gió se lạnh và ly cacao ấm thơm lừng bên Em iu.',
        actualCost: 280000,
        nextTimeWish: 'Lần sau sẽ lên Tam Đảo săn mây và ăn ngọn su su xào tỏi giòn ngọt!',
        mood: 'happy',
        sticker: '🌷',
      },
    ];
    return safeGet<JournalEntry[]>(KEYS.JOURNAL_ENTRIES, defaultEntries);
  },
  saveJournalEntries(entries: JournalEntry[]) {
    safeSet(KEYS.JOURNAL_ENTRIES, entries);
  },

  getCompletedScams(): string[] {
    return safeGet<string[]>(KEYS.COMPLETED_SCAMS, []);
  },
  markScamCompleted(scamId: string) {
    const completed = this.getCompletedScams();
    if (!completed.includes(scamId)) {
      completed.push(scamId);
      safeSet(KEYS.COMPLETED_SCAMS, completed);
    }
  },

  // Group Coordination Data
  getGroupMembers(): GroupMember[] {
    const defaultMembers: GroupMember[] = [
      { id: 'm-1', name: 'Em iu', avatar: '🌷', roleTitle: 'Nàng thơ & Thưởng thức cảnh đẹp', phone: '0912345678' },
      { id: 'm-2', name: 'Anh Thành', avatar: '🛵', roleTitle: 'Trưởng đoàn & Lái xe an toàn', phone: '0988776655' },
      { id: 'm-3', name: 'Bạn thân', avatar: '📸', roleTitle: 'Phó nháy & Thủ quỹ cẩn thận', phone: '0901234567' },
    ];
    return safeGet<GroupMember[]>(KEYS.GROUP_MEMBERS, defaultMembers);
  },
  saveGroupMembers(members: GroupMember[]) {
    safeSet(KEYS.GROUP_MEMBERS, members);
  },

  getGroupTasks(): GroupTask[] {
    const defaultTasks: GroupTask[] = [
      {
        id: 'gt-1',
        title: 'Đặt vé máy bay khứ hồi & check-in online',
        category: 'booking',
        assigneeId: 'm-2',
        deadline: '2026-11-18',
        status: 'done',
        priority: 'urgent',
        notes: 'Giờ bay 07:15 sáng, chuẩn bị CCCD trước.',
      },
      {
        id: 'gt-2',
        title: 'Đặt homestay view đồi thung lũng & cọc phòng',
        category: 'booking',
        assigneeId: 'm-1',
        deadline: '2026-11-19',
        status: 'done',
        priority: 'urgent',
        notes: 'Phòng tầng 2 có ban công ngắm mây.',
      },
      {
        id: 'gt-3',
        title: 'Chuẩn bị túi thuốc y tế gia đình, kem chống nắng, xịt côn trùng',
        category: 'health',
        assigneeId: 'm-1',
        deadline: '2026-11-19',
        status: 'in_progress',
        priority: 'normal',
        notes: 'Mang thêm thuốc say xe và vitamin C.',
      },
      {
        id: 'gt-4',
        title: 'Thuê 2 xe máy tay ga phanh tốt, 2 nón bảo hiểm chuẩn chất lượng',
        category: 'logistics',
        assigneeId: 'm-2',
        deadline: '2026-11-20',
        status: 'todo',
        priority: 'urgent',
        notes: 'Kiểm tra kỹ đèn xe, gương và lốp trước khi nhận.',
      },
      {
        id: 'gt-5',
        title: 'Lên danh sách 8 quán ăn ngon & quán cà phê hoàng hôn',
        category: 'food',
        assigneeId: 'm-3',
        deadline: '2026-11-20',
        status: 'in_progress',
        priority: 'normal',
        notes: 'Lẩu gà lá é, bánh căn Tăng Bạt Hổ, tiệm cà phê Túi Mơ To.',
      },
      {
        id: 'gt-6',
        title: 'Chuẩn bị máy ảnh, chân máy tripod, 2 sạc dự phòng 20.000mAh',
        category: 'gear',
        assigneeId: 'm-3',
        deadline: '2026-11-19',
        status: 'todo',
        priority: 'normal',
        notes: 'Sạc đầy pin từ tối hôm trước.',
      },
    ];
    return safeGet<GroupTask[]>(KEYS.GROUP_TASKS, defaultTasks);
  },
  saveGroupTasks(tasks: GroupTask[]) {
    safeSet(KEYS.GROUP_TASKS, tasks);
  },

  getSharedGear(): SharedGearItem[] {
    const defaultGear: SharedGearItem[] = [
      { id: 'sg-1', name: 'Ổ cắm nối dài 3 chấu & chia 4 cổng USB', category: 'electronics', responsibleMemberId: 'm-2', packed: true, notes: 'Để cắm sạc cho cả phòng' },
      { id: 'sg-2', name: 'Máy sấy tóc mini du lịch công suất lớn', category: 'hygiene', responsibleMemberId: 'm-1', packed: true, notes: 'Sấy tóc và sấy ấm đồ nhanh' },
      { id: 'sg-3', name: 'Loa Bluetooth chống nước cắm trại', category: 'entertainment', responsibleMemberId: 'm-2', packed: true, notes: 'Nghe nhạc chill buổi tối' },
      { id: 'sg-4', name: 'Chai kem chống nắng toàn thân SPF50+ cỡ lớn', category: 'hygiene', responsibleMemberId: 'm-1', packed: true, notes: 'Dùng chung cho cả nhóm' },
      { id: 'sg-5', name: 'Túi sơ cứu y tế (băng gạc, sát khuẩn, dầu gió, panadol)', category: 'emergency', responsibleMemberId: 'm-1', packed: true, notes: 'Để ngăn ngoài balo' },
      { id: 'sg-6', name: 'Gậy chụp ảnh selfie & chân Tripod Bluetooth', category: 'electronics', responsibleMemberId: 'm-3', packed: false, notes: 'Chụp ảnh tập thể' },
      { id: 'sg-7', name: 'Bàn là hơi nước gấp gọn du lịch', category: 'hygiene', responsibleMemberId: 'm-3', packed: false, notes: 'Ủi váy xinh cho Em iu' },
      { id: 'sg-8', name: 'Dù che mưa lớn & 3 áo mưa cánh dơi', category: 'emergency', responsibleMemberId: 'm-2', packed: true, notes: 'Phòng thời tiết mưa bất chợt' },
      { id: 'sg-9', name: 'Bộ bài Uno & bài Tây vui nhộn', category: 'entertainment', responsibleMemberId: 'm-3', packed: true, notes: 'Chơi tại homestay buổi tối' },
    ];
    return safeGet<SharedGearItem[]>(KEYS.SHARED_GEAR, defaultGear);
  },
  saveSharedGear(gear: SharedGearItem[]) {
    safeSet(KEYS.SHARED_GEAR, gear);
  },

  getGroupBills(): GroupBill[] {
    const defaultBills: GroupBill[] = [
      {
        id: 'gb-1',
        title: 'Vé máy bay khứ hồi (3 người)',
        category: 'transport',
        totalAmount: 6900000,
        paidById: 'm-2',
        splitWithIds: ['m-1', 'm-2', 'm-3'],
        date: '2026-11-15',
        notes: 'Chuyến bay Vietjet bao gồm 20kg ký gửi',
      },
      {
        id: 'gb-2',
        title: 'Cọc & tiền homestay 2 đêm',
        category: 'hotel',
        totalAmount: 1800000,
        paidById: 'm-1',
        splitWithIds: ['m-1', 'm-2', 'm-3'],
        date: '2026-11-18',
        notes: 'Homestay view thung lũng 3 giường',
      },
      {
        id: 'gb-3',
        title: 'Lẩu gà lá é Tao Ngộ + đồ uống',
        category: 'food',
        totalAmount: 480000,
        paidById: 'm-3',
        splitWithIds: ['m-1', 'm-2', 'm-3'],
        date: '2026-11-20',
        notes: 'Ăn no nê buổi tối đầu tiên',
      },
      {
        id: 'gb-4',
        title: 'Xăng xe máy 2 ngày',
        category: 'transport',
        totalAmount: 160000,
        paidById: 'm-2',
        splitWithIds: ['m-1', 'm-2', 'm-3'],
        date: '2026-11-21',
        notes: 'Đổ đầy 2 bình xăng',
      },
    ];
    return safeGet<GroupBill[]>(KEYS.GROUP_BILLS, defaultBills);
  },
  saveGroupBills(bills: GroupBill[]) {
    safeSet(KEYS.GROUP_BILLS, bills);
  },


  exportAllData(): string {
    const data = {
      trips: this.getTrips(),
      packing: this.getPackingList(),
      budget: this.getBudgetItems(),
      emergency: this.getEmergencyProfile(),
      journal: this.getJournalEntries(),
      scams: this.getCompletedScams(),
      groupMembers: this.getGroupMembers(),
      groupTasks: this.getGroupTasks(),
      sharedGear: this.getSharedGear(),
      groupBills: this.getGroupBills(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.trips) safeSet(KEYS.TRIPS, data.trips);
      if (data.packing) safeSet(KEYS.PACKING_LIST, data.packing);
      if (data.budget) safeSet(KEYS.BUDGET_ITEMS, data.budget);
      if (data.emergency) safeSet(KEYS.EMERGENCY_PROFILE, data.emergency);
      if (data.journal) safeSet(KEYS.JOURNAL_ENTRIES, data.journal);
      if (data.scams) safeSet(KEYS.COMPLETED_SCAMS, data.scams);
      if (data.groupMembers) safeSet(KEYS.GROUP_MEMBERS, data.groupMembers);
      if (data.groupTasks) safeSet(KEYS.GROUP_TASKS, data.groupTasks);
      if (data.sharedGear) safeSet(KEYS.SHARED_GEAR, data.sharedGear);
      if (data.groupBills) safeSet(KEYS.GROUP_BILLS, data.groupBills);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  clearAllData() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
