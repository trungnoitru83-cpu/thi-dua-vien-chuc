import React, { useState, useMemo } from 'react';
import {
  Lock,
  ShieldCheck,
  User,
  Users,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  X,
  Search,
  KeyRound,
  UserCheck,
  FileSpreadsheet,
  Check,
  Hash,
  Sparkles,
  QrCode,
  ListOrdered
} from 'lucide-react';
import { Teacher, Role } from '../types';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  isLeaderTeacher,
  getDefaultRoleForTeacher,
  getFormTypeForTeacher
} from '../data/form03Criteria';
import { getTeacherEmulationCode } from '../data/mockTeachers';

interface LoginPageProps {
  teachers: Teacher[];
  onLogin: (teacher: Teacher, role: Role) => void;
  onSelectTeacherForDemo?: (teacher: Teacher, role: Role) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  teachers,
  onLogin
}) => {
  // Login Input State (Supports Mã thi đua: TĐ0001 - TĐ0036 or Email)
  const [loginIdentifier, setLoginIdentifier] = useState('TĐ0001');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<Role>('principal');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Google Auth Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');

  // Change Password Modal State
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [changePassIdentifier, setChangePassIdentifier] = useState('TĐ0001');
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  // Helper: Find teacher by Mã thi đua (TĐ0001, TD0001, 1, 0001) or Email or Name
  const findTeacher = (input: string): { teacher: Teacher; index: number } | null => {
    const raw = input.trim();
    if (!raw) return null;
    const clean = raw.toLowerCase();
    const cleanNoAccent = clean.replace(/đ/g, 'd');

    for (let i = 0; i < teachers.length; i++) {
      const t = teachers[i];
      const code = (t.emulationCode || getTeacherEmulationCode(t, i)).toLowerCase();
      const codeNoAccent = code.replace(/đ/g, 'd');
      const teacherNum = parseInt(t.id.replace(/\D/g, ''), 10) || (i + 1);
      const rawNum = parseInt(clean.replace(/\D/g, ''), 10);

      if (
        code === clean ||
        codeNoAccent === cleanNoAccent ||
        (cleanNoAccent.startsWith('td') && cleanNoAccent === codeNoAccent) ||
        (!isNaN(rawNum) && rawNum === teacherNum && clean.length <= 6) ||
        t.email.toLowerCase() === clean ||
        t.fullName.toLowerCase() === clean ||
        t.id.toLowerCase() === clean
      ) {
        return { teacher: t, index: i };
      }
    }
    return null;
  };

  // Password verification helper (checks localStorage custom passwords first, then defaults '123456' / 'nuocoa2026')
  const verifyPassword = (matchedTeacher: Teacher, inputPass: string): boolean => {
    const cleanInput = inputPass.trim();
    const cleanEmail = matchedTeacher.email.toLowerCase();
    const code = (matchedTeacher.emulationCode || getTeacherEmulationCode(matchedTeacher)).toLowerCase();

    try {
      const customPasswords = JSON.parse(localStorage.getItem('nuocoa_user_passwords') || '{}');
      if (customPasswords[code]) return cleanInput === customPasswords[code];
      if (customPasswords[cleanEmail]) return cleanInput === customPasswords[cleanEmail];
      if (customPasswords[matchedTeacher.id]) return cleanInput === customPasswords[matchedTeacher.id];
    } catch (e) {
      console.error(e);
    }
    return cleanInput === '123456' || cleanInput === 'nuocoa2026';
  };

  // Matched teacher for live indicator
  const matchedTeacherData = useMemo(() => {
    return findTeacher(loginIdentifier);
  }, [loginIdentifier, teachers]);

  // Handle select teacher from 36 codes list
  const handleSelectTeacherByCode = (teacher: Teacher, index: number) => {
    const code = teacher.emulationCode || getTeacherEmulationCode(teacher, index);
    setLoginIdentifier(code);
    setErrorMessage('');
    const autoRole = getDefaultRoleForTeacher(teacher);
    setRole(autoRole);
    if (!password) setPassword('123456');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanInput = loginIdentifier.trim();
    const cleanPassword = password.trim();

    if (!cleanInput) {
      setErrorMessage('Vui lòng nhập Mã thi đua (VD: TĐ0001 - TĐ0036) hoặc Email cán bộ để đăng nhập!');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu đăng nhập!');
      return;
    }

    // 1. Strict Verification: Check if Mã Thi Đua exists in Teacher Directory
    const matched = findTeacher(cleanInput);

    if (!matched) {
      setErrorMessage(`⛔ ĐĂNG NHẬP THẤT BẠI: Mã thi đua hoặc Email "${loginIdentifier}" KHÔNG TỒN TẠI trong danh sách 36 mã thi đua (TĐ0001 - TĐ0036) của trường Nước Oa. Vui lòng kiểm tra lại.`);
      return;
    }

    const { teacher: foundTeacher } = matched;

    // 2. Strict Verification: Check Password
    if (!verifyPassword(foundTeacher, cleanPassword)) {
      setErrorMessage(`⛔ SAI MẬT KHẨU: Mật khẩu bạn nhập cho cán bộ "${foundTeacher.fullName}" (${foundTeacher.emulationCode || getTeacherEmulationCode(foundTeacher)}) KHÔNG CHÍNH XÁC. Hệ thống không cho phép truy cập!`);
      return;
    }

    // Granted access
    onLogin(foundTeacher, role);
  };

  const handleSendPhoneOtp = (teacher: Teacher) => {
    setIsSendingOtp(true);
    setChangePassError('');
    setOtpSentNotice('');
    
    setTimeout(() => {
      setIsSendingOtp(false);
      // Generate 6-digit OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtpCode(randomOtp);
      const phoneDisplay = teacher.phone || '09051234xx';
      setOtpSentNotice(`Đã gửi mã xác nhận OTP (6 số) tới SĐT ${phoneDisplay} đăng ký liên kết với Gmail: ${teacher.email}. [Mã thử nghiệm hệ thống: ${randomOtp}]`);
    }, 700);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    const cleanInput = changePassIdentifier.trim();
    const cleanCurrent = currentPassInput.trim();
    const cleanOtp = phoneOtpInput.trim();
    const cleanNew = newPassInput.trim();
    const cleanConfirm = confirmNewPassInput.trim();

    if (!cleanInput) {
      setChangePassError('Vui lòng chọn hoặc nhập Mã thi đua / Email cần đổi mật khẩu!');
      return;
    }

    const matched = findTeacher(cleanInput);
    if (!matched) {
      setChangePassError(`⛔ Mã thi đua hoặc Email "${cleanInput}" không thuộc danh sách 36 cán bộ nhà trường.`);
      return;
    }

    const { teacher: found } = matched;

    if (!cleanCurrent) {
      setChangePassError('Vui lòng nhập Mật khẩu hiện tại!');
      return;
    }

    if (!verifyPassword(found, cleanCurrent)) {
      setChangePassError('⛔ Mật khẩu hiện tại không chính xác! Vui lòng kiểm tra lại.');
      return;
    }

    // Check Phone OTP if sent
    if (sentOtpCode && cleanOtp !== sentOtpCode) {
      setChangePassError('⛔ Mã xác nhận OTP gửi qua Số điện thoại / Gmail không chính xác!');
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
      const code = (found.emulationCode || getTeacherEmulationCode(found)).toLowerCase();
      customPasswords[code] = cleanNew;
      customPasswords[found.email.toLowerCase()] = cleanNew;
      localStorage.setItem('nuocoa_user_passwords', JSON.stringify(customPasswords));

      setChangePassSuccess(`✅ Đã đổi mật khẩu thành công cho cán bộ ${found.fullName} (${found.emulationCode || getTeacherEmulationCode(found)})!`);
      setLoginIdentifier(found.emulationCode || getTeacherEmulationCode(found));
      setPassword(cleanNew);

      setTimeout(() => {
        setIsChangePassModalOpen(false);
        setCurrentPassInput('');
        setPhoneOtpInput('');
        setSentOtpCode('');
        setOtpSentNotice('');
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
      const matched = findTeacher(userGoogleEmail);

      if (!matched) {
        // Sign out immediately
        await auth.signOut();
        setErrorMessage(`⛔ HỆ THỐNG TỪ CHỐI TRUY CẬP: Tài khoản Google (${userGoogleEmail}) KHÔNG THUỘC danh sách cán bộ giáo viên Nước Oa. Hệ thống không cho phép truy cập!`);
        return;
      }

      onLogin(matched.teacher, role);
    } catch (err: any) {
      console.warn('Firebase Google Auth Popup error or cancelled:', err);
      // Fallback open manual Google verification modal
      setGoogleEmailInput(teachers[0]?.email || 'anh.nguyen@nuocoa.edu.vn');
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
      const matched = findTeacher(cleanGoogleEmail);

      if (!matched) {
        setGoogleModalError(`⛔ ĐĂNG NHẬP THẤT BẠI: Tài khoản Google "${cleanGoogleEmail}" KHÔNG HỢP LỆ hoặc chưa được cấp quyền trong hệ thống cán bộ giáo viên Nước Oa!`);
        return;
      }

      const { teacher: found } = matched;

      if (!verifyPassword(found, cleanGooglePassword)) {
        setGoogleModalError(`⛔ SAI MẬT KHẨU: Mật khẩu nhập cho tài khoản Google "${cleanGoogleEmail}" không chính xác. Hệ thống từ chối truy cập!`);
        return;
      }

      setGoogleSuccessMsg(`✅ Xác thực và liên kết tài khoản Google thành công (${found.fullName} - ${found.emulationCode || getTeacherEmulationCode(found)})!`);
      setTimeout(() => {
        setIsGoogleModalOpen(false);
        onLogin(found, role);
      }, 700);

    }, 600);
  };

  // Filter teachers for the 36 codes directory
  const filteredTeachers = useMemo(() => {
    if (!searchFilter.trim()) return teachers;
    const q = searchFilter.toLowerCase();
    const qNoAccent = q.replace(/đ/g, 'd');
    return teachers.filter((t, idx) => {
      const code = (t.emulationCode || getTeacherEmulationCode(t, idx)).toLowerCase();
      const codeNoAccent = code.replace(/đ/g, 'd');
      return (
        code.includes(q) ||
        codeNoAccent.includes(qNoAccent) ||
        t.fullName.toLowerCase().includes(q) ||
        (t.position && t.position.toLowerCase().includes(q)) ||
        t.subject.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
      );
    });
  }, [teachers, searchFilter]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">

      {/* Top Banner Header */}
      <div className="bg-theme-gradient text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-white/20 relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-extrabold bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-xs">
                TRANG 1: ĐĂNG NHẬP HỆ THỐNG
              </span>
              <span className="px-3 py-1 text-xs font-extrabold bg-emerald-500/30 text-emerald-200 rounded-full border border-emerald-400/40 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                MÃ THI ĐUA TĐ0001 - TĐ0036
              </span>
              <span className="text-xs text-white/90 font-medium">
                Trường PTDTNT THCS và THPT Nước Oa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Phần Mềm Chấm Thi Đua Hàng Tháng
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl mt-1">
              Đăng nhập trực tiếp bằng <strong>Mã Thi Đua (TĐ0001 - TĐ0036)</strong> được cấp hoặc tài khoản Email cán bộ.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shrink-0">
            <BookOpen className="w-7 h-7 text-amber-300" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-white/90">Danh mục mã cấp</p>
              <p className="text-base font-black text-amber-300">{teachers.length} Mã Thi Đua</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Left = Login Form, Right = 36 Emulation Codes Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Column Left (5 cols): Centered Login Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">

          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-theme-accent text-theme-accent rounded-2xl mb-3 border border-theme-accent">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Đăng Nhập Mã Thi Đua
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Nhập Mã thi đua (VD: <strong>TĐ0001</strong> - <strong>TĐ0036</strong>) hoặc chọn nhanh từ danh sách
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

          {/* Active Teacher Recognition Card */}
          {matchedTeacherData && (
            <div className={`mb-5 p-3.5 rounded-2xl border text-xs shadow-xs transition-all ${
              isLeaderTeacher(matchedTeacherData.teacher)
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/70 dark:to-slate-800 border-amber-300 dark:border-amber-700'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-slate-800 border-blue-300 dark:border-blue-700'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 bg-slate-900 text-white font-mono font-black text-xs rounded-lg shadow-xs">
                    {matchedTeacherData.teacher.emulationCode || getTeacherEmulationCode(matchedTeacherData.teacher, matchedTeacherData.index)}
                  </span>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                      {matchedTeacherData.teacher.fullName}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      {matchedTeacherData.teacher.position || matchedTeacherData.teacher.subject} • Tổ: {matchedTeacherData.teacher.department}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shrink-0 ${
                  isLeaderTeacher(matchedTeacherData.teacher)
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}>
                  {isLeaderTeacher(matchedTeacherData.teacher) ? 'MẪU 02' : 'MẪU 03'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">

            {/* Emulation Code / Email Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mã Thi Đua đăng nhập (TĐ0001 - TĐ0036)
                </label>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Hỗ trợ cả TĐ &amp; Email
                </span>
              </div>
              <div className="relative">
                <Hash className="w-4 h-4 text-theme absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLoginIdentifier(val);
                    setErrorMessage('');
                    const matched = findTeacher(val);
                    if (matched) {
                      const autoRole = getDefaultRoleForTeacher(matched.teacher);
                      setRole(autoRole);
                    }
                  }}
                  placeholder="Ví dụ: TĐ0001 hoặc TĐ0014"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent uppercase tracking-wide placeholder:normal-case placeholder:font-normal"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Gõ mã như <strong>TĐ0001</strong>, <strong>TĐ0008</strong>, <strong>TĐ0026</strong> hoặc chọn ở bảng bên phải.
              </p>
            </div>

            {/* Quick Dropdown Picker */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Hoặc chọn nhanh từ danh sách 36 mã:</span>
                <span className="text-[10px] text-theme font-semibold">{teachers.length} cán bộ</span>
              </label>

              <select
                value={matchedTeacherData ? (matchedTeacherData.teacher.emulationCode || getTeacherEmulationCode(matchedTeacherData.teacher, matchedTeacherData.index)) : ''}
                onChange={(e) => {
                  const selectedVal = e.target.value;
                  setLoginIdentifier(selectedVal);
                  setErrorMessage('');
                  const matched = findTeacher(selectedVal);
                  if (matched) {
                    const autoRole = getDefaultRoleForTeacher(matched.teacher);
                    setRole(autoRole);
                  }
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              >
                <option value="">-- Chọn cán bộ theo Mã Thi Đua --</option>
                {teachers.map((t, idx) => {
                  const code = t.emulationCode || getTeacherEmulationCode(t, idx);
                  const isLead = isLeaderTeacher(t);
                  const formBadge = isLead ? '[Mẫu 02]' : '[Mẫu 03]';
                  return (
                    <option key={t.id} value={code}>
                      {code} - {t.fullName} ({t.position || t.subject}) - {formBadge}
                    </option>
                  );
                })}
              </select>
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
                    setChangePassIdentifier(loginIdentifier || 'TĐ0001');
                    setCurrentPassInput('');
                    setNewPassInput('');
                    setConfirmNewPassInput('');
                    setChangePassError('');
                    setChangePassSuccess('');
                    setIsChangePassModalOpen(true);
                  }}
                  className="text-[11px] text-theme font-bold hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Đổi mật khẩu</span>
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
                  placeholder="Mật khẩu (Mặc định: 123456)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-100 mb-1.5">
                Vai trò truy cập hệ thống
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer ${
                    role === 'teacher'
                      ? 'btn-teacher border-blue-800 text-white font-black shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-900 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-black hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto mb-0.5 shrink-0" />
                  <span className="text-xs">Giáo viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('department_head')}
                  className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer ${
                    role === 'department_head'
                      ? 'btn-solid-indigo border-indigo-900 text-white font-black shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-900 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-black hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <Users className="w-4 h-4 mx-auto mb-0.5 shrink-0" />
                  <span className="text-xs">Tổ trưởng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer ${
                    role === 'staff'
                      ? 'btn-solid-emerald border-emerald-900 text-white font-black shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-900 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-black hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <UserCheck className="w-4 h-4 mx-auto mb-0.5 shrink-0" />
                  <span className="text-xs">Nhân viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('principal')}
                  className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer ${
                    role === 'principal'
                      ? 'btn-principal border-amber-950 text-white font-black shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-900 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-black hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-0.5 shrink-0" />
                  <span className="text-xs">Hiệu trưởng / HP</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 btn-theme font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Xác Thực &amp; Đăng Nhập Hệ Thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-black text-[11px]">
                Hoặc Đăng Nhập Bằng Google
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleFirebaseGooglePopup}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-xs rounded-xl border-2 border-slate-900 dark:border-slate-600 flex items-center justify-center gap-2.5 transition shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
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

        {/* Column Right (7 cols): Visual 36 Emulation Codes (TĐ0001 - TĐ0036) Directory */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-theme-accent text-theme rounded-lg border border-theme-accent">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Danh Mục 36 Mã Thi Đua (TĐ0001 - TĐ0036)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bấm vào một mã bất kỳ để chọn nhanh tài khoản đăng nhập
              </p>
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Tìm mã hoặc tên GV..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats & Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[11px]">
            <div className="p-2 bg-theme-accent rounded-xl border border-theme-accent text-theme">
              <span className="font-extrabold text-xs block">TĐ0001 - TĐ0003</span>
              <span className="text-[10px]">Ban Giám Hiệu</span>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300">
              <span className="font-extrabold text-xs block">TĐ0004 - TĐ0007, TĐ0032</span>
              <span className="text-[10px]">Nhân viên Văn phòng</span>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300">
              <span className="font-extrabold text-xs block">TĐ0008, TĐ0013</span>
              <span className="text-[10px]">Tổ trưởng chuyên môn</span>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
              <span className="font-extrabold text-xs block">TĐ0009 - TĐ0036</span>
              <span className="text-[10px]">Giáo viên bộ môn</span>
            </div>
          </div>

          {/* Scrollable Codes List Table */}
          <div className="max-h-[480px] overflow-y-auto pr-1 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTeachers.map((t, idx) => {
              const code = t.emulationCode || getTeacherEmulationCode(t, idx);
              const isSelected = (loginIdentifier.trim().toLowerCase() === code.toLowerCase()) || (matchedTeacherData?.teacher.id === t.id);
              const isLead = isLeaderTeacher(t);

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTeacherByCode(t, idx)}
                  className={`pt-1.5 first:pt-0 flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-theme text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Emulation Code Badge */}
                    <div className={`px-2 py-1 rounded-lg font-mono font-black text-xs shrink-0 tracking-wider ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'bg-slate-900 text-white dark:bg-slate-700'
                    }`}>
                      {code}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {t.fullName}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {t.position || t.subject}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        Tổ: {t.department} • Bộ môn: {t.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white border border-white/30'
                        : isLead
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-theme-accent text-theme border border-theme-accent'
                    }`}>
                      {isLead ? 'Mẫu 02' : 'Mẫu 03'}
                    </span>

                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}

            {filteredTeachers.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Không tìm thấy mã thi đua hoặc giáo viên phù hợp với từ khóa "{searchFilter}".
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Hiển thị <strong>{filteredTeachers.length}</strong> / <strong>{teachers.length}</strong> cán bộ giáo viên</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Mật khẩu mặc định: 123456</span>
          </div>

        </div>

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
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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
                  Cập nhật mật khẩu mới theo Mã thi đua cán bộ giáo viên
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
                  Đang tự động cập nhật mật khẩu vào ô đăng nhập...
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {/* Select Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chọn Mã Thi Đua / Cán bộ giáo viên
                  </label>
                  <select
                    value={changePassIdentifier}
                    onChange={(e) => {
                      setChangePassIdentifier(e.target.value);
                      setChangePassError('');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">-- Chọn cán bộ cần đổi mật khẩu --</option>
                    {teachers.map((t, idx) => {
                      const code = t.emulationCode || getTeacherEmulationCode(t, idx);
                      return (
                        <option key={t.id} value={code}>
                          {code} - {t.fullName} ({t.position || t.subject})
                        </option>
                      );
                    })}
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
                    placeholder="Mật khẩu hiện tại (Mặc định: 123456)"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Phone & Gmail Verification Section */}
                {(() => {
                  const targetTeacher = findTeacher(changePassIdentifier)?.teacher;
                  if (!targetTeacher) return null;
                  return (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                          Xác nhận qua SĐT / Gmail đăng ký
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendPhoneOtp(targetTeacher)}
                          disabled={isSendingOtp}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-[10px] rounded-lg transition cursor-pointer"
                        >
                          {isSendingOtp ? 'Đang gửi mã...' : sentOtpCode ? 'Gửi lại mã OTP' : 'Gửi mã OTP qua SĐT'}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        SĐT đăng ký: <strong className="text-slate-800 dark:text-slate-200">{targetTeacher.phone || '09051234xx'}</strong> • Gmail: <span className="font-mono">{targetTeacher.email}</span>
                      </p>

                      {otpSentNotice && (
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-lg text-[10px] border border-emerald-300 dark:border-emerald-800">
                          {otpSentNotice}
                        </div>
                      )}

                      {sentOtpCode && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Nhập mã OTP xác nhận (6 số):
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={phoneOtpInput}
                            onChange={(e) => setPhoneOtpInput(e.target.value)}
                            placeholder="Nhập mã OTP (VD: 123456)"
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold tracking-widest text-center text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer"
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
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
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
                    Mật khẩu đăng nhập (Mặc định: 123456)
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
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isLinkingGoogle}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
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
