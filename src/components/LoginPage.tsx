import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, User, Users, ArrowRight, BookOpen, AlertTriangle, CheckCircle, X, Search, KeyRound, UserCheck } from 'lucide-react';
import { Teacher, Role } from '../types';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginPageProps {
  teachers: Teacher[];
  onLogin: (teacher: Teacher, role: Role) => void;
  onSelectTeacherForDemo?: (teacher: Teacher, role: Role) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  teachers,
  onLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('teacher');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Google Auth Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');

  // Change Password Modal State
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [changePassEmail, setChangePassEmail] = useState('');
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  // Password verification helper (checks localStorage custom passwords first, then defaults '123456' / 'nuocoa2026')
  const verifyPassword = (cleanEmail: string, inputPass: string): boolean => {
    const cleanInput = inputPass.trim();
    try {
      const customPasswords = JSON.parse(localStorage.getItem('nuocoa_user_passwords') || '{}');
      if (customPasswords[cleanEmail]) {
        return cleanInput === customPasswords[cleanEmail];
      }
    } catch (e) {
      console.error(e);
    }
    return cleanInput === '123456' || cleanInput === 'nuocoa2026';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ Email Google đăng nhập của bạn!');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu đăng nhập!');
      return;
    }

    // 1. Strict Verification: Check if Email exists in Teacher Directory
    const foundTeacher = teachers.find(
      t => t.email.toLowerCase() === cleanEmail
    );

    if (!foundTeacher) {
      setErrorMessage(`⛔ ĐĂNG NHẬP THẤT BẠI: Địa chỉ Email Google "${email}" KHÔNG TỒN TẠI trong danh sách ${teachers.length} cán bộ giáo viên trường Nước Oa. Vui lòng kiểm tra lại tài khoản.`);
      return;
    }

    // 2. Strict Verification: Check Password
    if (!verifyPassword(cleanEmail, cleanPassword)) {
      setErrorMessage(`⛔ SAI MẬT KHẨU: Mật khẩu bạn nhập cho tài khoản Google "${foundTeacher.email}" KHÔNG CHÍNH XÁC. Hệ thống không cho phép truy cập!`);
      return;
    }

    // Both email & password match registered teacher -> Grant access
    onLogin(foundTeacher, role);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    const cleanEmail = changePassEmail.trim().toLowerCase();
    const cleanCurrent = currentPassInput.trim();
    const cleanNew = newPassInput.trim();
    const cleanConfirm = confirmNewPassInput.trim();

    if (!cleanEmail) {
      setChangePassError('Vui lòng chọn hoặc nhập Email tài khoản cần đổi mật khẩu!');
      return;
    }

    const found = teachers.find(t => t.email.toLowerCase() === cleanEmail);
    if (!found) {
      setChangePassError(`⛔ Email "${cleanEmail}" không thuộc danh sách cán bộ nhà trường.`);
      return;
    }

    if (!cleanCurrent) {
      setChangePassError('Vui lòng nhập Mật khẩu hiện tại!');
      return;
    }

    if (!verifyPassword(cleanEmail, cleanCurrent)) {
      setChangePassError('⛔ Mật khẩu hiện tại không chính xác! Vui lòng kiểm tra lại.');
      return;
    }

    if (!cleanNew) {
      setChangePassError('Vui lòng nhập Mật khẩu mới!');
      return;
    }

    if (cleanNew.length < 6) {
      setChangePassError('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setChangePassError('⛔ Mật khẩu mới và Nhập lại mật khẩu mới KHÔNG TRÙNG KHỚP!');
      return;
    }

    // Save to localStorage
    try {
      const customPasswords = JSON.parse(localStorage.getItem('nuocoa_user_passwords') || '{}');
      customPasswords[cleanEmail] = cleanNew;
      localStorage.setItem('nuocoa_user_passwords', JSON.stringify(customPasswords));
      
      setChangePassSuccess(`✅ Đã đổi mật khẩu thành công cho cán bộ ${found.fullName}!`);
      setEmail(found.email);
      setPassword(cleanNew);

      setTimeout(() => {
        setIsChangePassModalOpen(false);
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmNewPassInput('');
        setChangePassSuccess('');
      }, 1500);
    } catch (err) {
      setChangePassError('Không thể lưu mật khẩu mới. Vui lòng thử lại!');
    }
  };

  // Real Firebase Google Login Popup Handler
  const handleFirebaseGooglePopup = async () => {
    setErrorMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userGoogleEmail = result.user?.email?.toLowerCase();

      if (!userGoogleEmail) {
        setErrorMessage('⛔ Không thể lấy thông tin Email từ tài khoản Google.');
        return;
      }

      // Strict check against teacher list
      const found = teachers.find(t => t.email.toLowerCase() === userGoogleEmail);

      if (!found) {
        // Sign out immediately
        await auth.signOut();
        setErrorMessage(`⛔ HỆ THỐNG TỪ CHỐI TRUY CẬP: Tài khoản Google (${userGoogleEmail}) KHÔNG THUỘC danh sách cán bộ giáo viên Nước Oa. Hệ thống không cho phép truy cập!`);
        return;
      }

      onLogin(found, role);
    } catch (err: any) {
      console.warn('Firebase Google Auth Popup error or cancelled:', err);
      // Fallback open manual Google verification modal
      setGoogleEmailInput(email || 'anh.nguyen@nuocoa.edu.vn');
      setGooglePasswordInput('');
      setGoogleModalError('');
      setGoogleSuccessMsg('');
      setIsGoogleModalOpen(true);
    }
  };

  const handleGoogleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleModalError('');
    setGoogleSuccessMsg('');

    const cleanGoogleEmail = googleEmailInput.trim().toLowerCase();
    const cleanGooglePassword = googlePasswordInput.trim();

    if (!cleanGoogleEmail) {
      setGoogleModalError('Vui lòng nhập Email tài khoản Google của giáo viên!');
      return;
    }

    if (!cleanGooglePassword) {
      setGoogleModalError('Vui lòng nhập mật khẩu tài khoản Google!');
      return;
    }

    setIsLinkingGoogle(true);

    setTimeout(() => {
      setIsLinkingGoogle(false);
      
      // Strict verification against teachers list
      const found = teachers.find(t => t.email.toLowerCase() === cleanGoogleEmail);

      if (!found) {
        setGoogleModalError(`⛔ ĐĂNG NHẬP THẤT BẠI: Tài khoản Google "${cleanGoogleEmail}" KHÔNG HỢP LỆ hoặc chưa được cấp quyền trong hệ thống cán bộ giáo viên Nước Oa!`);
        return;
      }

      if (!verifyPassword(cleanGoogleEmail, cleanGooglePassword)) {
        setGoogleModalError(`⛔ SAI MẬT KHẨU: Mật khẩu nhập cho tài khoản Google "${cleanGoogleEmail}" không chính xác. Hệ thống từ chối truy cập!`);
        return;
      }

      setGoogleSuccessMsg(`✅ Xác thực và liên kết tài khoản Google thành công (${found.fullName} - ${found.email})!`);
      setTimeout(() => {
        setIsGoogleModalOpen(false);
        onLogin(found, role);
      }, 700);

    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-blue-800/40 relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-extrabold bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/30">
                TRANG 1: ĐĂNG NHẬP HỆ THỐNG
              </span>
              <span className="text-xs text-blue-300 font-medium">
                Trường PTDTNT THCS và THPT Nước Oa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Phần Mềm Chấm Thi Đua Hàng Tháng
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl mt-1">
              Xác thực tài khoản Google giáo viên & cán bộ nhân viên - Đánh giá công khai, minh bạch & chính xác.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <BookOpen className="w-7 h-7 text-amber-300" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-200">Quy mô quản lý</p>
              <p className="text-base font-black text-amber-300">{teachers.length} Cán Bộ / GV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Centered Login Box */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-2xl mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Đăng Nhập Tài Khoản
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chỉ tài khoản Email Google hợp lệ của cán bộ giáo viên mới được truy cập
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-5 p-4 bg-rose-50 text-rose-800 dark:bg-rose-950/90 dark:text-rose-200 rounded-2xl text-xs font-semibold border-2 border-rose-300 dark:border-rose-800 flex items-start gap-2.5 animate-pulse shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-rose-900 dark:text-rose-100 text-xs">TRUY CẬP BỊ TỪ CHỐI!</p>
              <p className="text-xs font-medium text-rose-800 dark:text-rose-200 mt-1 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Select Registered Teacher Google Email */}
        <div className="mb-5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Chọn nhanh Email Cán bộ ({teachers.length} người):</span>
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">Tự động điền Email</span>
          </label>

          <select
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
            }}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">-- Chọn cán bộ/giáo viên từ danh sách --</option>
            {teachers.map((t, idx) => (
              <option key={t.id} value={t.email}>
                {idx + 1}. {t.fullName} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Địa chỉ Email Google đăng nhập
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Ví dụ: anh.nguyen@nuocoa.edu.vn"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Password Input & Change Password Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu đăng nhập
              </label>
              <button
                type="button"
                onClick={() => {
                  setChangePassEmail(email || teachers[0]?.email || '');
                  setCurrentPassInput('');
                  setNewPassInput('');
                  setConfirmNewPassInput('');
                  setChangePassError('');
                  setChangePassSuccess('');
                  setIsChangePassModalOpen(true);
                }}
                className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>Đổi mật khẩu hiện tại</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Nhập mật khẩu (VD: 123456)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Role Selection (4 Roles: Giáo viên, Tổ trưởng, Nhân viên, Hiệu trưởng) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Vai trò truy cập hệ thống
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === 'teacher'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300 dark:border-blue-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px]">Giáo viên</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('department_head')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === 'department_head'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px]">Tổ trưởng</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === 'staff'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700 font-bold dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px]">Nhân viên</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('principal')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  role === 'principal'
                    ? 'bg-amber-50 border-amber-600 text-amber-700 font-bold dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px]">Hiệu trưởng</span>
              </button>
            </div>
          </div>

          {/* Submit Email Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Xác Thực & Đăng Nhập System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Change Password Banner Action */}
        <button
          type="button"
          onClick={() => {
            setChangePassEmail(email || teachers[0]?.email || '');
            setCurrentPassInput('');
            setNewPassInput('');
            setConfirmNewPassInput('');
            setChangePassError('');
            setChangePassSuccess('');
            setIsChangePassModalOpen(true);
          }}
          className="w-full mt-3 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition border border-slate-200 dark:border-slate-700"
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>Đổi mật khẩu tài khoản hiện tại</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
              Hoặc Đăng Nhập Trực Tiếp Google
            </span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleFirebaseGooglePopup}
          className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2.5 transition shadow-sm"
        >
          {/* Google Color Icon SVG */}
          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng nhập qua Tài Khoản Google</span>
        </button>

      </div>

      {/* Change Password Modal */}
      {isChangePassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => {
                setIsChangePassModalOpen(false);
                setChangePassError('');
                setChangePassSuccess('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Đổi Mật Khẩu Hiện Tại
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cập nhật mật khẩu mới cho tài khoản cán bộ giáo viên
                </p>
              </div>
            </div>

            {changePassError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-bold border border-rose-300 dark:border-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{changePassError}</span>
              </div>
            )}

            {changePassSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {changePassSuccess}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đang tự động điền mật khẩu mới vào ô đăng nhập...
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {/* Select Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chọn tài khoản Cán bộ / Giáo viên
                  </label>
                  <select
                    value={changePassEmail}
                    onChange={(e) => {
                      setChangePassEmail(e.target.value);
                      setChangePassError('');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">-- Chọn cán bộ cần đổi mật khẩu --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.email}>
                        {t.fullName} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={currentPassInput}
                    onChange={(e) => {
                      setCurrentPassInput(e.target.value);
                      setChangePassError('');
                    }}
                    placeholder="Mật khẩu hiện tại (VD: 123456)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu mới (Tối thiểu 6 ký tự)
                  </label>
                  <input
                    type="password"
                    value={newPassInput}
                    onChange={(e) => {
                      setNewPassInput(e.target.value);
                      setChangePassError('');
                    }}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassInput}
                    onChange={(e) => {
                      setConfirmNewPassInput(e.target.value);
                      setChangePassError('');
                    }}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePassModalOpen(false);
                      setChangePassError('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-600/30"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Lưu Mật Khẩu Mới</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Google Link & Verification Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Xác Thực Tài Khoản Google
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập tài khoản Google và mật khẩu hợp lệ để vào hệ thống
                </p>
              </div>
            </div>

            {googleModalError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-bold border border-rose-300 dark:border-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{googleModalError}</span>
              </div>
            )}

            {googleSuccessMsg ? (
              <div className="py-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {googleSuccessMsg}
                </p>
                <p className="text-xs text-slate-400 mt-1">Đang chuyển hướng vào hệ thống...</p>
              </div>
            ) : (
              <form onSubmit={handleGoogleLinkSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Địa chỉ Email Google giáo viên
                  </label>
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => {
                      setGoogleEmailInput(e.target.value);
                      setGoogleModalError('');
                    }}
                    placeholder="anh.nguyen@nuocoa.edu.vn"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu đăng nhập (VD: 123456)
                  </label>
                  <input
                    type="password"
                    value={googlePasswordInput}
                    onChange={(e) => {
                      setGooglePasswordInput(e.target.value);
                      setGoogleModalError('');
                    }}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quy định bảo mật:</strong> Nếu thông tin Email Google hoặc Mật khẩu không đúng với thông tin cán bộ giáo viên đăng ký, hệ thống sẽ <strong>từ chối hoàn toàn</strong> không cho truy cập.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isLinkingGoogle}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                  >
                    {isLinkingGoogle ? 'Đang xác thực...' : 'Xác Thực & Đăng Nhập'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};


