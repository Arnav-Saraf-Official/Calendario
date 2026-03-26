'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function AssignmentForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const deadline = formData.get('deadline') as string;
    const start = new Date(deadline).toISOString();
    const end = new Date(new Date(deadline).getTime() + 30 * 60 * 1000).toISOString();

    try {
      await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'assignment',
          title: `[Assignment] ${formData.get('name')}`,
          start,
          end,
          metadata: {
            difficulty: formData.get('difficulty'),
            estHours: formData.get('hours'),
            status: 'pending'
          }
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
          <h3 className="text-xl font-bold text-slate-800">Add Assignment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Name</label>
            <input name="name" required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g., History Essay" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
            <input name="deadline" required type="datetime-local" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty (1-5)</label>
              <select name="difficulty" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="1">1 - Easy</option>
                <option value="2">2</option>
                <option value="3">3 - Medium</option>
                <option value="4">4</option>
                <option value="5">5 - Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Est. Hours</label>
              <input name="hours" type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="2" />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors mt-4 disabled:opacity-50">
            {loading ? 'Scheduling...' : 'Schedule Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}
