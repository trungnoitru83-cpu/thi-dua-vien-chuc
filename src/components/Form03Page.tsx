import React, { useState } from 'react';
import { FileSpreadsheet, CheckSquare, ShieldCheck, PenTool, Printer, Save, ChevronLeft, ChevronRight, User, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Teacher, Form03Evaluation, Role, CriteriaScore } from '../types';
import { FORM_03_CRITERIA, CLASSIFICATION_RULES, getClassification, getClassificationLabel } from '../data/form03Criteria';
import { SignatureModal } from './SignatureModal';

interface Form03PageProps {
  teachers: Teacher[];
  currentTeacher: Teacher;
  onSelectTeacher: (teacher: Teacher) => void;
  evaluation: Form03Evaluation;
  selectedMonth: number;
  currentRole: Role;
  onSaveEvaluation: (evalData: Form03Evaluation) => void;
  onOpenPrintModal: (type: 'form03', teacherId: string) => void;
  onNavigateToSummary: () => void;
}

export const Form03Page: React.FC<Form03PageProps> = ({
  teachers,
  currentTeacher,
  onSelectTeacher,
  evaluation,
  selectedMonth,
  currentRole,
  onSaveEvaluation,
  onOpenPrintModal,
  onNavigateToSummary
}) => {
  // Local state for live score updates
  const [scores, setScores] = useState<Record<string, CriteriaScore>>(evaluation.scores || {});
  const [principalComment, setPrincipalComment] = useState(evaluation.principalComment || '');
  const [status, setStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>(evaluation.status || 'submitted');

  // Signatures state
  const [teacherSigImg, setTeacherSigImg] = useState<string | undefined>(evaluation.teacherSignatureImg);
  const [principalSigImg, setPrincipalSigImg] = useState<string | undefined>(evaluation.principalSignatureImg);

  // Modals for drawing signature
  const [sigModalType, setSigModalType] = useState<'teacher' | 'principal' | null>(null);

  const [saveToast, setSaveToast] = useState(false);

  // Sync state if current teacher or evaluation changes
  React.useEffect(() => {
    setScores(evaluation.scores || {});
    setPrincipalComment(evaluation.principalComment || '');
    setStatus(evaluation.status || 'submitted');
    setTeacherSigImg(evaluation.teacherSignatureImg);
    setPrincipalSigImg(evaluation.principalSignatureImg);
  }, [evaluation, currentTeacher.id]);

  // Handle Score Change
  const handleScoreChange = (criteriaId: string, field: 'teacherScore' | 'principalScore', value: number) => {
    setScores(prev => {
      const existing = prev[criteriaId] || { criteriaId, teacherScore: 0, principalScore: 0 };
      return {
        ...prev,
        [criteriaId]: {
          ...existing,
          [field]: value
        }
      };
    });
  };

  // Calculate live totals
  let rawPartA_Teacher = 0;
  let rawPartA_Principal = 0;
  let rawPartB_Teacher = 0;
  let rawPartB_Principal = 0;
  let bonus_Teacher = 0;
  let bonus_Principal = 0;
  let deduction_Teacher = 0;
  let deduction_Principal = 0;

  FORM_03_CRITERIA.forEach(c => {
    const isBonusOrDed = c.section === 'BONUS' || c.section === 'DEDUCTION';
    const defaultScore = isBonusOrDed ? 0 : c.maxPoints;
    const sc = scores[c.id] || { teacherScore: defaultScore, principalScore: defaultScore };
    if (c.section === 'A') {
      rawPartA_Teacher += sc.teacherScore;
      rawPartA_Principal += sc.principalScore;
    } else if (c.section === 'B') {
      rawPartB_Teacher += sc.teacherScore;
      rawPartB_Principal += sc.principalScore;
    } else if (c.section === 'BONUS') {
      bonus_Teacher += (sc.teacherScore || 0);
      bonus_Principal += (sc.principalScore || 0);
    } else if (c.section === 'DEDUCTION') {
      deduction_Teacher += (sc.teacherScore || 0);
      deduction_Principal += (sc.principalScore || 0);
    }
  });

  // Cap Part A at 30 points, Part B at 70 points
  const partA_Teacher = Math.min(30, rawPartA_Teacher);
  const partA_Principal = Math.min(30, rawPartA_Principal);
  const partB_Teacher = Math.min(70, rawPartB_Teacher);
  const partB_Principal = Math.min(70, rawPartB_Principal);

  // Grand total is strictly Part A + Part B (Max 100).
  // Bonus & Deduction are recorded separately in system & summary file without affecting grand total score.
  const grandTotal_Teacher = Math.min(100, partA_Teacher + partB_Teacher);
  const grandTotal_Principal = Math.min(100, partA_Principal + partB_Principal);

  const teacherClass = getClassification(grandTotal_Teacher);
  const principalClass = getClassification(grandTotal_Principal);

  // Save changes
  const handleSave = (newStatus?: 'submitted' | 'approved' | 'rejected') => {
    const finalStatus = newStatus || status;
    const updatedEval: Form03Evaluation = {
      ...evaluation,
      scores,
      totalPartA_Teacher: partA_Teacher,
      totalPartA_Principal: partA_Principal,
      totalPartB_Teacher: partB_Teacher,
      totalPartB_Principal: partB_Principal,
      totalBonus_Teacher: bonus_Teacher,
      totalBonus_Principal: bonus_Principal,
      totalDeduction_Teacher: deduction_Teacher,
      totalDeduction_Principal: deduction_Principal,
      grandTotal_Teacher,
      grandTotal_Principal,
      teacherClassification: teacherClass,
      principalClassification: principalClass,
      teacherSignatureImg: teacherSigImg,
      principalSignatureImg: principalSigImg,
      teacherSignatureDate: teacherSigImg ? (evaluation.teacherSignatureDate || `28/0${selectedMonth}/2026`) : undefined,
      principalSignatureDate: principalSigImg ? (evaluation.principalSignatureDate || `30/0${selectedMonth}/2026`) : undefined,
      status: finalStatus,
      principalComment,
      updatedAt: new Date().toISOString()
    };

    onSaveEvaluation(updatedEval);
    if (newStatus) setStatus(newStatus);

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Teacher navigation indexing
  const currentIndex = teachers.findIndex(t => t.id === currentTeacher.id);
  const prevTeacher = teachers[currentIndex - 1];
  const nextTeacher = teachers[currentIndex + 1];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Page Header & 34 Teacher Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full">
                TRANG 3: BẢNG CHẤM ĐIỂM MẪU 03
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Tháng {selectedMonth}/2026
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Phiếu Chấm Điểm Thi Đua - {currentTeacher.fullName}
            </h1>
            <p className="text-xs text-slate-500">
              Trường: {currentTeacher.school} | Môn: <strong>{currentTeacher.subject}</strong> | Tổ: {currentTeacher.department}
            </p>
          </div>

          {/* Controls: Print + Go to Summary */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintModal('form03', currentTeacher.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>In Mẫu 03 (A4)</span>
            </button>

            <button
              onClick={onNavigateToSummary}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              <span>Xem Bảng Tổng Hợp 34 GV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 34 Teachers Quick Selector Bar */}
        <div className="mt-4 flex items-center justify-between gap-2">
          
          <button
            disabled={!prevTeacher}
            onClick={() => prevTeacher && onSelectTeacher(prevTeacher)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 transition shrink-0"
            title={prevTeacher ? `GV trước: ${prevTeacher.fullName}` : ''}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-x-auto flex items-center gap-1.5 py-1 scrollbar-thin px-2">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">
              Chọn GV ({currentIndex + 1}/34):
            </span>
            {teachers.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => onSelectTeacher(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition shrink-0 ${
                  t.id === currentTeacher.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}. {t.fullName.split(' ').pop()}
              </button>
            ))}
          </div>

          <button
            disabled={!nextTeacher}
            onClick={() => nextTeacher && onSelectTeacher(nextTeacher)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 transition shrink-0"
            title={nextTeacher ? `GV kế tiếp: ${nextTeacher.fullName}` : ''}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

      {saveToast && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100 rounded-2xl border-2 border-emerald-500 flex items-center justify-between gap-3 font-bold text-sm shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-200">
                ✅ ĐÃ LƯU MẪU 03 THÀNH CÔNG!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                Bảng điểm thi đua tháng {selectedMonth}/2026 của giáo viên <strong>{currentTeacher.fullName}</strong> đã được lưu và cập nhật tức thì lên Firebase.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase shrink-0">
            ĐÃ LƯU FIREBASE
          </span>
        </div>
      )}

      {/* Main Score Sheet Table (Mẫu 03 Layout) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        
        {/* Table Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-white/20 text-white font-extrabold text-[11px] rounded-md">
                MẪU 03 - THI ĐUA THÁNG
              </span>
              <span className="text-xs text-blue-200 font-medium">
                Dành cho Giáo viên & BGH chấm điểm
              </span>
            </div>
            <h2 className="text-xl font-black">
              BẢNG ĐÁNH GIÁ VÀ XẾP LOẠI THI ĐUA THÁNG {selectedMonth}/2026
            </h2>
          </div>

          {/* Quick Stats Summary Pills */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/10">
              <p className="text-[10px] uppercase text-blue-200 font-semibold">GV Tự chấm</p>
              <p className="text-lg font-black text-amber-300">{grandTotal_Teacher} điểm</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/10">
              <p className="text-[10px] uppercase text-blue-200 font-semibold">Hiệu trưởng duyệt</p>
              <p className="text-lg font-black text-emerald-300">{grandTotal_Principal} điểm</p>
            </div>
          </div>
        </div>

        {/* 2 Cột Tích Điểm Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase border-b-2 border-slate-300 dark:border-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200 dark:border-slate-700">STT</th>
                <th className="p-3 min-w-[300px] border-r border-slate-200 dark:border-slate-700">Nội dung đánh giá & Tiêu chí thi đua</th>
                <th className="p-3 w-20 text-center border-r border-slate-200 dark:border-slate-700">Điểm tối đa</th>
                
                {/* CỘT 1: GIÁO VIÊN TỰ TICK */}
                <th className="p-3 w-36 text-center bg-blue-50 dark:bg-blue-950/60 border-r border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
                  <div className="flex items-center justify-center gap-1">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>GV TỰ TICK</span>
                  </div>
                </th>

                {/* CỘT 2: HIỆU TRƯỞNG DƯYỆT TICK */}
                <th className="p-3 w-36 text-center bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>HIỆU TRƯỞNG TICK</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              
              {/* PHẦN A HEADER */}
              <tr className="bg-slate-200/80 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-slate-100">
                <td className="p-3 text-center border-r border-slate-300 dark:border-slate-700">A</td>
                <td className="p-3 border-r border-slate-300 dark:border-slate-700" colSpan={2}>
                  PHẦN A: NHIỆM VỤ CHUNG VÀ QUY CHẾ CHUYÊN MÔN (TỐI ĐA 30 ĐIỂM)
                </td>
                <td className="p-3 text-center bg-blue-100/70 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-black border-r border-blue-200">
                  {partA_Teacher} / 30đ
                </td>
                <td className="p-3 text-center bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-black">
                  {partA_Principal} / 30đ
                </td>
              </tr>

              {/* PHẦN A CRITERIA ITEMS */}
              {FORM_03_CRITERIA.filter(c => c.section === 'A').map((item, idx) => {
                const sc = scores[item.id] || { teacherScore: item.maxPoints, principalScore: item.maxPoints };
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        [{item.code}] {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.maxPoints}đ
                    </td>

                    {/* Cột Giáo viên tự tick */}
                    <td className="p-3 text-center bg-blue-50/30 dark:bg-blue-950/20 border-r border-blue-100 dark:border-blue-900">
                      <select
                        value={sc.teacherScore}
                        onChange={(e) => handleScoreChange(item.id, 'teacherScore', Number(e.target.value))}
                        disabled={currentRole === 'principal' && status === 'approved'}
                        className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg text-center font-bold text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} điểm
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Cột Hiệu trưởng tự tick */}
                    <td className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">
                      <select
                        value={sc.principalScore}
                        onChange={(e) => handleScoreChange(item.id, 'principalScore', Number(e.target.value))}
                        className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-lg text-center font-bold text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer shadow-2xs"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} điểm
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {/* PHẦN B HEADER */}
              <tr className="bg-slate-200/80 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-slate-100 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300 dark:border-slate-700">B</td>
                <td className="p-3 border-r border-slate-300 dark:border-slate-700" colSpan={2}>
                  PHẦN B: NHIỆM VỤ CỤ THỂ VÀ CÔNG TÁC KIÊM NHIỆM (TỐI ĐA 70 ĐIỂM)
                </td>
                <td className="p-3 text-center bg-blue-100/70 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-black border-r border-blue-200">
                  {partB_Teacher} / 70đ
                </td>
                <td className="p-3 text-center bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-black">
                  {partB_Principal} / 70đ
                </td>
              </tr>

              {/* PHẦN B CRITERIA ITEMS */}
              {FORM_03_CRITERIA.filter(c => c.section === 'B').map((item, idx) => {
                const sc = scores[item.id] || { teacherScore: item.maxPoints, principalScore: item.maxPoints };
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        [{item.code}] {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.maxPoints}đ
                    </td>

                    {/* Cột Giáo viên tự tick */}
                    <td className="p-3 text-center bg-blue-50/30 dark:bg-blue-950/20 border-r border-blue-100 dark:border-blue-900">
                      <select
                        value={sc.teacherScore}
                        onChange={(e) => handleScoreChange(item.id, 'teacherScore', Number(e.target.value))}
                        disabled={currentRole === 'principal' && status === 'approved'}
                        className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg text-center font-bold text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} điểm
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Cột Hiệu trưởng tự tick */}
                    <td className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">
                      <select
                        value={sc.principalScore}
                        onChange={(e) => handleScoreChange(item.id, 'principalScore', Number(e.target.value))}
                        className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-lg text-center font-bold text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer shadow-2xs"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} điểm
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {/* PHẦN ĐIỂM CỘNG */}
              <tr className="bg-emerald-100/70 dark:bg-emerald-950/60 font-extrabold text-emerald-950 dark:text-emerald-200 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300">C</td>
                <td className="p-3 border-r border-slate-300" colSpan={2}>
                  <div>
                    <span className="font-extrabold">C. ĐIỂM CỘNG THI ĐƯA (TỔNG C.1 + C.2 + C.3 + C.4)</span>
                    <span className="ml-2 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 italic">
                      (Chỉ ghi nhận vào Hệ thống & Bảng tổng hợp - Không tính cộng vào Tổng điểm)
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center font-black border-r border-blue-200">
                  +{bonus_Teacher}đ
                </td>
                <td className="p-3 text-center font-black">
                  +{bonus_Principal}đ
                </td>
              </tr>
              {FORM_03_CRITERIA.filter(c => c.section === 'BONUS').map((item, idx) => {
                const sc = scores[item.id] || { teacherScore: 0, principalScore: 0, note: '' };
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                      C.{idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={sc.note || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setScores(prev => ({
                              ...prev,
                              [item.id]: {
                                ...(prev[item.id] || { criteriaId: item.id, teacherScore: 0, principalScore: 0 }),
                                note: val
                              }
                            }));
                          }}
                          placeholder="Nhập ghi chú / nội dung tự điền điểm cộng..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      +{item.maxPoints}đ
                    </td>
                    <td className="p-3 text-center bg-blue-50/30 dark:bg-blue-950/20 border-r border-blue-100">
                      <select
                        value={sc.teacherScore}
                        onChange={(e) => handleScoreChange(item.id, 'teacherScore', Number(e.target.value))}
                        className="w-full py-1 px-2 bg-white dark:bg-slate-800 border border-emerald-300 rounded-lg text-center font-bold text-emerald-800 dark:text-emerald-300"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>+{opt} điểm</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">
                      <select
                        value={sc.principalScore}
                        onChange={(e) => handleScoreChange(item.id, 'principalScore', Number(e.target.value))}
                        className="w-full py-1 px-2 bg-white dark:bg-slate-800 border border-emerald-300 rounded-lg text-center font-bold text-emerald-800 dark:text-emerald-300"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>+{opt} điểm</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {/* PHẦN ĐIỂM TRỪ */}
              <tr className="bg-rose-100/70 dark:bg-rose-950/60 font-extrabold text-rose-950 dark:text-rose-200 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300">D</td>
                <td className="p-3 border-r border-slate-300" colSpan={2}>
                  <div>
                    <span className="font-extrabold">D. ĐIỂM TRỪ THI ĐƯA (TỔNG D.1 + D.2 + D.3)</span>
                    <span className="ml-2 text-[11px] font-medium text-rose-800 dark:text-rose-300 italic">
                      (Chỉ ghi nhận vào Hệ thống & Bảng tổng hợp - Không tính trừ vào Tổng điểm)
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center font-black border-r border-blue-200 text-rose-700">
                  -{deduction_Teacher}đ
                </td>
                <td className="p-3 text-center font-black text-rose-700">
                  -{deduction_Principal}đ
                </td>
              </tr>
              {FORM_03_CRITERIA.filter(c => c.section === 'DEDUCTION').map((item, idx) => {
                const sc = scores[item.id] || { teacherScore: 0, principalScore: 0, note: '' };
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                      D.{idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <div className="mt-1.5">
                        <input
                          type="text"
                          value={sc.note || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setScores(prev => ({
                              ...prev,
                              [item.id]: {
                                ...(prev[item.id] || { criteriaId: item.id, teacherScore: 0, principalScore: 0 }),
                                note: val
                              }
                            }));
                          }}
                          placeholder="Nhập lý do vi phạm / khoảng trống tự điền..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      -{item.maxPoints}đ
                    </td>
                    <td className="p-3 text-center bg-blue-50/30 dark:bg-blue-950/20 border-r border-blue-100">
                      <select
                        value={sc.teacherScore}
                        onChange={(e) => handleScoreChange(item.id, 'teacherScore', Number(e.target.value))}
                        className="w-full py-1 px-2 bg-white dark:bg-slate-800 border border-rose-300 rounded-lg text-center font-bold text-rose-800 dark:text-rose-300"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>-{opt} điểm</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">
                      <select
                        value={sc.principalScore}
                        onChange={(e) => handleScoreChange(item.id, 'principalScore', Number(e.target.value))}
                        className="w-full py-1 px-2 bg-white dark:bg-slate-800 border border-rose-300 rounded-lg text-center font-bold text-rose-800 dark:text-rose-300"
                      >
                        {item.scoreOptions.map((opt) => (
                          <option key={opt} value={opt}>-{opt} điểm</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {/* TỔNG ĐIỂM CỘNG HÀNG TỔNG KẾT */}
              <tr className="bg-slate-900 text-white font-extrabold text-sm">
                <td className="p-4 text-center border-r border-slate-700" colSpan={3}>
                  <div>
                    <p className="text-sm font-black text-white uppercase">
                      TỔNG ĐIỂM THI ĐUA (PHẦN A TỐI ĐA 30Đ + PHẦN B TỐI ĐA 70Đ = TỐI ĐA 100Đ)
                    </p>
                    <p className="text-[11px] font-normal text-slate-300 italic mt-0.5">
                      * Điểm cộng (+{bonus_Principal}đ) và điểm trừ (-{deduction_Principal}đ) được ghi nhận độc lập vào hệ thống & Bảng tổng hợp.
                    </p>
                  </div>
                </td>
                <td className="p-4 text-center bg-blue-900 text-amber-300 font-black text-base border-r border-blue-800">
                  {grandTotal_Teacher} ĐIỂM
                </td>
                <td className="p-4 text-center bg-indigo-900 text-emerald-300 font-black text-base">
                  {grandTotal_Principal} ĐIỂM
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Dynamic Classification Summary Box */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Giáo viên tự xếp loại */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Giáo viên tự xếp loại theo Mẫu:
              </p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                    CLASSIFICATION_RULES.find(r => r.type === teacherClass)?.badgeColor
                  }`}>
                    {getClassificationLabel(teacherClass)}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Dựa trên tổng điểm tự chấm: <strong>{grandTotal_Teacher} điểm</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Hiệu trưởng xếp loại */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Hiệu trưởng phê duyệt xếp loại chính thức:
              </p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                    CLASSIFICATION_RULES.find(r => r.type === principalClass)?.badgeColor
                  }`}>
                    {getClassificationLabel(principalClass)}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Dựa trên điểm Hiệu trưởng duyệt: <strong>{grandTotal_Principal} điểm</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Principal Comments */}
          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ý kiến nhận xét của Hiệu trưởng / Ban Giám hiệu:
            </label>
            <textarea
              rows={2}
              value={principalComment}
              onChange={(e) => setPrincipalComment(e.target.value)}
              placeholder="Nhập nhận xét động viên hoặc nhắc nhở của Hiệu trưởng đối với giáo viên..."
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

      </div>

      {/* Section Signature Sign-off Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800 mb-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-blue-600" />
          <span>Xác Nhận Ký Tên Điện Tử - Mẫu 03</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Giáo viên kí tên */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">
              GIÁO VIÊN TỰ ĐÁNH GIÁ KÝ TÊN
            </p>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-3">
              {currentTeacher.fullName}
            </p>

            {teacherSigImg ? (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 my-2">
                <img src={teacherSigImg} alt="Chữ ký giáo viên" className="h-20 mx-auto object-contain" />
                <p className="text-[10px] text-slate-400 mt-1">Đã ký vào ngày {evaluation.teacherSignatureDate || `28/0${selectedMonth}/2026`}</p>
              </div>
            ) : (
              <div className="h-24 my-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                Chưa có chữ ký giáo viên
              </div>
            )}

            <button
              onClick={() => setSigModalType('teacher')}
              className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 hover:bg-blue-200 font-bold text-xs rounded-xl transition"
            >
              ✍️ {teacherSigImg ? 'Thay đổi chữ ký Giáo viên' : 'Giáo viên ký tên ngay'}
            </button>
          </div>

          {/* Hiệu trưởng kí tên */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1">
              HIỆU TRƯỞNG PHÊ DUYỆT & KÝ TÊN
            </p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3">
              HIỆU TRƯỞNG TRƯỜNG NƯỚC OA
            </p>

            {principalSigImg ? (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 my-2">
                <img src={principalSigImg} alt="Chữ ký Hiệu trưởng" className="h-20 mx-auto object-contain" />
                <p className="text-[10px] text-slate-400 mt-1">Hiệu trưởng đã ký ngày {evaluation.principalSignatureDate || `30/0${selectedMonth}/2026`}</p>
              </div>
            ) : (
              <div className="h-24 my-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                Chưa có chữ ký Hiệu trưởng
              </div>
            )}

            <button
              onClick={() => setSigModalType('principal')}
              className="mt-2 px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 hover:bg-emerald-200 font-bold text-xs rounded-xl transition"
            >
              ✍️ {principalSigImg ? 'Thay đổi chữ ký Hiệu trưởng' : 'Hiệu trưởng ký duyệt'}
            </button>
          </div>

        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Trạng thái:</span>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
            status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
          }`}>
            {status === 'approved' ? '✅ Hiệu trưởng đã duyệt' : '⏳ Đã gửi (Chờ phê duyệt)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSave('submitted')}
            className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 ${
              saveToast && status !== 'approved'
                ? 'bg-emerald-600 ring-2 ring-emerald-300 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saveToast && status !== 'approved' ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>✅ ĐÃ LƯU MẪU 03 THÀNH CÔNG!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu bảng chấm Mẫu 03</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSave('approved')}
            className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 ${
              saveToast && status === 'approved'
                ? 'bg-emerald-700 ring-2 ring-emerald-300 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {saveToast && status === 'approved' ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>✅ ĐÃ DUYỆT MẪU 03 THÀNH CÔNG!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Hiệu trưởng duyệt chính thức</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Signature Modals */}
      <SignatureModal
        isOpen={sigModalType === 'teacher'}
        onClose={() => setSigModalType(null)}
        onSave={(dataUrl) => {
          setTeacherSigImg(dataUrl);
        }}
        title={`Chữ ký Giáo viên: ${currentTeacher.fullName}`}
      />

      <SignatureModal
        isOpen={sigModalType === 'principal'}
        onClose={() => setSigModalType(null)}
        onSave={(dataUrl) => {
          setPrincipalSigImg(dataUrl);
        }}
        title="Chữ ký Hiệu trưởng Trường Nước Oa"
      />

    </div>
  );
};
