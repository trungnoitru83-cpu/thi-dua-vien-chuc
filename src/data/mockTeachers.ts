import { Teacher, Form01Data, Form03Evaluation } from '../types';
import { FORM_03_CRITERIA, getClassification } from './form03Criteria';

export const SCHOOL_NAME = 'Trường PTDTNT THCS và THPT Nước Oa';

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 'gv01', fullName: 'Nguyễn Xuân Ảnh', email: 'anh.nguyen@nuocoa.edu.vn', dob: '15/04/1975', subject: 'Hiệu trưởng', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv02', fullName: 'Hồ Thị Hiến', email: 'hien.ho@nuocoa.edu.vn', dob: '22/08/1978', subject: 'Hiệu trưởng', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv03', fullName: 'Đinh Hữu Phước', email: 'phuoc.dinh@nuocoa.edu.vn', dob: '10/11/1980', subject: 'Phó hiệu trưởng', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv04', fullName: 'Nguyễn Thị Hồng', email: 'hong.nguyen@nuocoa.edu.vn', dob: '05/01/1985', subject: 'Nhân viên', department: 'Văn phòng', school: SCHOOL_NAME },
  { id: 'gv05', fullName: 'Lương Văn Hơn', email: 'hon.luong@nuocoa.edu.vn', dob: '18/09/1982', subject: 'Nhân viên', department: 'Văn phòng', school: SCHOOL_NAME },
  { id: 'gv06', fullName: 'Ng.Thị Tường Vy', email: 'vy.nguyen@nuocoa.edu.vn', dob: '30/03/1988', subject: 'Nhân viên văn thư', department: 'Văn phòng', school: SCHOOL_NAME },
  { id: 'gv07', fullName: 'Vũ Thị Hồng Ngọc', email: 'ngoc.vu@nuocoa.edu.vn', dob: '12/07/1989', subject: 'Nhân viên kế toán', department: 'Văn phòng', school: SCHOOL_NAME },
  { id: 'gv08', fullName: 'Nguyễn Đình Lâu', email: 'lau.nguyen@nuocoa.edu.vn', dob: '25/02/1981', subject: 'TTCM - Lịch sử', department: 'KHXH2', school: SCHOOL_NAME },
  { id: 'gv09', fullName: 'Hồ Thị Hiếu', email: 'hieu.ho@nuocoa.edu.vn', dob: '08/12/1987', subject: 'Giáo viên', department: 'KHXH2', school: SCHOOL_NAME },
  { id: 'gv10', fullName: 'Lữ Văm Lam', email: 'lam.lu@nuocoa.edu.vn', dob: '14/06/1986', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv11', fullName: 'Nguyễn Hùng Vỹ', email: 'vy.nguyenhung@nuocoa.edu.vn', dob: '03/05/1984', subject: 'Giáo viên', department: 'KHXH2', school: SCHOOL_NAME },
  { id: 'gv12', fullName: 'Huỳnh Thị Bích Lợi', email: 'loi.huynh@nuocoa.edu.vn', dob: '19/10/1988', subject: 'Giáo viên', department: 'KHXH2', school: SCHOOL_NAME },
  { id: 'gv13', fullName: 'Phạm Lý Nghĩa', email: 'nghia.pham@nuocoa.edu.vn', dob: '27/01/1983', subject: 'TTCM - Vật lý', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv14', fullName: 'Nguyễn Văn Trung', email: 'trung.nguyen@nuocoa.edu.vn', dob: '11/08/1985', subject: 'Giáo viên-TKHĐ', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv15', fullName: 'Huỳnh Thị Mi Sa', email: 'misa.huynh@nuocoa.edu.vn', dob: '09/04/1989', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv16', fullName: 'Bùi Thị Mỹ An', email: 'an.bui@nuocoa.edu.vn', dob: '16/09/1990', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv17', fullName: 'Nguyễn Văn Ân Tình', email: 'tinh.nguyen@nuocoa.edu.vn', dob: '02/11/1987', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv18', fullName: 'Bùi Thị Hồng Thắm', email: 'tham.bui@nuocoa.edu.vn', dob: '20/06/1991', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv19', fullName: 'Trần Thị Kim Tuyến', email: 'tuyen.tran@nuocoa.edu.vn', dob: '13/03/1988', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv20', fullName: 'Cao Thị Hà My', email: 'my.cao@nuocoa.edu.vn', dob: '07/07/1992', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv21', fullName: 'Lê Thị Hoa', email: 'hoa.le@nuocoa.edu.vn', dob: '29/01/1986', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv22', fullName: 'Trần Thị Kiều Hương', email: 'huong.tran@nuocoa.edu.vn', dob: '17/05/1989', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv23', fullName: 'Nguyễn Văn Sĩ', email: 'si.nguyen@nuocoa.edu.vn', dob: '21/10/1984', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME },
  { id: 'gv24', fullName: 'Huỳnh Thị Minh Hằng', email: 'hang.huynh@nuocoa.edu.vn', dob: '04/02/1990', subject: 'Nhân viên QLNT', department: 'QLNT', school: SCHOOL_NAME },
  { id: 'gv25', fullName: 'Trần Văn Hảo', email: 'hao.tran@nuocoa.edu.vn', dob: '18/12/1985', subject: 'Giáo viên', department: 'KHXH2', school: SCHOOL_NAME },
  { id: 'gv26', fullName: 'Lê Văn Lập', email: 'lap.le@nuocoa.edu.vn', dob: '06/08/1987', subject: 'BTĐTN', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv27', fullName: 'Hoàng Văn Hùng', email: 'hung.hoang@nuocoa.edu.vn', dob: '31/05/1983', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv28', fullName: 'Huỳnh Thị Trang', email: 'trang.huynh@nuocoa.edu.vn', dob: '15/09/1990', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv29', fullName: 'Hồ Thị Bờ', email: 'bo.ho@nuocoa.edu.vn', dob: '23/11/1991', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv30', fullName: 'Nguyễn Thị Hồng Châu', email: 'chau.nguyen@nuocoa.edu.vn', dob: '10/03/1986', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv31', fullName: 'Lê Thị Phương Uyên', email: 'uyen.le@nuocoa.edu.vn', dob: '28/07/1992', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv32', fullName: 'Nguyễn Duy Vũ', email: 'vu.nguyen@nuocoa.edu.vn', dob: '12/01/1988', subject: 'Nhân viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv33', fullName: 'Nguyễn Thị Hoà', email: 'hoa.nguyen@nuocoa.edu.vn', dob: '05/06/1989', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv34', fullName: 'Trần Thị Nhật', email: 'nhat.tran@nuocoa.edu.vn', dob: '19/02/1990', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv35', fullName: 'Nguyễn Phạm Trúc Phương', email: 'phuong.nguyen@nuocoa.edu.vn', dob: '14/11/1993', subject: 'Giáo viên', department: 'KHXH1', school: SCHOOL_NAME },
  { id: 'gv36', fullName: 'Nguyễn Văn Hoài', email: 'hoai.nguyen@nuocoa.edu.vn', dob: '26/04/1991', subject: 'Giáo viên', department: 'KHTN', school: SCHOOL_NAME }
];

