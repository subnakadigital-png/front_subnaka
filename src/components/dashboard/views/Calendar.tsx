"use client";
import React from 'react';
import { PlusCircle, Clock } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Corrected import path
import { Event } from '@/lib/types'; // Import Event interface

interface CalendarViewProps {
  events: Event[]; // Use the imported Event interface
  setActiveTab: (tab: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, setActiveTab }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
        <p className="text-slate-500 text-sm">Schedule viewings, meetings, and deadlines.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
        <PlusCircle className="w-4 h-4" /> Add Event
      </button>
    </div>

    <div className="flex flex-col md:flex-row gap-6">
      {/* Simple Calendar Grid Mock */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">October 2024</h3>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-100 rounded"><span className="rotate-180 block">➜</span></button>
            <button className="p-1 hover:bg-slate-100 rounded">➜</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 text-center mb-4 text-slate-400 text-xs font-bold uppercase">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-4 text-center">
          {/* MOCK DAYS */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const hasEvent = [24, 25].includes(day);
            return (
              <div key={i} className={`h-10 w-10 md:h-14 md:w-full flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-slate-50 transition relative ${day === 24 ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold' : ''}`}>
                <span className="text-sm">{day}</span>
                {hasEvent && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agenda List */}
      <div className="w-full md:w-80 space-y-4">
        <h3 className="font-bold text-slate-900">Agenda</h3>
        {events.map((evt) => (
          <div key={evt.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-yellow-400">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm text-slate-900">{evt.title}</h4>
              <span className="text-xs font-bold text-slate-400">{evt.time}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{evt.with}</p>
            <div className="mt-2 flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-500">{evt.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CalendarView;