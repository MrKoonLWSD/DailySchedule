import React, { useMemo } from 'react';
import type { Period } from '../types';

interface ActivePeriodDisplayProps {
    activePeriod: Period | null;
    nextPeriod: Period | null;
    currentTime: Date;
}

const formatTime = (time: string): string => {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minute} ${ampm}`;
};

const getSecondsFromTimeString = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60;
};

const ActivePeriodDisplay: React.FC<ActivePeriodDisplayProps> = ({ activePeriod, nextPeriod, currentTime }) => {

    const progressData = useMemo(() => {
        if (!activePeriod) return null;

        const startTimeInSeconds = getSecondsFromTimeString(activePeriod.startTime);
        const endTimeInSeconds = getSecondsFromTimeString(activePeriod.endTime);
        const currentTimeInSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
        
        const totalDuration = endTimeInSeconds - startTimeInSeconds;
        const elapsedSeconds = currentTimeInSeconds - startTimeInSeconds;
        
        const progress = Math.max(0, Math.min(100, (elapsedSeconds / totalDuration) * 100));

        const remainingSecondsTotal = Math.max(0, endTimeInSeconds - currentTimeInSeconds);
        const remainingMinutes = Math.floor(remainingSecondsTotal / 60);
        const remainingSeconds = remainingSecondsTotal % 60;
        
        return {
            progress,
            remainingMinutes,
            remainingSeconds,
        };
    }, [activePeriod, currentTime]);


    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 text-gray-800">
            <h2 className="text-xl font-bold mb-4 text-center">Live Status</h2>
            {activePeriod && progressData ? (
                <div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-indigo-600">CURRENTLY ACTIVE</p>
                        <h3 className="text-3xl font-bold tracking-tight">{activePeriod.name}</h3>
                        <p className="text-sm text-gray-500">
                            {formatTime(activePeriod.startTime)} - {formatTime(activePeriod.endTime)}
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>
                                {progressData.remainingMinutes}m {progressData.remainingSeconds.toString().padStart(2, '0')}s remaining
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-linear" 
                                style={{ width: `${progressData.progress}%` }}
                                role="progressbar"
                                aria-valuenow={progressData.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${activePeriod.name} progress`}
                            ></div>
                        </div>
                    </div>
                    {activePeriod.agenda && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-md font-semibold text-gray-800 text-center mb-2">Today's Agenda</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{activePeriod.agenda}</p>
                        </div>
                    )}
                     {nextPeriod && (
                        <p className="text-center text-sm text-gray-500 mt-4">
                            <strong>Up next:</strong> {nextPeriod.name} at {formatTime(nextPeriod.startTime)}
                        </p>
                    )}
                </div>
            ) : nextPeriod ? (
                <div className="text-center">
                    <p className="text-lg">No active period right now.</p>
                     <p className="text-gray-600 mt-1">
                        <strong>Up next:</strong> {nextPeriod.name} at {formatTime(nextPeriod.startTime)}
                    </p>
                </div>
            ) : (
                 <div className="text-center">
                    <p className="text-lg">No active or upcoming periods.</p>
                    <p className="text-gray-600 mt-1">The school day may be over.</p>
                </div>
            )}
        </div>
    );
};

export default ActivePeriodDisplay;