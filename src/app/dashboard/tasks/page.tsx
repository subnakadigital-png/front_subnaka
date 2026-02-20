'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '@/hooks/useLocalStorage';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Flag, 
  X,
  User,
  AlertCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
}

const initialTasks: Task[] = [
  { id: '1', title: 'Upload new villa photos', assignee: 'Alice', dueDate: '2023-11-01', priority: 'High', status: 'In Progress' },
  { id: '2', title: 'Send contract to Client B', assignee: 'Bob', dueDate: '2023-11-02', priority: 'Medium', status: 'To Do' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('subnaka_tasks', initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: uuidv4(),
      title,
      assignee,
      dueDate,
      priority,
      status,
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setAssignee('');
    setDueDate('');
    setPriority('Medium');
    setStatus('To Do');
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Employee Tasks</h1>
          
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Task
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks or assignees..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm transition-all" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['To Do', 'In Progress', 'Completed'] as const).map((colStatus) => (
          <div key={colStatus} className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-widest">
                {colStatus === 'To Do' && <Circle className="w-4 h-4 text-slate-400" />}
                {colStatus === 'In Progress' && <Clock className="w-4 h-4 text-yellow-500" />}
                {colStatus === 'Completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {colStatus}
              </h3>
              <span className="bg-white border border-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full text-slate-500 shadow-sm">
                {filteredTasks.filter(t => t.status === colStatus).length}
              </span>
            </div>
            
            <div className="space-y-4 flex-grow">
              {filteredTasks.filter(t => t.status === colStatus).map((task) => (
                <div key={task.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-yellow-200 transition-all cursor-default">
                  <div className="flex justify-between items-start mb-4">
                    <PriorityBadge priority={task.priority} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => deleteTask(task.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-6 leading-relaxed">{task.title}</h4>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] font-black text-yellow-700 border border-yellow-200">
                        {task.assignee[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">{task.assignee}</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" /> {task.dueDate}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                     {colStatus !== 'To Do' && <button onClick={() => moveTask(task.id, 'To Do')} className="text-[9px] font-black uppercase tracking-tighter py-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all">Move to To Do</button>}
                     {colStatus !== 'In Progress' && <button onClick={() => moveTask(task.id, 'In Progress')} className="text-[9px] font-black uppercase tracking-tighter py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all">Move to Doing</button>}
                     {colStatus !== 'Completed' && <button onClick={() => moveTask(task.id, 'Completed')} className="text-[9px] font-black uppercase tracking-tighter py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all col-span-2">Mark Done</button>}
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => { setStatus(colStatus); setIsModalOpen(true); }}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-white hover:border-yellow-400 hover:text-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Task to {colStatus}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="bg-yellow-500 p-2 rounded-xl shadow-lg">
                    <CheckCircle2 className="text-white w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Task</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X /></button>
            </div>
            
            <form className="space-y-6" onSubmit={handleCreateTask}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Task Description</label>
                <textarea 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium transition-all" 
                  placeholder="What needs to be done?" 
                  rows={3}
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assignee</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium transition-all" 
                      placeholder="e.g. Alice" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium transition-all" 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium transition-all appearance-none cursor-pointer"
                    >
                        <option value="High">🔴 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Column</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium transition-all appearance-none cursor-pointer"
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                 </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 mt-4">
                Deploy Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    High: 'text-red-600 bg-red-50 border-red-100',
    Medium: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    Low: 'text-green-600 bg-green-50 border-green-100'
  };
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${colors[priority as keyof typeof colors]}`}>
      <AlertCircle className="w-3 h-3" /> {priority}
    </span>
  );
};
