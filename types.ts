export interface TeamDefinition {
  id: string;
  name: string; // Thai Display Name
  description?: string;
  color: string;
}

export interface TrackingLog {
  id: string;
  date: string; // ISO string
  message: string;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  team: string; 
  responsiblePerson?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Critical' | 'Delayed';
  isMilestone?: boolean;
  progress?: number;
  logs?: TrackingLog[];
}

export interface Phase {
  id: number;
  name: string;
  period: string;
  description: string;
  tasks: Task[];
}

export interface AgendaItem {
  id: string;
  title: string;
  responsibleTeam: string; 
  responsiblePerson?: string;
  status: 'Drafting' | 'Reviewing' | 'Finalized';
  logs: TrackingLog[];
}