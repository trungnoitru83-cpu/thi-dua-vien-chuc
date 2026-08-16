import React, { useState, useEffect } from 'react';
import { User, Calendar, GraduationCap, Building2, School, Link as LinkIcon, FileText, CheckCircle, Plus, Trash2, ExternalLink, Save, ArrowRight, ChevronLeft, ChevronRight, Users, Send, Award, FileSpreadsheet, ShieldCheck, Copy } from 'lucide-react';
import { Teacher, Form01Data, Form01Task, Form03Evaluation, Role } from '../types';
import { isLeaderTeacher, getClassification, getClassificationLabel } from '../data/form03Criteria';

interface TeacherProfilePageProps {
  teachers?: Teacher[];
  teacher: Teacher;
  form01: Form01Data;
  evaluation?: Form03Evaluation;
  selectedMonth: number;
  currentRole: Role;
  onSelectTeacher?: (teacher: Teacher) => void;
  onUpdateTeacher: (updated: Teacher) => void;
  onUpdateForm01: (updatedForm01: Form01Data) => void;
  onNavigateToForm03: () => void;
}

export const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({
  teachers = [],
  teacher,
  form01,
  evaluation,
  selectedMonth,
  currentRole,
  onSelectTeacher,
  onUpdateTeacher,
  onUpdateForm01,
  onNavigateToForm03
}) => {
  // Local state for editable profile fields
  const [fullName, setFullName] = useState(teacher.fullName);
  const [dob, setDob] = useState(teacher.dob);
  const [position, setPosition] = useState(teacher.position || teacher.subject || 'Giáo viên');
  const [subject, setSubject] = useState(teacher.subject);
  const [department, setDepartment] = useState(teacher.department);
  const [school, setSchool] = useState(teacher.school);
  const [evaluationDate, setEvaluationDate] = useState(`2026-0${selectedMonth}-28`);

  // Local state for Form 01
  const [attachedFileUrl, setAttachedFileUrl] = useState(
    form01.attachedFileUrl || 'https://docs.google.com/spreadsheets/d/1sLOpOWvtufbaFHkcuJAa0BpC2zA4ePFZMSjY-hc-DM8/edit?gid=0#gid=0'
  );
  const [overallSummary, setOverallSummary] = useState(form01.overallSummary || '');
  const [tasks, setTasks] = useState<Form01Task[]>(form01.tasks || []);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when selected teacher or form01 changes
  useEffect(() => {
    setFullName(teacher.fullName);
    setDob(teacher.dob);
    setPosition(teacher.position || teacher.subject || 'Giáo viên');
    setSubject(teacher.subject);
    setDepartment(teacher.department);
    setSchool(teacher.school);
    setAttachedFileUrl(
      form01.attachedFileUrl || 'https://docs.google.com/spreadsheets/d/1sLOpOWvtufbaFHkcuJAa0BpC2zA4ePFZMSjY-hc-DM8/edit?gid=0#gid=0'
    );
    setOverallSummary(form01.overallSummary || '');
    setTasks(form01.tasks || []);
    setEvaluationDate(`2026-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}-28`);
  }, [teacher, form01, selectedMonth]);

  // Indexing for teacher navigation
  const currentIndex = teachers.findIndex(t => t.id === teacher.id);
  const prevTeacher = currentIndex > 0 ? teachers[currentIndex - 1] : null;
  const nextTeacher = currentIndex < teachers.length - 1 ? teachers[currentIndex + 1] : null;

  const isLeader = isLeaderTeacher(teacher);

  // Mẫu 03 Evaluation Summary calculation
  const partA = evaluation ? Math.min(30, evaluation.totalPartA_Principal) : 30;
  const partB = evaluation ? Math.min(70, evaluation.totalPartB_Principal) : 60;
  const bonusVal = evaluation ? (evaluation.totalBonus_Principal || 0) : 0;
  const dedVal = evaluation ? (evaluation.totalDeduction_Principal || 0) : 0;
  const grandTotalVal = evaluation ? (evaluation.grandTotal_Principal ?? Math.min(100, partA + partB)) : Math.min(100, partA + partB);
  const clsType = getClassification(grandTotalVal);
  const clsLabel = getClassificationLabel(clsType);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save profile update
    const updatedTeacher: Teacher = {
      ...teacher,
      fullName,
      dob,
      position,
      subject,
      department,
      school
    };
    onUpdateTeacher(updatedTeacher);

    // Save Form 01 update
    const updatedForm01: Form01Data = {
      ...form01,
      month: selectedMonth,
      attachedFileUrl,
      overallSummary,
      tasks,
      updatedAt: new Date().toISOString()
    };
    onUpdateForm01(updatedForm01);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  const handleAddTask = () => {
    const newTask: Form01Task = {
      id: `task_${Date.now()}`,
      taskName: 'Nhiệm vụ bổ sung trong tháng',
      assignedTarget: 'Hoàn thành 100% chỉ tiêu',
      result: 'Đã thực hiện xong',
      completionRate: 100,
      status: 'completed',
      evidenceLink: ''
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleTaskChange = (id: string, field: keyof Form01Task, value: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // Calculate overall completion percentage
  const avgCompletion = tasks.length > 0 
    ? Math.round(tasks.reduce((acc, t) => acc + Number(t.completionRate || 0), 0) / tasks.length)
    : 100;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full">
              TRANG 2: HỒ SƠ & MẪU 01
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Tháng {selectedMonth}/2026
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Thông Tin Giáo Viên & Minh Chứng Mẫu 01
          </h1>
          <p className="text-xs text-slate-500">
            Cập nhật lý lịch chuyên môn và đính kèm đường link / file báo cáo Mẫu 01
          </p>
        </div>

        <button
          onClick={onNavigateToForm03}
          className={`flex items-center gap-2 px-5 py-2.5 text-white font-bold text-xs rounded-2xl shadow-md transition shrink-0 ${
            isLeader ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <span>{isLeader ? 'Chuyển sang Bảng chấm Mẫu 02 (TTCM, TPCM, HT, HP)' : 'Chuyển sang Bảng chấm Mẫu 03 (GV, NV)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Teacher Selector Bar for Trang 2 */}
      {teachers.length > 0 && onSelectTeacher && (
        <div className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase">
                Chọn GV ({currentIndex >= 0 ? currentIndex + 1 : 1}/{teachers.length}):
              </span>
              
              {/* Dropdown menu for fast access */}
              <select
                value={teacher.id}
                onChange={(e) => {
                  const found = teachers.find(t => t.id === e.target.value);
                  if (found) onSelectTeacher(found);
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {teachers.map((t, idx) => (
                  <option key={t.id} value={t.id}>
                    {idx + 1}. {t.fullName} ({t.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Next / Prev Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!prevTeacher}
                onClick={() => prevTeacher && onSelectTeacher(prevTeacher)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 hover:bg-slate-200 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>GV Trước</span>
              </button>

              <button
                type="button"
                disabled={!nextTeacher}
                onClick={() => nextTeacher && onSelectTeacher(nextTeacher)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 hover:bg-slate-200 transition flex items-center gap-1"
              >
                <span>GV Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontally scrollable list of teacher pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {teachers.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTeacher(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition shrink-0 ${
                  t.id === teacher.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}. {t.fullName.split(' ').pop()}
              </button>
            ))}
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100 rounded-2xl border-2 border-emerald-500 flex items-center justify-between gap-3 font-bold text-sm shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-200">
                ✅ ĐÃ LƯU MẪU 01 THÀNH CÔNG!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                Dữ liệu hồ sơ & đính kèm minh chứng Mẫu 01 tháng {selectedMonth}/2026 đã được lưu an toàn lên đám mây Firebase.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase shrink-0">
            ĐÃ LƯU FIREBASE
          </span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Section 1: Thông tin cá nhân & chuyên môn */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-2xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Thông Tin Lý Lịch Giáo Viên
              </h2>
              <p className="text-xs text-slate-500">
                Các thông tin đơn vị công tác và bộ môn giảng dạy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chu kỳ đánh giá / Lịch chọn ngày */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chu kỳ đánh giá (Lịch chọn ngày / Tháng) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-blue-600 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700 rounded-xl text-sm font-extrabold text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Chu kỳ Tháng {selectedMonth}/2026 đính kèm lịch lưu lâu dài</p>
            </div>

            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Chức vụ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chức vụ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Hiệu trưởng">Hiệu trưởng</option>
                  <option value="Phó Hiệu trưởng">Phó Hiệu trưởng</option>
                  <option value="Tổ trưởng chuyên môn">Tổ trưởng chuyên môn</option>
                  <option value="Bí thư Đoàn trường">Bí thư Đoàn trường</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Giáo viên - TKHĐ">Giáo viên - TKHĐ</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Nhân viên QLNT">Nhân viên QLNT</option>
                </select>
              </div>
            </div>

            {/* Ngày tháng năm sinh */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ngày tháng năm sinh <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Bộ môn giảng dạy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bộ môn giảng dạy / Công tác <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Tổ chuyên môn */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tổ chuyên môn <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                  <option value="Tổ Xã hội">Tổ Xã hội</option>
                  <option value="Tổ Tự nhiên">Tổ Tự nhiên</option>
                  <option value="Tổ KHXH1">Tổ KHXH1</option>
                  <option value="Tổ KHXH2">Tổ KHXH2</option>
                  <option value="Tổ KHTN">Tổ KHTN</option>
                  <option value="Văn phòng">Văn phòng</option>
                  <option value="QLNT">QLNT (Nội trú)</option>
                </select>
              </div>
            </div>

            {/* Trường */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trường công tác <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 1.5: Thống Kê Tổng Điểm Mẫu 03/02 của Cán Bộ Trong Tháng */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-800/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Tổng Điểm Đánh Giá {isLeader ? 'Mẫu 02 (CBQL)' : 'Mẫu 03 (GV, NV)'} - Tháng {selectedMonth}/2026</span>
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Tự động đồng bộ điểm Tiêu chí chung, Tiêu chí chuyên môn, Điểm cộng, Điểm trừ & Mức xếp loại
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 font-extrabold text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{clsLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
            <div className="bg-white/10 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Điểm Tiêu chí chung (A)</p>
              <p className="text-xl font-black text-blue-300 mt-1">{partA} <span className="text-xs text-indigo-300/70 font-normal">/30</span></p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Tiêu chí chuyên môn (B)</p>
              <p className="text-xl font-black text-indigo-300 mt-1">{partB} <span className="text-xs text-indigo-300/70 font-normal">/70</span></p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Điểm Cộng (+C)</p>
              <p className="text-xl font-black text-emerald-300 mt-1">+{bonusVal}</p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Điểm Trừ (-D)</p>
              <p className="text-xl font-black text-rose-300 mt-1">-{dedVal}</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-amber-400/20 p-3.5 rounded-2xl border border-amber-400/40">
              <p className="text-[10px] text-amber-200 uppercase font-bold">Tổng Điểm Đánh Giá</p>
              <p className="text-2xl font-black text-amber-300 mt-1">{grandTotalVal} <span className="text-xs text-amber-200/70 font-normal">/100</span></p>
            </div>
          </div>
        </div>

        {/* Section 2: Đính kèm link & Quản lý Mẫu 01 Google Sheet */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>2. Liên Kết File Google Sheet Mẫu 01 Tháng {selectedMonth}/2026</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Mỗi tháng hệ thống quản lý một đường link Google Sheet Mẫu 01 riêng biệt
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl">
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                Tỷ lệ hoàn thành:
              </span>
              <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                {avgCompletion}%
              </span>
            </div>
          </div>

          {/* Link Attachment Input Box */}
          <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-700">
            <label className="block text-xs font-extrabold text-emerald-950 dark:text-emerald-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Đường Link Google Sheet Mẫu 01 (Tháng {selectedMonth}/2026):
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-200/80 dark:bg-emerald-900/80 px-2.5 py-0.5 rounded-full">
                Mẫu chuẩn Google Sheet
              </span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={attachedFileUrl}
                onChange={(e) => setAttachedFileUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1sLOpOWvtufbaFHkcuJAa0BpC2zA4ePFZMSjY-hc-DM8/edit"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              {attachedFileUrl && (
                <a
                  href={attachedFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm shrink-0"
                  title="Mở Google Sheet Mẫu 01 trong tab mới"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Google Sheet Mẫu 01</span>
                </a>
              )}

              <a
                href="https://docs.google.com/spreadsheets/d/1sLOpOWvtufbaFHkcuJAa0BpC2zA4ePFZMSjY-hc-DM8/copy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shrink-0"
                title="Tạo bản sao Google Sheet mẫu cho Tháng này"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Tạo bản sao mẫu</span>
              </a>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <p className="flex items-center gap-1">
                <span>📁 Quy định tên file Google Sheet tháng {selectedMonth}: <code className="bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-200 font-mono text-[10px] font-bold">Tháng {selectedMonth} năm 2026</code></span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                * Dữ liệu Mẫu 01 & Mẫu 03 (Họ tên, Chức vụ, Tổ chuyên môn, Điểm Tiêu chí chung A, Điểm Chuyên môn B, Điểm cộng C, Điểm trừ D, Tổng điểm HT & Xếp loại) được tự động truyền & lưu trữ lâu dài vào Bảng Tổng Hợp Hệ Thống.
              </p>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Danh mục nhiệm vụ thực hiện trong tháng {selectedMonth}/2026:
              </h3>
              <button
                type="button"
                onClick={handleAddTask}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-200 font-bold text-xs rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm nhiệm vụ
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 w-10 text-center">STT</th>
                    <th className="p-3 min-w-[200px]">Nhiệm vụ trong tháng</th>
                    <th className="p-3 min-w-[180px]">Chỉ tiêu / Kế hoạch giao</th>
                    <th className="p-3 min-w-[180px]">Kết quả đạt được</th>
                    <th className="p-3 w-28 text-center">% Hoàn thành</th>
                    <th className="p-3 min-w-[180px]">Link minh chứng</th>
                    <th className="p-3 w-12 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {tasks.map((task, idx) => (
                    <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-3">
                        <textarea
                          rows={2}
                          value={task.taskName}
                          onChange={(e) => handleTaskChange(task.id, 'taskName', e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <textarea
                          rows={2}
                          value={task.assignedTarget}
                          onChange={(e) => handleTaskChange(task.id, 'assignedTarget', e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <textarea
                          rows={2}
                          value={task.result}
                          onChange={(e) => handleTaskChange(task.id, 'result', e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={task.completionRate}
                          onChange={(e) => handleTaskChange(task.id, 'completionRate', Number(e.target.value))}
                          className="w-20 p-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="url"
                          placeholder="Link Drive..."
                          value={task.evidenceLink || ''}
                          onChange={(e) => handleTaskChange(task.id, 'evidenceLink', e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overall Summary textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Đánh giá chung mức độ hoàn thành nhiệm vụ Mẫu 01
            </label>
            <textarea
              rows={3}
              value={overallSummary}
              onChange={(e) => setOverallSummary(e.target.value)}
              placeholder="Nhập nhận xét chung về việc thực hiện nhiệm vụ trong tháng..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

        </div>

        {/* Save & Navigation Action Bar at bottom of Trang 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Hoàn tất cập nhật hồ sơ Mẫu 01 của cán bộ: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{teacher.fullName}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Xác nhận nộp Mẫu 01 rồi chuyển tiếp sang Trang 3 để tính điểm thi đua ({isLeader ? 'Mẫu 02 cho CBQL' : 'Mẫu 03 cho Giáo viên/Nhân viên'}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-3 font-bold text-xs rounded-xl shadow-lg transition ${
                savedSuccess
                  ? 'bg-emerald-600 ring-4 ring-emerald-300 dark:ring-emerald-800 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>✅ ĐÃ LƯU MẪU 01 THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Xác Nhận Nộp Mẫu 01</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateToForm03}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
            >
              <span>{isLeader ? 'Chuyển sang tính điểm Mẫu 02 (CBQL)' : 'Chuyển sang tính điểm Mẫu 03 (GV, NV)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
