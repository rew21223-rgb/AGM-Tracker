import React, { useState } from 'react';
import { FileText, Users, Check, User, Plus, Trash2, Edit2, X, MessageSquare, Send, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { AgendaItem, TeamDefinition, TrackingLog } from '../types';
import { formatThaiDateTime } from '../utils';

interface AgendaChecklistProps {
  items: AgendaItem[];
  teams: TeamDefinition[];
  onUpdateItem: (item: AgendaItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: AgendaItem) => void;
  userRole: 'admin' | 'staff';
}

const getThaiStatusLabel = (status: string) => {
  switch (status) {
    case 'Drafting': return 'กำลังร่าง';
    case 'Reviewing': return 'รอตรวจสอบ';
    case 'Finalized': return 'สมบูรณ์';
    default: return status;
  }
};

const AgendaChecklist: React.FC<AgendaChecklistProps> = ({ items, teams, onUpdateItem, onDeleteItem, onAddItem, userRole }) => {
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [newLogMessage, setNewLogMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<AgendaItem>>({});

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  const handleEditClick = (item: AgendaItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setFormData({
      title: '',
      responsibleTeam: teams[0]?.id || '',
      responsiblePerson: '',
      status: 'Drafting',
      logs: []
    });
    setIsAdding(true);
    setEditingItem({ id: 'new' } as AgendaItem); // Dummy for modal
  };

  const handleSave = () => {
    if (isAdding) {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled',
        responsibleTeam: formData.responsibleTeam || teams[0]?.id || '',
        responsiblePerson: formData.responsiblePerson || 'Unassigned',
        status: formData.status || 'Drafting',
        logs: []
      };
      onAddItem(newItem);
    } else if (editingItem) {
      onUpdateItem({ ...editingItem, ...formData } as AgendaItem);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleAddLog = (itemId: string) => {
    if (!newLogMessage.trim()) return;
    
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newLog: TrackingLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        message: newLogMessage,
        author: userRole === 'admin' ? 'Admin' : 'Staff'
      };
      onUpdateItem({
        ...item,
        logs: [newLog, ...(item.logs || [])]
      });
      setNewLogMessage('');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">จัดการระเบียบวาระและติดตามงาน</h2>
          <p className="text-slate-500 text-sm mt-1">บริหารจัดการเนื้อหาหนังสือรายงานประจำปี มอบหมายผู้รับผิดชอบ และติดตามความคืบหน้า</p>
        </div>
        {userRole === 'admin' && (
          <button 
            onClick={handleAddClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
          >
            <Plus size={16} className="mr-2" />
            เพิ่มวาระใหม่
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          <div className="col-span-6 lg:col-span-5 text-center">หัวข้อ / ระเบียบวาระ</div>
          <div className="col-span-3 lg:col-span-2 text-center">ผู้รับผิดชอบ</div>
          <div className="col-span-2 lg:col-span-2 text-center">สถานะ</div>
          <div className="col-span-1 lg:col-span-3 text-center">จัดการ</div>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="group transition-colors hover:bg-slate-50">
              {/* Main Row */}
              <div 
                className="px-6 py-4 grid grid-cols-12 gap-4 items-center cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="col-span-6 lg:col-span-5">
                   <div className="flex items-start">
                      {expandedItemId === item.id ? <ChevronDown size={16} className="mt-1 mr-2 text-slate-400" /> : <ChevronRight size={16} className="mt-1 mr-2 text-slate-400" />}
                      <span className={`font-medium text-sm ${item.status === 'Finalized' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                   </div>
                   {item.logs && item.logs.length > 0 && (
                     <div className="ml-6 mt-1 flex items-center text-xs text-indigo-600">
                       <MessageSquare size={10} className="mr-1" />
                       {item.logs.length} อัปเดต
                     </div>
                   )}
                </div>

                <div className="col-span-3 lg:col-span-2">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                         <User size={10} className="mr-1.5" />
                         <span className="truncate max-w-[80px] sm:max-w-full">{item.responsiblePerson}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 pl-1">{getTeamName(item.responsibleTeam)}</span>
                   </div>
                </div>

                <div className="col-span-2 lg:col-span-2 text-center">
                   <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block w-full sm:w-auto ${
                     item.status === 'Finalized' ? 'bg-green-100 text-green-700' :
                     item.status === 'Reviewing' ? 'bg-orange-100 text-orange-700' :
                     'bg-red-100 text-red-700'
                   }`}>
                     {getThaiStatusLabel(item.status)}
                   </span>
                </div>

                <div className="col-span-1 lg:col-span-3 flex justify-center items-center gap-2">
                   {userRole === 'admin' && (
                     <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                          className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                          title="แก้ไข"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                     </>
                   )}
                </div>
              </div>

              {/* Expanded Details / Logs */}
              {expandedItemId === item.id && (
                <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 ml-0 lg:ml-6 border-l-4 border-l-indigo-500">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                    <Clock size={12} className="mr-1" /> ประวัติการติดตามงาน / บันทึกข้อความ (History Log)
                  </h4>
                  
                  {/* Log Input */}
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newLogMessage}
                      onChange={(e) => setNewLogMessage(e.target.value)}
                      placeholder="พิมพ์บันทึกผลการติดตาม ปัญหา หรืออัปเดตสถานะ..."
                      className="flex-1 text-sm border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLog(item.id)}
                    />
                    <button 
                      onClick={() => handleAddLog(item.id)}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  {/* Logs List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {(!item.logs || item.logs.length === 0) && (
                      <p className="text-sm text-slate-400 italic">ยังไม่มีบันทึกการติดตามงาน</p>
                    )}
                    {item.logs?.map((log) => (
                      <div key={log.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-700">{log.author}</span>
                          <span className="text-xs text-slate-400">{formatThaiDateTime(log.date)}</span>
                        </div>
                        <p className="text-slate-600">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {isAdding ? 'เพิ่มระเบียบวาระใหม่' : 'แก้ไขข้อมูลระเบียบวาระ'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อระเบียบวาระ (Topic / Title)</label>
                <input 
                  type="text" 
                  className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="ระบุชื่อวาระ..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">หน่วยงานที่รับผิดชอบ</label>
                  <select 
                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                    value={formData.responsibleTeam}
                    onChange={(e) => setFormData({...formData, responsibleTeam: e.target.value})}
                  >
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">ผู้รับผิดชอบหลัก</label>
                   <input 
                    type="text" 
                    className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({...formData, responsiblePerson: e.target.value})}
                    placeholder="ระบุชื่อ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">สถานะปัจจุบัน (Status)</label>
                <div className="flex gap-2">
                  {['Drafting', 'Reviewing', 'Finalized'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFormData({...formData, status: status as any})}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        formData.status === status 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {getThaiStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                {isAdding ? 'บันทึกข้อมูล' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaChecklist;