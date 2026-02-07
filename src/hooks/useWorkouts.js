import { defaultWorkouts } from '../data/defaultWorkouts';
import { useFirestoreDoc } from './useFirestoreDoc';

// NOTE: This hook is not currently used — useWorkoutPlans replaced it.
// Kept for reference but migrated to Firestore to remove localStorage.
export function useWorkouts() {
  const { data: workouts, setData: setWorkouts, loading } = useFirestoreDoc('workouts', defaultWorkouts);

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
    resetToDefault,
    loading
  };
}
