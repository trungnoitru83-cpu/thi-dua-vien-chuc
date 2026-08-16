import { CriteriaItem, Teacher, Role } from '../types';

export function generate025Options(maxPoints: number): number[] {
  const options: number[] = [];
  for (let val = 0; val <= maxPoints + 0.0001; val += 0.25) {
    options.push(Math.round(val * 100) / 100);
  }
  return options;
}

// Helper to determine if a teacher holds a leadership/management position (Hiệu trưởng HT, Phó HT/Hiệu phó HP, Tổ trưởng TTCM, Tổ phó TPCM)
export function isLeaderTeacher(teacher?: Teacher): boolean {
  if (!teacher) return false;
  const pos = (teacher.position || '').toLowerCase().trim();
  const subj = (teacher.subject || '').toLowerCase().trim();
  const dept = (teacher.department || '').toLowerCase().trim();
  
  return (
    pos.includes('hiệu trưởng') ||
    pos.includes('phó hiệu trưởng') ||
    pos.includes('hiệu phó') ||
    pos.includes('tổ trưởng') ||
    pos.includes('tổ phó') ||
    pos.includes('ttcm') ||
    pos.includes('tpcm') ||
    pos.includes('lãnh đạo') ||
    pos.includes('quản lý') ||
    pos === 'ht' ||
    pos === 'hp' ||
    pos.startsWith('ht ') ||
    pos.startsWith('hp ') ||
    subj.includes('hiệu trưởng') ||
    subj.includes('phó hiệu trưởng') ||
    subj.includes('hiệu phó') ||
    subj.includes('ttcm') ||
    subj.includes('tpcm') ||
    subj.includes('tổ trưởng') ||
    subj.includes('tổ phó') ||
    dept.includes('bgh') ||
    dept.includes('ban giám hiệu') ||
    dept.includes('lãnh đạo')
  );
}

// Phân định rõ ràng Form mặc định:
// - Mẫu 02: Tổ trưởng chuyên môn (TTCM), Tổ phó chuyên môn (TPCM), Hiệu trưởng (HT), Hiệu phó (HP)
// - Mẫu 03: Giáo viên (GV), Nhân viên (NV)
export type FormType = 'mau02' | 'mau03';

export function getFormTypeForTeacher(teacher?: Teacher): FormType {
  return isLeaderTeacher(teacher) ? 'mau02' : 'mau03';
}

export function getFormLabel(formType: FormType): string {
  return formType === 'mau02'
    ? 'Mẫu 02 (Lãnh đạo, TTCM, TPCM, HT, HP)'
    : 'Mẫu 03 (Giáo viên, Nhân viên)';
}

export function getDefaultRoleForTeacher(teacher: Teacher): Role {
  const pos = (teacher.position || '').toLowerCase();
  const dept = (teacher.department || '').toLowerCase();

  if (pos.includes('hiệu trưởng') || pos.includes('phó hiệu trưởng') || pos.includes('hiệu phó') || dept.includes('ban giám hiệu') || dept.includes('bgh')) {
    return 'principal';
  }
  if (pos.includes('tổ trưởng') || pos.includes('tổ phó') || pos.includes('ttcm') || pos.includes('tpcm')) {
    return 'department_head';
  }
  if (pos.includes('nhân viên') || dept.includes('văn phòng') || dept.includes('qlnt') || pos.includes('y tế') || pos.includes('kế toán') || pos.includes('văn thư') || pos.includes('bảo vệ')) {
    return 'staff';
  }
  return 'teacher';
}

