import React from 'react';
import { Palette, Sun, Moon, Laptop, Check, X, Sparkles } from 'lucide-react';
import { ThemeConfig, ThemeColor, ThemeMode, THEME_OPTIONS } from '../lib/theme';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onThemeChange: (newTheme: ThemeConfig) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  if (!isOpen) return null;

  const handleColorSelect = (color: ThemeColor) => {
    onThemeChange({ ...currentTheme, color });
  };

  const handleModeSelect = (mode: ThemeMode) => {
    onThemeChange({ ...currentTheme, mode });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Tùy Chỉnh Màu Sắc Giao Diện
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn tông màu và chế độ hiển thị phù hợp với sở thích của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Palette Selector */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            1. Bảng Tông Màu Chủ Đạo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = currentTheme.color === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleColorSelect(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-6 h-6 rounded-full shadow-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: opt.dotColor }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {opt.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Mode (Light / Dark / System) */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            2. Chế Độ Sáng / Tối
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleModeSelect('light')}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                currentTheme.mode === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Sáng (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('dark')}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                currentTheme.mode === 'dark'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Tối (Dark)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('system')}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                currentTheme.mode === 'system'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-4 h-4 text-slate-500" />
              <span>Hệ thống</span>
            </button>
          </div>
        </div>

        {/* Live Preview Sample */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Xem trước màu nút & tiêu đề
            </span>
            <span className="text-[10px] text-slate-500">Tự động lưu</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs text-white"
              style={{
                backgroundColor: THEME_OPTIONS.find(t => t.id === currentTheme.color)?.dotColor || '#2563eb'
              }}
            >
              Nút Chấm Điểm
            </button>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              Tháng {new Date().getMonth() + 1}/2026
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Trường PTDTNT THCS và THPT Nước Oa
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-extrabold rounded-xl transition shadow-sm"
          >
            Đóng & Áp Dụng
          </button>
        </div>

      </div>
    </div>
  );
};
