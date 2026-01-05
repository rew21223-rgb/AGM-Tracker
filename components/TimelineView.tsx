import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Flag, User, AlertCircle, Edit2, Trash2, Plus, X, Filter, RotateCcw, MessageSquare, Send, ChevronUp, CalendarDays, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Phase, Task, TrackingLog, TeamDefinition } from '../types';
import { formatThaiDate, formatThaiDateTime } from '../utils';

interface TimelineViewProps {
  phases: Phase[];
  teams: TeamDefinition[];
  onUpdateTask: (phaseId: number, task: Task) => void;
  onAddTask: (phaseId: number, task: Task) => void;
  onDeleteTask: (phaseId: number, taskId: string) => void;
  userRole: 'admin' | 'staff';
}

// Helper for Thai Status Display
const getThaiStatus = (status: Task['status']) => {
  const map: Record<string, string> = {
    'Pending': 'รอดำเนินการ',
    'In Progress': 'กำลังดำเนินการ',
    'Completed': 'เสร็จสิ้น',
    'Critical': 'วิกฤต/เร่งด่วน',
    'Delayed': 'ล่าช้า',
  };
  return map[status] || status;
};

// Helper to generate consistent avatar colors - Darkened text for WCAG AA compliance
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-100 text-red-800 ring-red-50 border-red-200',
    'bg-blue-100 text-blue-800 ring-blue-50 border-blue-200',
    'bg-emerald-100 text-emerald-800 ring-emerald-50 border-emerald-200',
    'bg-amber-100 text-amber-800 ring-amber-50 border-amber-200',
    'bg-purple-100 text-purple-800 ring-purple-50 border-purple-200',
    'bg-pink-100 text-pink-800 ring-pink-50 border-pink-200',
    'bg-indigo-100 text-indigo-800 ring-indigo-50 border-indigo-200',
    'bg-teal-100 text-teal-800 ring-teal-50 border-teal-200',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const StatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
  // Increased contrast for text colors (mostly moved to -800)
  const styles = {
    'Completed': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'In Progress': 'bg-blue-50 text-blue-800 border-blue-200',
    'Pending': 'bg-slate-50 text-slate-700 border-slate-200',
    'Critical': 'bg-red-50 text-red-800 border-red-200',
    'Delayed': 'bg-orange-50 text-orange-800 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap ${styles[status] || styles['Pending']}`}>
      {getThaiStatus(status)}
    </span>
  );
};

