import { CriteriaItem } from '../types';

export function generate025Options(maxPoints: number): number[] {
  const options: number[] = [];
  for (let val = 0; val <= maxPoints + 0.0001; val += 0.25) {
    options.push(Math.round(val * 100) / 100);
  }
  return options;
}

export const FORM_03_CRITERIA: CriteriaItem[] = [
  // =========================================================================
  // A. TIÊU CHÍ CHUNG (TỐI ĐA 30 ĐIỂM)
  // =========================================================================

  // --- I. Phẩm chất chính trị, đạo đức, văn hóa & kỷ luật (10đ) ---
  // 1. Phẩm chất chính trị, đạo đức (5đ)
  {
    id: 'A_I_1_a',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.a',
    title: 'Chấp hành nghiêm túc đường lối, chủ trương của Đảng, chính sách pháp luật của Nhà nước và các nguyên tắc tổ chức, kỷ luật của Đảng',
    description: 'Chấp hành chủ trương, đường lối, nguyên tắc tổ chức kỷ luật.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_b',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.b',
    title: 'Có quan điểm, bản lĩnh chính trị vững vàng; kiên định lập trường; không dao động trước mọi khó khăn, thách thức',
    description: 'Bản lĩnh chính trị vững vàng, không dao động.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_c',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.c',
    title: 'Có ý thức nghiên cứu, học tập, vận dụng chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh, nghị quyết, chỉ thị, quyết định và các văn bản của Đảng và Nhà nước',
    description: 'Học tập, vận dụng chỉ thị nghị quyết của Đảng, Nhà nước.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_d',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.d',
    title: 'Giữ gìn phẩm chất đạo đức, lối sống trong sáng, trung thực, khiêm tốn, chân thành, giản dị; cần, kiệm, liêm, chính, chí công vô tư; không có biểu hiện suy thoái...',
    description: 'Đạo đức lối sống trong sáng, không suy thoái "tự diễn biến", "tự chuyển hóa".',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_de',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.đ',
    title: 'Không tham ô, tham nhũng, lãng phí, tiêu cực, quan liêu, hách dịch, cửa quyền, vụ lợi; không để người thân, người quen lợi dụng chức vụ, quyền hạn để trục lợi',
    description: 'Không tham nhũng, lãng phí, cửa quyền, vụ lợi.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_e',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.e',
    title: 'Có tinh thần đoàn kết, ý thức xây dựng cơ quan, tổ chức, đơn vị trong sạch, vững mạnh; tích cực tham gia các hoạt động tập thể',
    description: 'Đoàn kết nội bộ, tham gia tích cực hoạt động tập thể.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_ee',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.ê',
    title: 'Thực hiện văn hóa công vụ: có thái độ đúng mực, phong cách làm việc chuẩn mực, chuyên nghiệp trong quan hệ công tác',
    description: 'Văn hóa công vụ chuẩn mực, chuyên nghiệp.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_g',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.g',
    title: 'Tinh thần tự phê bình; tự soi, tự sửa; mức độ tự giác nhận diện hạn chế, khuyết điểm của bản thân và kết quả khắc phục sau khi đã được chỉ ra',
    description: 'Tự phê bình, tự soi tự sửa, khắc phục khuyết điểm.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },

  // 2. Ý thức kỷ luật, kỷ cương trong thực thi công vụ (5đ)
  {
    id: 'A_I_2_a',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.a',
    title: 'Chấp hành sự phân công của tổ chức',
    description: 'Sẵn sàng nhận và hoàn thành nhiệm vụ theo phân công.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_b',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.b',
    title: 'Thực hiện các quy định, quy chế, nội quy của cơ quan, tổ chức, đơn vị nơi công tác',
    description: 'Chấp hành quy chế ngày giờ công, nội quy trường học.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_c',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.c',
    title: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định',
    description: 'Kê khai minh bạch tài sản thu nhập đúng thời hạn.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_d',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức & Kỷ luật công vụ / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.d',
    title: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác, khách quan về những nội dung liên quan đến việc thực hiện chức trách, nhiệm vụ được giao...',
    description: 'Báo cáo trung thực, khách quan thông tin thực hiện nhiệm vụ khi được yêu cầu.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },

  // --- II. Năng lực chuyên môn, tinh thần trách nhiệm & Thái độ phục vụ (10đ) ---
  // 1. Năng lực chuyên môn (2.5đ)
  {
    id: 'A_II_1_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.a',
    title: 'Có kiến thức chuyên sâu, toàn diện về lĩnh vực công tác được phân công; hiểu biết đầy đủ về quy định pháp luật, quy trình nghiệp vụ có liên quan đến vị trí việc làm',
    description: 'Kiến thức chuyên sâu, nắm vững pháp luật nghiệp vụ.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.b',
    title: 'Thường xuyên cập nhật kiến thức mới, có khả năng nghiên cứu, phân tích, tổng hợp và vận dụng sáng tạo vào công việc; đáp ứng yêu cầu đổi mới, cải cách hành chính',
    description: 'Cập nhật kiến thức mới, phân tích tổng hợp sáng tạo.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_c',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.c',
    title: 'Có kỹ năng xử lý công việc độc lập, làm việc nhóm hiệu quả; sử dụng thành thạo công nghệ thông tin và các công cụ hỗ trợ phục vụ chuyên môn, nghiệp vụ...',
    description: 'Kỹ năng độc lập/nhóm, thành thạo CNTT.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_d',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.d',
    title: 'Có năng lực lãnh đạo, chỉ đạo, điều hành, tổ chức triển khai thực hiện nhiệm vụ của cơ quan, tổ chức, đơn vị thuộc phạm vi phụ trách, quản lý đảm bảo kịp thời, khoa học, hiệu quả',
    description: 'Năng lực chỉ đạo, tổ chức khoa học hiệu quả.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_de',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.đ',
    title: 'Có năng lực tập hợp, quy tụ cán bộ, công chức, viên chức thuộc phạm vi quản lý, xây dựng tập thể đoàn kết, thống nhất, vững mạnh; không để xảy ra mâu thuẫn',
    description: 'Quy tụ cán bộ, xây dựng tập thể đoàn kết.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },

  // 2. Khả năng đáp ứng yêu cầu nhiệm vụ thường xuyên, đột xuất (2.5đ)
  {
    id: 'A_II_2_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 2. Đáp ứng nhiệm vụ',
    code: 'A.II.2.a',
    title: 'Nhiệm vụ thường xuyên: Có khả năng vận dụng thành thạo kiến thức chuyên môn, nghiệp vụ để xử lý công việc chuyên môn theo kế hoạch định kỳ; duy trì ổn định chất lượng',
    description: 'Duy trì chất lượng chuyên môn ổn định theo kế hoạch.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_2_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 2. Đáp ứng nhiệm vụ',
    code: 'A.II.2.b',
    title: 'Nhiệm vụ đột xuất: Chủ động đề xuất giải pháp, thực hiện hiệu quả các công việc phát sinh có tính chất chuyên môn cao; có khả năng phản ứng nhanh, chính xác với yêu cầu mới',
    description: 'Đề xuất giải pháp, xử lý công việc phát sinh nhanh chóng.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // 3. Tinh thần trách nhiệm trong thực thi công vụ (2.5đ)
  {
    id: 'A_II_3_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 3. Tinh thần trách nhiệm',
    code: 'A.II.3.a',
    title: 'Có tinh thần trách nhiệm trong việc nghiên cứu, đề xuất, tham mưu nội dung chuyên môn; chủ động tiếp cận thông tin, kịp thời điều chỉnh cách làm phù hợp',
    description: 'Chủ động tham mưu, cải tiến phương pháp làm việc.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_3_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 3. Tinh thần trách nhiệm',
    code: 'A.II.3.b',
    title: 'Tích cực cập nhật, ứng dụng kiến thức, công nghệ mới trong công việc chuyên môn; có tinh thần cầu thị, phối hợp tốt trong các hoạt động liên quan',
    description: 'Tinh thần cầu thị, ứng dụng công nghệ mới.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // 4. Thái độ phục vụ & Phối hợp đồng nghiệp (2.5đ)
  {
    id: 'A_II_4_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 4. Phục vụ & Phối hợp',
    code: 'A.II.4.a',
    title: 'Được người dân, phụ huynh, học sinh đánh giá tích cực về tính chuyên nghiệp, rõ ràng, minh bạch trong giao tiếp, giải quyết công việc, tư vấn chuyên môn',
    description: 'Thái độ phục vụ tận tụy, rõ ràng, chuyên nghiệp.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_4_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 4. Phục vụ & Phối hợp',
    code: 'A.II.4.b',
    title: 'Được đánh giá có tinh thần trách nhiệm, hợp tác trong chuyên môn; bảo đảm phối hợp hiệu quả trong xử lý liên thông các thủ tục, công việc',
    description: 'Phối hợp hiệu quả với đồng nghiệp và đoàn thể.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // --- III. Năng lực đổi mới, sáng tạo, dám nghĩ dám làm (10đ) ---
  {
    id: 'A_III_1',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.1',
    title: 'Có sản phẩm, giải pháp đột phá, sáng tạo, đem lại giá trị, hiệu quả thiết thực, tác động tích cực đến kết quả thực hiện nhiệm vụ của đơn vị',
    description: 'Có sáng kiến, giải pháp cải tiến đem lại hiệu quả thực tế.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_2',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.2',
    title: 'Có năng lực đổi mới, sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung; sẵn sàng tham gia thực hiện nhiệm vụ đột xuất, phức tạp',
    description: 'Dám nghĩ dám làm, sẵn sàng nhận nhiệm vụ khó.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_3',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.3',
    title: 'Có tinh thần chịu trách nhiệm trước kết quả công việc; chủ động nhận trách nhiệm khi có sai sót và có biện pháp khắc phục rõ ràng, cụ thể',
    description: 'Chủ động chịu trách nhiệm và khắc phục khuyết điểm.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_4',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.4',
    title: 'Chủ động đưa ra quyết định trong phạm vi thẩm quyền, không né tránh, đùn đẩy trách nhiệm; có tinh thần tiên phong trong thực hiện nhiệm vụ mới',
    description: 'Tiên phong thực hiện nhiệm vụ mới, quyết đoán.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },


  // =========================================================================
  // B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO (TỐI ĐA 70 ĐIỂM)
  // (Đánh giá tích hợp Mẫu 01 - Nghị định 335/2025/NĐ-CP)
  // =========================================================================

  // --- I. Nhiệm vụ được giao trực tiếp & Chỉ đạo điều hành (35đ) ---
  // 1. Tỷ lệ số lượng công việc, sản phẩm hoàn thành (10đ)
  {
    id: 'B_I_1',
    section: 'B',
    category: 'I. Nhiệm vụ thực hiện trực tiếp & Điều hành (35đ) / 1. Tỷ lệ hoàn thành công việc (10đ)',
    code: 'B.I.1',
    title: 'Tỷ lệ số lượng công việc, sản phẩm hoàn thành (Căn cứ theo báo cáo Mẫu 01 đính kèm link minh chứng)',
    description: 'Chọn 1 mức tương ứng: 100% (10đ) | 90%-<100% (8đ) | 80%-<90% (6đ) | 70%-<80% (4đ) | 60%-<70% (1đ) | <60% (0đ)',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },
  // 2. Tỷ lệ số lượng công việc đảm bảo tiến độ (10đ)
  {
    id: 'B_I_2',
    section: 'B',
    category: 'I. Nhiệm vụ thực hiện trực tiếp & Điều hành (35đ) / 2. Tỷ lệ đảm bảo tiến độ (10đ)',
    code: 'B.I.2',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo tiến độ được giao',
    description: 'Chọn 1 mức tương ứng: 100% đúng tiến độ (10đ) | 90%-<100% (8đ) | 80%-<90% (6đ) | 70%-<80% (4đ) | 60%-<70% (1đ) | <60% (0đ)',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },
  // 3. Tỷ lệ số lượng công việc đảm bảo chất lượng (15đ)
  {
    id: 'B_I_3',
    section: 'B',
    category: 'I. Nhiệm vụ thực hiện trực tiếp & Điều hành (35đ) / 3. Tỷ lệ đảm bảo chất lượng (15đ)',
    code: 'B.I.3',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo chất lượng được phê duyệt',
    description: 'Chọn 1 mức: 95%-100% (15đ) | 90%-<95% (12đ) | 80%-<90% (10đ) | 70%-<80% (8đ) | 60%-<70% (5đ) | <60% (0đ)',
    maxPoints: 15,
    scoreOptions: generate025Options(15)
  },

  // --- II. Kết quả hoạt động của cơ quan, tổ chức, đơn vị (10đ) ---
  {
    id: 'B_II',
    section: 'B',
    category: 'II. Kết quả hoạt động của đơn vị (10đ)',
    code: 'B.II',
    title: 'Kết quả hoạt động của cơ quan, tổ chức, đơn vị thuộc phạm vi phụ trách/quản lý',
    description: '100% cá nhân đạt "hoàn thành nhiệm vụ" trở lên: 100% (10đ) | Có cá nhân "không hoàn thành": 50% (5đ)',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },

  // --- III. Khả năng tổ chức triển khai thực hiện nhiệm vụ (10đ) ---
  {
    id: 'B_III',
    section: 'B',
    category: 'III. Khả năng tổ chức triển khai thực hiện nhiệm vụ (10đ)',
    code: 'B.III',
    title: 'Khả năng tổ chức triển khai thực hiện nhiệm vụ theo kế hoạch công tác',
    description: 'Hoàn thành đầy đủ đúng thời hạn, bảo đảm chất lượng, có sáng kiến: 100% (10đ) | Có tồn tại hạn chế chậm trễ: 50% (5đ)',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },

  // --- IV. Năng lực tập hợp, đoàn kết công chức thuộc phạm vi quản lý (10đ) ---
  {
    id: 'B_IV',
    section: 'B',
    category: 'IV. Năng lực tập hợp, đoàn kết nội bộ (10đ)',
    code: 'B.IV',
    title: 'Năng lực tập hợp, duy trì môi trường làm việc đoàn kết, phối hợp hiệu quả',
    description: 'Môi trường làm việc đoàn kết, phối hợp tốt: 100% (10đ) | Có phản ánh khiếu nại mâu thuẫn kéo dài: 50% (5đ)',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },


  // =========================================================================
  // C. ĐIỂM CỘNG, ĐIỂM TRỪ THI ĐƯA
  // =========================================================================

  // I. ĐIỂM CỘNG THI ĐƯA (TỔNG C.1 + C.2 + C.3 + C.4 TỐI ĐA 7.0 ĐIỂM)
  {
    id: 'BONUS_1',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.1',
    title: 'C.1 - Ô 1: Giáo viên / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +1.0 điểm)',
    description: 'Giáo viên tự điền hoặc Hiệu trưởng duyệt nội dung thành tích đề xuất cộng điểm.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'BONUS_2',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.2',
    title: 'C.2 - Ô 2: Giáo viên / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +2.0 điểm)',
    description: 'Giáo viên tự điền hoặc Hiệu trưởng duyệt nội dung thành tích đề xuất cộng điểm bổ sung.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'BONUS_3',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.3',
    title: 'C.3 - Ô 3: Giáo viên / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +2.0 điểm)',
    description: 'Giáo viên tự điền hoặc Hiệu trưởng duyệt sáng kiến, thành tích xuất sắc áp dụng trong tháng.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'BONUS_4',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.4',
    title: 'C.4 - Hoàn thành công việc có tính chất phức tạp, công việc có nội dung hoàn toàn mới, chưa từng có tiền lệ xử lý, có tác động, ảnh hưởng tích cực trên phạm vi rộng của cơ quan, đơn vị, địa phương hoặc thành phố (Tối đa +2.0 điểm)',
    description: 'Mỗi một công việc nêu trên hoàn thành đảm bảo chất lượng, hiệu quả được cộng 01 điểm, tối đa không quá 02 điểm.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },

  // II. ĐIỂM TRỪ THI ĐƯA (TỔNG D.1 + D.2 + D.3)
  {
    id: 'DEDUCTION_1',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.1',
    title: 'D.1 - Ô 1: Giáo viên / Hiệu trưởng ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -1.0 điểm)',
    description: 'Nhập nội dung lý do vi phạm trễ hạn / quy chế và số điểm trừ tương ứng.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'DEDUCTION_2',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.2',
    title: 'D.2 - Ô 2: Giáo viên / Hiệu trưởng ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -2.0 điểm)',
    description: 'Nhập nội dung lý do vi phạm trễ hạn / quy chế bổ sung.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'DEDUCTION_3',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.3',
    title: 'D.3 - Ô 3: Giáo viên / Hiệu trưởng ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -2.0 điểm)',
    description: 'Nhập nội dung lý do vi phạm trễ hạn / quy chế bổ sung.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  }
];

export const CLASSIFICATION_RULES = [
  {
    type: 'HOAN_THANH_XUAT_SAC',
    label: 'Hoàn thành xuất sắc nhiệm vụ',
    minScore: 90,
    maxScore: 100,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Tổng điểm thi đua đạt từ 90 điểm trở lên'
  },
  {
    type: 'HOAN_THANH_TOT',
    label: 'Hoàn thành tốt nhiệm vụ',
    minScore: 80,
    maxScore: 89.99,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    description: 'Tổng điểm thi đua đạt từ 80 đến dưới 90 điểm'
  },
  {
    type: 'HOAN_THANH',
    label: 'Hoàn thành nhiệm vụ',
    minScore: 50,
    maxScore: 79.99,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    description: 'Tổng điểm thi đua đạt từ 50 đến dưới 80 điểm'
  },
  {
    type: 'KHONG_HOAN_THANH',
    label: 'Không hoàn thành nhiệm vụ',
    minScore: 0,
    maxScore: 49.99,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
    description: 'Tổng điểm thi đua đạt dưới 50 điểm'
  }
];

export function getClassification(score: number): 'HOAN_THANH_XUAT_SAC' | 'HOAN_THANH_TOT' | 'HOAN_THANH' | 'KHONG_HOAN_THANH' {
  if (score >= 90) return 'HOAN_THANH_XUAT_SAC';
  if (score >= 80) return 'HOAN_THANH_TOT';
  if (score >= 50) return 'HOAN_THANH';
  return 'KHONG_HOAN_THANH';
}

export function getClassificationLabel(type: string): string {
  switch (type) {
    case 'HOAN_THANH_XUAT_SAC': return 'Hoàn thành xuất sắc nhiệm vụ';
    case 'HOAN_THANH_TOT': return 'Hoàn thành tốt nhiệm vụ';
    case 'HOAN_THANH': return 'Hoàn thành nhiệm vụ';
    case 'KHONG_HOAN_THANH': return 'Không hoàn thành nhiệm vụ';
    default: return 'Chưa xếp loại';
  }
}
