import React, { useState } from 'react';
import { LayoutDashboard, CalendarDays, ListChecks, Anchor, Menu, X, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TimelineView from './components/TimelineView';
import AgendaChecklist from './components/AgendaChecklist';
import SettingsView from './components/SettingsView';
import { INITIAL_AGENDA_ITEMS, INITIAL_PROJECT_PHASES, INITIAL_TEAMS } from './constants';
import { AgendaItem, Phase, Task, TeamDefinition } from './types';

type Tab = 'dashboard' | 'timeline' | 'agenda' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(INITIAL_AGENDA_ITEMS);
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PROJECT_PHASES);
  const [teams, setTeams] = useState<TeamDefinition[]>(INITIAL_TEAMS);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Team Handlers
  const handleAddTeam = (newTeam: TeamDefinition) => {
    setTeams(prev => [...prev, newTeam]);
  };

  const handleUpdateTeam = (updatedTeam: TeamDefinition) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  // Agenda Handlers
  const handleUpdateAgendaItem = (updatedItem: AgendaItem) => {
    setAgendaItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteAgendaItem = (id: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddAgendaItem = (newItem: AgendaItem) => {
    setAgendaItems(prev => [newItem, ...prev]);
  };

  // Phase/Task Handlers
  const handleUpdateTask = (phaseId: number, updatedTask: Task) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        };
      }
      return phase;
    }));
  };

  const handleAddTask = (phaseId: number, newTask: Task) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: [...phase.tasks, newTask]
        };
      }
      return phase;
    }));
  };

  const handleDeleteTask = (phaseId: number, taskId: string) => {
     setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.filter(t => t.id !== taskId)
        };
      }
      return phase;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard agendaItems={agendaItems} phases={phases} />;
      case 'timeline':
        return (
          <TimelineView 
            phases={phases}
            teams={teams}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'agenda':
        return (
          <AgendaChecklist 
            items={agendaItems} 
            teams={teams}
            onUpdateItem={handleUpdateAgendaItem}
            onDeleteItem={handleDeleteAgendaItem}
            onAddItem={handleAddAgendaItem}
          />
        );
      case 'settings':
        return (
          <SettingsView
            teams={teams}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        );
      default:
        return <Dashboard agendaItems={agendaItems} phases={phases} />;
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: Tab; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        activeTab === id
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Anchor className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">PAT Saving Coop</h1>
              <p className="text-xs text-slate-500">AGM Tracker 2569</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="timeline" label="Timeline & Tasks" icon={CalendarDays} />
            <NavItem id="agenda" label="Report Contents" icon={ListChecks} />
            <NavItem id="settings" label="การตั้งค่า (Settings)" icon={Settings} />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-indigo-50 p-4 rounded-xl">
               <p className="text-xs font-semibold text-indigo-800 uppercase mb-2">Next Milestone</p>
               <p className="text-sm font-bold text-indigo-900">Final Assembly</p>
               <p className="text-xs text-indigo-600">Due: 6 Feb 2569</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Mobile */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden">
           <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-1.5 rounded-md">
              <Anchor className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800">AGM Tracker</span>
           </div>
           <button onClick={toggleSidebar} className="text-slate-600">
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;