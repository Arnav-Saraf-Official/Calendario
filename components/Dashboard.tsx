'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import EventForm from './EventForm';
import AssignmentForm from './AssignmentForm';
import HobbyForm from './HobbyForm';
import { Plus, Calendar as CalendarIcon, CheckSquare, Heart, Settings } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showModal, setShowModal] = useState<null | 'event' | 'assignment' | 'hobby'>(null);
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar/events');
      const data = await res.json();
      if (!data.error) {
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  const assignments = events.filter(e => e.type === 'assignment');
  const hobbies = events.filter(e => e.type === 'hobby');
  const calendarEvents = events.filter(e => e.type === 'event');

  const handleLogin = async () => {
    await signIn('google');
  };

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-slate-800">Calendar Dashboard</h1>
          <p className="text-slate-600 mb-6">Sign in to view your schedule and manage events.</p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab === 'calendar' ? 'My Schedule' : activeTab}
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal('event')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              Add Event
            </button>
            <button 
              onClick={() => setShowModal('assignment')}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              Add Assignment
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'calendar' && <Calendar events={calendarEvents} />}
          {activeTab === 'assignments' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {assignments.length > 0 ? assignments.map(item => (
                  <div key={item.id} className="bg-white rounded-xl border p-6 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{item.title.replace('[Assignment] ', '')}</h3>
                      <p className="text-slate-500 text-sm">Due: {new Date(item.start).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        Diff: {item.metadata.difficulty}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {item.metadata.estHours} hrs
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <p className="text-slate-500">No assignments yet. Add one to see it here!</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'hobbies' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">My Hobbies & Tasks</h2>
              <div className="space-y-4">
                {hobbies.length > 0 ? hobbies.map(item => (
                  <div key={item.id} className="bg-white rounded-xl border p-6 shadow-sm">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                )) : (
                  <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <p className="text-slate-500">No hobbies added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showModal === 'event' && <EventForm onClose={() => setShowModal(null)} />}
      {showModal === 'assignment' && <AssignmentForm onClose={() => setShowModal(null)} />}
      {showModal === 'hobby' && <HobbyForm onClose={() => setShowModal(null)} />}
    </div>
  );
}
