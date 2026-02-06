import { useState, useEffect } from 'react';
import { defaultWorkouts } from '../data/defaultWorkouts';

const STORAGE_KEY = 'iron-log-workouts';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultWorkouts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const updateExercise = (day, exerciseId, updates) => {
    setWorkouts(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      }
    }));
  };

  const addExercise = (day, exercise) => {
    const newId = Math.max(0, ...workouts[day].exercises.map(e => e.id)) + 1;
    setWorkouts(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: [...prev[day].exercises, { ...exercise, id: newId }]
      }
    }));
  };

  const removeExercise = (day, exerciseId) => {
    setWorkouts(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.filter(ex => ex.id !== exerciseId)
      }
    }));
  };

  const updateDayName = (day, name) => {
    setWorkouts(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        name
      }
    }));
  };

  const resetToDefault = () => {
    setWorkouts(defaultWorkouts);
  };

  return {
    workouts,
    updateExercise,
    addExercise,
    removeExercise,
    updateDayName,
    resetToDefault
  };
}
