import { useState, useEffect } from 'react';

const STORAGE_KEY = 'iron-log-running';

export function useRunning() {
  const [runs, setRuns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  }, [runs]);

  const addRun = (run) => {
    const newRun = {
      ...run,
      id: Date.now(),
      date: run.date || new Date().toISOString().split('T')[0],
    };
    setRuns(prev => [newRun, ...prev]);
  };

  const updateRun = (id, updates) => {
    setRuns(prev => prev.map(run => 
      run.id === id ? { ...run, ...updates } : run
    ));
  };

  const deleteRun = (id) => {
    setRuns(prev => prev.filter(run => run.id !== id));
  };

  const clearAllRuns = () => {
    setRuns([]);
  };

  return {
    runs,
    addRun,
    updateRun,
    deleteRun,
    clearAllRuns,
  };
}
