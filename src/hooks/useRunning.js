import { useFirestoreDoc } from './useFirestoreDoc';

export function useRunning() {
  const { data: runs, setData: setRuns, loading } = useFirestoreDoc('runs', []);

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
    loading,
  };
}
