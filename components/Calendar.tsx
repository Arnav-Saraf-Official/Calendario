'use client';

import React from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay } from 'date-fns';

export default function Calendar({ events = [] }: { events?: any[] }) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, -30))}
            className="p-2 hover:bg-slate-100 rounded-lg border"
          >
            Prev
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 hover:bg-slate-100 rounded-lg border font-medium"
          >
            Today
          </button>
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 30))}
            className="p-2 hover:bg-slate-100 rounded-lg border"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold text-slate-500 text-sm uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = events.filter(e => isSameDay(new Date(e.start), cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] border-t border-l p-2 transition-colors hover:bg-slate-50 ${
              !isSameMonth(day, monthStart) ? 'bg-slate-50 text-slate-400' : 'bg-white'
            } ${isSameDay(day, new Date()) ? 'bg-indigo-50/30' : ''}`}
          >
            <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : ''}`}>
              {formattedDate}
            </span>
            <div className="mt-2 space-y-1">
              {dayEvents.map(event => (
                <div key={event.id} className="text-[10px] p-1 bg-indigo-100 text-indigo-700 rounded truncate font-medium" title={event.title}>
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 border-r border-b" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-xl overflow-hidden border-slate-200">{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