// Helper to build initial Form 01 for a teacher
export function createDefaultForm01(teacherId: string, month: number, year: number = 2026): Form01Data {
  return {
    teacherId,
    month,
    year,
    tasks: [
      {
        id: 't1',
        taskName: 'Giảng dạy theo thời khóa biểu & Thực hiện quy chế chuyên môn',
        assignedTarget: 'Đảm bảo đủ 100% tiết dạy, chuẩn bị giáo án trước 2 ngày',
        result: 'Đã thực hiện đầy đủ 100% số tiết, giáo án đúng tiến độ',
        completionRate: 100,
        status: 'completed',
        evidenceLink: 'https://drive.google.com/file/d/sample-giao-an-nuocoa'
      },
      {
        id: 't2',
        taskName: 'Bồi dưỡng học sinh giỏi & Phụ đạo học sinh yếu kém',
        assignedTarget: '4 tiết/tuần bồi dưỡng đội tuyển HSG, phụ đạo 10 em học sinh yếu',
        result: 'Hoàn thành bồi dưỡng 16 tiết trong tháng, học sinh tiến bộ',
        completionRate: 100,
        status: 'completed',
        evidenceLink: 'https://drive.google.com/file/d/sample-so-boi-duong'
      },
      {
        id: 't3',
        taskName: 'Sinh hoạt tổ chuyên môn, dự giờ thăm lớp & làm đồ dùng dạy học',
        assignedTarget: 'Dự 2 tiết/tháng, làm 1 đồ dùng dạy học ứng dụng CNTT',
        result: 'Đã dự đủ 2 tiết, thiết kế bài giảng E-learning trên Canva/PPT',
        completionRate: 100,
        status: 'completed',
        evidenceLink: 'https://drive.google.com/file/d/sample-bai-giang-cntt'
      }
    ],
    overallSummary: '3/3 nhiệm vụ hoàn thành xuất sắc trong tháng. Tỷ lệ hoàn thành nhiệm vụ đạt 100%.',
    attachedFileUrl: 'https://drive.google.com/file/d/sample-mau-01-full-doc',
    updatedAt: new Date().toISOString()
  };
}

