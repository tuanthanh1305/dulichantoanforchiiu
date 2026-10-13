import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { SCAM_SCENARIOS } from '../data/travelData';
import { ScamScenario } from '../types/travel';
import { Storage } from '../utils/storage';

export const ScamSimulator: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(Storage.getCompletedScams());
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCAM_SCENARIOS[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const scenario = SCAM_SCENARIOS.find((s) => s.id === selectedScenarioId) || SCAM_SCENARIOS[0];

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setShowExplanation(true);
    const chosen = scenario.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      Storage.markScamCompleted(scenario.id);
      if (!completedIds.includes(scenario.id)) {
        setCompletedIds([...completedIds, scenario.id]);
      }
    }
  };

  const handleNextScenario = () => {
    const currentIndex = SCAM_SCENARIOS.findIndex((s) => s.id === scenario.id);
    const nextIndex = (currentIndex + 1) % SCAM_SCENARIOS.length;
    setSelectedScenarioId(SCAM_SCENARIOS[nextIndex].id);
    setSelectedOptionId(null);
    setShowExplanation(false);
  };

  const filteredScenarios = SCAM_SCENARIOS.filter((s) => {
    if (categoryFilter === 'all') return true;
    return s.category === categoryFilter;
  });

  const completedCount = completedIds.length;
  const totalScenarios = SCAM_SCENARIOS.length;
  const progressPercent = Math.round((completedCount / totalScenarios) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
            <span>🕵️ GIẢ LẬP NHẬN DIỆN LỪA ĐẢO DU LỊCH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            20 Tình huống tương tác thực tế cho Em iu 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Luyện tập phản xạ nhanh trước các chiêu trò cọc phòng ảo, taxi dù, tour bẫy và lừa đảo công nghệ.
          </p>
        </div>

        {/* Achievement Badge */}
        <div className="flex items-center gap-3 bg-[#FFF7ED] p-3 rounded-2xl border border-[#EADCCB] shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-[#DDD2F4]/60 flex items-center justify-center text-2xl shadow-xs">
            🎖️
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#343C58] block">Thám tử cẩn trọng</span>
            <span className="text-purple-700 font-semibold tabular-nums">
              Đã vượt qua {completedCount}/{totalScenarios} bài học ({progressPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EADCCB]/30 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#DDD2F4] to-purple-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {[
          { id: 'all', label: 'Tất cả 20 tình huống' },
          { id: 'hotel', label: 'Đặt phòng & Khách sạn' },
          { id: 'transport', label: 'Taxi & Xe cộ' },
          { id: 'shopping', label: 'Mua sắm & Tiền bạc' },
          { id: 'tech', label: 'Công nghệ & Wi-Fi' },
          { id: 'outdoor', label: 'Đi chơi & Người lạ' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
              categoryFilter === c.id
                ? 'bg-[#343C58] text-white border-[#343C58] shadow-xs'
                : 'bg-white text-[#343C58]/70 border-[#EADCCB] hover:bg-[#FFF7ED]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Scenarios Navigation List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredScenarios.map((sc, idx) => {
            const isCompleted = completedIds.includes(sc.id);
            const isCurrent = sc.id === scenario.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setSelectedOptionId(null);
                  setShowExplanation(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-100'
                    : 'bg-white/80 border-[#EADCCB] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span className="text-[#343C58]/60">Tình huống #{idx + 1}</span>
                  {isCompleted ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Đã nắm rõ
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {sc.difficulty}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#343C58] leading-snug line-clamp-2">
                  {sc.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Right: Active Interactive Simulation */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 border border-[#EADCCB] shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  Mô phỏng tình huống
                </span>
                <span className="text-xs text-[#343C58]/60">· {scenario.difficulty}</span>
              </div>
              <h2 className="text-lg font-black text-[#343C58] mt-2">
                {scenario.title}
              </h2>
            </div>

            {/* Description Prompt */}
            <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#EADCCB]/80 text-xs text-[#343C58] leading-relaxed">
              <strong className="block text-[#343C58] mb-1 font-bold">Hoàn cảnh:</strong>
              {scenario.description}
            </div>

            {/* Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#343C58] uppercase tracking-wider">
                Em iu sẽ xử lý thế nào trong tình huống này?
              </h4>

              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all leading-relaxed ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                        : 'bg-white border-[#EADCCB] hover:border-[#F5CAD7] text-[#343C58]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.id.replace('opt-', '').toUpperCase()}
                      </div>
                      <span className="font-semibold">{opt.text}</span>
                    </div>

                    {/* Reveal feedback if selected */}
                    {isSelected && (
                      <div
                        className={`mt-3 pt-2.5 border-t text-xs leading-relaxed ${
                          opt.isCorrect
                            ? 'border-emerald-200 text-emerald-900'
                            : 'border-rose-200 text-rose-900'
                        }`}
                      >
                        <strong>{opt.isCorrect ? '✓ Hoan hô Em iu: ' : '✗ Cảnh báo nguy hiểm: '}</strong>
                        {opt.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Key Takeaway Box */}
            {showExplanation && (
              <div className="p-4 rounded-2xl bg-[#DDD2F4]/30 border border-[#DDD2F4] text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span>Bài học kinh nghiệm rút ra:</span>
                </div>
                <p className="text-[#343C58] leading-relaxed font-medium">
                  {scenario.keyTakeaway}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextScenario}
                    className="px-4 py-2 rounded-xl bg-[#343C58] text-white text-xs font-bold hover:bg-[#202534] transition-all shadow-sm"
                  >
                    Tiếp tục sang tình huống tiếp theo ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
