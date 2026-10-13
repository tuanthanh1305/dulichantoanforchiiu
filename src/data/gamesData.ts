export interface WheelPreset {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export const WHEEL_PRESETS: WheelPreset[] = [
  {
    id: 'food',
    title: '🍲 Bữa này ăn gì ở Ba Vì / Tam Đảo?',
    description: 'Khỏi đau đầu cãi nhau xem ăn món gì hôm nay!',
    items: [
      'Gà đồi nướng lu Ba Vì thơm nức mũi',
      'Ngọn su su xào tỏi Tam Đảo giòn sần sật',
      'Bê non Ba Vì xào lăn sả ớt',
      'Lợn mán nướng than hoa mắc khén',
      'Cá lăng sông Đà nướng than',
      'Sữa chua nếp cẩm & Bánh sữa Ba Vì',
      'Bánh cuốn Tam Đảo thịt nướng than',
      'Trứng gà nướng & Ngô nướng than chợ đêm',
    ],
  },
  {
    id: 'drink',
    title: '🥤 Ai bao chầu nước / cà phê?',
    description: 'Quay chọn người may mắn khao nước cả hội!',
    items: [
      'Em iu (được miễn phí, ai khác trả hộ!)',
      'Anh Thành khao tất!',
      'Bạn thân trả tiền chầu này',
      'Chia đều mỗi người một ly',
      'Người ngồi bên trái trả',
      'Bốc thăm lại lần nữa!',
    ],
  },
  {
    id: 'challenge',
    title: '🎯 Thử thách vui trên đường đi',
    description: 'Nhiệm vụ bất ngờ giúp chuyến đi thêm tiếng cười!',
    items: [
      'Chụp 10 tấm hình có tâm cho người bên cạnh',
      'Lái xe / mở Google Maps dẫn đường 30 phút',
      'Chọn playlist nhạc chill cho cả chuyến đi',
      'Kể một câu chuyện tiếu lâm / kỷ niệm xấu hổ',
      'Bao cả nhóm một món ăn vặt ven đường',
      'Dọn dẹp phòng homestay và gom rác sạch sẽ',
      'Khen người bên cạnh 3 lời chân thành nhất',
    ],
  },
  {
    id: 'destination',
    title: '☕ Điểm check-in tiếp theo',
    description: 'Chưa biết đi đâu tiếp theo? Để vòng quay quyết định!',
    items: [
      'Quán Gió Tam Đảo ngắm biển mây hoàng hôn',
      'Nhà thờ đổ Pháp cổ rêu phong (Ba Vì Cốt 800)',
      'Cầu Mây Studio săn mây bồng bềnh',
      'Vườn xương rồng Vườn Quốc Gia Ba Vì',
      'Quảng trường & Nhà thờ đá cổ Tam Đảo',
      'Đền Thượng đỉnh Vua Ba Vì (1.296m)',
      'Chợ đêm Tam Đảo ăn đồ nướng',
    ],
  },
];

export interface TruthOrDareCard {
  id: string;
  type: 'truth' | 'dare';
  category: 'couple' | 'friends' | 'adventure';
  text: string;
}

export const TRUTH_OR_DARE_CARDS: TruthOrDareCard[] = [
  // Cặp đôi
  {
    id: 'tod-1',
    type: 'truth',
    category: 'couple',
    text: 'Khoảnh khắc nào trong chuyến đi này làm bạn thấy người ấy đáng yêu nhất?',
  },
  {
    id: 'tod-2',
    type: 'truth',
    category: 'couple',
    text: 'Nếu được chọn một nơi trên thế giới để sống cùng người ấy cả đời, bạn sẽ chọn nơi nào?',
  },
  {
    id: 'tod-3',
    type: 'dare',
    category: 'couple',
    text: 'Nhìn vào mắt người ấy trong 30 giây không chớp mắt và nói 3 điều bạn trân trọng nhất.',
  },
  {
    id: 'tod-4',
    type: 'dare',
    category: 'couple',
    text: 'Chụp một bức ảnh đôi tự sướng kiểu meme hài hước nhất và lưu làm hình nền khóa máy trong 24 giờ!',
  },
  {
    id: 'tod-5',
    type: 'truth',
    category: 'couple',
    text: 'Điều bất ngờ lãng mạn nhất mà người ấy từng làm cho bạn khi đi chơi xa là gì?',
  },
  {
    id: 'tod-6',
    type: 'dare',
    category: 'couple',
    text: 'Đút cho người ấy ăn một miếng đồ ăn hoặc rót một ly nước ấm kèm một lời chúc ngọt ngào.',
  },

  // Bạn thân
  {
    id: 'tod-7',
    type: 'truth',
    category: 'friends',
    text: 'Kể lại lần đi du lịch mà bạn thấy xấu hổ hoặc quê nhất từ trước đến giờ.',
  },
  {
    id: 'tod-8',
    type: 'truth',
    category: 'friends',
    text: 'Ai trong nhóm là người hay mè nheo hoặc ngủ nướng nhiều nhất mỗi khi đi chơi?',
  },
  {
    id: 'tod-9',
    type: 'dare',
    category: 'friends',
    text: 'Bắt chước lại dáng điệu hoặc giọng nói của một người trong nhóm cho cả hội đoán!',
  },
  {
    id: 'tod-10',
    type: 'dare',
    category: 'friends',
    text: 'Gọi đồ ăn hoặc đồ uống bằng giọng địa phương nơi bạn đang du lịch.',
  },
  {
    id: 'tod-11',
    type: 'truth',
    category: 'friends',
    text: 'Thú nhận một món đồ bạn mượn của bạn bè nhưng quên trả hoặc làm thất lạc.',
  },
  {
    id: 'tod-12',
    type: 'dare',
    category: 'friends',
    text: 'Hát live một đoạn điệp khúc bài hát hot trend bằng tông giọng opera hoặc rock metal!',
  },

  // Khám phá & Trải nghiệm
  {
    id: 'tod-13',
    type: 'truth',
    category: 'adventure',
    text: 'Nỗi sợ lớn nhất của bạn khi đi du lịch xa nhà một mình là gì?',
  },
  {
    id: 'tod-14',
    type: 'dare',
    category: 'adventure',
    text: 'Gặp một người dân địa phương hoặc nhân viên quán, nở nụ cười thật tươi và chúc họ một ngày thật tuyệt vời!',
  },
  {
    id: 'tod-15',
    type: 'dare',
    category: 'adventure',
    text: 'Thử nếm thử một món ăn hoặc đồ uống mà từ trước đến giờ bạn chưa từng dám thử.',
  },
  {
    id: 'tod-16',
    type: 'truth',
    category: 'adventure',
    text: 'Chuyến đi nào là bước ngoặt khiến bạn nhận ra bản thân đã trưởng thành hơn rất nhiều?',
  },
];

export interface MostLikelyQuestion {
  id: string;
  question: string;
  context: string;
}

export const MOST_LIKELY_QUESTIONS: MostLikelyQuestion[] = [
  {
    id: 'ml-1',
    question: 'Ai là người dễ ngủ quên và trễ giờ xe/chuyến bay nhất?',
    context: 'Báo thức reo 10 lần vẫn chưa tỉnh giấc!',
  },
  {
    id: 'ml-2',
    question: 'Ai chụp 300 bức ảnh sống ảo chỉ để chọn đúng 1 bức?',
    context: 'Đồ ăn nguội ngắt nhưng góc chụp vẫn chưa ưng ý!',
  },
  {
    id: 'ml-3',
    question: 'Ai mang vali to đùng cả chục bộ quần áo nhưng chỉ mặc có 2 bộ?',
    context: 'Vali 20kg toàn đồ dự phòng không bao giờ đụng tới!',
  },
  {
    id: 'ml-4',
    question: 'Ai dễ bị lạc đường nhất dù tay đang cầm Google Maps?',
    context: 'Rẽ trái nhưng đi thẳng, 15 phút sau vẫn ở chỗ cũ!',
  },
  {
    id: 'ml-5',
    question: 'Ai là người tiêu hết sạch tiền túi ngay trong ngày đầu tiên?',
    context: 'Thấy cái gì cũng muốn mua thử một tí!',
  },
  {
    id: 'ml-6',
    question: 'Ai là người hay đòi dừng xe để mua đồ ăn vặt dọc đường nhất?',
    context: 'Vừa ăn no 30 phút trước là đã thèm khoai nướng!',
  },
  {
    id: 'ml-7',
    question: 'Ai là người dễ làm rơi hoặc để quên đồ ở khách sạn/quán cà phê nhất?',
    context: 'Kính râm, sạc điện thoại, son môi, chìa khóa phòng...',
  },
  {
    id: 'ml-8',
    question: 'Ai là người luôn chuẩn bị chu đáo nhất, trong balo cái gì cũng có?',
    context: 'Băng cá nhân, kẹo ngậm, sạc dự phòng, khăn ướt, thuốc say xe...',
  },
];

export const BINGO_PROMPTS = [
  { id: 'b-1', title: 'Thấy một chú cún/mèo bản địa cực ngoan', icon: '🐾' },
  { id: 'b-2', title: 'Ngắm trọn khoảnh khắc hoàng hôn rực rỡ', icon: '🌅' },
  { id: 'b-3', title: 'Thử một món ăn đặc sản chưa từng ăn', icon: '🍲' },
  { id: 'b-4', title: 'Bị cơn mưa bất chợt phải nép hiên nhà', icon: '🌧️' },
  { id: 'b-5', title: 'Uống ly cà phê thơm lừng ngắm mây bay', icon: '☕' },
  { id: 'b-6', title: 'Chụp một tấm hình đôi/nhóm cực ưng ý', icon: '📸' },
  { id: 'b-7', title: 'Hỏi đường và gặp người bản địa dễ thương', icon: '🗺️' },
  { id: 'b-8', title: 'Tự tay chọn một món quà lưu niệm ý nghĩa', icon: '🎁' },
  { id: 'b-9', title: 'Dậy sớm hít thở bầu không khí se lạnh', icon: '🌲' },
  { id: 'b-10', title: 'Ăn hết sạch một đĩa đồ ăn nóng hổi', icon: '😋' },
  { id: 'b-11', title: 'Bật cười to vì một chuyện vô lý trên đường', icon: '😂' },
  { id: 'b-12', title: 'Tìm thấy một con hẻm cổ kính hoặc thơ mộng', icon: '🏘️' },
  { id: 'b-13', title: 'Mặc trang phục tone-sur-tone cùng nhau', icon: '👗' },
  { id: 'b-14', title: 'Nghe bài hát yêu thích khi đang ngồi xe', icon: '🎵' },
  { id: 'b-15', title: 'Check-in đúng giờ và an toàn tuyệt đối', icon: '🛡️' },
  { id: 'b-16', title: 'Nói lời cảm ơn người đồng hành trong chuyến đi', icon: '💗' },
];

export const TRAVEL_TRIVIA = [
  {
    id: 'tv-1',
    destination: 'Ba Vì (Hà Nội)',
    question: 'Di tích thời Pháp cổ rêu phong nổi tiếng nằm ở độ cao Cốt 800 Vườn Quốc Gia Ba Vì là công trình gì?',
    options: ['Nhà thờ đổ Ba Vì', 'Dinh toàn quyền Pháp', 'Trại tù thực dân', 'Biệt thự Hoa Hồng'],
    correctIndex: 0,
    explanation: 'Nhà thờ đổ Ba Vì được người Pháp xây dựng vào đầu thế kỷ 20, nay phủ đầy rêu phong và ánh nắng xuyên qua tán rừng thông cực kỳ ma mị, lãng mạn.',
  },
  {
    id: 'tv-2',
    destination: 'Tam Đảo (Vĩnh Phúc)',
    question: 'Rau đặc sản số 1 của thị trấn Tam Đảo, được xào tỏi giòn ngọt trong mọi bữa cơm du khách là gì?',
    options: ['Ngọn su su Tam Đảo', 'Rau sắng rừng', 'Cải mèo đắng', 'Rau dớn rừng'],
    correctIndex: 0,
    explanation: 'Ngọn su su Tam Đảo được trồng khắp các sườn núi quanh năm mát lạnh, có vị giòn ngọt thanh đặc trưng không đâu sánh bằng!',
  },
  {
    id: 'tv-3',
    destination: 'Tam Đảo (Vĩnh Phúc)',
    question: 'Đoạn đường đèo từ chân dốc Lập lên trung tâm thị trấn Tam Đảo có chiều dài khoảng bao nhiêu km?',
    options: ['5 km', '13 km', '25 km', '30 km'],
    correctIndex: 1,
    explanation: 'Cung đèo Tam Đảo dài khoảng 13km với nhiều khúc cua dốc hiểm trở, đòi hỏi người lái xe phải có tay lái vững và kiểm tra phanh kỹ càng.',
  },
  {
    id: 'tv-4',
    destination: 'Ba Vì (Hà Nội)',
    question: 'Đỉnh núi cao nhất của dãy núi Ba Vì (nơi có Đền Thượng thờ Tản Viên Sơn Thánh) có tên là gì?',
    options: ['Đỉnh Vua (1.296m)', 'Đỉnh Ngọc Hoa', 'Đỉnh Tản Viên', 'Đỉnh Viên Nam'],
    correctIndex: 0,
    explanation: 'Đỉnh Vua cao 1.296m là đỉnh cao nhất dãy Ba Vì, nơi tọa lạc Đền Thờ Chủ tịch Hồ Chí Minh và Đền Thượng linh thiêng.',
  },
  {
    id: 'tv-4',
    destination: 'Phú Quốc',
    question: 'Đặc sản nổi tiếng nào của đảo ngọc Phú Quốc được bảo hộ chỉ dẫn địa lý tại châu Âu?',
    options: ['Tiêu sọ & Nước mắm', 'Bánh tét mật cật', 'Rượu sim', 'Gỏi cá trích'],
    correctIndex: 0,
    explanation: 'Nước mắm truyền thống Phú Quốc làm từ cá cơm than ủ chượp trong thùng gỗ bời lời nổi tiếng khắp thế giới.',
  },
  {
    id: 'tv-5',
    destination: 'Sa Pa & Tây Bắc',
    question: 'Đỉnh núi cao nhất Việt Nam và được mệnh danh là "Nóc nhà Đông Dương" là đỉnh nào?',
    options: ['Ngũ Chỉ Sơn', 'Fansipan (Phan Xi Păng)', 'Bạch Mộc Lương Tử', 'Tây Côn Lĩnh'],
    correctIndex: 1,
    explanation: 'Đỉnh Fansipan cao 3.143 mét thuộc dãy núi Hoàng Liên Sơn, cách thị xã Sa Pa khoảng 9km.',
  },
  {
    id: 'tv-6',
    destination: 'An toàn du lịch',
    question: 'Khi thuê xe máy tự lái ở các vùng đèo dốc núi, loại xe nào được khuyên dùng an toàn nhất?',
    options: ['Xe tay ga phân khối lớn', 'Xe số / Xe côn tay', 'Xe điện mini', 'Xe không cần phanh trước'],
    correctIndex: 1,
    explanation: 'Xe số hoặc xe côn tay cho phép bạn về số thấp (số 1, 2) để hãm động cơ bằng máy khi xuống đèo dốc, tránh bị cháy má phanh như xe ga!',
  },
];
