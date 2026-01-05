import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, Settings, ShieldCheck } from 'lucide-react';
import { TeamDefinition } from '../types';

interface SettingsViewProps {
  teams: TeamDefinition[];
  onAddTeam: (team: TeamDefinition) => void;
  onUpdateTeam: (team: TeamDefinition) => void;
  onDeleteTeam: (id: string) => void;
}

const COLORS = [
  'bg-slate-100 text-slate-700',
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
  'bg-amber-100 text-amber-700',
  'bg-yellow-100 text-yellow-700',
  'bg-lime-100 text-lime-700',
  'bg-green-100 text-green-700',
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-sky-100 text-sky-700',
  'bg-blue-100 text-blue-700',
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-purple-100 text-purple-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-pink-100 text-pink-700',
  'bg-rose-100 text-rose-700',
];

const SettingsView: React.FC<SettingsViewProps> = ({ teams, onAddTeam, onUpdateTeam, onDeleteTeam }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<TeamDefinition>>({});

  const startEdit = (team: TeamDefinition) => {
    setEditingId(team.id);
    setFormData(team);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      color: 'bg-slate-100 text-slate-700'
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (isAdding) {
      const newTeam: TeamDefinition = {
        id: formData.name.trim(), // Use name as ID for simplicity in this context, or UUID
        name: formData.name.trim(),
        description: formData.description || '',
        color: formData.color || 'bg-slate-100 text-slate-700'
      };
      onAddTeam(newTeam);
    } else if (editingId) {
      onUpdateTeam({
        ...formData,
        id: editingId,
        name: formData.name.trim(),
        description: formData.description || '',
        color: formData.color || 'bg-slate-100 text-slate-700'
      } as TeamDefinition);
    }
    cancelEdit();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
             <Settings className="mr-3 text-indigo-600" />
             การตั้งค่า (Settings)
          </h2>
          <p className="text-sm text-slate-500 mt-1">จัดการรายชื่อฝ่าย/กลุ่มผู้รับผิดชอบงาน</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={startAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            เพิ่มฝ่ายใหม่
          </button>
        )}
      </div>

      {/* Editor Card */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 animate-fade-in-down">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">
              {isAdding ? 'เพิ่มฝ่ายรับผิดชอบใหม่' : 'แก้ไขข้อมูลฝ่าย'}
            </h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">ชื่อฝ่าย / ทีม (Team Name)</label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-sm border-slate-200 rounded-xl px-4 py-3 font-semibold focus:border-indigo-500 focus:ring-indigo-500 border"
                  placeholder="ระบุชื่อฝ่าย..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">คำอธิบาย (Description)</label>
                <input 
                  type="text" 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full text-sm border-slate-200 rounded-xl px-4 py-3 font-medium focus:border-indigo-500 focus:ring-indigo-500 border"
                  placeholder="รายละเอียดหน้าที่ความรับผิดชอบ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">สีประจำฝ่าย (Color Label)</label>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`h-8 w-full rounded-lg border-2 transition-all ${color} ${formData.color === color ? 'border-slate-600 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                  />
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${formData.color || 'bg-slate-100 text-slate-700'}`}>
                   ตัวอย่างการแสดงผล (Preview)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={cancelEdit}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.name}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">รายชื่อฝ่ายที่มีอยู่ในระบบ ({teams.length})</span>
        </div>
        <div className="divide-y divide-slate-100">
          {teams.map((team) => (
            <div key={team.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${team.color}`}>
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-base">{team.name}</h4>
                    {team.description && <p className="text-sm text-slate-500 font-medium">{team.description}</p>}
                 </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startEdit(team)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="แก้ไข"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDeleteTeam(team.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="ลบ"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {teams.length === 0 && (
            <div className="p-10 text-center text-slate-400">
               <p>ยังไม่มีข้อมูลฝ่าย</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;