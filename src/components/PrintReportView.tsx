import React from 'react';
import { Printer, X } from 'lucide-react';
import { Teacher, Form01Data, Form03Evaluation } from '../types';
import { FORM_03_CRITERIA, getClassification, getClassificationLabel } from '../data/form03Criteria';

interface PrintReportViewProps {
  type: 'form01' | 'form03' | 'summary';
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  currentTeacher?: Teacher;
  form01?: Form01Data;
  evaluation?: Form03Evaluation;
  evaluations: Record<string, Form03Evaluation>;
  selectedMonth: number;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  type,
  isOpen,
  onClose,
  teachers,
  currentTeacher,
  form01,
  evaluation,
  evaluations,
  selectedMonth
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Floating Action Buttons */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-2 print:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>In trang này ngay (A4)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Paper A4 Page Container */}
      <div className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 shadow-2xl rounded-xl print:shadow-none print:w-full print:max-w-none print:p-0 my-8 print:my-0 font-serif">
        
        {/* Document Header (Quốc Hiệu & Tiêu Ngữ) */}
        <div className="flex justify-between items-start text-xs border-b border-slate-300 pb-4 mb-6">
          <div className="text-center font-bold uppercase leading-snug">
            <p>SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
            <p>TRƯỜNG PTDTBT THCS NƯỚC OA</p>
            <p className="font-normal border-t border-slate-400 mt-1 pt-0.5">Số: ...../TB-TĐNO</p>
          </div>

          <div className="text-center font-bold uppercase leading-snug">
            <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
            <p className="font-normal italic capitalize mt-1">Trà My, ngày 30 tháng {selectedMonth} năm 2026</p>
          </div>
        </div>

        {/* PRINT FORM 03 DETAILS */}
        {type === 'form03' && currentTeacher && evaluation && (
          <div>
            <div className="text-center my-6">
              <h1 className="text-base font-bold uppercase tracking-wide text-slate-900">
                BẢNG ĐÁNH GIÁ VÀ XẾP LOẠI THI ĐUA THÁNG {selectedMonth} NĂM 2026
              </h1>
              <p className="text-xs italic font-sans text-slate-600 mt-1">(Theo Mẫu số 03 quy định thi đua ngành giáo dục)</p>
            </div>

            {/* Profile Summary */}
            <div className="text-xs space-y-1.5 mb-6 font-sans bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>1. Họ và tên giáo viên:</strong> {currentTeacher.fullName}</p>
                <p><strong>2. Ngày tháng năm sinh:</strong> {currentTeacher.dob}</p>
                <p><strong>3. Bộ môn giảng dạy:</strong> {currentTeacher.subject}</p>
                <p><strong>4. Tổ chuyên môn:</strong> {currentTeacher.department}</p>
              </div>
              <p><strong>5. Trường công tác:</strong> {currentTeacher.school}</p>
            </div>

            {/* Criteria Table */}
            <table className="w-full text-xs border-collapse border border-slate-800 mb-6 font-sans">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-2 w-10">STT</th>
                  <th className="border border-slate-800 p-2">Nội dung thi đua đánh giá</th>
                  <th className="border border-slate-800 p-2 w-16">Tối đa</th>
                  <th className="border border-slate-800 p-2 w-20">GV tự chấm</th>
                  <th className="border border-slate-800 p-2 w-20">HT Duyệt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold bg-slate-50">
                  <td className="border border-slate-800 p-1.5 text-center">A</td>
                  <td className="border border-slate-800 p-1.5" colSpan={2}>PHẦN A: NHIỆM VỤ CHUNG VÀ CHUYÊN MÔN (TỐI ĐA 30 ĐIỂM)</td>
                  <td className="border border-slate-800 p-1.5 text-center">{Math.min(30, evaluation.totalPartA_Teacher)}đ</td>
                  <td className="border border-slate-800 p-1.5 text-center">{Math.min(30, evaluation.totalPartA_Principal)}đ</td>
                </tr>

                {FORM_03_CRITERIA.filter(c => c.section === 'A').map((c, i) => {
                  const sc = evaluation.scores[c.id] || { teacherScore: c.maxPoints, principalScore: c.maxPoints };
                  return (
                    <tr key={c.id}>
                      <td className="border border-slate-800 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-800 p-1.5">{c.title}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{c.maxPoints}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-bold">{sc.teacherScore}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-bold">{sc.principalScore}</td>
                    </tr>
                  );
                })}

                <tr className="font-bold bg-slate-50">
                  <td className="border border-slate-800 p-1.5 text-center">B</td>
                  <td className="border border-slate-800 p-1.5" colSpan={2}>PHẦN B: NHIỆM VỤ CỤ THỂ VÀ CÔNG TÁC KIÊM NHIỆM (TỐI ĐA 70 ĐIỂM)</td>
                  <td className="border border-slate-800 p-1.5 text-center">{Math.min(70, evaluation.totalPartB_Teacher)}đ</td>
                  <td className="border border-slate-800 p-1.5 text-center">{Math.min(70, evaluation.totalPartB_Principal)}đ</td>
                </tr>

                {FORM_03_CRITERIA.filter(c => c.section === 'B').map((c, i) => {
                  const sc = evaluation.scores[c.id] || { teacherScore: c.maxPoints, principalScore: c.maxPoints };
                  return (
                    <tr key={c.id}>
                      <td className="border border-slate-800 p-1.5 text-center">{i + 1}</td>
                      <td className="border border-slate-800 p-1.5">{c.title}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{c.maxPoints}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-bold">{sc.teacherScore}</td>
                      <td className="border border-slate-800 p-1.5 text-center font-bold">{sc.principalScore}</td>
                    </tr>
                  );
                })}

                <tr>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">C</td>
                  <td className="border border-slate-800 p-1.5 font-bold">Điểm cộng thi đua (Tổng C.1 + C.2 + C.3 + C.4)</td>
                  <td className="border border-slate-800 p-1.5 text-center">+7</td>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">+{evaluation.totalBonus_Teacher || 0}</td>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">+{evaluation.totalBonus_Principal || 0}</td>
                </tr>

                <tr>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">D</td>
                  <td className="border border-slate-800 p-1.5 font-bold">Điểm trừ thi đua (Tổng D.1 + D.2 + D.3)</td>
                  <td className="border border-slate-800 p-1.5 text-center">-5</td>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">-{evaluation.totalDeduction_Teacher || 0}</td>
                  <td className="border border-slate-800 p-1.5 text-center font-bold">-{evaluation.totalDeduction_Principal || 0}</td>
                </tr>

                <tr className="font-extrabold text-sm bg-slate-200">
                  <td className="border border-slate-800 p-2 text-center" colSpan={3}>
                    TỔNG ĐIỂM VÀ XẾP LOẠI THI ĐUA (PHẦN A TỐI ĐA 30Đ + PHẦN B TỐI ĐA 70Đ = TỐI ĐA 100Đ)
                  </td>
                  <td className="border border-slate-800 p-2 text-center">{Math.min(100, Math.min(30, evaluation.totalPartA_Teacher) + Math.min(70, evaluation.totalPartB_Teacher))} điểm</td>
                  <td className="border border-slate-800 p-2 text-center">{Math.min(100, Math.min(30, evaluation.totalPartA_Principal) + Math.min(70, evaluation.totalPartB_Principal))} điểm</td>
                </tr>
              </tbody>
            </table>

            {/* Classification text */}
            <div className="text-xs space-y-1 mb-8 font-sans">
              <p>• <strong>Giáo viên tự xếp loại:</strong> {getClassificationLabel(evaluation.teacherClassification)}</p>
              <p>• <strong>Hiệu trưởng phê duyệt xếp loại:</strong> <strong className="uppercase">{getClassificationLabel(evaluation.principalClassification)}</strong></p>
              {evaluation.principalComment && (
                <p>• <strong>Ý kiến Ban Giám hiệu:</strong> <em>"{evaluation.principalComment}"</em></p>
              )}
            </div>

            {/* Signatures Footer */}
            <div className="grid grid-cols-2 gap-4 text-center text-xs font-sans mt-10">
              <div>
                <p className="font-bold uppercase">GIÁO VIÊN TỰ ĐÁNH GIÁ</p>
                <p className="italic text-[11px]">(Ký, ghi rõ họ tên)</p>
                <div className="h-20 flex items-center justify-center my-1">
                  {evaluation.teacherSignatureImg ? (
                    <img src={evaluation.teacherSignatureImg} alt="Ký tên" className="max-h-16 object-contain" />
                  ) : (
                    <p className="text-slate-400 italic">(Đã ký xác nhận)</p>
                  )}
                </div>
                <p className="font-bold">{currentTeacher.fullName}</p>
              </div>

              <div>
                <p className="font-bold uppercase">HIỆU TRƯỞNG PHÊ DUYỆT</p>
                <p className="italic text-[11px]">(Ký tên và đóng dấu)</p>
                <div className="h-20 flex items-center justify-center my-1">
                  {evaluation.principalSignatureImg ? (
                    <img src={evaluation.principalSignatureImg} alt="Ký tên Hiệu trưởng" className="max-h-16 object-contain" />
                  ) : (
                    <p className="text-slate-400 italic">(Đã phê duyệt)</p>
                  )}
                </div>
                <p className="font-bold">TRƯỜNG PTDTBT THCS NƯỚC OA</p>
              </div>
            </div>
          </div>
        )}

        {/* PRINT SUMMARY TABLE FOR ALL 34 TEACHERS */}
        {type === 'summary' && (
          <div>
            <div className="text-center my-6">
              <h1 className="text-base font-bold uppercase tracking-wide text-slate-900">
                BẢNG TỔNG HỢP XẾP LOẠI THI ĐUA GIÁO VIÊN THÁNG {selectedMonth} NĂM 2026
              </h1>
              <p className="text-xs italic font-sans text-slate-600 mt-1">
                Trường PTDTBT THCS Nước Oa (Tổng số: 34 Giáo viên)
              </p>
            </div>

            <table className="w-full text-[10px] border-collapse border border-slate-800 mb-8 font-sans">
              <thead>
                <tr className="bg-slate-100 font-bold uppercase text-center border-b border-slate-800">
                  <th className="border border-slate-800 p-1.5 w-6">STT</th>
                  <th className="border border-slate-800 p-1.5 min-w-[120px]">Họ và tên giáo viên</th>
                  <th className="border border-slate-800 p-1.5 w-16">Ngày sinh</th>
                  <th className="border border-slate-800 p-1.5">Bộ môn</th>
                  <th className="border border-slate-800 p-1.5">Tổ chuyên môn</th>
                  <th className="border border-slate-800 p-1.5 w-10">Điểm A</th>
                  <th className="border border-slate-800 p-1.5 w-10">Điểm B</th>
                  <th className="border border-slate-800 p-1.5 w-10">Cộng</th>
                  <th className="border border-slate-800 p-1.5 w-10">Trừ</th>
                  <th className="border border-slate-800 p-1.5 w-12 font-extrabold">Tổng</th>
                  <th className="border border-slate-800 p-1.5 min-w-[110px]">Xếp loại thi đua</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, idx) => {
                  const ev = evaluations[t.id];
                  const partA = Math.min(30, ev ? ev.totalPartA_Principal : 30);
                  const partB = Math.min(70, ev ? ev.totalPartB_Principal : 60);
                  const bonus = ev ? ev.totalBonus_Principal : 0;
                  const ded = ev ? ev.totalDeduction_Principal : 0;
                  const grandTotal = Math.min(100, partA + partB);
                  const clsLabel = getClassificationLabel(getClassification(grandTotal));

                  return (
                    <tr key={t.id}>
                      <td className="border border-slate-800 p-1 text-center font-bold">{idx + 1}</td>
                      <td className="border border-slate-800 p-1 font-bold">{t.fullName}</td>
                      <td className="border border-slate-800 p-1 text-center">{t.dob}</td>
                      <td className="border border-slate-800 p-1">{t.subject}</td>
                      <td className="border border-slate-800 p-1">{t.department}</td>
                      <td className="border border-slate-800 p-1 text-center">{partA}</td>
                      <td className="border border-slate-800 p-1 text-center">{partB}</td>
                      <td className="border border-slate-800 p-1 text-center">+{bonus}</td>
                      <td className="border border-slate-800 p-1 text-center">-{ded}</td>
                      <td className="border border-slate-800 p-1 text-center font-extrabold">{grandTotal}</td>
                      <td className="border border-slate-800 p-1 font-bold">{clsLabel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signatures Footer */}
            <div className="grid grid-cols-2 gap-4 text-center text-xs font-sans mt-8">
              <div>
                <p className="font-bold uppercase">NGƯỜI LẬP BẢNG TỔNG HỢP</p>
                <p className="italic text-[11px]">(Ký, ghi rõ họ tên)</p>
                <div className="h-20" />
                <p className="font-bold">Tổ trưởng chuyên môn</p>
              </div>

              <div>
                <p className="font-bold uppercase">HIỆU TRƯỜNG PHÊ DUYỆT</p>
                <p className="italic text-[11px]">(Ký tên và đóng dấu)</p>
                <div className="h-20" />
                <p className="font-bold">TRƯỜNG PTDTBT THCS NƯỚC OA</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
