'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function HobbyForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Add Hobby/Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hobby Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="e.g., Guitar Practice" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none">
              <option>One-time</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Duration (mins)</label>
            <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="45" />
          </div>
          <button className="w-full bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 transition-colors mt-4">
            Add Hobby
          </button>
        </form>
      </div>
    </div>
  );
}