// Helper to generate mock scores for a teacher
export function createDefaultEvaluation(teacherId: string, month: number, year: number = 2026, offset: number = 0): Form03Evaluation {
  const scores: Record<string, any> = {};
  
  // Base scores variation based on teacher index to give realistic distribution
  const idx = parseInt(teacherId.replace('gv', ''), 10) || 1;
  const isTop = idx <= 12 || idx % 3 === 0;
  const isGood = !isTop && (idx % 2 === 0);
  
  let partA_Teacher = 0;
  let partA_Principal = 0;
  let partB_Teacher = 0;
  let partB_Principal = 0;
  let bonus_Teacher = 0;
  let bonus_Principal = 0;
  let deduction_Teacher = 0;
  let deduction_Principal = 0;

  FORM_03_CRITERIA.forEach(c => {
    let tScore = c.maxPoints;
    if (c.section === 'BONUS' || c.section === 'DEDUCTION') {
      tScore = 0; // Default bonus and deduction to 0
    } else if (!isTop) {
      if (isGood) {
        tScore = Math.max(0, c.maxPoints - (c.maxPoints >= 5 ? 1 : 0.25));
      } else {
        tScore = Math.max(0, c.maxPoints - (c.maxPoints >= 5 ? 2 : 0.5));
      }
    }
    
    // Slight principal adjustment
    let pScore = tScore;
    if (idx === 15 && c.id === 'A_I_1_a') pScore = Math.max(0, tScore - 0.25);

    scores[c.id] = {
      criteriaId: c.id,
      teacherScore: tScore,
      principalScore: pScore,
      note: ''
    };

    if (c.section === 'A') {
      partA_Teacher += tScore;
      partA_Principal += pScore;
    } else if (c.section === 'B') {
      partB_Teacher += tScore;
      partB_Principal += pScore;
    } else if (c.section === 'BONUS') {
      bonus_Teacher += tScore;
      bonus_Principal += pScore;
    } else if (c.section === 'DEDUCTION') {
      deduction_Teacher += tScore;
      deduction_Principal += pScore;
    }
  });

  // Cap Part A at 30 points and Part B at 70 points
  const cappedA_Teacher = Math.min(30, partA_Teacher);
  const cappedA_Principal = Math.min(30, partA_Principal);
  const cappedB_Teacher = Math.min(70, partB_Teacher);
  const cappedB_Principal = Math.min(70, partB_Principal);

  // Grand total is strictly Part A + Part B (Max 100).
  // Bonus & Deduction are recorded separately in system/summary without affecting grand total score.
  const grandTotal_Teacher = Math.min(100, cappedA_Teacher + cappedB_Teacher);
  const grandTotal_Principal = Math.min(100, cappedA_Principal + cappedB_Principal);

  return {
    id: `eval_${teacherId}_m${month}`,
    teacherId,
    month,
    year,
    scores,
    totalPartA_Teacher: cappedA_Teacher,
    totalPartA_Principal: cappedA_Principal,
    totalPartB_Teacher: cappedB_Teacher,
    totalPartB_Principal: cappedB_Principal,
    totalBonus_Teacher: bonus_Teacher,
    totalBonus_Principal: bonus_Principal,
    totalDeduction_Teacher: deduction_Teacher,
    totalDeduction_Principal: deduction_Principal,
    grandTotal_Teacher,
    grandTotal_Principal,
    teacherClassification: getClassification(grandTotal_Teacher),
    principalClassification: getClassification(grandTotal_Principal),
    status: idx % 4 === 0 ? 'approved' : 'submitted',
    teacherSignatureDate: `28/0${month}/2026`,
    principalSignatureDate: `30/0${month}/2026`,
    updatedAt: new Date().toISOString()
  };
}
