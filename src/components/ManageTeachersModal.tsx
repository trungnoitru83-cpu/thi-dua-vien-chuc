import React, { useState } from 'react';
import { X, UserPlus, Trash2, Edit2, Check, Save } from 'lucide-react';
import { Teacher } from '../types';
import { SCHOOL_NAME } from '../data/mockTeachers';

interface ManageTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
}

export const ManageTeachersModal: React.FC<ManageTeachersModalProps> = ({
  isOpen,
  onClose,
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('01/01/1990');
  const [subject, setSubject] = useState('Ngữ văn');
  const [department, setDepartment] = useState('Tổ Xã hội');

  if (!isOpen) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newTeacher: Teacher = {
      id: `gv_${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@nuocoa.edu.vn`,
      dob,
      subject,
      department,
      school: SCHOOL_NAME
    };

    onAddTeacher(newTeacher);
    setFullName('');
    setEmail('');
    setShowAddForm(false);
  };

  const startEdit = (t: Teacher) => {
    setEditingId(t.id);
    setFullName(t.fullName);
    setEmail(t.email);
    setDob(t.dob);
    setSubject(t.subject);
    setDepartment(t.department);
  };

  const handleSaveEdit = (t: Teacher) => {
    const updated: Teacher = {
      ...t,
      fullName,
      email,
      dob,
      subject,
      department
    };
    onUpdateTeacher(updated);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋 Quản Lý Danh Sách Giáo Viên ({teachers.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chỉnh sửa thông tin, thêm mới hoặc xóa giáo viên khỏi danh sách thi đua
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 btn-teacher text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddForm ? 'Đóng form thêm' : 'Thêm giáo viên mới'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Add New Teacher */}
        {showAddForm && (
          <form onSubmit={handleCreateNew} className="p-6 bg-blue-50/60 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800">
            <h4 className="text-xs font-extrabold uppercase text-blue-900 dark:text-blue-300 mb-3">
              Thêm Giáo Viên Mới
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Họ và tên..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
              <input
                type="email"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
              <input
                type="text"
                placeholder="Ngày sinh (DD/MM/YYYY)..."
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
              <input
                type="text"
                placeholder="Bộ môn..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              >
                <option value="Tổ Xã hội">Tổ Xã hội</option>
                <option value="Tổ Tự nhiên">Tổ Tự nhiên</option>
                <option value="Tổ Năng khiếu">Tổ Năng khiếu</option>
              </select>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 btn-teacher text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận thêm GV</span>
              </button>
            </div>
          </form>
        )}

        {/* Teachers List Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 w-10 text-center">STT</th>
                <th className="p-3 min-w-[160px]">Họ và tên</th>
                <th className="p-3 min-w-[180px]">Email</th>
                <th className="p-3 w-28">Ngày sinh</th>
                <th className="p-3 w-32">Bộ môn</th>
                <th className="p-3 w-32">Tổ chuyên môn</th>
                <th className="p-3 w-20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {teachers.map((t, idx) => {
                const isEditing = editingId === t.id;
                return (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>

                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {isEditing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                        />
                      ) : (
                        t.fullName
                      )}
                    </td>

                    <td className="p-3 text-slate-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                        />
                      ) : (
                        t.email
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                        />
                      ) : (
                        t.dob
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                        />
                      ) : (
                        t.subject
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                        >
                          <option value="Tổ Xã hội">Tổ Xã hội</option>
                          <option value="Tổ Tự nhiên">Tổ Tự nhiên</option>
                          <option value="Tổ Năng khiếu">Tổ Năng khiếu</option>
                        </select>
                      ) : (
                        t.department
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(t)}
                            title="Lưu"
                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(t)}
                            title="Sửa"
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteTeacher(t.id)}
                          title="Xóa"
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-medium">
            Tất cả các thay đổi sẽ tự động đồng bộ hóa toàn bộ các trang chấm điểm thi đua
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
