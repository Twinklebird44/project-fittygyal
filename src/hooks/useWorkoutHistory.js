import { useFirestoreDoc } from './useFirestoreDoc';

export function useWorkoutHistory() {
  const { data: history, setData: setHistory, loading } = useFirestoreDoc('workoutHistory', []);

  // Submit a completed workout
  const submitWorkout = (day, workout, planId = null) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      dayOfWeek: day,
      workoutName: workout.name,
      planId: planId || null,
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

  // Get history filtered by plan (entries without planId are included for backwards compat)
  const getHistoryForPlan = (planId) => {
    if (!planId) return history;
    return history.filter(entry => !entry.planId || entry.planId === planId);
  };

  // Get workouts for a specific week
  const getWeekWorkouts = (weekOffset = 0, planId = null) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (weekOffset * 7));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const source = planId ? getHistoryForPlan(planId) : history;
    return source.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate < endOfWeek;
    });
  };

  // Get workout history for a specific day of the week
  const getDayHistory = (dayOfWeek, planId = null) => {
    const source = planId ? getHistoryForPlan(planId) : history;
    return source.filter(entry => entry.dayOfWeek === dayOfWeek);
  };

  // Compare exercise progress between two dates
  const compareExercise = (exerciseName, dayOfWeek) => {
    const dayHistory = getDayHistory(dayOfWeek)
      .filter(entry => entry.exercises.some(ex => ex.name.toLowerCase() === exerciseName.toLowerCase()))
      .slice(0, 4);

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
  const getThisWeekCompletedDays = (planId = null) => {
    const thisWeek = getWeekWorkouts(0, planId);
    return [...new Set(thisWeek.map(entry => entry.dayOfWeek))];
  };

  // Calculate volume for a workout entry
  const calculateVolume = (entry) => {
    return entry.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
  };

  // Get weekly stats
  const getWeeklyStats = (weekOffset = 0, planId = null) => {
    const weekWorkouts = getWeekWorkouts(weekOffset, planId);
    
    const totalVolume = weekWorkouts.reduce((sum, entry) => sum + calculateVolume(entry), 0);
    const totalWorkouts = weekWorkouts.length;
    const totalExercises = weekWorkouts.reduce((sum, entry) => sum + entry.exercises.length, 0);
    const totalSets = weekWorkouts.reduce((sum, entry) => 
      sum + entry.exercises.reduce((s, ex) => s + ex.sets, 0), 0);
    
    const exerciseMaxes = {};
    weekWorkouts.forEach(entry => {
      entry.exercises.forEach(ex => {
        const key = ex.name.toLowerCase();
        if (!exerciseMaxes[key] || ex.weight > exerciseMaxes[key].weight) {
          exerciseMaxes[key] = { name: ex.name, weight: ex.weight };
        }
      });
    });

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
  const compareWeeks = (currentWeekOffset = 0, planId = null) => {
    const currentStats = getWeeklyStats(currentWeekOffset, planId);
    const previousStats = getWeeklyStats(currentWeekOffset + 1, planId);

    const volumeChange = currentStats.totalVolume - previousStats.totalVolume;
    const workoutsChange = currentStats.totalWorkouts - previousStats.totalWorkouts;
    const setsChange = currentStats.totalSets - previousStats.totalSets;

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

    const insights = [];

    if (previousStats.totalWorkouts > 0) {
      if (volumeChange > 0) {
        const percent = ((volumeChange / previousStats.totalVolume) * 100).toFixed(0);
        insights.push({
          type: 'positive',
          icon: '\u{1F4AA}',
          text: `${(volumeChange / 1000).toFixed(1)}k kg more volume this week (+${percent}%)`
        });
      } else if (volumeChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '\u{1F4CA}',
          text: `${(Math.abs(volumeChange) / 1000).toFixed(1)}k kg less volume - recovery week?`
        });
      }

      if (workoutsChange > 0) {
        insights.push({
          type: 'positive',
          icon: '\u{1F525}',
          text: `${workoutsChange} more workout${workoutsChange > 1 ? 's' : ''} completed!`
        });
      } else if (workoutsChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '\u{1F4C5}',
          text: `${Math.abs(workoutsChange)} fewer workout${Math.abs(workoutsChange) > 1 ? 's' : ''} this week`
        });
      } else if (workoutsChange === 0 && currentStats.totalWorkouts > 0) {
        insights.push({
          type: 'positive',
          icon: '\u{2B50}',
          text: `Consistent! Same number of workouts as last week`
        });
      }

      if (setsChange > 10) {
        insights.push({
          type: 'positive',
          icon: '\u{1F4C8}',
          text: `${setsChange} more sets - pushing harder!`
        });
      }

      if (newPRs.length > 0) {
        newPRs.forEach(pr => {
          insights.push({
            type: 'positive',
            icon: '\u{1F3C6}',
            text: `New PR on ${pr.exercise}: ${pr.newWeight}kg (+${pr.increase}kg)`
          });
        });
      }

      const avgChange = currentStats.avgVolumePerWorkout - previousStats.avgVolumePerWorkout;
      if (avgChange > 500) {
        insights.push({
          type: 'positive',
          icon: '\u{1F4A5}',
          text: `${(avgChange / 1000).toFixed(1)}k more volume per session - intense!`
        });
      }
    }

    if (previousStats.totalWorkouts === 0 && currentStats.totalWorkouts > 0) {
      insights.push({
        type: 'positive',
        icon: '\u{1F31F}',
        text: `Great start! ${currentStats.totalWorkouts} workout${currentStats.totalWorkouts > 1 ? 's' : ''} logged`
      });
      if (currentStats.totalVolume > 0) {
        insights.push({
          type: 'neutral',
          icon: '\u{1F3CB}\u{FE0F}',
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
  const getVolumeHistory = (weeks = 8, planId = null) => {
    const data = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const stats = getWeeklyStats(i, planId);
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
    getHistoryForPlan,
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
    calculateVolume,
    loading
  };
}
