export type TravelStyle =
  | 'relax' // Nghỉ dưỡng
  | 'nature' // Du lịch thiên nhiên
  | 'culture' // Khám phá văn hóa
  | 'city' // Du lịch thành phố
  | 'beach' // Đi biển
  | 'trekking' // Leo núi & trekking
  | 'weekend' // Du lịch cuối tuần
  | 'budget' // Du lịch tiết kiệm
  | 'solo' // Đi một mình
  | 'friends'; // Cùng bạn bè

export type TravelMode = 'before' | 'during' | 'return';

export interface Activity {
  id: string;
  name: string;
  time: string; // e.g. "08:30"
  duration: string; // e.g. "2 tiếng"
  address: string;
  transport: string; // e.g. "Xe máy", "Taxi", "Đi bộ"
  cost: number; // VND
  preparation: string; // Điều cần chuẩn bị
  safetyNote: string; // Lưu ý an toàn
  backupPlan: string; // Phương án dự phòng (mưa, mệt, đóng cửa)
  completed: boolean;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  title: string;
  note?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  name: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  transport: string;
  style: TravelStyle;
  estimatedBudget: number;
  specialNotes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  itinerary: ItineraryDay[];
  accommodation?: AccommodationInfo;
  createdAt: string;
}

export interface AccommodationInfo {
  name: string;
  address: string;
  phone: string;
  bookingCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
  pricePerNight?: number;
  notes?: string;
  verifiedChecklist?: Record<string, boolean>;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'documents' | 'gadgets' | 'personal' | 'health' | 'extra';
  packed: boolean;
  essential: boolean;
}

export interface BudgetItem {
  id: string;
  category: 'transport' | 'hotel' | 'food' | 'tickets' | 'rental' | 'extra' | 'emergency';
  title: string;
  estimatedCost: number;
  actualCost: number;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  notes?: string;
}

export interface EmergencyProfile {
  fullName: string;
  bloodType?: string;
  allergies?: string;
  trustedContactName: string;
  trustedContactPhone: string;
  accommodationAddress: string;
  hotelPhone: string;
  notes?: string;
}

export interface ScamScenario {
  id: string;
  title: string;
  category: 'hotel' | 'transport' | 'shopping' | 'tech' | 'outdoor';
  description: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  keyTakeaway: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  tripId?: string;
  title: string;
  places: string;
  food: string;
  favoriteMoment: string;
  actualCost: number;
  nextTimeWish: string;
  mood: 'happy' | 'peaceful' | 'excited' | 'tired' | 'grateful';
  sticker?: string;
}

export interface SafetyTopic {
  id: string;
  category: 'personal' | 'solo' | 'friends' | 'transport' | 'trekking' | 'beach' | 'scam';
  title: string;
  summary: string;
  tips: string[];
  warningNotice?: string;
}

// Group Coordination Types (Công cụ đồng hành & phân công)
export interface GroupMember {
  id: string;
  name: string;
  avatar: string; // emoji icon e.g. "🌷", "🧑‍🚀", "👑"
  roleTitle?: string; // e.g. "Trưởng đoàn", "Thủ quỹ", "Phó nháy", "Em iu"
  phone?: string;
}

export interface GroupTask {
  id: string;
  title: string;
  category: 'booking' | 'gear' | 'itinerary' | 'logistics' | 'health' | 'food';
  assigneeId: string; // memberId or 'all'
  deadline?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'urgent' | 'normal' | 'nice_to_have';
  notes?: string;
}

export interface SharedGearItem {
  id: string;
  name: string;
  category: 'electronics' | 'hygiene' | 'emergency' | 'entertainment' | 'cooking';
  responsibleMemberId: string; // memberId
  packed: boolean;
  notes?: string;
}

export interface GroupBill {
  id: string;
  title: string;
  category: 'food' | 'transport' | 'hotel' | 'tickets' | 'shopping' | 'extra';
  totalAmount: number;
  paidById: string; // memberId
  splitWithIds: string[]; // memberIds participating
  date: string;
  notes?: string;
}

export interface SettlementTransfer {
  fromMemberId: string;
  fromName: string;
  toMemberId: string;
  toName: string;
  amount: number;
}

// Travel Games Types (Trò chơi cùng bạn)
export interface BingoCell {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
}

export interface TriviaQuestion {
  id: string;
  destination: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

