import React, { useState } from 'react';
import {
  Bot,
  Compass,
  Heart,
  Loader2,
  Send,
  Sparkles,
  User,
  Coffee,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Trip } from '../types/travel';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface AITravelAssistantProps {
  trip: Trip | null;
}

export const AITravelAssistant: React.FC<AITravelAssistantProps> = ({ trip }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Chào Em iu của Anh Thành! 🌷✨

Em là Trợ Lý Du Lịch Thông Minh đây ạ. Em có thể giúp Em iu:
- Lên kế hoạch lịch trình chi tiết (Ba Vì, Đà Lạt, Hội An, Phú Quốc...)
- Gợi ý hành lý cần chuẩn bị theo mùa
- Tư vấn phương án B khi thời tiết mưa hoặc mệt mỏi
- Kiểm tra dấu hiệu lừa đảo cọc phòng trước khi chuyển tiền
- Cân đối ngân sách chi tiêu hợp lý

Em iu muốn em hỗ trợ điều gì cho chuyến đi sắp tới nè? 🧳💗`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Lập lịch trình Ba Vì trong 1 ngày',
    'Chuẩn bị đồ cho chuyến đi biển 2 ngày 1 đêm',
    'Kiểm tra những điều cần xác minh trước khi cọc phòng',
    'Nếu trời mưa bất chợt thì nên điều chỉnh lịch trình thế nào?',
    'Lập kế hoạch du lịch một mình an toàn cho nữ',
    'Tạo checklist leo núi Sa Pa cho người mới',
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: trip
            ? `Chuyến đi hiện tại: ${trip.name}, từ ${trip.origin} đến ${trip.destination}, phong cách ${trip.style}, số người: ${trip.peopleCount}`
            : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch from assistant');
      const data = await response.json();

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.text || 'Em iu ơi, trợ lý tạm thời gián đoạn một xíu, Em iu thử lại nhé! 🌷',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error fetching assistant response:', err);
      const fallbackMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Em iu ơi, nếu có thắc mắc gấp về địa điểm hay sự cố, Em iu có thể xem phần "Trung tâm an toàn" hoặc bấm nút "Cần trợ giúp 🚨" trong app nhé! Anh Thành và ứng dụng luôn đồng hành cùng Em iu! 🌷💗`,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <Bot className="w-4 h-4 text-rose-500" />
            <span>TRỢ LÝ DU LỊCH THÔNG MINH CHO EM IU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Bạn đồng hành chu đáo & Tinh tế 🤖🌷
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Gợi ý hành trình, chia ngân sách, phương án dự phòng ngày mưa và mẹo du lịch an toàn.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] text-xs font-bold text-[#343C58] flex items-center gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Sẵn sàng hỗ trợ 24/7</span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#343C58]/70 uppercase tracking-wider block">
          Câu hỏi gợi ý nhanh cho Em iu:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-3.5 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#343C58] border border-[#EADCCB] hover:border-[#F5CAD7] hover:bg-[#FFF7ED] transition-all whitespace-nowrap shadow-2xs"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-[#EADCCB] shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-[#343C58] text-white'
                      : 'bg-[#F5CAD7] text-[#343C58]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : '🌷'}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-[#343C58] text-white rounded-tr-xs'
                      : 'bg-[#FFF7ED] text-[#343C58] border border-[#EADCCB]/80 rounded-tl-xs'
                  }`}
                >
                  {m.text}
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isUser ? 'text-slate-300 text-right' : 'text-[#343C58]/50'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#F5CAD7] flex items-center justify-center text-sm shrink-0">
                🌷
              </div>
              <div className="p-4 rounded-3xl bg-[#FFF7ED] text-xs text-[#343C58]/70 border border-[#EADCCB] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>Trợ lý đang suy nghĩ và chuẩn bị câu trả lời chu đáo nhất cho Em iu...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 sm:p-4 border-t border-[#EADCCB] bg-[#FFF9F5] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Hỏi trợ lý về địa điểm, đồ cần mang, kiểm tra homestay..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#EADCCB] text-xs sm:text-sm text-[#343C58] focus:outline-none focus:ring-2 focus:ring-[#F5CAD7]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[#343C58] text-white flex items-center justify-center hover:bg-[#252a3b] transition-all disabled:opacity-40 disabled:hover:bg-[#343C58] shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
