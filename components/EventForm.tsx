'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function EventForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const start = new Date(`${date}T${time}`).toISOString();
    const end = new Date(new Date(`${date}T${time}`).getTime() + 60 * 60 * 1000).toISOString();

    try {
      await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          title: formData.get('title'),
          description: formData.get('description'),
          start,
          end,
        }),
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Add New Event</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input name="title" required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Math Class" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input name="date" required type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input name="time" required type="time" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24" placeholder="Add details..."></textarea>
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors mt-4 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
