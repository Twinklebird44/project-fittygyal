import { useFirestoreDoc } from './useFirestoreDoc';

export function useRunHistory() {
  const { data: history, setData: setHistory, loading } = useFirestoreDoc('runHistory', []);

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
    
    const runsWithPace = weekRuns.filter(run => run.pace);
    const avgPaceMinutes = runsWithPace.length > 0 
      ? runsWithPace.reduce((sum, run) => sum + parsePace(run.pace), 0) / runsWithPace.length 
      : null;
    
    const runsWithHR = weekRuns.filter(run => run.avgHeartRate);
    const avgHeartRate = runsWithHR.length > 0
      ? Math.round(runsWithHR.reduce((sum, run) => sum + parseInt(run.avgHeartRate), 0) / runsWithHR.length)
      : null;

    const runsWithDuration = weekRuns.filter(run => run.duration);
    const totalDurationMinutes = runsWithDuration.reduce((sum, run) => {
      const [min, sec] = run.duration.split(':').map(Number);
      return sum + min + (sec || 0) / 60;
    }, 0);

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
    
    const distanceChange = currentStats.totalDistance - previousStats.totalDistance;
    const runsChange = currentStats.totalRuns - previousStats.totalRuns;
    
    const paceChange = (currentStats.avgPaceMinutes && previousStats.avgPaceMinutes)
      ? previousStats.avgPaceMinutes - currentStats.avgPaceMinutes
      : null;
    
    const hrChange = (currentStats.avgHeartRate && previousStats.avgHeartRate)
      ? currentStats.avgHeartRate - previousStats.avgHeartRate
      : null;

    const insights = [];
    
    if (previousStats.totalRuns > 0) {
      if (distanceChange > 0) {
        const percent = ((distanceChange / previousStats.totalDistance) * 100).toFixed(0);
        insights.push({
          type: 'positive',
          icon: '\u{1F525}',
          text: `You ran ${distanceChange.toFixed(1)}km more this week (+${percent}%)`
        });
      } else if (distanceChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '\u{1F4CA}',
          text: `${Math.abs(distanceChange).toFixed(1)}km less than last week - rest is important too!`
        });
      }

      if (runsChange > 0) {
        insights.push({
          type: 'positive',
          icon: '\u{1F4AA}',
          text: `${runsChange} more run${runsChange > 1 ? 's' : ''} completed - great consistency!`
        });
      } else if (runsChange < 0) {
        insights.push({
          type: 'neutral',
          icon: '\u{1F4C5}',
          text: `${Math.abs(runsChange)} fewer run${Math.abs(runsChange) > 1 ? 's' : ''} this week`
        });
      }

      if (paceChange !== null) {
        if (paceChange > 0.1) {
          const secondsFaster = Math.round(paceChange * 60);
          insights.push({
            type: 'positive',
            icon: '\u{26A1}',
            text: `${secondsFaster}s faster per km on average - you're getting quicker!`
          });
        } else if (paceChange < -0.1) {
          const secondsSlower = Math.round(Math.abs(paceChange) * 60);
          insights.push({
            type: 'neutral',
            icon: '\u{1F422}',
            text: `${secondsSlower}s slower per km - maybe more recovery runs?`
          });
        } else {
          insights.push({
            type: 'neutral',
            icon: '\u{23F1}\u{FE0F}',
            text: `Pace staying consistent at ${currentStats.avgPace}/km`
          });
        }
      }

      if (hrChange !== null) {
        if (hrChange < -3) {
          insights.push({
            type: 'positive',
            icon: '\u{2764}\u{FE0F}',
            text: `Heart rate ${Math.abs(hrChange)}bpm lower - your fitness is improving!`
          });
        } else if (hrChange > 5) {
          insights.push({
            type: 'warning',
            icon: '\u{1F493}',
            text: `Heart rate up ${hrChange}bpm - consider more recovery`
          });
        }
      }

      const currentGreatGood = (currentStats.feelings.great || 0) + (currentStats.feelings.good || 0);
      const prevGreatGood = (previousStats.feelings.great || 0) + (previousStats.feelings.good || 0);
      if (currentStats.totalRuns >= 2 && currentGreatGood > prevGreatGood) {
        insights.push({
          type: 'positive',
          icon: '\u{1F60A}',
          text: `More runs felt great this week - you're in the zone!`
        });
      }
    }

    if (previousStats.totalRuns === 0 && currentStats.totalRuns > 0) {
      insights.push({
        type: 'positive',
        icon: '\u{1F31F}',
        text: `Great start! ${currentStats.totalRuns} run${currentStats.totalRuns > 1 ? 's' : ''} logged this week`
      });
      if (currentStats.avgPace) {
        insights.push({
          type: 'neutral',
          icon: '\u{23F1}\u{FE0F}',
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
    clearHistory,
    loading
  };
}
