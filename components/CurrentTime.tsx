
import React from 'react';

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

interface CurrentTimeProps {
  date: Date;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ date }) => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-8" aria-live="polite">
        <div className="flex items-center justify-center mb-4">
            <ClockIcon />
            <h3 className="text-xl font-bold text-gray-800">Current Time</h3>
        </div>
        <div 
            className="text-4xl sm:text-5xl font-mono font-bold text-gray-900 tracking-tight text-center"
            aria-label={`Current time is ${formattedTime}`}
        >
            {formattedTime}
        </div>
        <div className="flex items-center justify-center text-md text-gray-600 mt-4" aria-label={`Current date is ${formattedDate}`}>
            <CalendarIcon />
            <span>{formattedDate}</span>
        </div>
    </div>
  );
};

export default CurrentTime;