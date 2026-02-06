import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fitty-gyal-workout-history';

export function useWorkoutHistory() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Submit a completed workout
  const submitWorkout = (day, workout) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      dayOfWeek: day,
      workoutName: workout.name,
      exercises: workout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight
      }))
    };
    setHistory(prev => [entry, ...prev]);
    return entry;
  };

  // Get workouts for a specific week
  const getWeekWorkouts = (weekOffset = 0) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (weekOffset * 7));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate < endOfWeek;
    });
  };

  // Get workout history for a specific day of the week
  const getDayHistory = (dayOfWeek) => {
    return history.filter(entry => entry.dayOfWeek === dayOfWeek);
  };

  // Compare exercise progress between two dates
  const compareExercise = (exerciseName, dayOfWeek) => {
    const dayHistory = getDayHistory(dayOfWeek)
      .filter(entry => entry.exercises.some(ex => ex.name.toLowerCase() === exerciseName.toLowerCase()))
      .slice(0, 4); // Last 4 occurrences

    return dayHistory.map(entry => ({
      date: entry.date,
      exercise: entry.exercises.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase())
    }));
  };

  // Delete a history entry
  const deleteEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };

  // Get total workouts count
  const getTotalWorkouts = () => history.length;

  // Get this week's completed days
  const getThisWeekCompletedDays = () => {
    const thisWeek = getWeekWorkouts(0);
    return [...new Set(thisWeek.map(entry => entry.dayOfWeek))];
  };

  // Calculate volume for a workout entry
  const calculateVolume = (entry) => {
    return entry.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
  };

  // Get weekly stats
  const getWeeklyStats = (weekOffset = 0) => {
    const weekWorkouts = getWeekWorkouts(weekOffset);
    
    const totalVolume = weekWorkouts.reduce((sum, entry) => sum + calculateVolume(entry), 0);
    const totalWorkouts = weekWorkouts.length;
    const totalExercises = weekWorkouts.reduce((sum, entry) => sum + entry.exercises.length, 0);
    const totalSets = weekWorkouts.reduce((sum, entry) => 
      sum + entry.exercises.reduce((s, ex) => s + ex.sets, 0), 0);
    
    // Calculate max weights per exercise
    const exerciseMaxes = {};
    weekWorkouts.forEach(entry => {
      entry.exercises.forEach(ex => {
        const key = ex.name.toLowerCase();
        if (!exerciseMaxes[key] || ex.weight > exerciseMaxes[key].weight) {
          exerciseMaxes[key] = { name: ex.name, weight: ex.weight };
        }
      });
    });

    // Count workout days
    const daysWorkedOut = [...new Set(weekWorkouts.map(w => w.dayOfWeek))];

    return {
      totalVolume,
      totalWorkouts,
      totalExercises,
      totalSets,
      avgVolumePerWorkout: totalWorkouts > 0 ? totalVolume / totalWorkouts : 0,
      exerciseMaxes,
      daysWorkedOut,
      workouts: weekWorkouts
    };
  };

  // Compare weeks and generate insights
  const compareWeeks = (currentWeekOffset = 0) => {
    const currentStats = getWeeklyStats(currentWeekOffset);
    const previousStats = getWeeklyStats(currentWeekOffset + 1);

    const volumeChange = currentStats.totalVolume - previousStats.totalVolume;
    const workoutsChange = currentStats.totalWorkouts - previousStats.totalWorkouts;
    const setsChange = currentStats.totalSets - previousStats.totalSets;

    // Compare PRs (Personal Records)
    const newPRs = [];
    Object.keys(currentStats.exerciseMaxes).forEach(key => {
      const current = currentStats.exerciseMaxes[key];
      const previous = previousStats.exerciseMaxes[key];
      if (previous && current.weight > previous.weight) {
        newPRs.push({
          exercise: current.name,
          newWeight: current.weight,
          oldWeight: previous.weight,
          increase: current.weight - previous.weight
        });
      }
    });

    // Generate insights
    const insights = [];

    if (previousStats.totalWorkouts > 0) {
      // Volume insight
      if (volumeChange > 0) {
        const percent = ((volumeChange / previousStats.totalVolume) * 100).toFixed(0);
        insights.push({
          type: 'positive',
          icon: '💪',
          text: `${(volumeChange / 1000).toFixed(1)}k kg more volume this week (+${percent}%)`
        });
      } else if (volumeChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '📊',
          text: `${(Math.abs(volumeChange) / 1000).toFixed(1)}k kg less volume - recovery week?`
        });
      }

      // Consistency insight
      if (workoutsChange > 0) {
        insights.push({
          type: 'positive',
          icon: '🔥',
          text: `${workoutsChange} more workout${workoutsChange > 1 ? 's' : ''} completed!`
        });
      } else if (workoutsChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '📅',
          text: `${Math.abs(workoutsChange)} fewer workout${Math.abs(workoutsChange) > 1 ? 's' : ''} this week`
        });
      } else if (workoutsChange === 0 && currentStats.totalWorkouts > 0) {
        insights.push({
          type: 'positive',
          icon: '⭐',
          text: `Consistent! Same number of workouts as last week`
        });
      }

      // Sets insight
      if (setsChange > 10) {
        insights.push({
          type: 'positive',
          icon: '📈',
          text: `${setsChange} more sets - pushing harder!`
        });
      }

      // PR insights
      if (newPRs.length > 0) {
        newPRs.forEach(pr => {
          insights.push({
            type: 'positive',
            icon: '🏆',
            text: `New PR on ${pr.exercise}: ${pr.newWeight}kg (+${pr.increase}kg)`
          });
        });
      }

      // Avg volume per workout
      const avgChange = currentStats.avgVolumePerWorkout - previousStats.avgVolumePerWorkout;
      if (avgChange > 500) {
        insights.push({
          type: 'positive',
          icon: '💥',
          text: `${(avgChange / 1000).toFixed(1)}k more volume per session - intense!`
        });
      }
    }

    // First week insights
    if (previousStats.totalWorkouts === 0 && currentStats.totalWorkouts > 0) {
      insights.push({
        type: 'positive',
        icon: '🌟',
        text: `Great start! ${currentStats.totalWorkouts} workout${currentStats.totalWorkouts > 1 ? 's' : ''} logged`
      });
      if (currentStats.totalVolume > 0) {
        insights.push({
          type: 'neutral',
          icon: '🏋️',
          text: `Total volume: ${(currentStats.totalVolume / 1000).toFixed(1)}k kg`
        });
      }
    }

    return {
      current: currentStats,
      previous: previousStats,
      volumeChange,
      workoutsChange,
      setsChange,
      newPRs,
      insights
    };
  };

  // Get volume history for graphing (last N weeks)
  const getVolumeHistory = (weeks = 8) => {
    const data = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const stats = getWeeklyStats(i);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
      
      data.push({
        weekOffset: i,
        weekLabel: i === 0 ? 'This Week' : i === 1 ? 'Last Week' : `${i}w ago`,
        weekStart: weekStart.toISOString(),
        totalVolume: stats.totalVolume,
        totalWorkouts: stats.totalWorkouts,
        avgVolume: stats.avgVolumePerWorkout
      });
    }
    return data;
  };

  // Get exercise progress history for a specific exercise
  const getExerciseHistory = (exerciseName, limit = 10) => {
    const exerciseData = [];
    history.forEach(entry => {
      entry.exercises.forEach(ex => {
        if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
          exerciseData.push({
            date: entry.date,
            dayOfWeek: entry.dayOfWeek,
            weight: ex.weight,
            sets: ex.sets,
            reps: ex.reps,
            volume: ex.sets * ex.reps * ex.weight
          });
        }
      });
    });
    return exerciseData.slice(0, limit);
  };

  return {
    history,
    submitWorkout,
    getWeekWorkouts,
    getDayHistory,
    compareExercise,
    deleteEntry,
    clearHistory,
    getTotalWorkouts,
    getThisWeekCompletedDays,
    getWeeklyStats,
    compareWeeks,
    getVolumeHistory,
    getExerciseHistory,
    calculateVolume
  };
}
