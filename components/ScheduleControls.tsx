import React from 'react';
import type { Schedule } from '../types';

const CollectionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


interface ScheduleControlsProps {
  schedules: Schedule[];
  selectedScheduleId: string | null;
  onSelectSchedule: (id: string) => void;
  onAddSchedule: () => void;
  onRenameSchedule: () => void;
  onDeleteSchedule: () => void;
}

const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  schedules,
  selectedScheduleId,
  onSelectSchedule,
  onAddSchedule,
  onRenameSchedule,
  onDeleteSchedule,
}) => {
  
  const hasSchedules = schedules.length > 0;
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 mb-8">
      <div className="flex items-center mb-4">
        <CollectionIcon />
        <h2 className="text-2xl font-bold text-gray-800">Manage Schedules</h2>
      </div>

      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="flex-grow">
          <label htmlFor="schedule-select" className="sr-only">Select a schedule</label>
          <select
            id="schedule-select"
            value={selectedScheduleId || ''}
            onChange={(e) => onSelectSchedule(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:opacity-50 disabled:bg-gray-100"
            disabled={!hasSchedules}
          >
            {hasSchedules ? (
                schedules.map(schedule => (
                    <option key={schedule.id} value={schedule.id}>
                        {schedule.name}
                    </option>
                ))
            ) : (
                <option>No schedules available</option>
            )}
          </select>
        </div>

        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={onAddSchedule}
            className="flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all text-sm"
          >
            <PlusIcon /> Add
          </button>
          <button
            onClick={onRenameSchedule}
            disabled={!selectedScheduleId}
            className="flex items-center justify-center bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <PencilIcon /> Rename
          </button>
          <button
            onClick={onDeleteSchedule}
            disabled={!selectedScheduleId}
            className="flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <TrashIcon /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleControls;