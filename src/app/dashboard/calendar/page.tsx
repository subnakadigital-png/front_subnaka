'use client';

import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bell, 
  Clock, 
  X,
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string; // Stored as ISO string for easy serialization
  type: 'Viewing' | 'Follow-up' | 'Internal';
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedReminders = localStorage.getItem('subnaka_reminders');
      if (savedReminders) {
        return JSON.parse(savedReminders);
      }
    }
    return [{ id: '1', title: 'Welcome Viewing', time: '10:00', date: new Date().toISOString(), type: 'Viewing' }];
  });

  const [note, setNote] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNote = localStorage.getItem('subnaka_calendar_note');
      if (savedNote) {
        return savedNote;
      }
    }
    return '';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newTime, setNewTime] = useState('10:00');
  const [newType, setNewType] = useState<'Viewing' | 'Follow-up' | 'Internal'>('Viewing');

  // Save to LocalStorage whenever reminders change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('subnaka_reminders', JSON.stringify(reminders));
    }
  }, [reminders, isLoaded]);

  // Save Note to LocalStorage
  const handleSaveNote = () => {
    localStorage.setItem('subnaka_calendar_note', note);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const reminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      date: new Date(newDate).toISOString(),
      time: newTime,
      type: newType,
    };
    setReminders([...reminders, reminder]);
    setIsModalOpen(false);
    setNewTitle('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {days.map((day) => {
          const formattedDate = format(day, 'd');
          const dayReminders = reminders.filter(r => isSameDay(parseISO(r.date), day));
          
          return (
            <div
              key={day.toString()}
              className={`min-h-[110px] bg-white p-2 transition-all cursor-pointer hover:bg-slate-50 relative ${
                !isSameMonth(day, monthStart) ? 'bg-slate-50 text-slate-300' : 'text-slate-700'
              } ${isSameDay(day, selectedDate) ? 'bg-yellow-50/50' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-black inline-flex items-center justify-center w-6 h-6 rounded-full ${
                  isSameDay(day, new Date()) ? 'bg-yellow-500 text-white shadow-md' : 
                  isSameDay(day, selectedDate) ? 'text-yellow-600 font-black' : ''
                }`}>
                  {formattedDate}
                </span>
                {dayReminders.length > 0 && (
                   <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                )}
              </div>
              <div className="mt-2 space-y-1 overflow-hidden">
                {dayReminders.slice(0, 2).map(reminder => (
                  <div key={reminder.id} className={`text-[9px] p-1 rounded font-bold truncate border-l-2 ${
                    reminder.type === 'Viewing' ? 'bg-blue-50 text-blue-700 border-blue-500' : 
                    reminder.type === 'Follow-up' ? 'bg-green-50 text-green-700 border-green-500' : 
                    'bg-slate-50 text-slate-700 border-slate-500'
                  }`}>
                    {reminder.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="p-8 relative">
       {/* Header */}
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Calendar & Reminders</h1>
          <p className="text-slate-500 font-medium">Data is saved automatically to your browser</p>
        </div>
        <button 
          onClick={() => {
            setNewDate(format(selectedDate, 'yyyy-MM-dd'));
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-yellow-600 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-4 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-white rounded-xl transition-all">Today</button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">{day}</div>
              ))}
            </div>
            {renderCells()}
          </div>
        </div>

        {/* Agenda Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-yellow-500" /> Agenda: {format(selectedDate, 'MMM d')}
            </h3>
            <div className="space-y-4 flex-grow max-h-[400px] overflow-y-auto pr-2">
              {reminders.filter(r => isSameDay(parseISO(r.date), selectedDate)).length > 0 ? (
                reminders.filter(r => isSameDay(parseISO(r.date), selectedDate))
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(reminder => (
                  <div key={reminder.id} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-yellow-500 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        reminder.type === 'Viewing' ? 'bg-blue-100 text-blue-700' : 
                        reminder.type === 'Follow-up' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                      }`}>{reminder.type}</span>
                      <button onClick={() => removeReminder(reminder.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{reminder.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold"><Clock className="w-3.5 h-3.5 text-yellow-500" /> {reminder.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-3xl">
                   <p className="text-xs font-bold text-slate-400">No events for this day</p>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100">
               <h3 className="font-black text-slate-800 mb-4 text-xs uppercase tracking-widest">Quick Note</h3>
               <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:ring-2 focus:ring-yellow-500 outline-none min-h-[120px]" placeholder="Type here..." />
               <button onClick={handleSaveNote} className="mt-4 w-full bg-slate-800 text-white py-3 rounded-2xl font-bold text-sm hover:bg-slate-700 shadow-lg">Save Note</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal & Toast */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">New Schedule</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X /></button>
            </div>
            <form className="space-y-6" onSubmit={handleAddReminder}>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="Event Title" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
              </div>
              <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                <option value="Viewing">Viewing</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Internal">Internal</option>
              </select>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black text-lg shadow-xl hover:bg-slate-800">Create Event</button>
            </form>
          </div>
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom">
          <div className="bg-green-500 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-white" /></div>
          <p className="font-bold text-sm">Action completed successfully!</p>
        </div>
      )}
    </div>
  );
}
