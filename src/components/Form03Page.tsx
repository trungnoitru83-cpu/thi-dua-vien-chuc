import React, { useState } from 'react';
import { FileSpreadsheet, CheckSquare, ShieldCheck, PenTool, Printer, Save, ChevronLeft, ChevronRight, User, AlertCircle, ArrowRight, CheckCircle, RefreshCw, FileText } from 'lucide-react';
import { Teacher, Form03Evaluation, Role, CriteriaScore } from '../types';
import { FORM_03_CRITERIA, CLASSIFICATION_RULES, getClassification, getClassificationLabel, getCriteriaForTeacher, isLeaderTeacher } from '../data/form03Criteria';
import { SignatureModal } from './SignatureModal';
import { exportToWord } from '../lib/wordExport';

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
  const [saveToastMsg, setSaveToastMsg] = useState('');

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

  // Determine criteria set (Mẫu 02 for Leaders/TTCM/TPCM/HT/HP, Mẫu 03 for GV/NV)
  const defaultFormType = isLeaderTeacher(currentTeacher) ? 'mau02' : 'mau03';
  const [selectedFormType, setSelectedFormType] = useState<'mau02' | 'mau03'>(defaultFormType);

  React.useEffect(() => {
    setSelectedFormType(isLeaderTeacher(currentTeacher) ? 'mau02' : 'mau03');
  }, [currentTeacher.id]);

  const isLeader = selectedFormType === 'mau02';
  const activeCriteria = getCriteriaForTeacher(currentTeacher, selectedFormType);

  // Calculate live totals
  let rawPartA_Teacher = 0;
  let rawPartA_Principal = 0;
  let rawPartB_Teacher = 0;
  let rawPartB_Principal = 0;
  let bonus_Teacher = 0;
  let bonus_Principal = 0;
  let deduction_Teacher = 0;
  let deduction_Principal = 0;

  activeCriteria.forEach(c => {
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

  // Grand total formula: Part A (A.1 đến A.27, max 30) + Part B (B.1 đến B.6, max 70) = max 100
  const grandTotal_Teacher = Math.min(100, Math.round((partA_Teacher + partB_Teacher) * 100) / 100);
  const grandTotal_Principal = Math.min(100, Math.round((partA_Principal + partB_Principal) * 100) / 100);

  const teacherClass = getClassification(grandTotal_Teacher);
  const principalClass = getClassification(grandTotal_Principal);

  // Save changes & update summary file for 36 teachers
  const handleSave = (newStatus?: 'submitted' | 'approved' | 'rejected', customMsg?: string) => {
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

    const defaultMsg = finalStatus === 'approved' 
      ? `✅ Đã cập nhật điểm Hiệu trưởng đánh giá (${grandTotal_Principal} điểm) và phê duyệt lưu vào File tổng hợp 36 Giáo viên!`
      : `✅ Đã cập nhật điểm Giáo viên tự chấm (${grandTotal_Teacher} điểm) và lưu vào File tổng hợp 36 Giáo viên!`;

    setSaveToastMsg(customMsg || defaultMsg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4500);
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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedFormType('mau03')}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                    selectedFormType === 'mau03'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  MẪU 03 (GV &amp; NV)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormType('mau02')}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                    selectedFormType === 'mau02'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  MẪU 02 (LÃNH ĐẠO, TTCM, TPCM, HT, HP)
                </button>
              </div>
              <span className="text-xs text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                Tháng {selectedMonth}/2026
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {isLeader ? 'Bảng Đánh Giá Mẫu 02 (Lãnh Đạo / TTCM / TPCM)' : 'Phiếu Chấm Điểm Mẫu 03 (Giáo Viên / Nhân Viên)'} - {currentTeacher.fullName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Chức vụ: <strong>{currentTeacher.position || 'Giáo viên'}</strong> | Môn: <strong>{currentTeacher.subject}</strong> | Tổ: <strong>{currentTeacher.department}</strong> | Trường: {currentTeacher.school}
            </p>
          </div>

          {/* Controls: Print + Export Word + Go to Summary */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenPrintModal('form03', currentTeacher.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>In {isLeader ? 'Mẫu 02' : 'Mẫu 03'} (A4)</span>
            </button>

            <button
              onClick={() => onOpenPrintModal('form03', currentTeacher.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 font-bold text-xs rounded-2xl transition"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Xuất File Word (.doc)</span>
            </button>

            <button
              onClick={onNavigateToSummary}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              <span>Xem Bảng Tổng Hợp {teachers.length} GV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teachers Quick Selector Bar */}
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
              Chọn GV ({currentIndex + 1}/{teachers.length}):
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
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100 rounded-2xl border-2 border-emerald-500 flex items-center justify-between gap-3 font-bold text-sm shadow-xl animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-200">
                {saveToastMsg || '✅ ĐÃ CẬP NHẬT MẪU 03 VÀO FILE TỔNG HỢP VÀ HỆ THỐNG ĐÁM MÂY!'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                Bảng điểm thi đua Tháng {selectedMonth}/2026 của giáo viên <strong>{currentTeacher.fullName}</strong> đã tự động đồng bộ vào File tổng hợp {teachers.length} Giáo viên.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase shrink-0">
            ĐÃ ĐỒNG BỘ
          </span>
        </div>
      )}

      {/* Main Score Sheet Table (Mẫu 03 Layout) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        
        {/* Table Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-white/20 text-white font-extrabold text-[11px] rounded-md uppercase">
                {isLeader ? 'MẪU 02 - CÁN BỘ QUẢN LÝ / TỔ TRƯỞNG' : 'MẪU 03 - THI ĐUA THÁNG'}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                {isLeader ? 'Dành cho Hiệu trưởng, Phó Hiệu trưởng & Tổ trưởng' : 'Dành cho Giáo viên & BGH chấm điểm'}
              </span>
            </div>
            <h2 className="text-xl font-black">
              BẢNG ĐÁNH GIÁ VÀ XẾP LOẠI THI ĐUA THÁNG {selectedMonth}/2026
            </h2>
          </div>

          {/* Quick Stats Summary Pills & Update Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/10">
                <p className="text-[10px] uppercase text-blue-200 font-semibold">GV Tự chấm</p>
                <p className="text-lg font-black text-amber-300">{grandTotal_Teacher} điểm</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/10">
                <p className="text-[10px] uppercase text-blue-200 font-semibold">Hiệu trưởng duyệt</p>
                <p className="text-lg font-black text-emerald-300">{grandTotal_Principal} điểm</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave('submitted', `✅ Đã cập nhật điểm Giáo viên tự chấm (${grandTotal_Teacher} điểm) vào File tổng hợp ${teachers.length} Giáo viên!`)}
                className="px-3 py-2 bg-blue-500/30 hover:bg-blue-500/60 text-white border border-blue-300/40 font-bold text-xs rounded-xl backdrop-blur-sm transition flex items-center gap-1.5 shadow"
                title="Bấm để cập nhật điểm tự chấm của Giáo viên vào File Tổng hợp"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
                <span>Cập nhật điểm GV</span>
              </button>
              <button
                onClick={() => handleSave('approved', `✅ Đã cập nhật điểm Hiệu trưởng đánh giá (${grandTotal_Principal} điểm) vào File tổng hợp ${teachers.length} Giáo viên!`)}
                className="px-3 py-2 bg-emerald-500/30 hover:bg-emerald-500/60 text-white border border-emerald-300/40 font-bold text-xs rounded-xl backdrop-blur-sm transition flex items-center gap-1.5 shadow"
                title="Bấm để Hiệu trưởng phê duyệt & cập nhật điểm vào File Tổng hợp"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Cập nhật điểm HT</span>
              </button>
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
              {activeCriteria.filter(c => c.section === 'A').map((item, idx) => {
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
              <tr className="bg-slate-200/90 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-slate-100 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300 dark:border-slate-700">B</td>
                <td className="p-3 border-r border-slate-300 dark:border-slate-700" colSpan={2}>
                  <div>
                    <p className="font-extrabold uppercase text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      PHẦN B: KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO (TỐI ĐA 70 ĐIỂM)
                    </p>
                    <p className="text-[11px] font-normal text-slate-600 dark:text-slate-300 italic mt-0.5 leading-tight">
                      (Đối với sử dụng phần mềm, phần điểm của mục này được tích hợp vào phần kê khai công việc và chấm điểm thông qua quy đổi công việc chuẩn; phương pháp và cách xác định điểm tiêu chí đánh giá kết quả thực hiện nhiệm vụ đảm bảo theo quy định tại Nghị định số 335/2025/NĐ-CP)
                    </p>
                  </div>
                </td>
                <td className="p-3 text-center bg-blue-100/70 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-black border-r border-blue-200">
                  {partB_Teacher} / 70đ
                </td>
                <td className="p-3 text-center bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-black">
                  {partB_Principal} / 70đ
                </td>
              </tr>

              {/* PHẦN B CRITERIA ITEMS & BENCHMARK TIERS */}
              {activeCriteria.filter(c => c.section === 'B').map((item, idx) => {
                const sc = scores[item.id] || { teacherScore: item.maxPoints, principalScore: item.maxPoints };
                return (
                  <React.Fragment key={item.id}>
                    {/* Hàng chính tiêu chí B.1, B.2, B.3 */}
                    <tr className="bg-slate-100/90 dark:bg-slate-800/90 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                      <td className="p-3 text-center font-extrabold text-slate-800 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-300 dark:border-slate-700">
                        <p className="font-extrabold text-slate-900 dark:text-white uppercase text-xs sm:text-sm">
                          {item.title}
                        </p>
                        {item.description && (
                          <div className="text-[11px] font-normal text-slate-600 dark:text-slate-300 whitespace-pre-line mt-1.5 bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed shadow-2xs">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-black text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700 text-sm">
                        {item.maxPoints}đ
                      </td>

                      {/* Cột Điểm Giáo viên chọn */}
                      <td className="p-3 text-center bg-blue-50/50 dark:bg-blue-950/30 border-r border-blue-200 dark:border-blue-900 align-top">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase block">Điểm chọn:</span>
                          <select
                            value={sc.teacherScore}
                            onChange={(e) => handleScoreChange(item.id, 'teacherScore', Number(e.target.value))}
                            disabled={currentRole === 'principal' && status === 'approved'}
                            className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-lg text-center font-black text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs text-xs"
                          >
                            {item.scoreOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt} điểm
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Cột Điểm Hiệu trưởng duyệt */}
                      <td className="p-3 text-center bg-indigo-50/50 dark:bg-indigo-950/30 align-top">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">Điểm duyệt:</span>
                          <select
                            value={sc.principalScore}
                            onChange={(e) => handleScoreChange(item.id, 'principalScore', Number(e.target.value))}
                            className="w-full py-1.5 px-2 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-lg text-center font-black text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer shadow-2xs text-xs"
                          >
                            {item.scoreOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt} điểm
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>

                    {/* Dòng danh sách các Mức Điểm Chuẩn (a, b, c, d, đ, e, g) */}
                    {item.tiers && item.tiers.map((tier) => {
                      const isTeacherSelected = sc.teacherScore === tier.points;
                      const isPrincipalSelected = sc.principalScore === tier.points;

                      return (
                        <tr
                          key={tier.code}
                          className={`text-xs transition border-t border-slate-200/60 dark:border-slate-800/60 ${
                            isTeacherSelected || isPrincipalSelected
                              ? 'bg-amber-50/70 dark:bg-amber-950/30'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-2 px-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                            {tier.code}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{tier.label}</span>
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                            {tier.points}
                          </td>

                          {/* Nút bấm chọn nhanh điểm GV */}
                          <td className="py-1.5 px-2 text-center border-r border-blue-100 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
                            <button
                              type="button"
                              onClick={() => handleScoreChange(item.id, 'teacherScore', tier.points)}
                              disabled={currentRole === 'principal' && status === 'approved'}
                              className={`w-full py-1 px-2 rounded-md font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                                isTeacherSelected
                                  ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-700'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isTeacherSelected ? `✓ Mức ${tier.code} (${tier.points}đ)` : `Mức ${tier.code} (${tier.points}đ)`}
                            </button>
                          </td>

                          {/* Nút bấm chọn nhanh điểm Hiệu trưởng */}
                          <td className="py-1.5 px-2 text-center bg-indigo-50/20 dark:bg-indigo-950/20">
                            <button
                              type="button"
                              onClick={() => handleScoreChange(item.id, 'principalScore', tier.points)}
                              className={`w-full py-1 px-2 rounded-md font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                                isPrincipalSelected
                                  ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-700'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isPrincipalSelected ? `✓ Mức ${tier.code} (${tier.points}đ)` : `Mức ${tier.code} (${tier.points}đ)`}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
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
              {activeCriteria.filter(c => c.section === 'BONUS').map((item, idx) => {
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
              {activeCriteria.filter(c => c.section === 'DEDUCTION').map((item, idx) => {
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
                      TỔNG ĐIỂM THI ĐUA (TỔNG = PHẦN A [TỐI ĐA 30Đ: A.1-A.27] + PHẦN B [TỐI ĐA 70Đ: B.1-B.3] = TỐI ĐA 100Đ)
                    </p>
                    <p className="text-[11px] font-normal text-slate-300 italic mt-0.5">
                      * Điểm cộng (+{bonus_Principal}đ) và điểm trừ (-{deduction_Principal}đ) được ghi nhận độc lập vào Hệ thống & Bảng tổng hợp thi đua hàng tháng.
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

        {/* NÚT CẬP NHẬT ĐIỂM TỰ ĐÁNH GIÁ CỦA GIÁO VIÊN VÀ HIỆU TRƯỞNG BÊN DƯỚI TỔNG ĐIỂM */}
        <div className="p-5 bg-gradient-to-r from-blue-900/15 via-slate-100 to-emerald-900/15 dark:from-blue-950/50 dark:via-slate-800 dark:to-emerald-950/50 border-t-2 border-b-2 border-slate-300 dark:border-slate-700 flex flex-col lg:flex-row items-center justify-between gap-4 my-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide">
                CẬP NHẬT ĐIỂM TỰ ĐÁNH GIÁ VÀO FILE TỔNG HỢP {teachers.length} GIÁO VIÊN (THÁNG {selectedMonth}/2026)
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Bấm các nút dưới đây để đồng bộ ngay lập tức điểm Tự chấm của GV hoặc điểm Hiệu trưởng đánh giá vào Bảng tổng hợp thi đua.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Nút Cập nhật điểm Giáo viên tự chấm */}
            <button
              onClick={() => handleSave('submitted', `✅ Đã cập nhật điểm Giáo viên tự chấm (${grandTotal_Teacher} điểm) và lưu vào File tổng hợp ${teachers.length} Giáo viên!`)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-4 h-4 text-amber-300 shrink-0" />
              <span>CẬP NHẬT ĐIỂM GV TỰ CHẤM ({grandTotal_Teacher} ĐIỂM)</span>
            </button>

            {/* Nút Cập nhật điểm Hiệu trưởng đánh giá */}
            <button
              onClick={() => handleSave('approved', `✅ Đã cập nhật điểm Hiệu trưởng đánh giá (${grandTotal_Principal} điểm) và phê duyệt lưu vào File tổng hợp ${teachers.length} Giáo viên!`)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>CẬP NHẬT ĐIỂM HIỆU TRƯỞNG DƯỆT ({grandTotal_Principal} ĐIỂM)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Classification Summary Box */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Giáo viên tự xếp loại */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
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

              <button
                onClick={() => handleSave('submitted', `✅ Đã cập nhật điểm Giáo viên tự chấm (${grandTotal_Teacher} điểm) vào File tổng hợp ${teachers.length} Giáo viên!`)}
                className="w-full mt-4 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Cập nhật điểm GV tự chấm ({grandTotal_Teacher}đ) -&gt; File tổng hợp</span>
              </button>
            </div>

            {/* Hiệu trưởng xếp loại */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
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

              <button
                onClick={() => handleSave('approved', `✅ Đã cập nhật điểm Hiệu trưởng đánh giá (${grandTotal_Principal} điểm) vào File tổng hợp ${teachers.length} Giáo viên!`)}
                className="w-full mt-4 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Cập nhật điểm Hiệu trưởng duyệt ({grandTotal_Principal}đ) -&gt; File tổng hợp</span>
              </button>
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
