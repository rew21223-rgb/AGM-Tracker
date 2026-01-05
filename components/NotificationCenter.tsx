import React from 'react';
import { AlertTriangle, Clock, AlertCircle, User, Calendar, CheckCircle } from 'lucide-react';
import { Phase, Task } from '../types';
import { formatThaiDate } from '../utils';

interface NotificationCenterProps {
  phases: Phase[];
  currentDate: Date;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ phases, currentDate }) => {
  const allTasks = phases.flatMap(p => p.tasks);

  // Logic for Overdue: Not completed AND EndDate < CurrentDate OR Status is Delayed
  const overdueTasks = allTasks.filter(task => {
    const end = new Date(task.endDate);
    return (task.status === 'Delayed' || (task.status !== 'Completed' && end < currentDate));
  });

  // Logic for Upcoming: Not completed AND EndDate is within 3 days AND not overdue
  const upcomingTasks = allTasks.filter(task => {
    const end = new Date(task.endDate);
    const diffTime = end.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (task.status !== 'Completed' && task.status !== 'Delayed' && diffDays >= 0 && diffDays <= 3);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-bold text-slate-800 flex items-center">
          <AlertCircle className="mr-2 text-indigo-600" size={20} />
          ศูนย์แจ้งเตือนและติดตามงาน
        </h2>
        <span className="text-xs text-slate-500 font-medium bg-slate-200 px-2 py-1 rounded">
          {formatThaiDate(currentDate)}
        </span>
      </div>

      <div className="p-0">
        {overdueTasks.length === 0 && upcomingTasks.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
            <p className="font-medium">เยี่ยมมาก! ภารกิจทั้งหมดเป็นไปตามแผน</p>
            <p className="text-xs mt-1">ไม่มีงานค้างหรือใกล้กำหนดส่งในขณะนี้</p>
          </div>
        )}

        {/* Overdue / Critical Alerts */}
        {overdueTasks.length > 0 && (
          <div className="border-b border-slate-100">
            <div className="px-4 py-2 bg-red-50 text-xs font-bold text-red-800 uppercase tracking-wide flex items-center">
              <AlertTriangle size={14} className="mr-1" /> สิ่งที่ต้องดำเนินการด่วน (เกินกำหนด)
            </div>
            <div className="divide-y divide-red-100">
              {overdueTasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-red-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 text-sm">{task.id} {task.title}</h4>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      {task.status === 'Delayed' ? 'ล่าช้า' : 'เกินกำหนด'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <div className="flex items-center text-red-600 font-medium">
                      <Calendar size={12} className="mr-1" />
                      กำหนดส่ง: {formatThaiDate(task.endDate)}
                    </div>
                    {task.responsiblePerson && (
                      <div className="flex items-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <User size={12} className="mr-1" />
                        {task.responsiblePerson}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Deadlines */}
        {upcomingTasks.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-amber-50 text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center">
              <Clock size={14} className="mr-1" /> ใกล้กำหนดส่ง (ภายใน 3 วัน)
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-amber-50/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-slate-800 text-sm">{task.id} {task.title}</h4>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      ใกล้กำหนด
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <div className="flex items-center text-amber-600 font-medium">
                      <Calendar size={12} className="mr-1" />
                      กำหนดส่ง: {formatThaiDate(task.endDate)}
                    </div>
                    {task.responsiblePerson && (
                      <div className="flex items-center text-slate-500">
                        <User size={12} className="mr-1" />
                        {task.responsiblePerson}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;