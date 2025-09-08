import React, { useState } from 'react';
import type { Period } from '../types';

interface ScheduleFormProps {
  onAddPeriod: (period: Omit<Period, 'id'>) => void;
  disabled?: boolean;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onAddPeriod, disabled = false }) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (!name.trim() || !startTime || !endTime) {
      setError('All fields are required.');
      return;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    onAddPeriod({ name, startTime, endTime });
    setName('');
    // A simple logic to suggest next period time
    const [h, m] = endTime.split(':');
    const nextStartTime = `${h}:${m}`;
    const nextEndTime = `${String(parseInt(h, 10) + 1).padStart(2, '0')}:${m}`;
    setStartTime(nextStartTime);
    setEndTime(nextEndTime);
    setError(null);
  };

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Period</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="period-name" className="block text-sm font-medium text-gray-700 mb-1">Period Name</label>
          <input
            id="period-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Math, Science, Lunch"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              disabled={disabled}
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              disabled={disabled}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
        
        <button
          type="submit"
          disabled={disabled}
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <PlusIcon />
          Add Period
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;
