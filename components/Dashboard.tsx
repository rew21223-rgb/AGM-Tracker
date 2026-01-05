import React from 'react';
import { Clock, CheckCircle, Calendar, BookOpen, AlertTriangle, Activity } from 'lucide-react';
import SummaryCard from './SummaryCard';
import NotificationCenter from './NotificationCenter';
import { AgendaItem, Phase } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatThaiDate } from '../utils';

interface DashboardProps {
  agendaItems: AgendaItem[];
  phases: Phase[];
}

const Dashboard: React.FC<DashboardProps> = ({ agendaItems, phases }) => {
  // SIMULATION DATE: Set to Feb 7, 2026 (Saturday)
  const simulatedToday = new Date('2026-02-07');
  const agmDate = new Date('2026-03-13');
  
  const daysLeft = Math.ceil((agmDate.getTime() - simulatedToday.getTime()) / (1000 * 60 * 60 * 24));
  
  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phases.reduce((acc, phase) => 
    acc + phase.tasks.filter(t => t.status === 'Completed').length, 0);
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Agenda Stats
  const finalizedAgenda = agendaItems.filter(i => i.status === 'Finalized').length;
  const totalAgenda = agendaItems.length;

  // Pie Chart Data
  const agendaStatus = [
    { name: 'สมบูรณ์ (Finalized)', value: finalizedAgenda, color: '#10b981' }, // Emerald-500
    { name: 'รอตรวจสอบ (Reviewing)', value: agendaItems.filter(i => i.status === 'Reviewing').length, color: '#f59e0b' }, // Amber-500
    { name: 'กำลังร่าง (Drafting)', value: agendaItems.filter(i => i.status === 'Drafting').length, color: '#ef4444' }, // Red-500
  ];

  // Calculate Critical/Overdue
  const allTasks = phases.flatMap(p => p.tasks);
  const overdueCount = allTasks.filter(task => {
    const end = new Date(task.endDate);
    return (task.status === 'Delayed' || (task.status !== 'Completed' && end < simulatedToday));
  }).length;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ภาพรวมโครงการ AGM 2569</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">ระบบติดตามการดำเนินงาน สหกรณ์ออมทรัพย์การท่าเรือแห่งประเทศไทย จำกัด</p>
        </div>
        <div className="mt-6 sm:mt-0 text-right bg-white shadow-xl shadow-indigo-500/5 px-6 py-4 rounded-3xl border border-slate-200">
           <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.25em] mb-1.5">วันที่จำลองระบบ (SIMULATION DATE)</p>
           <div className="flex items-center text-slate-900 font-black text-2xl justify-end">
              <Calendar className="mr-3.5 text-indigo-500" size={24} />
              {formatThaiDate(simulatedToday)}
           </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="ระยะเวลาคงเหลือ" 
          value={`${daysLeft} วัน`}
          icon={Clock} 
          color="sky" 
          subtext={`เป้าหมายวันประชุมใหญ่: ${formatThaiDate(agmDate)}`}
          accessibilityLabel={`เหลือเวลาอีก ${daysLeft} วัน สำหรับโครงการ AGM. เป้าหมายวันประชุมใหญ่คือ ${formatThaiDate(agmDate)}. สถานะปัจจุบัน ${daysLeft < 14 ? 'วิกฤต' : 'ปกติ'}.`}
          trend={{ 
            value: daysLeft < 14 ? '⚠️ วิกฤต' : '✅ ปกติ', 
            positive: daysLeft >= 14,
            neutral: false 
          }}
        />
        <SummaryCard 
          title="ความคืบหน้าสะสม" 
          value={`${progressPercentage}%`} 
          icon={Activity} 
          color="emerald" 
          subtext={`ทำเสร็จแล้ว ${completedTasks} งาน จาก ${totalTasks} งานย่อย`}
          accessibilityLabel={`ความคืบหน้าโครงการรวม ${progressPercentage}%. ดำเนินการเสร็จสิ้นแล้ว ${completedTasks} งาน จากทั้งหมด ${totalTasks} งานย่อย.`}
          trend={{ value: 'กำลังดำเนินการ', positive: true }}
        />
        <SummaryCard 
          title="ความพร้อมเนื้อหา" 
          value={`${finalizedAgenda}/${totalAgenda}`}
          icon={BookOpen} 
          color="fuchsia" 
          subtext="วาระที่ตรวจสอบความถูกต้องแล้ว"
          accessibilityLabel={`ความพร้อมเนื้อหาวาระการประชุม. ตรวจสอบความถูกต้องแล้ว ${finalizedAgenda} วาระ จากทั้งหมด ${totalAgenda} วาระ.`}
          trend={{ 
            value: `${Math.round((finalizedAgenda/totalAgenda)*100)}% ข้อมูล`, 
            positive: finalizedAgenda/totalAgenda >= 0.7, 
            neutral: finalizedAgenda/totalAgenda < 0.7 
          }}
        />
        <SummaryCard 
          title="จุดที่ต้องเร่งแก้ไข" 
          value={overdueCount} 
          icon={AlertTriangle} 
          color="amber" 
          subtext="งานที่เกินกำหนดหรือพบปัญหาล่าช้า"
          accessibilityLabel={`พบจุดที่ต้องเร่งแก้ไขจำนวน ${overdueCount} รายการ. ซึ่งเป็นงานที่เกินกำหนดหรือพบปัญหาล่าช้า.`}
          trend={overdueCount > 0 ? { value: 'ต้องแก้ไข', positive: false } : { value: 'เรียบร้อย', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Notification Center */}
        <div className="lg:col-span-2 space-y-8">
           <NotificationCenter phases={phases} currentDate={simulatedToday} />
        </div>

        {/* Side Panel: Agenda Distribution */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 p-8 flex flex-col h-full min-h-[420px]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">สถานะความพร้อมของวาระ</h2>
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
                <CheckCircle size={22} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10">สรุปข้อมูลการจัดทำเนื้อหา (Content Readiness)</p>
            
            <div className="flex-1 w-full min-h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agendaStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {agendaStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px 20px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: '800' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={40} 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '11px', fontWeight: '800', paddingTop: '40px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center mt-[-45px]">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                      {Math.round((finalizedAgenda/totalAgenda)*100)}%
                    </span>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">เสร็จสิ้น</p>
                 </div>
              </div>
            </div>

            <div className="mt-10 space-y-4 pt-8 border-t border-slate-100">
              {agendaStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between group transition-all">
                  <div className="flex items-center">
                    <span className="w-3.5 h-3.5 rounded-full mr-4 shadow-sm border border-white" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm text-slate-600 font-black group-hover:text-slate-900 transition-colors uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900 bg-slate-50 px-4 py-1.5 rounded-xl text-[11px] tabular-nums border border-slate-100 shadow-sm">
                    {item.value} วาระ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;