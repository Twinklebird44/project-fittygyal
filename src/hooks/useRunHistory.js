import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fitty-gyal-run-history';

export function useRunHistory() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // Submit a completed run from the weekly plan
  const submitRun = (day, runData, logData = {}) => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      dayOfWeek: day,
      runName: runData.name,
      type: runData.type,
      plannedDistance: runData.distance,
      actualDistance: logData.actualDistance || runData.distance,
      effort: runData.effort,
      notes: logData.notes || runData.notes || '',
      segments: runData.segments || [],
      // Tracking fields from log form
      duration: logData.duration || '',
      pace: logData.pace || '',
      avgHeartRate: logData.avgHeartRate || '',
      feeling: logData.feeling || 'good'
    };
    setHistory(prev => [entry, ...prev]);
    return entry;
  };

  // Get runs for a specific week
  const getWeekRuns = (weekOffset = 0) => {
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

  // Get run history for a specific day of the week
  const getDayHistory = (dayOfWeek) => {
    return history.filter(entry => entry.dayOfWeek === dayOfWeek);
  };

  // Get this week's completed days
  const getThisWeekCompletedDays = () => {
    const thisWeek = getWeekRuns(0);
    return [...new Set(thisWeek.map(entry => entry.dayOfWeek))];
  };

  // Helper to parse pace string to minutes
  const parsePace = (pace) => {
    if (!pace) return null;
    const [min, sec] = pace.split(':').map(Number);
    if (isNaN(min)) return null;
    return min + (sec || 0) / 60;
  };

  // Helper to format pace from minutes to mm:ss
  const formatPace = (paceInMinutes) => {
    if (!paceInMinutes) return null;
    const min = Math.floor(paceInMinutes);
    const sec = Math.round((paceInMinutes - min) * 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Calculate weekly stats
  const getWeeklyStats = (weekOffset = 0) => {
    const weekRuns = getWeekRuns(weekOffset);
    const totalDistance = weekRuns.reduce((sum, run) => sum + (run.actualDistance || 0), 0);
    const totalRuns = weekRuns.length;
    
    // Calculate average pace
    const runsWithPace = weekRuns.filter(run => run.pace);
    const avgPaceMinutes = runsWithPace.length > 0 
      ? runsWithPace.reduce((sum, run) => sum + parsePace(run.pace), 0) / runsWithPace.length 
      : null;
    
    // Calculate average heart rate
    const runsWithHR = weekRuns.filter(run => run.avgHeartRate);
    const avgHeartRate = runsWithHR.length > 0
      ? Math.round(runsWithHR.reduce((sum, run) => sum + parseInt(run.avgHeartRate), 0) / runsWithHR.length)
      : null;

    // Calculate total duration
    const runsWithDuration = weekRuns.filter(run => run.duration);
    const totalDurationMinutes = runsWithDuration.reduce((sum, run) => {
      const [min, sec] = run.duration.split(':').map(Number);
      return sum + min + (sec || 0) / 60;
    }, 0);

    // Count feelings
    const feelings = weekRuns.reduce((acc, run) => {
      acc[run.feeling] = (acc[run.feeling] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalDistance,
      totalRuns,
      avgDistance: totalRuns > 0 ? totalDistance / totalRuns : 0,
      avgPace: formatPace(avgPaceMinutes),
      avgPaceMinutes,
      avgHeartRate,
      totalDurationMinutes,
      feelings,
      runs: weekRuns
    };
  };

  // Compare two weeks with detailed insights
  const compareWeeks = (currentWeekOffset = 0) => {
    const currentStats = getWeeklyStats(currentWeekOffset);
    const previousStats = getWeeklyStats(currentWeekOffset + 1);
    
    // Calculate changes
    const distanceChange = currentStats.totalDistance - previousStats.totalDistance;
    const runsChange = currentStats.totalRuns - previousStats.totalRuns;
    
    // Pace change (negative is better/faster)
    const paceChange = (currentStats.avgPaceMinutes && previousStats.avgPaceMinutes)
      ? previousStats.avgPaceMinutes - currentStats.avgPaceMinutes
      : null;
    
    // Heart rate change (lower at same effort is generally better)
    const hrChange = (currentStats.avgHeartRate && previousStats.avgHeartRate)
      ? currentStats.avgHeartRate - previousStats.avgHeartRate
      : null;

    // Generate insights
    const insights = [];
    
    if (previousStats.totalRuns > 0) {
      // Distance insight
      if (distanceChange > 0) {
        const percent = ((distanceChange / previousStats.totalDistance) * 100).toFixed(0);
        insights.push({
          type: 'positive',
          icon: '🔥',
          text: `You ran ${distanceChange.toFixed(1)}km more this week (+${percent}%)`
        });
      } else if (distanceChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '📊',
          text: `${Math.abs(distanceChange).toFixed(1)}km less than last week - rest is important too!`
        });
      }

      // Runs consistency
      if (runsChange > 0) {
        insights.push({
          type: 'positive',
          icon: '💪',
          text: `${runsChange} more run${runsChange > 1 ? 's' : ''} completed - great consistency!`
        });
      } else if (runsChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '📅',
          text: `${Math.abs(runsChange)} fewer run${Math.abs(runsChange) > 1 ? 's' : ''} this week`
        });
      }

      // Pace insight
      if (paceChange !== null) {
        if (paceChange > 0.1) { // More than 6 seconds faster
          const secondsFaster = Math.round(paceChange * 60);
          insights.push({
            type: 'positive',
            icon: '⚡',
            text: `${secondsFaster}s faster per km on average - you're getting quicker!`
          });
        } else if (paceChange < -0.1) {
          const secondsSlower = Math.round(Math.abs(paceChange) * 60);
          insights.push({
            type: 'neutral',
            icon: '🐢',
            text: `${secondsSlower}s slower per km - maybe more recovery runs?`
          });
        } else {
          insights.push({
            type: 'neutral',
            icon: '⏱️',
            text: `Pace staying consistent at ${currentStats.avgPace}/km`
          });
        }
      }

      // Heart rate insight
      if (hrChange !== null) {
        if (hrChange < -3) {
          insights.push({
            type: 'positive',
            icon: '❤️',
            text: `Heart rate ${Math.abs(hrChange)}bpm lower - your fitness is improving!`
          });
        } else if (hrChange > 5) {
          insights.push({
            type: 'warning',
            icon: '💓',
            text: `Heart rate up ${hrChange}bpm - consider more recovery`
          });
        }
      }

      // Feeling insight
      const currentGreatGood = (currentStats.feelings.great || 0) + (currentStats.feelings.good || 0);
      const prevGreatGood = (previousStats.feelings.great || 0) + (previousStats.feelings.good || 0);
      if (currentStats.totalRuns >= 2 && currentGreatGood > prevGreatGood) {
        insights.push({
          type: 'positive',
          icon: '😊',
          text: `More runs felt great this week - you're in the zone!`
        });
      }
    }

    // If no previous data
    if (previousStats.totalRuns === 0 && currentStats.totalRuns > 0) {
      insights.push({
        type: 'positive',
        icon: '🌟',
        text: `Great start! ${currentStats.totalRuns} run${currentStats.totalRuns > 1 ? 's' : ''} logged this week`
      });
      if (currentStats.avgPace) {
        insights.push({
          type: 'neutral',
          icon: '⏱️',
          text: `Average pace: ${currentStats.avgPace}/km - keep tracking to see progress!`
        });
      }
    }
    
    return {
      current: currentStats,
      previous: previousStats,
      distanceChange,
      runsChange,
      paceChange,
      hrChange,
      insights
    };
  };

  // Update a history entry
  const updateEntry = (id, updates) => {
    setHistory(prev => prev.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  // Delete a history entry
  const deleteEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    submitRun,
    getWeekRuns,
    getDayHistory,
    getThisWeekCompletedDays,
    getWeeklyStats,
    compareWeeks,
    updateEntry,
    deleteEntry,
    clearHistory
  };
}
