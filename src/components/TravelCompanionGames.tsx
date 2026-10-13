import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Sparkles,
  RotateCw,
  Dices,
  HelpCircle,
  Trophy,
  Heart,
  Laugh,
  CheckCircle2,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Shuffle,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BINGO_PROMPTS,
  MOST_LIKELY_QUESTIONS,
  TRAVEL_TRIVIA,
  TRUTH_OR_DARE_CARDS,
  TruthOrDareCard,
  WHEEL_PRESETS,
} from '../data/gamesData';
import { BingoCell } from '../types/travel';

export const TravelCompanionGames: React.FC = () => {
  const [activeGameTab, setActiveGameTab] = useState<'wheel' | 'tod' | 'mostlikely' | 'bingo' | 'trivia'>('wheel');

  // --- GAME 1: LUCKY WHEEL & DICE ---
  const [selectedPresetId, setSelectedPresetId] = useState<string>('food');
  const [wheelItems, setWheelItems] = useState<string[]>(WHEEL_PRESETS[0].items);
  const [customItemInput, setCustomItemInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinWinner, setSpinWinner] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Dice state
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [diceResult, setDiceResult] = useState<number>(1);

  // Canvas ref for wheel
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update wheel items on preset change
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = WHEEL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setWheelItems(found.items);
      setSpinWinner(null);
    }
  };

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const total = wheelItems.length;
    if (total === 0) return;

    const sliceAngle = (2 * Math.PI) / total;
    const colors = [
      '#F5CAD7',
      '#FFF0D4',
      '#CBE7F5',
      '#DDD2F4',
      '#D4EDDA',
      '#FCE8E6',
      '#FFE8CC',
      '#E8DAEF',
    ];

    ctx.clearRect(0, 0, width, height);

    wheelItems.forEach((item, i) => {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#343C58';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';

      const maxLen = 18;
      const displayTxt = item.length > maxLen ? item.slice(0, maxLen) + '...' : item;
      ctx.fillText(displayTxt, radius - 20, 4);
      ctx.restore();
    });

    // Center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#343C58';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFF9F5';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUAY', centerX, centerY + 3);
  }, [wheelItems]);

  const spinWheel = () => {
    if (isSpinning || wheelItems.length === 0) return;
    setIsSpinning(true);
    setSpinWinner(null);

    const fullSpins = 5 + Math.floor(Math.random() * 4);
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const sliceDeg = 360 / wheelItems.length;
    // Calculate rotation so that randomIndex lands at pointer (top: 270 deg or right: 0 deg)
    // Pointer is at the top (270 deg in canvas terms or top indicator)
    const targetDeg = fullSpins * 360 + (360 - (randomIndex * sliceDeg + sliceDeg / 2));

    const finalDeg = wheelRotation + targetDeg;
    setWheelRotation(finalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinWinner(wheelItems[randomIndex]);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 3800);
  };

  const rollDice = () => {
    if (isRollingDice) return;
    setIsRollingDice(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsRollingDice(false);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    }, 80);
  };

  const handleAddCustomWheelItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemInput.trim()) return;
    setWheelItems([...wheelItems, customItemInput.trim()]);
    setCustomItemInput('');
  };

  const handleRemoveWheelItem = (index: number) => {
    if (wheelItems.length <= 2) {
      alert('Vòng quay cần ít nhất 2 mục!');
      return;
    }
    setWheelItems(wheelItems.filter((_, i) => i !== index));
  };

  // --- GAME 2: TRUTH OR DARE ---
  const [todCategory, setTodCategory] = useState<'all' | 'couple' | 'friends' | 'adventure'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedDares, setCompletedDares] = useState<number>(0);

  const filteredCards = TRUTH_OR_DARE_CARDS.filter((c) => {
    if (todCategory === 'all') return true;
    return c.category === todCategory;
  });

  const currentCard: TruthOrDareCard = filteredCards[currentCardIndex % filteredCards.length] || TRUTH_OR_DARE_CARDS[0];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  const markCardComplete = () => {
    setCompletedDares((c) => c + 1);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    nextCard();
  };

  // --- GAME 3: MOST LIKELY TO ---
  const [mlIndex, setMlIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const currentMl = MOST_LIKELY_QUESTIONS[mlIndex % MOST_LIKELY_QUESTIONS.length];

  const startCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  }, [countdown]);

  // --- GAME 4: TRAVEL BINGO ---
  const [bingoCells, setBingoCells] = useState<BingoCell[]>(() => {
    return BINGO_PROMPTS.map((p) => ({ ...p, completed: false }));
  });
  const [hasWonBingo, setHasWonBingo] = useState(false);

  const toggleBingoCell = (id: string) => {
    const updated = bingoCells.map((c) => {
      if (c.id === id) {
        return { ...c, completed: !c.completed };
      }
      return c;
    });
    setBingoCells(updated);

    // Check if won bingo (4x4)
    // Row checks
    let won = false;
    for (let r = 0; r < 4; r++) {
      if (updated.slice(r * 4, r * 4 + 4).every((c) => c.completed)) won = true;
    }
    // Column checks
    for (let c = 0; c < 4; c++) {
      if ([0, 1, 2, 3].every((r) => updated[r * 4 + c].completed)) won = true;
    }
    // Diagonal checks
    if ([0, 5, 10, 15].every((i) => updated[i].completed)) won = true;
    if ([3, 6, 9, 12].every((i) => updated[i].completed)) won = true;

    if (won && !hasWonBingo) {
      setHasWonBingo(true);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }
  };

  const resetBingo = () => {
    setBingoCells(BINGO_PROMPTS.map((p) => ({ ...p, completed: false })));
    setHasWonBingo(false);
  };

  // --- GAME 5: TRIVIA QUIZ ---
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);

  const currentTrivia = TRAVEL_TRIVIA[triviaIndex % TRAVEL_TRIVIA.length];

  const handleAnswerTrivia = (optIndex: number) => {
    if (selectedTriviaOption !== null) return;
    setSelectedTriviaOption(optIndex);
    if (optIndex === currentTrivia.correctIndex) {
      setTriviaScore((s) => s + 10);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const nextTrivia = () => {
    setSelectedTriviaOption(null);
    setTriviaIndex((i) => (i + 1) % TRAVEL_TRIVIA.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Games Banner */}
      <div className="bg-gradient-to-r from-[#DDD2F4]/40 via-white to-[#F5CAD7]/40 border border-[#EADCCB]/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EADCCB] text-xs font-bold text-[#343C58] mb-2 shadow-xs">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Gắn Kết & Giải Trí Trên Đường Đi</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#343C58] tracking-tight">
              Trò chơi vi vu cùng Bạn & Em iu 🎲🎉
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#343C58]/70 max-w-2xl">
              Chơi lúc ngồi cà phê, trên xe khách/tàu hỏa, lúc đợi đồ ăn hoặc tối chill tại homestay. Tiếng cười bất tận, thêm kỷ niệm và hiểu nhau hơn!
            </p>
          </div>
        </div>

        {/* Game Tabs Navigation Grid (Dạng lưới, không phải dạng kéo) */}
        <div className="mt-6 pt-5 border-t border-[#EADCCB]/60 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { id: 'wheel', label: '1. Vòng quay & Xúc xắc', icon: '🎡' },
            { id: 'tod', label: '2. Thật hay Thách', icon: '🃏' },
            { id: 'mostlikely', label: '3. Ai dễ làm nhất?', icon: '🙋' },
            { id: 'bingo', label: '4. Bingo du lịch', icon: '🎯' },
            { id: 'trivia', label: '5. Đố vui địa danh', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGameTab(tab.id as any)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-center ${
                activeGameTab === tab.id
                  ? 'bg-[#343C58] text-white shadow-xs scale-102 ring-2 ring-[#343C58]/20'
                  : 'bg-white text-[#343C58]/70 hover:bg-[#FFF7ED] border border-[#EADCCB]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GAME 1: LUCKY WHEEL & DICE */}
      {activeGameTab === 'wheel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Wheel */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EADCCB] p-6 shadow-2xs flex flex-col items-center justify-center relative">
            {/* Top Indicator Arrow */}
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-600 z-10 -mb-2 filter drop-shadow-md" />

            {/* Canvas Wheel */}
            <div className="relative p-2">
              <canvas
                ref={canvasRef}
                width={340}
                height={340}
                className="max-w-full rounded-full transition-transform duration-[3800ms] cubic-bezier(0.15, 0.85, 0.2, 1)"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                }}
              />
            </div>

            {/* Spin Button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`mt-4 px-8 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                isSpinning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-500/25'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Đang quay...' : 'QUAY NGAY 🎡'}</span>
            </button>

            {/* Winner Box */}
            {spinWinner && !isSpinning && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#F5CAD7]/40 border border-rose-300 text-center animate-bounce-short max-w-sm w-full">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest block">
                  🎉 Kết quả đã định đoạt:
                </span>
                <span className="text-base sm:text-lg font-black text-[#343C58] mt-1 block">
                  {spinWinner}
                </span>
              </div>
            )}
          </div>

          {/* Right Presets & Customizer & Dice */}
          <div className="lg:col-span-5 space-y-4">
            {/* Preset Selector */}
            <div className="p-5 bg-white rounded-3xl border border-[#EADCCB] shadow-2xs">
              <h3 className="text-xs font-bold text-[#343C58] mb-2 uppercase tracking-wider">
                Chọn chủ đề vòng quay:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {WHEEL_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedPresetId === p.id
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-2xs'
                        : 'bg-gray-50/70 border-[#EADCCB] text-[#343C58]/70 hover:bg-gray-100'
                    }`}
                  >
                    <div>{p.title}</div>
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="mt-4 pt-3 border-t border-[#EADCCB]/60">
                <span className="text-[11px] font-bold text-[#343C58]/70 block mb-2">
                  Danh sách ô ({wheelItems.length} lựa chọn):
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {wheelItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-[#FFF7ED]/60 rounded-lg border border-[#EADCCB]/40"
                    >
                      <span className="truncate pr-2">{item}</span>
                      <button
                        onClick={() => handleRemoveWheelItem(idx)}
                        className="text-gray-400 hover:text-rose-500 font-bold"
                        title="Xóa ô"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Item */}
                <form onSubmit={handleAddCustomWheelItem} className="mt-2.5 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Thêm lựa chọn của bạn..."
                    value={customItemInput}
                    onChange={(e) => setCustomItemInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-[#EADCCB] rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#343C58] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                  >
                    + Thêm
                  </button>
                </form>
              </div>
            </div>

            {/* Bonus: Interactive Dice Roll */}
            <div className="p-5 bg-gradient-to-br from-[#F5CAD7]/30 to-[#DDD2F4]/30 rounded-3xl border border-[#EADCCB] shadow-2xs flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#343C58] flex items-center gap-1.5 uppercase tracking-wider">
                  <Dices className="w-4 h-4 text-purple-600" />
                  <span>Xúc xắc may rủi 3D</span>
                </h4>
                <p className="text-[11px] text-[#343C58]/70 mt-1">
                  Số chẵn: Em iu thắng / Số lẻ: Anh Thành hoặc bạn khao!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={rollDice}
                  disabled={isRollingDice}
                  className={`w-14 h-14 rounded-2xl bg-white border-2 border-[#343C58] shadow-md flex items-center justify-center text-2xl font-black text-[#343C58] active:scale-95 transition-transform ${
                    isRollingDice ? 'animate-spin' : ''
                  }`}
                >
                  {diceResult}
                </button>
                <button
                  onClick={rollDice}
                  disabled={isRollingDice}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
                >
                  Lắc!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME 2: TRUTH OR DARE */}
      {activeGameTab === 'tod' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Tất cả 🃏' },
              { id: 'couple', label: 'Cặp đôi ngọt ngào 💖' },
              { id: 'friends', label: 'Hội bạn thân 🤣' },
              { id: 'adventure', label: 'Khám phá 🗺️' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setTodCategory(c.id as any);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  todCategory === c.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-[#343C58]/70 border border-[#EADCCB] hover:bg-[#FFF7ED]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 3D Card Display */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`cursor-pointer transition-all duration-300 rounded-3xl p-8 border text-center shadow-lg min-h-[260px] flex flex-col justify-between ${
              currentCard.type === 'truth'
                ? 'bg-gradient-to-br from-blue-50 via-white to-sky-50 border-blue-200'
                : 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-200'
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs bg-white border border-[#EADCCB]/60">
                {currentCard.type === 'truth' ? (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-700">Sự Thật (Truth)</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-rose-700">Thử Thách (Dare)</span>
                  </>
                )}
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-[#343C58] leading-relaxed max-w-lg mx-auto">
                “{currentCard.text}”
              </h2>
            </div>

            <div className="text-[11px] text-[#343C58]/50 mt-6">
              (Chạm vào thẻ để đổi góc nhìn · Bấm nút dưới để hoàn thành)
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={nextCard}
              className="flex-1 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-[#EADCCB] text-[#343C58] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Shuffle className="w-4 h-4" />
              <span>Đổi thẻ khác</span>
            </button>

            <button
              onClick={markCardComplete}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã hoàn thành! (+1 Điểm)</span>
            </button>
          </div>

          {/* Score counter */}
          <div className="text-center text-xs text-[#343C58]/70">
            Hội mình đã dũng cảm hoàn thành: <strong className="text-emerald-600">{completedDares}</strong> thử thách 🌟
          </div>
        </div>
      )}

      {/* GAME 3: MOST LIKELY TO */}
      {activeGameTab === 'mostlikely' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-[#EADCCB] p-8 text-center shadow-md relative overflow-hidden">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-2">
              Ai trong chúng mình dễ làm điều này nhất? 🤔
            </span>

            <h2 className="text-xl sm:text-3xl font-black text-[#343C58] leading-snug my-4">
              “{currentMl.question}”
            </h2>

            <p className="text-xs text-[#343C58]/60 italic mb-6">
              {currentMl.context}
            </p>

            {/* Countdown Display */}
            {countdown !== null ? (
              <div className="my-6">
                {countdown > 0 ? (
                  <div className="text-5xl font-black text-rose-600 animate-ping">
                    {countdown}
                  </div>
                ) : (
                  <div className="text-2xl font-black text-emerald-600 animate-bounce">
                    👉 CHỈ TAY NGAY! 👈
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={startCountdown}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span>Đếm ngược 3 - 2 - 1 để cùng chỉ tay!</span>
              </button>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setCountdown(null);
                setMlIndex((i) => (i + 1) % MOST_LIKELY_QUESTIONS.length);
              }}
              className="px-6 py-2.5 bg-white border border-[#EADCCB] hover:border-purple-300 rounded-2xl text-xs font-bold text-[#343C58] shadow-xs flex items-center gap-1.5"
            >
              <span>Câu hỏi tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* GAME 4: TRAVEL BINGO */}
      {activeGameTab === 'bingo' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#343C58]">
                Bảng Bingo du lịch cùng bạn (4x4)
              </h3>
              <p className="text-xs text-[#343C58]/60">
                Chạm vào các ô khi gặp trên đường để hoàn thành hàng ngang, dọc hoặc chéo!
              </p>
            </div>

            <button
              onClick={resetBingo}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Làm mới bảng
            </button>
          </div>

          {hasWonBingo && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 text-center animate-bounce-short">
              <span className="text-base font-black text-emerald-800">
                🎉 BINGO! Chúc mừng bạn đã hoàn thành một đường du lịch tuyệt vời! 🏆
              </span>
            </div>
          )}

          {/* 4x4 Bingo Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {bingoCells.map((cell) => (
              <button
                key={cell.id}
                onClick={() => toggleBingoCell(cell.id)}
                className={`p-2.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center min-h-[90px] sm:min-h-[110px] relative ${
                  cell.completed
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-98'
                    : 'bg-white hover:bg-[#FFF7ED] text-[#343C58] border-[#EADCCB] shadow-2xs'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{cell.icon}</span>
                <span
                  className={`text-[10px] sm:text-xs font-bold leading-tight ${
                    cell.completed ? 'text-white' : 'text-[#343C58]'
                  }`}
                >
                  {cell.title}
                </span>

                {cell.completed && (
                  <span className="absolute top-1 right-1 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 5: TRIVIA QUIZ */}
      {activeGameTab === 'trivia' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="bg-white rounded-3xl border border-[#EADCCB] p-6 sm:p-8 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-[#343C58]/70 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] border border-[#EADCCB] text-rose-600">
                📍 {currentTrivia.destination}
              </span>
              <span>Điểm số: <strong className="text-rose-600 font-extrabold">{triviaScore}</strong></span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#343C58] mb-4 leading-snug">
              {currentTrivia.question}
            </h3>

            {/* Options */}
            <div className="space-y-2">
              {currentTrivia.options.map((opt, idx) => {
                const isSelected = selectedTriviaOption === idx;
                const isCorrect = idx === currentTrivia.correctIndex;

                let btnStyle = 'bg-white border-[#EADCCB] text-[#343C58] hover:bg-gray-50';
                if (selectedTriviaOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                  } else {
                    btnStyle = 'bg-gray-100 text-gray-400 border-gray-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedTriviaOption !== null}
                    onClick={() => handleAnswerTrivia(idx)}
                    className={`w-full p-3 rounded-2xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedTriviaOption !== null && isCorrect && <span>✓ Đúng!</span>}
                    {selectedTriviaOption !== null && isSelected && !isCorrect && <span>✗ Sai</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedTriviaOption !== null && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB] text-xs text-[#343C58]/80 animate-fadeIn">
                <strong>Giải thích: </strong>
                {currentTrivia.explanation}
              </div>
            )}

            {selectedTriviaOption !== null && (
              <button
                onClick={nextTrivia}
                className="mt-4 w-full py-2.5 bg-[#343C58] hover:bg-black text-white rounded-xl text-xs font-bold transition-all"
              >
                Câu tiếp theo ➔
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