const TimelineView: React.FC<TimelineViewProps> = ({ phases, teams, onUpdateTask, onAddTask, onDeleteTask, userRole }) => {
  const simulatedToday = new Date('2026-02-07');
  
  // Helper to find team name from ID
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : teamId;
  };

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterTeam, setFilterTeam] = useState<string>('All');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Edit/Add State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({});

  // Comment/Log State
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Derived State for Filtering
  const filteredPhases = phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.filter(task => {
      const matchStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchTeam = filterTeam === 'All' || task.team === filterTeam;
      
      const matchStartDate = !filterStartDate || task.startDate >= filterStartDate;
      const matchEndDate = !filterEndDate || task.endDate <= filterEndDate;

      return matchStatus && matchTeam && matchStartDate && matchEndDate;
    })
  })).filter(phase => phase.tasks.length > 0);

  const handleEditClick = (phaseId: number, task: Task) => {
    setActivePhaseId(phaseId);
    setEditingTask(task);
    setFormData(task);
    setIsAdding(false);
  };

  const handleAddClick = (phaseId: number) => {
    setActivePhaseId(phaseId);
    setFormData({
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      team: teams[0]?.id || '',
      responsiblePerson: '',
      status: 'Pending',
      progress: 0,
      isMilestone: false,
      logs: []
    });
    setEditingTask({ id: 'new' } as Task);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!activePhaseId) return;

    if (isAdding) {
      const newTask: Task = {
        id: (Math.floor(Math.random() * 1000) + 1).toString(),
        title: formData.title || 'New Task',
        description: formData.description || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        team: formData.team || teams[0]?.id || '',
        responsiblePerson: formData.responsiblePerson || '',
        status: formData.status || 'Pending',
        progress: formData.progress || 0,
        isMilestone: formData.isMilestone || false,
        logs: []
      };
      onAddTask(activePhaseId, newTask);
    } else if (editingTask) {
      onUpdateTask(activePhaseId, { ...editingTask, ...formData } as Task);
    }
    setEditingTask(null);
    setActivePhaseId(null);
    setIsAdding(false);
  };

  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setNewComment('');
  };

  const handleAddLog = (phaseId: number, task: Task) => {
    if (!newComment.trim()) return;

    const newLog: TrackingLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      message: newComment,
      author: userRole === 'admin' ? 'Admin' : 'Staff'
    };

    const updatedTask = {
      ...task,
      logs: [newLog, ...(task.logs || [])]
    };

    onUpdateTask(phaseId, updatedTask);
    setNewComment('');
  };

  const resetFilters = () => {
    setFilterStatus('All');
    setFilterTeam('All');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  return (
    <div className="space-y-6 pb-12">
      <style>{`
        @keyframes indeterminate {
          0% { left: -35%; }
          100% { left: 100%; }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">แผนงานและกิจกรรมหลัก (Master Schedule)</h2>
           <p className="text-sm text-slate-500 mt-1">บริหารจัดการขั้นตอนการทำงานและติดตามความคืบหน้าโครงการ AGM 2569</p>
        </div>
        <div className="text-sm bg-indigo-50 text-indigo-800 px-4 py-2 rounded-xl font-bold border border-indigo-100 flex items-center shadow-sm">
          <Calendar size={16} className="mr-2 text-indigo-600" aria-hidden="true" />
          <span className="font-semibold">วันประชุมใหญ่:</span> <span className="ml-1 text-slate-900 font-extrabold">13 มี.ค. 2569</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-x-6 gap-y-4 items-end" role="search" aria-label="Task filters">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-status" className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center">
            <Filter size={12} className="mr-1.5" aria-hidden="true" /> สถานะ
          </label>
          <select 
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 hover:bg-white transition-all cursor-pointer min-w-[150px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-1"
          >
            <option value="All">ทั้งหมด</option>
            <option value="Pending">รอดำเนินการ</option>
            <option value="In Progress">กำลังดำเนินการ</option>
            <option value="Completed">เสร็จสิ้น</option>
            <option value="Delayed">ล่าช้า</option>
            <option value="Critical">วิกฤต/เร่งด่วน</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-department" className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center">
            <User size={12} className="mr-1.5" aria-hidden="true" /> ฝ่ายรับผิดชอบ
          </label>
          <select 
            id="filter-department"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 hover:bg-white transition-all cursor-pointer min-w-[180px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-1"
          >
            <option value="All">ทุกฝ่าย</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="h-10 w-px bg-slate-100 hidden sm:block" aria-hidden="true"></div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-start-date" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">วันที่เริ่มต้น</label>
          <input
            id="filter-start-date"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 hover:bg-white transition-all text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-end-date" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">วันที่สิ้นสุด</label>
          <input
            id="filter-end-date"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 hover:bg-white transition-all text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-1"
          />
        </div>

        <div className="flex items-center self-end">
          {(filterStatus !== 'All' || filterTeam !== 'All' || filterStartDate || filterEndDate) && (
            <button 
              onClick={resetFilters}
              className="flex items-center px-4 py-2 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-all border border-rose-200 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
              aria-label="ล้างตัวกรองทั้งหมด"
            >
              <RotateCcw size={14} className="mr-2" aria-hidden="true" /> ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden" role="region" aria-label="Tasks List">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <caption className="sr-only">รายชื่อกิจกรรมและงานที่ได้รับมอบหมาย แบ่งตามระยะเวลาโครงการ</caption>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                <th scope="col" className="px-6 py-4 w-[40%] text-center">งานและกิจกรรม</th>
                <th scope="col" className="px-4 py-4 w-[18%] text-center">ผู้รับผิดชอบ</th>
                <th scope="col" className="px-4 py-4 w-[17%] text-center">ระยะเวลาดำเนินการ</th>
                <th scope="col" className="px-4 py-4 w-[12%] text-center">สถานะ</th>
                <th scope="col" className="px-4 py-4 w-[13%] text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPhases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                      <Filter size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold text-lg">ไม่พบข้อมูลที่ค้นหา</p>
                    <button 
                      onClick={resetFilters} 
                      className="text-indigo-600 font-bold text-sm mt-3 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
                    >
                      ล้างตัวกรองทั้งหมด
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPhases.map((phase) => (
                  <React.Fragment key={phase.id}>
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="px-6 py-3 border-y border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-200" aria-label={`ระยะที่ ${phase.id}`}>
                              {phase.id}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                              <span className="font-bold text-slate-800 text-sm">{phase.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                                {phase.period}
                              </span>
                            </div>
                          </div>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleAddClick(phase.id)}
                              className="text-[10px] flex items-center text-indigo-700 hover:text-white hover:bg-indigo-700 font-bold bg-white px-3 py-1.5 rounded-lg transition-all border border-indigo-200 shadow-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                              aria-label={`เพิ่มงานใหม่ในระยะ ${phase.name}`}
                            >
                              <Plus size={12} className="mr-1.5" aria-hidden="true" /> เพิ่มงาน
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {phase.tasks.map((task) => {
                      const end = new Date(task.endDate);
                      const isOverdue = task.status !== 'Completed' && end < simulatedToday;
                      const isExpanded = expandedTaskId === task.id;
                      const isProgressing = task.status === 'In Progress';
                      const progressValue = task.progress || 0;
                      const expandedContentId = `task-details-${task.id}`;

                      return (
                        <React.Fragment key={task.id}>
                          <tr className={`group transition-colors border-b border-slate-50 last:border-none ${isExpanded ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
                            
                            {/* TASK INFO COLUMN */}
                            <td className="px-6 py-5 align-top">
                              <div className="flex items-start gap-4">
                                <div className="mt-0.5 shrink-0" aria-hidden="true">
                                  {task.status === 'Completed' ? (
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center ring-2 ring-emerald-50 border border-emerald-200">
                                      <CheckCircle2 size={12} className="text-emerald-700" />
                                    </div>
                                  ) : isOverdue ? (
                                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center ring-2 ring-rose-50 border border-rose-200 animate-pulse">
                                      <AlertCircle size={12} className="text-rose-700" />
                                    </div>
                                  ) : (
                                    <Circle size={18} className="text-slate-300" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  {task.isMilestone && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="inline-flex items-center text-[9px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 uppercase tracking-widest">
                                        <Flag size={8} className="mr-1" aria-hidden="true" /> Milestone
                                      </span>
                                    </div>
                                  )}

                                  <div className="font-bold text-sm text-slate-800 leading-snug group-hover:text-indigo-800 transition-colors">
                                      <span className="font-mono text-xs font-normal text-slate-500 mr-1.5" aria-label={`รหัสงาน ${task.id}`}>#{task.id}</span>
                                      {task.title}
                                  </div>

                                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2" title={task.description}>
                                    {task.description}
                                  </p>

                                  {isProgressing && (
                                    <div className="pt-2 w-full max-w-[160px]">
                                      {progressValue > 0 ? (
                                        <div className="flex justify-between items-baseline mb-1">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                                          <span className="text-[9px] font-bold text-blue-700 tabular-nums">
                                            {progressValue}%
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-baseline mb-1">
                                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Processing</span>
                                        </div>
                                      )}
                                      
                                      <div 
                                        className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative"
                                        role="progressbar"
                                        aria-valuenow={progressValue > 0 ? progressValue : undefined}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={progressValue > 0 ? `ความคืบหน้า ${progressValue}%` : 'กำลังประมวลผลความคืบหน้า'}
                                      >
                                          {progressValue > 0 ? (
                                            <div 
                                              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                                              style={{ width: `${progressValue}%` }}
                                            />
                                          ) : (
                                            <div 
                                              className="absolute top-0 bottom-0 h-full bg-blue-500/60 w-1/3 rounded-full"
                                              style={{ animation: 'indeterminate 1.5s infinite linear' }}
                                            />
                                          )}
                                      </div>
                                    </div>
                                  )}

                                  {!isExpanded && (
                                    <button 
                                      className={`mt-2 flex items-center text-[10px] font-bold transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-sm ${task.logs && task.logs.length > 0 ? 'text-indigo-700 hover:text-indigo-900' : 'text-slate-400 hover:text-indigo-700'}`} 
                                      onClick={() => toggleExpandTask(task.id)}
                                      aria-expanded={isExpanded}
                                      aria-controls={expandedContentId}
                                      aria-label={task.logs && task.logs.length > 0 ? `ดูบันทึก ${task.logs.length} รายการ ของงาน ${task.title}` : `เพิ่มบันทึกสำหรับงาน ${task.title}`}
                                    >
                                      <MessageSquare size={12} className="mr-1.5" aria-hidden="true" />
                                      {task.logs && task.logs.length > 0 ? `${task.logs.length} รายการอัปเดต` : 'เพิ่มบันทึก'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* OWNER COLUMN */}
                            <td className="px-4 py-5 align-top">
                              <div className="flex items-start gap-3">
                                   <div 
                                     className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black border ${getAvatarColor(task.responsiblePerson || 'N')}`} 
                                     aria-hidden="true"
                                     title={`ผู้รับผิดชอบ: ${task.responsiblePerson || 'ยังไม่ระบุ'}`}
                                   >
                                      {(task.responsiblePerson || 'N').charAt(0)}
                                   </div>
                                   <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold text-slate-800 truncate" title={task.responsiblePerson || 'Unassigned'}>
                                        {task.responsiblePerson || 'Unassigned'}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5" title={getTeamName(task.team)}>
                                        {getTeamName(task.team)}
                                      </span>
                                   </div>
                                </div>
                            </td>

                            {/* DURATION COLUMN */}
                            <td className="px-4 py-5 align-top">
                               <div className="flex flex-col gap-1">
                                  <div className={`flex items-center text-xs font-bold ${isOverdue ? 'text-rose-700' : 'text-slate-700'}`}>
                                     <CalendarDays size={14} className="mr-2 opacity-70" aria-hidden="true" />
                                     <span aria-label={`วันครบกำหนด ${formatThaiDate(task.endDate)}`}>{formatThaiDate(task.endDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 pl-6">
                                     <span className="text-[10px] text-slate-500 font-medium tabular-nums" aria-label={`วันที่เริ่มต้น ${formatThaiDate(task.startDate)}`}>
                                        เริ่ม {formatThaiDate(task.startDate)}
                                     </span>
                                  </div>
                               </div>
                            </td>

                            {/* STATUS COLUMN */}
                            <td className="px-4 py-5 align-top text-center">
                              <StatusBadge status={task.status} />
                            </td>

                            {/* ACTIONS COLUMN */}
                            <td className="px-4 py-5 align-top text-center">
                              <div className="flex justify-center items-center gap-1">
                                <button 
                                  onClick={() => toggleExpandTask(task.id)}
                                  className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isExpanded ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-700 hover:bg-slate-100'}`}
                                  title={isExpanded ? "ย่อรายละเอียด" : "ดูรายละเอียด"}
                                  aria-label={isExpanded ? `ย่อรายละเอียดงาน ${task.title}` : `ดูรายละเอียดงาน ${task.title}`}
                                  aria-expanded={isExpanded}
                                  aria-controls={expandedContentId}
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <MoreHorizontal size={16} />}
                                </button>
                                {userRole === 'admin' && (
                                  <>
                                    <button 
                                      onClick={() => handleEditClick(phase.id, task)}
                                      className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      title="แก้ไข"
                                      aria-label={`แก้ไขงาน ${task.title}`}
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => onDeleteTask(phase.id, task.id)}
                                      className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
                                      title="ลบ"
                                      aria-label={`ลบงาน ${task.title}`}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="px-0 py-0 border-none animate-fade-in-down">
                                <div id={expandedContentId} className="bg-slate-50 border-y border-slate-200 p-6 pl-20 shadow-inner" role="region" aria-label={`ประวัติการติดตามงานสำหรับ ${task.title}`}>
                                  <div className="max-w-4xl border-l-4 border-indigo-500 pl-6">
                                    <div className="flex items-center justify-between mb-6">
                                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center">
                                        <Clock size={16} className="mr-2 text-indigo-600" aria-hidden="true" /> ประวัติการติดตามงาน (History Log)
                                      </h4>
                                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                        {task.logs?.length || 0} รายการ
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" tabIndex={0} role="log" aria-label="รายการบันทึก">
                                      {(!task.logs || task.logs.length === 0) && (
                                        <div className="text-center py-8 text-slate-400 italic text-sm bg-white rounded-xl border border-slate-200 border-dashed">
                                          <MessageSquare size={24} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
                                          <p className="font-medium">ยังไม่มีบันทึกการติดตามงาน</p>
                                          <p className="text-xs mt-1">เริ่มเขียนบันทึกรายการแรกด้านล่าง</p>
                                        </div>
                                      )}
                                      
                                      {task.logs?.map((log) => (
                                        <div key={log.id} className="flex gap-4 group">
                                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border ${getAvatarColor(log.author)}`} aria-hidden="true">
                                            {log.author.charAt(0)}
                                          </div>
                                          <div className="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                                            <div className="flex justify-between items-center mb-1.5">
                                              <span className="font-bold text-slate-800 text-xs">{log.author}</span>
                                              <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                                                {formatThaiDateTime(log.date)}
                                              </span>
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed">{log.message}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="bg-white p-1.5 rounded-xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex gap-3 items-center">
                                      <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center" aria-hidden="true">
                                        <User size={16} />
                                      </div>
                                      <label htmlFor={`comment-input-${task.id}`} className="sr-only">เพิ่มบันทึกสำหรับ {task.title}</label>
                                      <input 
                                        id={`comment-input-${task.id}`}
                                        type="text" 
                                        autoFocus
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="พิมพ์บันทึกผลการติดตาม ปัญหา หรืออัปเดตสถานะ..."
                                        className="flex-1 text-sm bg-transparent border-none focus:ring-0 px-2 py-2 font-medium text-slate-700 placeholder:text-slate-400"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddLog(phase.id, task)}
                                      />
                                      <button 
                                        onClick={() => handleAddLog(phase.id, task)}
                                        disabled={!newComment.trim()}
                                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                                        aria-label="ส่งบันทึก"
                                      >
                                        <Send size={16} aria-hidden="true" />
                                      </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium mt-2 text-right">
                                      กด <span className="font-bold text-slate-600">Enter</span> เพื่อส่งข้อความ
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal - Translated to Thai */}
      {editingTask && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-scale-in">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 id="modal-title" className="font-black text-xl text-slate-900 tracking-tight">
                  {isAdding ? 'สร้างงานใหม่' : 'แก้ไขรายละเอียดงาน'}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ส่วนจัดการข้อมูล (Management Console)</p>
              </div>
              <button 
                onClick={() => setEditingTask(null)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="ปิดหน้าต่าง"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div>
                <label htmlFor="task-title" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">หัวข้องาน</label>
                <input 
                  id="task-title"
                  type="text" 
                  className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="เช่น 1.1 สรุปรายงานการตรวจสอบ"
                />
              </div>

              <div>
                <label htmlFor="task-desc" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">รายละเอียด</label>
                <textarea 
                  id="task-desc"
                  className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-semibold min-h-[100px] text-slate-700"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="ระบุรายละเอียดงาน..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label htmlFor="task-start" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">วันที่เริ่มต้น</label>
                   <input 
                    id="task-start"
                    type="date" 
                    className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                   <label htmlFor="task-end" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">วันที่สิ้นสุด</label>
                   <input 
                    id="task-end"
                    type="date" 
                    className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="task-team" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ฝ่ายที่รับผิดชอบ</label>
                  <select 
                    id="task-team"
                    className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                  >
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                   <label htmlFor="task-owner" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ผู้รับผิดชอบ</label>
                   <input 
                    id="task-owner"
                    type="text" 
                    className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({...formData, responsiblePerson: e.target.value})}
                    placeholder="ระบุชื่อผู้รับผิดชอบ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="task-status" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">สถานะปัจจุบัน</label>
                  <select 
                      id="task-status"
                      className={`w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700 ${isAdding ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                      value={formData.status || 'Pending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      disabled={isAdding}
                    >
                      <option value="Pending">รอดำเนินการ (Pending)</option>
                      <option value="In Progress">กำลังดำเนินการ (In Progress)</option>
                      <option value="Completed">เสร็จสิ้น (Completed)</option>
                      <option value="Critical">เร่งด่วน (Critical)</option>
                      <option value="Delayed">ล่าช้า (Delayed)</option>
                    </select>
                </div>
                <div>
                  <label htmlFor="task-progress" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ความคืบหน้า (%)</label>
                  <input 
                    id="task-progress"
                    type="number" 
                    min="0"
                    max="100"
                    className="w-full text-sm border-slate-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border font-bold text-slate-700"
                    value={formData.progress || 0}
                    onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input
                  id="isMilestone"
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-lg cursor-pointer"
                  checked={formData.isMilestone}
                  onChange={(e) => setFormData({...formData, isMilestone: e.target.checked})}
                />
                <label htmlFor="isMilestone" className="text-sm font-bold text-slate-700 cursor-pointer">
                  กำหนดเป็นหมุดหมายสำคัญ (Project Milestone)
                </label>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingTask(null)}
                className="px-6 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-100 uppercase tracking-[0.1em] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                {isAdding ? 'สร้างงาน' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView;