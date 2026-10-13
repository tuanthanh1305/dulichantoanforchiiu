import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CloudLightning,
  CloudRain,
  Compass,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
  Sun,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import { VIETNAM_POPULAR_DESTINATIONS } from '../data/travelData';
import { Trip } from '../types/travel';

interface WeatherRiskPanelProps {
  trip: Trip | null;
}

export const WeatherRiskPanel: React.FC<WeatherRiskPanelProps> = ({ trip }) => {
  const [selectedCity, setSelectedCity] = useState(trip?.destination || 'Ba Vì');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 5 checklist items before departure
  const [preTripChecklist, setPreTripChecklist] = useState<Record<string, boolean>>({
    forecast: false,
    localAlerts: false,
    roadCondition: false,
    openingHours: false,
    backupPlan: false,
  });

  const toggleCheck = (key: string) => {
    setPreTripChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentDest =
    VIETNAM_POPULAR_DESTINATIONS.find(
      (d) => d.name.toLowerCase() === selectedCity.toLowerCase()
    ) || VIETNAM_POPULAR_DESTINATIONS[0];

  const fetchLiveWeather = async (lat: number, lng: number) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FBangkok`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setWeatherData(data);
    } catch (e) {
      console.warn('Weather fetch fallback:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentDest) {
      fetchLiveWeather(currentDest.lat, currentDest.lng);
    }
  }, [selectedCity]);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return { label: 'Trời quang đãng, nắng nhẹ', icon: Sun, color: 'text-amber-500' };
    if ([1, 2, 3].includes(code)) return { label: 'Có mây rải rác, râm mát', icon: Sun, color: 'text-amber-600' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return { label: 'Có mưa rào / mưa dông', icon: CloudRain, color: 'text-blue-500' };
    if ([95, 96, 99].includes(code))
      return { label: 'Dông sét mạnh, gió giật', icon: CloudLightning, color: 'text-purple-600' };
    return { label: 'Trời nhiều mây, se lạnh', icon: Sun, color: 'text-slate-500' };
  };

  const weatherInfo = weatherData?.current ? getWeatherDescription(weatherData.current.weather_code) : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
            <span>🌦️ KIỂM TRA THỜI TIẾT & RỦI RO THIÊN TAI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#343C58] mt-1">
            Theo dõi thời tiết trước giờ lên đường ⛅
          </h1>
          <p className="text-xs sm:text-sm text-[#343C58]/70 mt-1">
            Cập nhật dữ liệu khí tượng trực tiếp, đánh giá nguy cơ sạt lở, dông bão và sóng biển.
          </p>
        </div>

        {/* Destination Select */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FFF7ED] border border-[#EADCCB] text-xs font-bold text-[#343C58] focus:outline-none"
          >
            {VIETNAM_POPULAR_DESTINATIONS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.region})
              </option>
            ))}
          </select>

          <button
            onClick={() => currentDest && fetchLiveWeather(currentDest.lat, currentDest.lng)}
            className="p-2 rounded-xl bg-white border border-[#EADCCB] hover:bg-[#FFF7ED] text-[#343C58]"
            title="Làm mới thời tiết"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Official Weather Forecast Card */}
      <div className="bg-gradient-to-br from-[#CBE7F5]/30 via-white to-[#FFF7ED] rounded-3xl p-6 border border-[#EADCCB] shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#343C58]/60">
            Đang tải dữ liệu thời tiết thực tế từ trạm khí tượng vệ tinh...
          </div>
        ) : weatherData?.current ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADCCB]/40">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl">
                  {weatherInfo?.icon && <weatherInfo.icon className={`w-8 h-8 ${weatherInfo.color}`} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-[#343C58]">{selectedCity}</h3>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      Dữ liệu trực tiếp (Open-Meteo)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#343C58]/80 mt-0.5">
                    {weatherInfo?.label}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-[#343C58] tabular-nums">
                  {Math.round(weatherData.current.temperature_2m)}°C
                </div>
                <div className="text-[11px] text-[#343C58]/60">
                  Cảm nhận thực tế: {Math.round(weatherData.current.apparent_temperature)}°C
                </div>
              </div>
            </div>

            {/* Weather Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                <span className="text-[#343C58]/60 block text-[10px] uppercase font-bold">Độ ẩm</span>
                <span className="text-base font-bold text-[#343C58] tabular-nums">
                  {weatherData.current.relative_humidity_2m}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                <span className="text-[#343C58]/60 block text-[10px] uppercase font-bold">Tốc độ gió</span>
                <span className="text-base font-bold text-[#343C58] tabular-nums">
                  {weatherData.current.wind_speed_10m} km/h
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                <span className="text-[#343C58]/60 block text-[10px] uppercase font-bold">Xác suất mưa ngày</span>
                <span className="text-base font-bold text-[#343C58] tabular-nums">
                  {weatherData.daily?.precipitation_probability_max?.[0] || 0}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#EADCCB]/60">
                <span className="text-[#343C58]/60 block text-[10px] uppercase font-bold">Nhiệt độ ngày</span>
                <span className="text-base font-bold text-[#343C58] tabular-nums">
                  {Math.round(weatherData.daily?.temperature_2m_min?.[0] || 18)}° -{' '}
                  {Math.round(weatherData.daily?.temperature_2m_max?.[0] || 26)}°C
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Chưa thể xác minh thời tiết trực tiếp lúc này:</strong>
              <p className="mt-1">
                Em iu hãy kiểm tra nguồn khí tượng và thông báo chính thức tại địa phương trước khi khởi hành. Tụi mình không tự bịa dự báo để đảm bảo an toàn tuyệt đối cho Em iu nha!
              </p>
            </div>
          </div>
        )}

        {/* Verification Link to Official NCHMF Vietnam */}
        <div className="mt-4 pt-3 border-t border-[#EADCCB]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#343C58]/70">
            Nguồn tham khảo chính thống: Trung tâm Dự báo Khí tượng Thủy văn Quốc gia (NCHMF)
          </span>
          <a
            href="https://nchmf.gov.vn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-800"
          >
            <span>Mở nchmf.gov.vn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 5-Step Departure Checklist from Prompt */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADCCB]/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#343C58] flex items-center gap-2">
          <span>📋 5 Bước kiểm tra bắt buộc trước giờ lăn bánh</span>
        </h3>
        <p className="text-xs text-[#343C58]/70">
          Chỉ mất 2 phút nhưng sẽ bảo vệ Em iu khỏi những rủi ro bất ngờ trên đường
        </p>

        <div className="space-y-2.5">
          {[
            {
              id: 'forecast',
              title: '1. Kiểm tra dự báo khí tượng mới nhất',
              desc: 'Xem có cảnh báo mưa dông giật, sấm sét hay sương mù dày trên tuyến đường không.',
            },
            {
              id: 'localAlerts',
              title: '2. Kiểm tra cảnh báo thiên tai & sạt lở địa phương',
              desc: 'Đặc biệt với cung đường đèo núi Tây Bắc, Tây Nguyên hoặc vùng trũng ven biển.',
            },
            {
              id: 'roadCondition',
              title: '3. Kiểm tra tình trạng đường sá và phương tiện',
              desc: 'Lốp xe đủ hơi, phanh ăn, đèn pha sáng, kiểm tra xem có đoạn đường nào đang cấm hay sửa chữa.',
            },
            {
              id: 'openingHours',
              title: '4. Xác nhận giờ hoạt động của điểm đến',
              desc: 'Gọi điện hoặc kiểm tra fanpage điểm tham quan xem hôm nay có mở cửa đón khách không.',
            },
            {
              id: 'backupPlan',
              title: '5. Chuẩn bị phương án thay thế trong nhà (Kế hoạch B)',
              desc: 'Lưu sẵn 1-2 quán cà phê hoặc bảo tàng gần đó nếu thời tiết bất ngờ xấu đi.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                preTripChecklist[item.id]
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-[#EADCCB] hover:border-[#F5CAD7]'
              }`}
            >
              <button type="button" className="mt-0.5 text-[#343C58] focus:outline-none">
                {preTripChecklist[item.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </button>
              <div>
                <h4
                  className={`text-xs font-bold leading-snug ${
                    preTripChecklist[item.id] ? 'text-emerald-900' : 'text-[#343C58]'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#343C58]/70 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
