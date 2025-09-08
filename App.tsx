import React, { useState, useMemo, useEffect } from 'react';
import ScheduleForm from './components/ScheduleForm';
import CurrentTime from './components/CurrentTime';
import ScheduleControls from './components/ScheduleControls';
import ActivePeriodDisplay from './components/ActivePeriodDisplay';
import type { Period, Schedule } from './types';

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const EmptyPeriodsState = () => (
    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No periods added yet</h3>
        <p className="mt-1 text-sm text-gray-500">
            Get started by adding a class period using the form.
        </p>
    </div>
);

const NoSchedulesState = () => (
    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-8 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Schedules Created</h3>
        <p className="mt-1 text-sm text-gray-500">
            Click "Add New Schedule" to get started.
        </p>
    </div>
);


const formatTime = (time: string): string => {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minute} ${ampm}`;
};

const App: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>(() => {
        try {
            const saved = localStorage.getItem('classSchedules');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Could not load schedules from local storage", e);
            return [];
        }
    });

    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(() => {
        return localStorage.getItem('selectedScheduleId');
    });

    const [currentTime, setCurrentTime] = useState(new Date());

     useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('classSchedules', JSON.stringify(schedules));
            if (selectedScheduleId) {
                localStorage.setItem('selectedScheduleId', selectedScheduleId);
            } else {
                localStorage.removeItem('selectedScheduleId');
            }
        } catch (e) {
            console.error("Could not save schedules to local storage", e);
        }
    }, [schedules, selectedScheduleId]);


    useEffect(() => {
        // On initial load, if there are no schedules, create a default one.
        if (schedules.length === 0) {
            const defaultScheduleId = crypto.randomUUID();
            const defaultSchedule: Schedule = {
                id: defaultScheduleId,
                name: "My First Schedule",
                periods: []
            };
            setSchedules([defaultSchedule]);
            setSelectedScheduleId(defaultScheduleId);
            return;
        }

        // If a schedule ID is selected, check if it's still valid in the current schedules list.
        const isSelectedIdValid = schedules.some(s => s.id === selectedScheduleId);

        // If the selected ID is invalid (e.g., stale from localStorage or schedule was deleted)
        // or no schedule is selected, default to the first schedule in the list.
        if (!isSelectedIdValid) {
            setSelectedScheduleId(schedules[0].id);
        }
    }, [schedules, selectedScheduleId]);


    const selectedSchedule = useMemo(() => {
        return schedules.find(s => s.id === selectedScheduleId);
    }, [schedules, selectedScheduleId]);

    const sortedPeriods = useMemo(() => {
        if (!selectedSchedule) return [];
        return [...selectedSchedule.periods].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [selectedSchedule]);
    
    const { activePeriod, nextPeriod } = useMemo(() => {
        if (!selectedSchedule || sortedPeriods.length === 0) {
            return { activePeriod: null, nextPeriod: null };
        }

        const now = new Date(currentTime);
        const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        let active: Period | null = null;
        let next: Period | null = null;

        for (let i = 0; i < sortedPeriods.length; i++) {
            const period = sortedPeriods[i];
            if (currentTimeString >= period.startTime && currentTimeString < period.endTime) {
                active = period;
                if (i + 1 < sortedPeriods.length) {
                    next = sortedPeriods[i+1];
                }
                break;
            }
        }

        if (!active) {
            for (const period of sortedPeriods) {
                if (currentTimeString < period.startTime) {
                    next = period;
                    break;
                }
            }
        }

        return { activePeriod: active, nextPeriod: next };

    }, [currentTime, sortedPeriods, selectedSchedule]);

    const addPeriod = (newPeriod: Omit<Period, 'id'>) => {
        if (!selectedScheduleId) return;
        setSchedules(prevSchedules => 
            prevSchedules.map(schedule => {
                if (schedule.id === selectedScheduleId) {
                    return {
                        ...schedule,
                        periods: [...schedule.periods, { ...newPeriod, id: crypto.randomUUID() }]
                    };
                }
                return schedule;
            })
        );
    };

    const deletePeriod = (id: string) => {
        if (!selectedScheduleId) return;
        setSchedules(prevSchedules =>
            prevSchedules.map(schedule => {
                if (schedule.id === selectedScheduleId) {
                    return {
                        ...schedule,
                        periods: schedule.periods.filter(p => p.id !== id)
                    };
                }
                return schedule;
            })
        );
    };
    
    const handleAddSchedule = () => {
        const name = prompt("Enter a name for the new schedule:", "New Schedule");
        if (name && name.trim()) {
            const newScheduleId = crypto.randomUUID();
            const newSchedule: Schedule = {
                id: newScheduleId,
                name: name.trim(),
                periods: []
            };
            setSchedules(prev => [...prev, newSchedule]);
            setSelectedScheduleId(newScheduleId);
        }
    };

    const handleRenameSchedule = () => {
        if (!selectedScheduleId) return;
        const currentSchedule = schedules.find(s => s.id === selectedScheduleId);
        if (!currentSchedule) return;

        const newName = prompt("Enter a new name for the schedule:", currentSchedule.name);
        if (newName && newName.trim() && newName.trim() !== currentSchedule.name) {
            setSchedules(prev => prev.map(s => s.id === selectedScheduleId ? { ...s, name: newName.trim() } : s));
        }
    };

    const handleDeleteSchedule = () => {
        if (!selectedScheduleId) return;
        const currentSchedule = schedules.find(s => s.id === selectedScheduleId);
        if (!currentSchedule) return;

        if (confirm(`Are you sure you want to delete the "${currentSchedule.name}" schedule? This action cannot be undone.`)) {
            const idToDelete = selectedScheduleId;
            setSchedules(prev => {
                const remaining = prev.filter(s => s.id !== idToDelete);
                if (selectedScheduleId === idToDelete) {
                    setSelectedScheduleId(remaining.length > 0 ? remaining[0].id : null);
                }
                return remaining;
            });
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
                        Class Schedule Builder
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Organize your school day with ease.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <main className="lg:col-span-2">
                        {schedules.length > 0 ? (
                           <>
                             <div className="mb-8">
                                <ActivePeriodDisplay 
                                    activePeriod={activePeriod} 
                                    nextPeriod={nextPeriod} 
                                    currentTime={currentTime} 
                                />

                                <h2 className="text-3xl font-bold text-gray-800 my-4">{selectedSchedule?.name || 'Schedule'}</h2>
                                <div className="space-y-4">
                                    {sortedPeriods.length > 0 ? (
                                        sortedPeriods.map((period, index) => (
                                            <div 
                                              key={period.id} 
                                              className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-105"
                                            >
                                                <div className="flex items-center">
                                                    <div className="text-center w-12 mr-4">
                                                        <p className="font-bold text-xl text-indigo-600">{index + 1}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{period.name}</h3>
                                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                                            <ClockIcon />
                                                            <span className="ml-2">{formatTime(period.startTime)} - {formatTime(period.endTime)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => deletePeriod(period.id)}
                                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    aria-label={`Delete ${period.name} period`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyPeriodsState />
                                    )}
                                </div>
                             </div>

                             <ScheduleControls
                                schedules={schedules}
                                selectedScheduleId={selectedScheduleId}
                                onSelectSchedule={setSelectedScheduleId}
                                onAddSchedule={handleAddSchedule}
                                onRenameSchedule={handleRenameSchedule}
                                onDeleteSchedule={handleDeleteSchedule}
                            />

                             <div className="mt-8">
                                <ScheduleForm onAddPeriod={addPeriod} disabled={!selectedSchedule} />
                             </div>
                           </>
                        ) : (
                            <>
                                <ScheduleControls
                                    schedules={schedules}
                                    selectedScheduleId={selectedScheduleId}
                                    onSelectSchedule={setSelectedScheduleId}
                                    onAddSchedule={handleAddSchedule}
                                    onRenameSchedule={handleRenameSchedule}
                                    onDeleteSchedule={handleDeleteSchedule}
                                />
                                <NoSchedulesState />
                            </>
                        )}
                    </main>
                    <aside className="lg:col-span-1">
                        <CurrentTime date={currentTime} />
                    </aside>
                </div>
                 <footer className="text-center mt-12 text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Class Schedule Builder. Happy teaching!</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
