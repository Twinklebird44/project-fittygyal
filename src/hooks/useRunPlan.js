import { useState, useEffect } from 'react';
import { defaultRunPlan } from '../data/defaultRunPlan';

const STORAGE_KEY = 'iron-log-run-plan';

export function useRunPlan() {
  const [runPlan, setRunPlan] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultRunPlan;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runPlan));
  }, [runPlan]);

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
    resetToDefault
  };
}
