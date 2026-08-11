import React, { useRef, useState } from 'react';
import { X, Check, Eraser, Upload } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  title: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Navy blue ink
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUploadedImg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'upload' && uploadedImg) {
      onSave(uploadedImg);
      onClose();
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            ✍️ {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'draw'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Ký trực tiếp trên màn hình
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Tải ảnh chữ ký sẵn có
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'draw' ? (
            <div>
              <p className="text-xs text-slate-500 mb-2">
                Dùng chuột hoặc ngón tay để ký vào khung bên dưới:
              </p>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 p-2 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={180}
                  className="w-full h-44 cursor-crosshair touch-none bg-white rounded-lg shadow-inner"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <Eraser className="w-4 h-4" />
                  Xóa vẽ lại
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 mb-2">
                Chọn file hình ảnh chữ ký của bạn (PNG, JPG):
              </p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 p-6 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition">
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {uploadedImg ? 'Thay đổi hình ảnh' : 'Bấm vào đây để chọn ảnh chữ ký'}
                </span>
                <span className="text-xs text-slate-400 mt-1">Hỗ trợ PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedImg && (
                <div className="mt-4 p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-center">
                  <p className="text-xs text-slate-500 mb-2">Xem trước chữ ký:</p>
                  <img
                    src={uploadedImg}
                    alt="Chữ ký đã tải lên"
                    className="max-h-32 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
          >
            <Check className="w-4 h-4" />
            Xác nhận chữ ký
          </button>
        </div>
      </div>
    </div>
  );
};
