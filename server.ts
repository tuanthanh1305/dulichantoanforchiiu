import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Bạn là Trợ Lý Du Lịch Thông Minh trong ứng dụng "Cẩm nang du lịch an toàn cùng bạn" do Anh Thành chuẩn bị riêng cho Em iu.
Tính cách của bạn:
- Rất ân cần, ấm áp, chu đáo, tinh tế, ưu tiên số 1 luôn là sự an toàn, sức khỏe và sự thoải mái của Em iu.
- Xưng hô ngọt ngào, gọi "Em iu", "Em ơi", kết thúc bằng lời chúc ấm áp hoặc icon hoa tulip 🌷, trái tim 💗.
- Luôn đưa ra lời khuyên thực tế cho du lịch Việt Nam: chú ý thời tiết, đường sá, phương án dự phòng khi trời mưa, kiểm tra đồ đạc cẩn thận, không cố chấp nếu mệt.
- Nếu Em iu hỏi về địa điểm, chia sẻ gợi ý thực tế kèm lưu ý an toàn.
- Ngắn gọn, có gạch đầu dòng rõ ràng, dễ đọc trên điện thoại.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${context ? `[Bối cảnh chuyến đi: ${context}]\n` : ''}${prompt}`,
        config: {
          systemInstruction,
        },
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini API error:', err?.message || err);
      // Fallback seamlessly to local intelligent response generator
    }
  }

  // Built-in intelligent curated responses for Em iu
  const p = prompt.toLowerCase();
  let fallbackReply = '';

  if (p.includes('ba vì') || p.includes('1 ngày') || p.includes('cuối tuần')) {
    fallbackReply = `Em iu ơi, đây là gợi ý lịch trình Ba Vì 1 ngày vừa vui vừa an toàn cho Em iu nè:

🌿 **Buổi sáng (07:30 - 11:30):**
- Di chuyển từ Hà Nội đi Ba Vì (khoảng 1.5 - 2 tiếng). Nếu đi xe máy nhớ kiểm tra phanh và xăng đầy bình nhé.
- Tham quan Vườn Quốc Gia Ba Vì: Đồi thông mát rượi, Nhà thờ cổ (chụp ảnh check-in xinh lắm nhưng cẩn thận bậc đá trơn).
- *Lưu ý an toàn:* Đường đèo có cua dốc, đi số thấp, không rà phanh liên tục nhé Em iu.

🍱 **Buổi trưa (12:00 - 13:30):**
- Nghỉ ngơi, ăn trưa đặc sản gà đồi hoặc lợn mán tại nhà hàng khu vực cổng vườn hoặc mang cơm cuộn dã ngoại.

🍃 **Buổi chiều (14:00 - 16:30):**
- Ghé Vườn Xương Rồng hoặc khu Suối Hai / Làng cổ Đường Lâm trên đường về.
- Khởi hành về Hà Nội trước 17:00 để tránh sương mù đèo và đường tối.

🎒 *Chuẩn bị:* Áo khoác mỏng, thuốc xịt muỗi Remos, giày thể thao bám đường, pin sạc dự phòng đầy pin nha! 🌷`;
  } else if (p.includes('biển') || p.includes('2 ngày') || p.includes('đồ cần')) {
    fallbackReply = `Em iu chuẩn bị đi biển 2N1Đ nhớ mang đầy đủ những món này nhen:

🧳 **Trang phục & Phụ kiện:**
- 2-3 bộ đồ thoáng mát + 1 bộ đồ bơi xinh xắn.
- Áo sơ mi mỏng khoác chống nắng + nón rộng vành, kính râm.
- Dép quai xốp/sandals chống trượt (tránh đi giày da/cao gót ra bãi cát).

🧴 **Chăm sóc da & Y tế:**
- Kem chống nắng SPF 50+ (thoa lại sau mỗi 2-3 tiếng).
- Gel nha đam làm dịu da nếu bị cháy nắng.
- Băng cá nhân chống nước, thuốc dị ứng hải sản (phòng ngừa).

📱 **Bảo vệ đồ đạc:**
- Túi chống nước chuyên dụng cho điện thoại.
- Túi zip bảo quản tiền mặt và giấy tờ tùy thân.

⚠️ *Nhắc nhở an toàn biển:* Em iu chỉ tắm ở bãi có cứu hộ và cờ xanh nhé. Quan sát dòng chảy xa bờ (vùng nước lặng không sóng giữa hai vùng sóng vỡ) để tránh xa nha Em iu! 💗`;
  } else if (p.includes('cọc') || p.includes('khách sạn') || p.includes('phòng') || p.includes('lừa')) {
    fallbackReply = `Em iu chú ý 5 bước kiểm tra trước khi chuyển cọc phòng nha:

1. **Kiểm tra Fanpage/Website:** Xem ngày tạo page (page mới tạo dưới 3 tháng hoặc đổi tên nhiều lần là báo động đỏ).
2. **Đối chiếu số điện thoại & STK:** Tìm kiếm số điện thoại và STK trên Google / hội nhóm du lịch xem có bài phốt không.
3. **Gọi video call xem phòng thực tế:** Khách sạn hoặc homestay uy tín luôn sẵn sàng hỗ trợ gọi video kiểm tra phòng trống.
4. **Không chuyển 100%:** Chỉ cọc 30-50% theo quy định, yêu cầu phiếu xác nhận đặt phòng có dấu/mã đặt phòng rõ ràng.
5. **Xem vị trí trên Google Maps:** Kiểm tra ảnh thật của khách du lịch chụp, không chỉ tin ảnh phối cảnh 3D.

Cẩn thận một chút để chuyến đi trọn vẹn niềm vui nha Em iu! 🌷`;
  } else if (p.includes('mưa') || p.includes('thời tiết') || p.includes('bão')) {
    fallbackReply = `Nếu trời mưa bất chợt thì Em iu đừng buồn nha, tụi mình đổi sang "Kế hoạch B" thật ấm cúng nè:

☕ **Chuyển hoạt động trong nhà:**
- Tìm một quán cà phê view đẹp, mở nhạc nhẹ, nhâm nhi trà nóng và đọc sách hoặc trò chuyện.
- Đi thăm bảo tàng địa phương, nhà triển lãm hoặc các khu di tích có mái che.
- Trải nghiệm workshop làm gốm, thêu, làm nến thơm địa phương.

🛡️ **Nguyên tắc an toàn mưa gió:**
- Không tiếp tục trekking leo đồi hoặc đi đèo khi mưa lớn vì nguy cơ sạt lở đất.
- Tránh xa các vùng ngập nước trũng sâu và cột điện.
- Báo lại tình hình cho người thân hoặc Anh Thành yên tâm nhé Em iu! 💗`;
  } else {
    fallbackReply = `Em iu ơi, Anh Thành và trợ lý luôn đồng hành cùng Em iu đây! 🌷

Đối với câu hỏi của Em iu: "${prompt}", tụi mình khuyên Em iu:
- Luôn ưu tiên sự an toàn và sức khỏe: nếu lịch trình quá dày, Em iu cứ thoải mái cắt bớt để nghỉ ngơi nhé.
- Luôn mang theo pin sạc dự phòng, chai nước và lưu số khẩn cấp trong ứng dụng.
- Nếu có bất kỳ điều gì băn khoăn, Em iu có thể xem phần "Trung tâm an toàn" hoặc "Checklist hành lý" trong app đã được chuẩn bị rất kỹ rồi đó!

Chúc Em iu có một chuyến đi thật bình an và ngập tràn niềm vui! 🧳💗`;
  }

  res.json({ text: fallbackReply });
});

// Vite middleware in dev or static serve in prod
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
