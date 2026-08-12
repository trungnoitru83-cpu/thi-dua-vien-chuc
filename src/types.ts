export type Role = 'teacher' | 'department_head' | 'principal' | 'staff';

export type ClassificationType = 
  | 'HOAN_THANH_XUAT_SAC' // >= 90
  | 'HOAN_THANH_TOT'      // 80 - <90
  | 'HOAN_THANH'          // 50 - <80
  | 'KHONG_HOAN_THANH';   // < 50

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  dob: string; // DD/MM/YYYY
  subject: string; // Bộ môn giảng dạy
  department: string; // Tổ chuyên môn
  school: string; // Trường
  avatar?: string;
  teacherSignature?: string; // Data URL or Image URL
  principalSignature?: string; // Data URL or Image URL
}

export interface Form01Task {
  id: string;
  taskName: string; // Tên nhiệm vụ trong tháng
  assignedTarget: string; // Chỉ tiêu / Yêu cầu
  result: string; // Kết quả đạt được
  completionRate: number; // 0 - 100%
  status: 'completed' | 'in_progress' | 'not_completed';
  evidenceLink?: string; // Link đính kèm minh chứng
}

export interface Form01Data {
  teacherId: string;
  month: number; // 1 - 12
  year: number;
  tasks: Form01Task[];
  overallSummary: string; // Đánh giá chung mức độ hoàn thành
  attachedFileUrl?: string; // Link đính kèm file Mẫu 01 gốc
  updatedAt: string;
}

export interface BenchmarkTier {
  code: string;
  label: string;
  points: number;
}

export interface CriteriaItem {
  id: string;
  section: 'A' | 'B' | 'BONUS' | 'DEDUCTION';
  category: string;
  code: string; // e.g. A1, A2, B1, B2...
  title: string; // Tên tiêu chí
  description?: string;
  maxPoints: number;
  scoreOptions: number[]; // e.g. [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, ...]
  tiers?: BenchmarkTier[];
}

export interface CriteriaScore {
  criteriaId: string;
  teacherScore: number; // Giáo viên tự tick
  principalScore: number; // Hiệu trưởng tự tick / duyệt
  note?: string;
}

export interface Form03Evaluation {
  id: string;
  teacherId: string;
  month: number; // 1 - 12
  year: number;
  scores: Record<string, CriteriaScore>; // criteriaId -> CriteriaScore
  
  // Totals calculated
  totalPartA_Teacher: number;
  totalPartA_Principal: number;
  
  totalPartB_Teacher: number;
  totalPartB_Principal: number;
  
  totalBonus_Teacher: number;
  totalBonus_Principal: number;
  
  totalDeduction_Teacher: number;
  totalDeduction_Principal: number;
  
  grandTotal_Teacher: number;
  grandTotal_Principal: number;
  
  teacherClassification: ClassificationType;
  principalClassification: ClassificationType;
  
  teacherSignatureDate?: string;
  principalSignatureDate?: string;
  
  teacherSignatureImg?: string;
  principalSignatureImg?: string;
  
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  principalComment?: string;
  updatedAt: string;
}

export interface MonthlyEmulationSummary {
  teacher: Teacher;
  form01Submitted: boolean;
  evaluation?: Form03Evaluation;
}
