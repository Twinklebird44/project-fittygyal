import { useFirestoreDoc } from './useFirestoreDoc';
import { defaultRunPlan } from '../data/defaultRunPlan';

export function useRunPlan() {
  const { data: runPlan, setData: setRunPlan, loading } = useFirestoreDoc('runPlan', defaultRunPlan);

  const updateDay = (day, updates) => {
    setRunPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updates
      }
    }));
  };

  const updateSegments = (day, segments) => {
    setRunPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        segments
      }
    }));
  };

  const addSegment = (day, segment) => {
    setRunPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        segments: [...prev[day].segments, segment]
      }
    }));
  };

  const removeSegment = (day, index) => {
    setRunPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        segments: prev[day].segments.filter((_, i) => i !== index)
      }
    }));
  };

  const resetToDefault = () => {
    setRunPlan(defaultRunPlan);
  };

  return {
    runPlan,
    updateDay,
    updateSegments,
    addSegment,
    removeSegment,
    resetToDefault,
    loading
  };
}
