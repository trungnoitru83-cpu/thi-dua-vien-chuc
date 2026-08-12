import React from 'react';
import { LogIn, UserCheck, FileSpreadsheet, BarChart3, Calendar, Award, LogOut, ChevronDown, CloudCheck } from 'lucide-react';
import { Teacher, Role } from '../types';

interface NavbarProps {
  activeTab: 'login' | 'profile' | 'evaluation' | 'summary';
  setActiveTab: (tab: 'login' | 'profile' | 'evaluation' | 'summary') => void;
  currentUser: Teacher | null;
  currentRole: Role;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  onLogout: () => void;
  teacherCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentRole,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onLogout,
  teacherCount
}) => {
  const roleLabel = {
    teacher: 'Giáo viên',
    department_head: 'Tổ trưởng chuyên môn',
    principal: 'Hiệu trưởng / Ban giám hiệu',
    staff: 'Nhân viên / Cán bộ'
  }[currentRole] || 'Cán bộ';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(currentUser ? 'summary' : 'login')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  THI ĐUA NƯỚC OA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  NĂM {selectedYear}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800" title="Dữ liệu đồng bộ trực tuyến thời gian thực trên CSDL Đám mây (Firebase Cloud)">
                  <CloudCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Đám Mây Firestore</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Quản lý & Chấm điểm thi đua giáo viên hàng tháng
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Hidden if not logged in */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Trang 1: Tài Khoản</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Trang 2: Thông Tin & Mẫu 01</span>
              </button>

              <button
                onClick={() => setActiveTab('evaluation')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'evaluation'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Trang 3: Bảng Chấm Điểm</span>
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Tổng Hợp ({teacherCount} GV)</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Month & Year Selectors + User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Month & Year Selectors */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1.5 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m} className="dark:bg-slate-900">
                    Tháng {m}
                  </option>
                ))}
              </select>
              <span className="text-slate-400 text-xs font-bold mx-0.5">/</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 appearance-none"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <option key={y} value={y} className="dark:bg-slate-900">
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none ml-1 shrink-0" />
            </div>

            {/* Current User Info */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/80 p-1.5 pr-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[130px] truncate">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                    {roleLabel}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="Đăng xuất / Chọn tài khoản khác"
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Row - Only if logged in */}
        {currentUser && (
          <div className="flex md:hidden overflow-x-auto pb-2 gap-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-2">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg ${
                activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Trang 1: Tài Khoản
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Trang 2: Thông tin & Mẫu 01
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg ${
                activeTab === 'evaluation' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Trang 3: Bảng chấm Mẫu 03
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg ${
                activeTab === 'summary' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Tổng hợp xếp loại
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