// =========================================================================
// MẪU SỐ 02: PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG LÃNH ĐẠO, QUẢN LÝ
// (Dành cho Hiệu trưởng, Phó Hiệu trưởng, Tổ trưởng chuyên môn)
// =========================================================================
export const FORM_02_CRITERIA: CriteriaItem[] = [
  // --- A. TIÊU CHÍ CHUNG (TỐI ĐA 30 ĐIỂM) ---

  // I. Phẩm chất chính trị, phẩm chất đạo đức, văn hóa thực thi công vụ và ý thức kỷ luật, kỷ cương trong thực thi công vụ (10đ)
  // 1. Phẩm chất chính trị, phẩm chất đạo đức, văn hóa thực thi công vụ (5đ)
  {
    id: 'A_I_1_a',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.a',
    title: 'Chấp hành nghiêm túc đường lối, chủ trương của Đảng, chính sách pháp luật của Nhà nước và các nguyên tắc tổ chức, kỷ luật của Đảng',
    description: 'Chấp hành nghiêm túc đường lối, chủ trương của Đảng, chính sách pháp luật của Nhà nước.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_b',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.b',
    title: 'Có quan điểm, bản lĩnh chính trị vững vàng; kiên định lập trường; không dao động trước mọi khó khăn, thách thức',
    description: 'Bản lĩnh chính trị vững vàng, kiên định lập trường.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_c',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.c',
    title: 'Có ý thức nghiên cứu, học tập, vận dụng chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh, nghị quyết, chỉ thị, quyết định và các văn bản của Đảng và Nhà nước',
    description: 'Ý thức nghiên cứu, học tập chỉ thị nghị quyết của Đảng, Nhà nước.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_d',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.d',
    title: 'Giữ gìn phẩm chất đạo đức, lối sống trong sáng, trung thực, khiêm tốn, chân thành, giản dị; cần, kiệm, liêm, chính, chí công vô tư; không có biểu hiện suy thoái về tư tưởng chính trị, đạo đức, lối sống, "tự diễn biến", "tự chuyển hóa"',
    description: 'Đạo đức lối sống trong sáng, không có biểu hiện suy thoái.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_de',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.đ',
    title: 'Không tham ô, tham nhũng, lãng phí, tiêu cực, quan liêu, hách dịch, cửa quyền, vụ lợi; không để người thân, người quen lợi dụng chức vụ, quyền hạn của mình để trục lợi',
    description: 'Liêm chính, không tham nhũng, hách dịch, vụ lợi.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_e',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.e',
    title: 'Có tinh thần đoàn kết, ý thức xây dựng cơ quan, tổ chức, đơn vị trong sạch, vững mạnh; tích cực tham gia các hoạt động tập thể',
    description: 'Đoàn kết nội bộ, xây dựng đơn vị vững mạnh.',
    maxPoints: 0.75,
    scoreOptions: generate025Options(0.75)
  },
  {
    id: 'A_I_1_ee',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
    code: 'A.I.1.ê',
    title: 'Thực hiện văn hóa công vụ; có thái độ đúng mực, phong cách làm việc chuẩn mực, chuyên nghiệp trong quan hệ công tác',
    description: 'Văn hóa công vụ chuẩn mực, làm việc chuyên nghiệp.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_I_1_g',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 1. Phẩm chất chính trị, đạo đức',
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
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.a',
    title: 'Chấp hành sự phân công của tổ chức',
    description: 'Chấp hành sự phân công của tổ chức.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_b',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.b',
    title: 'Thực hiện các quy định, quy chế, nội quy của cơ quan, tổ chức, đơn vị nơi công tác',
    description: 'Thực hiện nội quy, quy chế làm việc của cơ quan.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_c',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.c',
    title: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định',
    description: 'Kê khai tài sản, thu nhập minh bạch đúng quy định.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'A_I_2_d',
    section: 'A',
    category: 'I. Phẩm chất chính trị, đạo đức, văn hóa & Kỷ luật / 2. Ý thức kỷ luật, kỷ cương',
    code: 'A.I.2.d',
    title: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác, khách quan về những nội dung liên quan đến việc thực hiện chức trách, nhiệm vụ được giao và hoạt động của cơ quan, tổ chức, đơn vị với cấp trên khi được yêu cầu',
    description: 'Báo cáo đầy đủ, trung thực thông tin hoạt động với cấp trên.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },

  // II. Năng lực chuyên môn, nghiệp vụ theo yêu cầu của vị trí việc làm (10đ)
  // 1. Năng lực chuyên môn, nghiệp vụ theo yêu cầu của vị trí việc làm (2.5đ)
  {
    id: 'A_II_1_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.a',
    title: 'Có kiến thức, hiểu biết đầy đủ, toàn diện, chuyên sâu về quy định của pháp luật liên quan ngành, lĩnh vực công tác được phân công phụ trách; chủ động nghiên cứu, đề xuất giải pháp thực hiện hiệu quả các công việc phát sinh có tính chất chuyên môn cao',
    description: 'Hiểu biết chuyên sâu pháp luật và lĩnh vực phụ trách, đề xuất giải pháp hiệu quả.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.b',
    title: 'Thường xuyên cập nhật kiến thức mới, có khả năng nghiên cứu, phân tích, tổng hợp và vận dụng sáng tạo vào công việc; đáp ứng yêu cầu đổi mới, cải cách hành chính',
    description: 'Cập nhật kiến thức mới, phân tích tổng hợp sáng tạo.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_c',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.c',
    title: 'Có kỹ năng xử lý công việc độc lập, làm việc nhóm hiệu quả; sử dụng thành thạo công nghệ thông tin và các công cụ hỗ trợ phục vụ chuyên môn, nghiệp vụ; tích cực cập nhật, ứng dụng công nghệ mới trong công việc chuyên môn',
    description: 'Kỹ năng làm việc độc lập/nhóm, ứng dụng CNTT hiệu quả.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_d',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.d',
    title: 'Có năng lực lãnh đạo, chỉ đạo, điều hành, tổ chức triển khai thực hiện nhiệm vụ của cơ quan, tổ chức, đơn vị thuộc phạm vi phụ trách, quản lý đảm bảo kịp thời, khoa học, hiệu quả, không bỏ sót nhiệm vụ',
    description: 'Năng lực lãnh đạo chỉ đạo điều hành khoa học hiệu quả.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_de',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.đ',
    title: 'Có năng lực tập hợp, quy tụ cán bộ, công chức, viên chức thuộc phạm vi quản lý, xây dựng tập thể đoàn kết, thống nhất, vững mạnh; không để xảy ra tình trạng mâu thuẫn, mất đoàn kết nội bộ',
    description: 'Tập hợp quy tụ cán bộ, xây dựng tập thể đoàn kết.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },

  // 2. Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao thường xuyên, đột xuất (2.5đ)
  {
    id: 'A_II_2_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 2. Đáp ứng nhiệm vụ',
    code: 'A.II.2.a',
    title: 'Nhiệm vụ thường xuyên: Có khả năng vận dụng thành thạo kiến thức chuyên môn, nghiệp vụ để xử lý công việc chuyên môn theo kế hoạch định kỳ; duy trì ổn định chất lượng chuyên môn',
    description: 'Vận dụng chuyên môn xử lý công việc định kỳ chất lượng.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_2_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 2. Đáp ứng nhiệm vụ',
    code: 'A.II.2.b',
    title: 'Nhiệm vụ đột xuất: Chủ động đề xuất giải pháp, thực hiện hiệu quả các công việc phát sinh có tính chất chuyên môn cao; có khả năng phản ứng nhanh, chính xác với yêu cầu mới',
    description: 'Đề xuất giải pháp, phản ứng nhanh với nhiệm vụ đột xuất.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // 3. Tinh thần trách nhiệm trong thực thi công vụ (2.5đ)
  {
    id: 'A_II_3_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 3. Tinh thần trách nhiệm',
    code: 'A.II.3.a',
    title: 'Có tinh thần trách nhiệm trong nghiên cứu, đề xuất, tham mưu nội dung chuyên môn; chủ động tiếp cận thông tin, kịp thời điều chỉnh cách làm để phù hợp với yêu cầu mới',
    description: 'Trách nhiệm tham mưu đề xuất, điều chỉnh cách làm kịp thời.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_3_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 3. Tinh thần trách nhiệm',
    code: 'A.II.3.b',
    title: 'Tích cực cập nhật, ứng dụng kiến thức, công nghệ mới trong công việc chuyên môn; có tinh thần cầu thị, phối hợp tốt trong các hoạt động liên quan đến chuyên môn',
    description: 'Cập nhật công nghệ, cầu thị và phối hợp chuyên môn tốt.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // 4. Thái độ phục vụ người dân, doanh nghiệp và khả năng phối hợp với đồng nghiệp (2.5đ)
  {
    id: 'A_II_4_a',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 4. Phục vụ & Phối hợp',
    code: 'A.II.4.a',
    title: 'Được người dân, doanh nghiệp đánh giá tích cực về tính chuyên nghiệp, rõ ràng, minh bạch trong tiếp nhận, giải quyết thủ tục hành chính, cung cấp thông tin, tư vấn chuyên môn (đối với các vị trí việc làm tiếp xúc trực tiếp với người dân, doanh nghiệp).',
    description: 'Phục vụ tận tụy, minh bạch, được đánh giá tích cực.',
    maxPoints: 1.5,
    scoreOptions: generate025Options(1.5)
  },
  {
    id: 'A_II_4_b',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm, thái độ & phối hợp / 4. Phục vụ & Phối hợp',
    code: 'A.II.4.b',
    title: 'Được đánh giá có tinh thần trách nhiệm, hợp tác trong chuyên môn; bảo đảm phối hợp hiệu quả trong xử lý liên thông các thủ tục, công việc (đối với các vị trí việc làm không tiếp xúc trực tiếp với người dân, doanh nghiệp).',
    description: 'Trách nhiệm, hợp tác phối hợp liên thông hiệu quả.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },

  // III. Năng lực đổi mới, sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung trong thực thi công vụ (10đ)
  {
    id: 'A_III_1',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.1',
    title: 'Có sản phẩm, giải pháp đột phá, sáng tạo, đem lại giá trị, hiệu quả thiết thực, tác động tích cực đến kết quả thực hiện nhiệm vụ của cơ quan, tổ chức, đơn vị',
    description: 'Sản phẩm giải pháp đột phá sáng tạo đem lại hiệu quả thực tế.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_2',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.2',
    title: 'Có năng lực đổi mới, sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung trong thực thi công vụ; dám đương đầu với khó khăn, thách thức, sẵn sàng tham gia thực hiện nhiệm vụ chính trị đặc biệt quan trọng, nhiệm vụ có tính chất đột xuất, phức tạp hoặc trong điều kiện khó khăn',
    description: 'Dám nghĩ dám làm, dám đương đầu khó khăn thách thức.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_3',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.3',
    title: 'Có tinh thần chịu trách nhiệm trước kết quả công việc; chủ động nhận trách nhiệm khi có sai sót và có biện pháp khắc phục rõ ràng, cụ thể',
    description: 'Chịu trách nhiệm trước kết quả, nhận trách nhiệm và khắc phục.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },
  {
    id: 'A_III_4',
    section: 'A',
    category: 'III. Năng lực đổi mới, sáng tạo & Dám chịu trách nhiệm',
    code: 'A.III.4',
    title: 'Chủ động đưa ra quyết định trong phạm vi thẩm quyền, không có biểu hiện né tránh, đùn đẩy, không làm đúng, đầy đủ chức trách, nhiệm vụ, quyền hạn được giao theo quy định của cơ quan có thẩm quyền; có tinh thần tiên phong trong thực hiện những nhiệm vụ mới',
    description: 'Chủ động quyết định, không đùn đẩy, tiên phong nhiệm vụ mới.',
    maxPoints: 2.5,
    scoreOptions: generate025Options(2.5)
  },

  // --- B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO (TỐI ĐA 70 ĐIỂM) ---
  // I. Nhiệm vụ được giao trực tiếp thực hiện và nhiệm vụ chỉ đạo, điều hành, tổ chức thực hiện nhiệm vụ (35đ)
  {
    id: 'B_1',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / I. Nhiệm vụ trực tiếp & chỉ đạo điều hành (35đ)',
    code: 'B.I.1',
    title: 'Tỷ lệ số lượng công việc, sản phẩm hoàn thành (Tối đa 10 điểm)',
    description: '- Tỷ lệ công việc, sản phẩm hoàn thành = (Số lượng công việc, sản phẩm hoàn thành/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm hoàn thành = Tỷ lệ sản phẩm, công việc hoàn thành X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 10,
    scoreOptions: generate025Options(10),
    tiers: [
      { code: 'a', label: 'Hoàn thành 100% số lượng công việc, sản phẩm được giao', points: 10 },
      { code: 'b', label: 'Hoàn thành từ 90% đến dưới 100% số lượng công việc, sản phẩm được giao', points: 8 },
      { code: 'c', label: 'Hoàn thành từ 80% đến dưới 90% số lượng công việc, sản phẩm được giao', points: 6 },
      { code: 'd', label: 'Hoàn thành từ 70% đến dưới 80% số lượng công việc, sản phẩm được giao', points: 4 },
      { code: 'đ', label: 'Hoàn thành từ 60% đến dưới 70% số lượng công việc, sản phẩm được giao', points: 1 },
      { code: 'e', label: 'Hoàn thành dưới 60% số lượng công việc, sản phẩm được giao', points: 0 }
    ]
  },
  {
    id: 'B_2',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / I. Nhiệm vụ trực tiếp & chỉ đạo điều hành (35đ)',
    code: 'B.I.2',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo tiến độ (Tối đa 10 điểm)',
    description: '- Tỷ lệ công việc, sản phẩm đảm bảo tiến độ = (Số lượng công việc, sản phẩm đảm bảo tiến độ trở lên/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm đảm bảo tiến độ = Tỷ lệ sản phẩm, công việc đảm bảo tiến độ X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 10,
    scoreOptions: generate025Options(10),
    tiers: [
      { code: 'a', label: 'Có 100% công việc, sản phẩm đảm bảo đúng tiến độ được giao', points: 10 },
      { code: 'b', label: 'Có từ 90% đến dưới 100% công việc, sản phẩm đảm bảo đúng tiến độ', points: 8 },
      { code: 'c', label: 'Có từ 80% đến dưới 90% công việc, sản phẩm đảm bảo đúng tiến độ', points: 6 },
      { code: 'd', label: 'Có từ 70% đến dưới 80% công việc, sản phẩm đảm bảo đúng tiến độ', points: 4 },
      { code: 'đ', label: 'Có từ 60% đến dưới 70% công việc, sản phẩm đảm bảo đúng tiến độ', points: 1 },
      { code: 'e', label: 'Có dưới 60% công việc, sản phẩm đảm bảo đúng tiến độ', points: 0 }
    ]
  },
  {
    id: 'B_3',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / I. Nhiệm vụ trực tiếp & chỉ đạo điều hành (35đ)',
    code: 'B.I.3',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo chất lượng (Tối đa 15 điểm)',
    description: '- Tỷ lệ công việc, sản phẩm đảm bảo chất lượng = (Số lượng công việc, sản phẩm hoàn thành đạt yêu cầu về nội dung/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm đảm bảo chất lượng = Tỷ lệ sản phẩm, công việc hoàn thành đạt yêu cầu về nội dung X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 15,
    scoreOptions: generate025Options(15),
    tiers: [
      { code: 'a', label: 'Có từ 90 đến 100% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 15 },
      { code: 'b', label: 'Có từ 80 đến dưới 90% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 12 },
      { code: 'c', label: 'Có từ 70 đến dưới 80% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 10 },
      { code: 'd', label: 'Có từ 60 đến dưới 70% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 8 },
      { code: 'đ', label: 'Có từ 50 đến dưới 60% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 5 },
      { code: 'e', label: 'Có dưới 50% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 0 }
    ]
  },

  // II. Kết quả hoạt động của cơ quan, tổ chức, đơn vị (10 điểm)
  {
    id: 'B_II',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / II. Kết quả hoạt động đơn vị (10đ)',
    code: 'B.II',
    title: 'Kết quả hoạt động của cơ quan, tổ chức, đơn vị (Tối đa 10 điểm)',
    description: '- Trường hợp 100% công chức thuộc thẩm quyền quản lý có điểm đánh giá ở mức điểm tương ứng với mức xếp loại chất lượng "hoàn thành nhiệm vụ" trở lên thì được tính đạt điểm tỷ lệ bằng 100% (10 điểm);\n- Trường hợp có công chức thuộc thẩm quyền quản lý có điểm đánh giá ở mức điểm tương ứng với mức xếp loại chất lượng "không hoàn thành nhiệm vụ" thì được tính đạt điểm tỷ lệ bằng 50% (5 điểm).',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },

  // III. Khả năng tổ chức triển khai thực hiện nhiệm vụ (10 điểm)
  {
    id: 'B_III',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / III. Khả năng tổ chức triển khai thực hiện nhiệm vụ (10đ)',
    code: 'B.III',
    title: 'Khả năng tổ chức triển khai thực hiện nhiệm vụ (Tối đa 10 điểm)',
    description: '- Trường hợp cơ quan, tổ chức, đơn vị hoàn thành đầy đủ các nhiệm vụ theo kế hoạch đúng thời hạn, bảo đảm chất lượng, có sáng kiến hoặc giải pháp tổ chức thực hiện hiệu quả thì được tính đạt điểm tỷ lệ bằng 100% (10 điểm);\n- Trường hợp trong kỳ đánh giá có tồn tại, hạn chế, chậm trễ kéo dài trong việc thực hiện chương trình, kế hoạch công tác được giao thì được tính đạt điểm tỷ lệ bằng 50% (5 điểm).',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },

  // IV. Năng lực tập hợp, đoàn kết công chức thuộc phạm vi quản lý (10 điểm)
  {
    id: 'B_IV',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / IV. Năng lực tập hợp, đoàn kết (10đ)',
    code: 'B.IV',
    title: 'Năng lực tập hợp, đoàn kết công chức thuộc phạm vi quản lý (Tối đa 10 điểm)',
    description: '- Trường hợp cơ quan, tổ chức, đơn vị duy trì được môi trường làm việc đoàn kết, phối hợp hiệu quả giữa các cá nhân, bộ phận thì tính đạt điểm tỷ lệ bằng 100% (10 điểm);\n- Trường hợp trong kỳ đánh giá phát sinh phản ánh, khiếu nại, kiến nghị về mâu thuẫn, mất đoàn kết nội bộ kéo dài thì tính đạt điểm tỷ lệ bằng 50% (5 điểm).',
    maxPoints: 10,
    scoreOptions: generate025Options(10)
  },

  // --- C. ĐIỂM CỘNG, ĐIỂM TRỪ THI ĐƯA ---
  {
    id: 'BONUS_1',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.1',
    title: 'C.1 - Ô 1: Lãnh đạo / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +1.0 điểm)',
    description: 'Tự điền hoặc Hiệu trưởng duyệt nội dung thành tích đề xuất cộng điểm.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'BONUS_2',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.2',
    title: 'C.2 - Ô 2: Lãnh đạo / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +2.0 điểm)',
    description: 'Thành tích bổ sung đề xuất cộng điểm.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'BONUS_3',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.3',
    title: 'C.3 - Ô 3: Lãnh đạo / Hiệu trưởng ghi nhận thành tích & nội dung cộng điểm (Tối đa +2.0 điểm)',
    description: 'Sáng kiến, thành tích xuất sắc áp dụng trong tháng.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'BONUS_4',
    section: 'BONUS',
    category: 'I. ĐIỂM CỘNG THI ĐƯA (Tổng C.1 + C.2 + C.3 + C.4 tối đa 7.0 điểm)',
    code: 'C.4',
    title: 'C.4 - Hoàn thành công việc có tính chất phức tạp, công việc có nội dung hoàn toàn mới (Tối đa +2.0 điểm)',
    description: 'Mỗi công việc hoàn thành đảm bảo chất lượng được cộng 1 điểm, tối đa 2 điểm.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },

  {
    id: 'DEDUCTION_1',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.1',
    title: 'D.1 - Ô 1: Ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -1.0 điểm)',
    description: 'Nội dung vi phạm trễ hạn / quy chế.',
    maxPoints: 1.0,
    scoreOptions: generate025Options(1.0)
  },
  {
    id: 'DEDUCTION_2',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.2',
    title: 'D.2 - Ô 2: Ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -2.0 điểm)',
    description: 'Nội dung vi phạm bổ sung.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },
  {
    id: 'DEDUCTION_3',
    section: 'DEDUCTION',
    category: 'II. ĐIỂM TRỪ THI ĐƯA (Tổng D.1 + D.2 + D.3 tối đa 5.0 điểm)',
    code: 'D.3',
    title: 'D.3 - Ô 3: Ghi nhận lý do & nội dung vi phạm trừ điểm (Tối đa -2.0 điểm)',
    description: 'Nội dung vi phạm bổ sung.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  }
];

// =========================================================================
// MẪU SỐ 03: PHIẾU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG CÁN BỘ, GIÁO VIÊN
// (Dành cho Giáo viên, Nhân viên không giữ chức vụ lãnh đạo, quản lý)
// =========================================================================
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
    title: 'Thực hiện văn hóa công vụ; có thái độ đúng mực, phong cách làm việc chuẩn mực, chuyên nghiệp trong quan hệ công tác',
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
    title: 'Có năng lực tham mưu, đề xuất, thực hiện chuyên môn nghiệp vụ được giao kịp thời, khoa học, hiệu quả',
    description: 'Thực hiện chuyên môn khoa học hiệu quả.',
    maxPoints: 0.5,
    scoreOptions: generate025Options(0.5)
  },
  {
    id: 'A_II_1_de',
    section: 'A',
    category: 'II. Năng lực chuyên môn, trách nhiệm & Phối hợp / 1. Năng lực chuyên môn',
    code: 'A.II.1.đ',
    title: 'Có khả năng phối hợp chặt chẽ với đồng nghiệp, xây dựng tập thể đoàn kết, thống nhất',
    description: 'Phối hợp với đồng nghiệp, xây dựng tập thể đoàn kết.',
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
  // =========================================================================
  {
    id: 'B_1',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / 1. Tỷ lệ số lượng công việc, sản phẩm hoàn thành (20đ)',
    code: 'B.1',
    title: 'Tỷ lệ số lượng công việc, sản phẩm hoàn thành',
    description: '- Tỷ lệ công việc, sản phẩm hoàn thành = (Số lượng công việc, sản phẩm hoàn thành/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm hoàn thành = Tỷ lệ sản phẩm, công việc hoàn thành X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 20,
    scoreOptions: generate025Options(20),
    tiers: [
      { code: 'a', label: 'Hoàn thành 100% số lượng công việc, sản phẩm được giao', points: 20 },
      { code: 'b', label: 'Hoàn thành từ 90% đến dưới 100% số lượng công việc, sản phẩm được giao', points: 15 },
      { code: 'c', label: 'Hoàn thành từ 80% đến dưới 90% số lượng công việc, sản phẩm được giao', points: 10 },
      { code: 'd', label: 'Hoàn thành từ 70% đến dưới 80% số lượng công việc, sản phẩm được giao', points: 5 },
      { code: 'đ', label: 'Hoàn thành từ 60% đến dưới 70% số lượng công việc, sản phẩm được giao', points: 1 },
      { code: 'e', label: 'Hoàn thành dưới 60% số lượng công việc, sản phẩm được giao', points: 0 }
    ]
  },
  {
    id: 'B_2',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / 2. Tỷ lệ số lượng công việc, sản phẩm đảm bảo tiến độ (20đ)',
    code: 'B.2',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo tiến độ',
    description: '- Tỷ lệ công việc, sản phẩm đảm bảo tiến độ = (Số lượng công việc, sản phẩm đảm bảo tiến độ trở lên/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm đảm bảo tiến độ = Tỷ lệ sản phẩm, công việc đảm bảo tiến độ X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 20,
    scoreOptions: generate025Options(20),
    tiers: [
      { code: 'a', label: 'Có 100% công việc, sản phẩm đảm bảo đúng tiến độ được giao', points: 20 },
      { code: 'b', label: 'Có từ 90% đến dưới 100% công việc, sản phẩm đảm bảo đúng tiến độ', points: 15 },
      { code: 'c', label: 'Có từ 80% đến dưới 90% công việc, sản phẩm đảm bảo đúng tiến độ', points: 10 },
      { code: 'd', label: 'Có từ 70% đến dưới 80% công việc, sản phẩm đảm bảo đúng tiến độ', points: 5 },
      { code: 'đ', label: 'Có từ 60% đến dưới 70% công việc, sản phẩm đảm bảo đúng tiến độ', points: 1 },
      { code: 'e', label: 'Có dưới 60% công việc, sản phẩm đảm bảo đúng tiến độ', points: 0 }
    ]
  },
  {
    id: 'B_3',
    section: 'B',
    category: 'B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO / 3. Tỷ lệ số lượng công việc, sản phẩm đảm bảo chất lượng (30đ)',
    code: 'B.3',
    title: 'Tỷ lệ số lượng công việc, sản phẩm đảm bảo chất lượng',
    description: '- Tỷ lệ công việc, sản phẩm đảm bảo chất lượng = (Số lượng công việc, sản phẩm hoàn thành đạt yêu cầu về nội dung/Số lượng công việc, sản phẩm được giao) X 100.\n- Điểm tỷ lệ công việc, sản phẩm đảm bảo chất lượng = Tỷ lệ sản phẩm, công việc hoàn thành đạt yêu cầu về nội dung X số điểm tối đa tương ứng.\nLưu ý: Chỉ điền vào 01 dòng duy nhất trong số các dòng bên dưới.',
    maxPoints: 30,
    scoreOptions: generate025Options(30),
    tiers: [
      { code: 'a', label: 'Có từ 95 đến 100% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 30 },
      { code: 'b', label: 'Có từ 90 đến dưới 95% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 25 },
      { code: 'c', label: 'Có từ 80 đến dưới 90% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 20 },
      { code: 'd', label: 'Có từ 70 đến dưới 80% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 15 },
      { code: 'đ', label: 'Có từ 60 đến dưới 70% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 10 },
      { code: 'e', label: 'Có từ 50 đến dưới 60% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 5 },
      { code: 'g', label: 'Có dưới 50% công việc, sản phẩm đảm bảo chất lượng được cấp có thẩm quyền xác nhận, phê duyệt', points: 0 }
    ]
  },

  // =========================================================================
  // C. ĐIỂM CỘNG, ĐIỂM TRỪ THI ĐƯA
  // =========================================================================
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
    title: 'C.4 - Hoàn thành công việc có tính chất phức tạp, công việc có nội dung hoàn toàn mới (Tối đa +2.0 điểm)',
    description: 'Mỗi một công việc nêu trên hoàn thành đảm bảo chất lượng, hiệu quả được cộng 01 điểm, tối đa không quá 02 điểm.',
    maxPoints: 2.0,
    scoreOptions: generate025Options(2.0)
  },

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

export function getCriteriaForTeacher(teacher?: Teacher, customFormType?: 'mau02' | 'mau03'): CriteriaItem[] {
  if (customFormType === 'mau02') return FORM_02_CRITERIA;
  if (customFormType === 'mau03') return FORM_03_CRITERIA;
  return isLeaderTeacher(teacher) ? FORM_02_CRITERIA : FORM_03_CRITERIA;
}

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
