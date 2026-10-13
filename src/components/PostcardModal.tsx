import React, { useEffect } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostcardModalProps {
  onClose: () => void;
}

export const PostcardModal: React.FC<PostcardModalProps> = ({ onClose }) => {
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-[#FFF9F5] rounded-3xl max-w-2xl w-full border-4 border-[#F5CAD7] shadow-2xl p-6 sm:p-10 my-auto overflow-hidden">
        {/* Postal Stamp & Postmark Deco */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          {/* Postmark stamp */}
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-300 flex flex-col items-center justify-center text-[9px] font-bold text-rose-400 rotate-12 select-none">
            <span>ANH THÀNH</span>
            <span>★ FOR CHI ★</span>
            <span>VIETNAM</span>
          </div>

          {/* Postal stamp */}
          <div className="w-14 h-16 bg-[#F5CAD7] border-2 border-white rounded-md shadow-xs flex flex-col items-center justify-center p-1 select-none">
            <span className="text-xl">🌷</span>
            <span className="text-[8px] font-black text-[#343C58] tracking-widest uppercase mt-1">
              POST 2026
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center transition-colors text-slate-700 ml-2"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Postcard Header */}
        <div className="pr-36 mb-6">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">
            Thư gửi từ trái tim 💌
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#343C58] mt-1">
            Gửi Em iu thương của anh, 🌷
          </h2>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-xs sm:text-sm text-[#343C58]/90 font-medium leading-relaxed font-serif">
          <p>
            Thế giới ngoài kia có rất nhiều nơi đẹp để khám phá, nhiều món ngon để thưởng thức và nhiều kỷ niệm đang chờ Em iu.
          </p>

          <p>
            Anh mong mỗi chuyến đi của Em iu đều có những khoảnh khắc thật vui, những người đồng hành tử tế và những hành trình khiến Em iu thấy cuộc sống rộng lớn, đáng yêu hơn một chút.
          </p>

          <p>
            Nhớ chuẩn bị kỹ, quan sát tình hình thực tế, giữ liên lạc với người Em iu tin tưởng và đừng ngại thay đổi kế hoạch khi cần nha.
          </p>

          <p className="bg-[#FFF7ED] p-3.5 rounded-2xl border border-[#EADCCB]/70 italic">
            “Em iu không cần phải cố đi hết mọi nơi hay làm mọi thứ thật hoàn hảo. Chuyến đi vui nhất là chuyến đi phù hợp với Em iu, nơi Em iu có thể tự tin khám phá và trở về bình an.”
          </p>

          <p className="font-bold text-[#343C58] text-sm sm:text-base">
            Chúc Em iu có thật nhiều chuyến đi đẹp, an toàn và đáng nhớ! 🧳🌷💗
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 pt-4 border-t border-[#EADCCB]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[#343C58]">
              — Anh Thành
            </div>
            <div className="text-[11px] text-[#343C58]/60 italic">
              Người luôn cổ vũ Em iu khám phá thế giới theo cách riêng của mình.
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#343C58] text-white font-bold hover:bg-[#222736] transition-all shadow-sm self-start sm:self-auto"
          >
            Em cảm ơn Anh Thành 💗
          </button>
        </div>

        {/* Slogan Footer */}
        <div className="mt-6 pt-3 text-center border-t border-dashed border-[#EADCCB]/60 text-[11px] text-[#343C58]/60">
          <strong>“Khám phá thật nhiều. Chuẩn bị thật kỹ. Trở về bình an. 🌏💗”</strong>
          <span className="block mt-0.5">
            Cẩm nang du lịch an toàn cùng bạn — Made with care by Anh Thành.
          </span>
        </div>
      </div>
    </div>
  );
};
