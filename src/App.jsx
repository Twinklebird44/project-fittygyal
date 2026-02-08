import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import { useWorkoutPlans } from './hooks/useWorkoutPlans';
import { useWorkoutHistory } from './hooks/useWorkoutHistory';
import { useRunning } from './hooks/useRunning';
import { useRunPlan } from './hooks/useRunPlan';
import { useRunHistory } from './hooks/useRunHistory';
import { DAYS_OF_WEEK, defaultWorkouts } from './data/defaultWorkouts';
import { RUN_TYPES, SEGMENT_TYPES } from './data/defaultRunPlan';
import Icon from './components/Icons';
import './App.css';

function WaveBackground() {
  return (
    <div className="wave-bg">
      <svg className="wave wave-1" viewBox="0 0 3000 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,100 C250,80 500,120 750,100 S1250,80 1500,100 S2000,120 2250,100 S2750,80 3000,100 L3000,200 L0,200 Z" fill="var(--wave-color-1)" />
      </svg>
      <svg className="wave wave-2" viewBox="0 0 3000 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,110 C300,90 600,130 900,110 S1500,90 1800,110 S2400,130 2700,110 S2850,95 3000,105 L3000,200 L0,200 Z" fill="var(--wave-color-2)" />
      </svg>
      <svg className="wave wave-3" viewBox="0 0 3000 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,95 C200,115 500,85 750,105 S1250,120 1500,95 S2000,85 2250,105 S2750,115 3000,95 L3000,200 L0,200 Z" fill="var(--wave-color-3)" />
      </svg>
    </div>
  );
}

function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('gym');
  const [legalPage, setLegalPage] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fitty-dark-mode');
    return saved === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('fitty-dark-mode', darkMode);
  }, [darkMode]);

  if (legalPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setLegalPage(null)} />;
  }
  if (legalPage === 'terms') {
    return <TermsAndConditions onBack={() => setLegalPage(null)} />;
  }

  // If not logged in, show login page
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <WaveBackground />
      <header className="header">
        <div className="logo">
          <div className="logo-decoration left">
            <span className="star">✦</span>
            <span className="star small">✦</span>
          </div>
          <h1>FITTY</h1>
          <div className="logo-decoration right">
            <span className="star small">✦</span>
            <span className="star">✦</span>
          </div>
        </div>
        <div className="user-bar">
          <span className="user-greeting">
            Hey, {user.displayName || user.email?.split('@')[0]}!
          </span>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(prev => !prev)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
          </button>
          <button className="btn-logout" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="main-tabs">
        <button 
          className={`main-tab ${activeTab === 'gym' ? 'active' : ''}`}
          onClick={() => setActiveTab('gym')}
        >
          <span className="tab-icon"><Icon name="dumbbell" size={18} /></span>
          <span>Workouts</span>
        </button>
        <button 
          className={`main-tab ${activeTab === 'running' ? 'active' : ''}`}
          onClick={() => setActiveTab('running')}
        >
          <span className="tab-icon"><Icon name="running" size={18} /></span>
          <span>Running</span>
        </button>
      </div>

      {activeTab === 'gym' ? <GymSection /> : <RunningSection />}

      <div className="app-legal-footer">
        <button className="legal-link" onClick={() => setLegalPage('privacy')}>
          Privacy Policy
        </button>
        <span className="legal-separator">·</span>
        <button className="legal-link" onClick={() => setLegalPage('terms')}>
          Terms & Conditions
        </button>
      </div>
    </div>
  );
}

function GymSection() {
  const [subTab, setSubTab] = useState('plan');
  const plansHook = useWorkoutPlans();

  return (
    <>
      <div className="sub-tabs triple">
        <button 
          className={`sub-tab ${subTab === 'plan' ? 'active' : ''}`}
          onClick={() => setSubTab('plan')}
        >
          <Icon name="calendar" size={14} /> This Week
        </button>
        <button 
          className={`sub-tab ${subTab === 'plans' ? 'active' : ''}`}
          onClick={() => setSubTab('plans')}
        >
          <Icon name="folder" size={14} /> My Plans
        </button>
        <button 
          className={`sub-tab ${subTab === 'history' ? 'active' : ''}`}
          onClick={() => setSubTab('history')}
        >
          <Icon name="chart" size={14} /> History
        </button>
      </div>

      {subTab === 'plan' && <GymPlanSection plansHook={plansHook} />}
      {subTab === 'plans' && <GymPlansSection plansHook={plansHook} />}
      {subTab === 'history' && <GymHistorySection />}
    </>
  );
}

function GymPlanSection({ plansHook }) {
  const { activePlan, updateActivePlanWorkouts } = plansHook;
  const workouts = activePlan.workouts;
  
  const { submitWorkout, getThisWeekCompletedDays, deleteEntry, getWeekWorkouts } = useWorkoutHistory();
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [editingExercise, setEditingExercise] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [editingWorkoutName, setEditingWorkoutName] = useState(null);
  const [tempWorkoutName, setTempWorkoutName] = useState('');

  function getCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  // Helper functions to update workouts through plans system
  const updateExercise = (day, exerciseId, updates) => {
    const newWorkouts = {
      ...workouts,
      [day]: {
        ...workouts[day],
        exercises: workouts[day].exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, ...updates } : ex
        )
      }
    };
    updateActivePlanWorkouts(newWorkouts);
  };

  const addExercise = (day, exercise) => {
    const newId = Math.max(0, ...workouts[day].exercises.map(e => e.id)) + 1;
    const isFirstExercise = workouts[day].exercises.length === 0;
    const newWorkouts = {
      ...workouts,
      [day]: {
        ...workouts[day],
        name: isFirstExercise ? '' : workouts[day].name,
        exercises: [...workouts[day].exercises, { ...exercise, id: newId }]
      }
    };
    updateActivePlanWorkouts(newWorkouts);
  };

  const removeExercise = (day, exerciseId) => {
    const remainingExercises = workouts[day].exercises.filter(ex => ex.id !== exerciseId);
    const newWorkouts = {
      ...workouts,
      [day]: {
        ...workouts[day],
        name: remainingExercises.length === 0 ? 'Rest Day' : workouts[day].name,
        exercises: remainingExercises
      }
    };
    updateActivePlanWorkouts(newWorkouts);
  };

  const updateDayName = (day, name) => {
    const newWorkouts = {
      ...workouts,
      [day]: {
        ...workouts[day],
        name
      }
    };
    updateActivePlanWorkouts(newWorkouts);
  };

  const startEditingWorkoutName = () => {
    setEditingWorkoutName(selectedDay);
    setTempWorkoutName(currentDayData.name || '');
  };

  const saveWorkoutName = () => {
    if (editingWorkoutName) {
      updateDayName(editingWorkoutName, tempWorkoutName);
      setEditingWorkoutName(null);
      setTempWorkoutName('');
    }
  };

  const cancelEditingWorkoutName = () => {
    setEditingWorkoutName(null);
    setTempWorkoutName('');
  };

  const currentDayData = workouts[selectedDay];
  const completedDays = getThisWeekCompletedDays();
  const isCompletedToday = completedDays.includes(selectedDay);

  // Different color tones for each day
  const dayColors = {
    Sunday: 'var(--dot-sunday)',
    Monday: 'var(--dot-monday)',
    Tuesday: 'var(--dot-tuesday)',
    Wednesday: 'var(--dot-wednesday)',
    Thursday: 'var(--dot-thursday)',
    Friday: 'var(--dot-friday)',
    Saturday: 'var(--dot-saturday)',
  };

  const handleSubmitWorkout = () => {
    if (currentDayData.exercises.length === 0) return;
    submitWorkout(selectedDay, currentDayData);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  const handleUndoWorkoutLog = () => {
    const thisWeek = getWeekWorkouts(0);
    const todayEntry = thisWeek.find(entry => entry.dayOfWeek === selectedDay);
    if (todayEntry) {
      deleteEntry(todayEntry.id);
    }
  };

  return (
    <>
      <nav className="day-nav">
        {DAYS_OF_WEEK.map((day) => {
          const dayData = workouts[day];
          const hasExercises = dayData.exercises && dayData.exercises.length > 0;
          return (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? 'active' : ''} ${day === getCurrentDay() ? 'today' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="day-short">{day.slice(0, 3)}</span>
              {completedDays.includes(day) ? (
                <span className="completed-indicator">★</span>
              ) : hasExercises && (
                <span 
                  className="day-indicator workout-indicator"
                  style={{ background: dayColors[day] }}
                ></span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="main">
        <div className="day-header">
          <div className="day-header-top">
            <div className="day-title">
              <h2>{selectedDay}</h2>
              {currentDayData.exercises.length > 0 && !editingWorkoutName && (
                currentDayData.name && currentDayData.name !== 'Rest Day' ? (
                  <span 
                    className="workout-name-badge" 
                    style={{ background: dayColors[selectedDay] }}
                    onClick={startEditingWorkoutName}
                    title="Click to edit name"
                  >
                    {currentDayData.name}
                    <span className="badge-edit-icon">✎</span>
                  </span>
                ) : (
                  <span 
                    className="workout-name-badge-placeholder" 
                    onClick={startEditingWorkoutName}
                  >
                    + Add name
                  </span>
                )
              )}
            </div>
            {currentDayData.exercises.length > 0 && (
              <div className="day-stats">
                <div className="stat">
                  <span className="stat-value">{currentDayData.exercises.length}</span>
                  <span className="stat-label">Exercises</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {currentDayData.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
                  </span>
                  <span className="stat-label">Total Sets</span>
                </div>
              </div>
            )}
          </div>
          {editingWorkoutName === selectedDay && (
            <div className="workout-name-row">
              <input
                type="text"
                className="workout-name-input editing"
                value={tempWorkoutName}
                onChange={(e) => setTempWorkoutName(e.target.value)}
                placeholder="Workout name..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveWorkoutName();
                  if (e.key === 'Escape') cancelEditingWorkoutName();
                }}
              />
              <button className="btn btn-save-name" onClick={saveWorkoutName}>
                Save
              </button>
              <button className="btn btn-cancel-name" onClick={cancelEditingWorkoutName}>
                ✕
              </button>
            </div>
          )}
        </div>

        {currentDayData.exercises.length === 0 ? (
          <div className="empty-state">
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Add Workout
            </button>
          </div>
        ) : (
          <>
            <div className="exercises-grid">
              {currentDayData.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  isEditing={editingExercise === exercise.id}
                  onEdit={() => setEditingExercise(exercise.id)}
                  onSave={(updates) => {
                    updateExercise(selectedDay, exercise.id, updates);
                    setEditingExercise(null);
                  }}
                  onCancel={() => setEditingExercise(null)}
                  onDelete={() => removeExercise(selectedDay, exercise.id)}
                />
              ))}
            </div>

            <div className="submit-workout-section">
              {justSubmitted ? (
                <div className="submit-success">
                  <Icon name="sparkle" size={16} /> Workout logged! You're crushing it! <Icon name="dumbbell" size={16} />
                </div>
              ) : isCompletedToday ? (
                <button 
                  className="btn btn-undo-log"
                  onClick={handleUndoWorkoutLog}
                >
                  Undo Log
                </button>
              ) : (
                <button 
                  className="btn btn-submit-workout"
                  onClick={handleSubmitWorkout}
                >
                  <span>✓</span> Log Today's Workout
                </button>
              )}
            </div>
          </>
        )}

        {!showAddForm && currentDayData.exercises.length > 0 && (
          <button className="add-exercise-btn" onClick={() => setShowAddForm(true)}>
            <span>+</span> Add Exercise
          </button>
        )}

        {showAddForm && (
          <AddExerciseForm
            onAdd={(exercise) => {
              addExercise(selectedDay, exercise);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </main>

      <footer className="footer">
        <div className="current-plan-indicator">
          <span className="plan-label">Current Plan:</span>
          <span className="plan-name">{activePlan.name}</span>
        </div>
      </footer>
    </>
  );
}

function GymPlansSection({ plansHook }) {
  const { plans, activePlan, activePlanId, createPlan, switchPlan, renamePlan, deletePlan, duplicatePlan } = plansHook;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [copyFromCurrent, setCopyFromCurrent] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreatePlan = () => {
    if (!newPlanName.trim()) return;
    const newPlan = createPlan(newPlanName.trim(), copyFromCurrent);
    switchPlan(newPlan.id);
    setNewPlanName('');
    setShowCreateForm(false);
    setCopyFromCurrent(true);
  };

  const handleStartRename = (plan) => {
    setEditingPlanId(plan.id);
    setEditingName(plan.name);
  };

  const handleSaveRename = () => {
    if (editingName.trim()) {
      renamePlan(editingPlanId, editingName.trim());
    }
    setEditingPlanId(null);
    setEditingName('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <main className="main">
        <div className="plans-header">
          <h2>My Workout Plans</h2>
          <p className="plans-subtitle">Create and manage different training programs</p>
        </div>

        <div className="plans-list">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.id === activePlanId ? 'active' : ''}`}
              style={{ '--plan-accent': `var(--plan-color-${index % 8})`, '--plan-bg': `var(--plan-bg-${index % 8})` }}
            >
              <div className="plan-card-header">
                {editingPlanId === plan.id ? (
                  <div className="plan-name-edit-row">
                    <input
                      type="text"
                      className="plan-name-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename();
                        if (e.key === 'Escape') { setEditingPlanId(null); setEditingName(''); }
                      }}
                      autoFocus
                    />
                    <button className="btn btn-save-name" onClick={handleSaveRename}>
                      Save
                    </button>
                    <button className="btn btn-cancel-name" onClick={() => { setEditingPlanId(null); setEditingName(''); }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <h3 className="plan-name">{plan.name}</h3>
                )}
                {plan.id === activePlanId && (
                  <span className="active-badge">Active</span>
                )}
              </div>
              
              <div className="plan-meta">
                <span>Created {formatDate(plan.createdAt)}</span>
                <span>•</span>
                <span>{Object.values(plan.workouts).reduce((total, day) => total + day.exercises.length, 0)} exercises</span>
              </div>

              <div className="plan-preview">
                {DAYS_OF_WEEK.filter(day => plan.workouts[day].exercises.length > 0).map(day => (
                  <div key={day} className="plan-preview-day">
                    <span className="preview-day-name">{day.slice(0, 3)}</span>
                    <span className="preview-day-workout">{plan.workouts[day].name || 'Workout'}</span>
                  </div>
                ))}
              </div>

              <div className="plan-actions">
                {plan.id !== activePlanId && (
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => switchPlan(plan.id)}
                  >
                    Use This Plan
                  </button>
                )}
                <button 
                  className="btn btn-ghost btn-small"
                  onClick={() => handleStartRename(plan)}
                >
                  Rename
                </button>
                <button 
                  className="btn btn-ghost btn-small"
                  onClick={() => duplicatePlan(plan.id)}
                >
                  Duplicate
                </button>
                {plans.length > 1 && (
                  <button 
                    className="btn btn-ghost btn-small btn-danger"
                    onClick={() => deletePlan(plan.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!showCreateForm ? (
          <button 
            className="btn btn-primary create-plan-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <span>+</span> Create New Plan
          </button>
        ) : (
          <div className="create-plan-form">
            <h3>Create New Plan</h3>
            <div className="form-group">
              <label>Plan Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Strength Phase, Cut Program..."
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={copyFromCurrent}
                  onChange={(e) => setCopyFromCurrent(e.target.checked)}
                />
                <span>Copy exercises from current plan</span>
              </label>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleCreatePlan}
                disabled={!newPlanName.trim()}
              >
                Create Plan
              </button>
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlanName('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function GymHistorySection() {
  const { history, getWeekWorkouts, deleteEntry, clearHistory, compareWeeks, getVolumeHistory, calculateVolume } = useWorkoutHistory();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const weekWorkouts = getWeekWorkouts(weekOffset);
  const comparison = compareWeeks(weekOffset);
  const volumeHistory = getVolumeHistory(8);
  
  const getWeekLabel = (offset) => {
    if (offset === 0) return "This Week";
    if (offset === 1) return "Last Week";
    return `${offset} Weeks Ago`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Group workouts by day of week for comparison
  const groupedByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = history.filter(entry => entry.dayOfWeek === day).slice(0, 4);
    return acc;
  }, {});

  // Calculate max volume for graph scaling
  const maxVolume = Math.max(...volumeHistory.map(w => w.totalVolume), 1);

  return (
    <>
      <main className="main">
        <div className="history-header">
          <h2>Workout History</h2>
          <div className="history-stats">
            <div className="stat">
              <span className="stat-value">{history.length}</span>
              <span className="stat-label">Total Workouts</span>
            </div>
            {comparison.current.totalVolume > 0 && (
              <div className="stat">
                <span className="stat-value">{(comparison.current.totalVolume / 1000).toFixed(1)}k</span>
                <span className="stat-label">KG {getWeekLabel(weekOffset)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Insights Section */}
        {comparison.insights && comparison.insights.length > 0 && (
          <div className="weekly-insights">
            <div className="insights-header">
              <h3><Icon name="chart" size={18} /> Weekly Insights</h3>
              {comparison.previous.totalWorkouts > 0 && (
                <span className="insights-subtitle">vs. Last Week</span>
              )}
            </div>
            
            {/* Week Stats Comparison */}
            {comparison.previous.totalWorkouts > 0 && (
              <div className="week-stats-comparison">
                <div className="week-stat-card">
                  <div className="stat-comparison">
                    <span className="stat-current">{(comparison.current.totalVolume / 1000).toFixed(1)}k kg</span>
                    <span className={`stat-change ${comparison.volumeChange >= 0 ? 'positive' : 'negative'}`}>
                      {comparison.volumeChange >= 0 ? '+' : ''}{(comparison.volumeChange / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <span className="stat-label">Total Volume</span>
                </div>
                
                <div className="week-stat-card">
                  <div className="stat-comparison">
                    <span className="stat-current">{comparison.current.totalWorkouts} workouts</span>
                    <span className={`stat-change ${comparison.workoutsChange >= 0 ? 'positive' : 'negative'}`}>
                      {comparison.workoutsChange >= 0 ? '+' : ''}{comparison.workoutsChange}
                    </span>
                  </div>
                  <span className="stat-label">Sessions</span>
                </div>
                
                <div className="week-stat-card">
                  <div className="stat-comparison">
                    <span className="stat-current">{comparison.current.totalSets} sets</span>
                    <span className={`stat-change ${comparison.setsChange >= 0 ? 'positive' : 'negative'}`}>
                      {comparison.setsChange >= 0 ? '+' : ''}{comparison.setsChange}
                    </span>
                  </div>
                  <span className="stat-label">Total Sets</span>
                </div>
                
                {comparison.current.totalWorkouts > 0 && (
                  <div className="week-stat-card">
                    <div className="stat-comparison">
                      <span className="stat-current">{(comparison.current.avgVolumePerWorkout / 1000).toFixed(1)}k</span>
                    </div>
                    <span className="stat-label">Avg per Session</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Insight Cards */}
            <div className="insights-list">
              {comparison.insights.map((insight, idx) => (
                <div key={idx} className={`insight-card ${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-text">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Graph */}
        {history.length > 0 && (
          <div className="progress-graph-section">
            <h3><Icon name="trendUp" size={18} /> Volume Progress</h3>
            <p className="graph-subtitle">Weekly total volume (kg) over time</p>
            
            <div className="volume-graph">
              <div className="graph-container">
                {volumeHistory.map((week, idx) => {
                  const heightPercent = maxVolume > 0 ? (week.totalVolume / maxVolume) * 100 : 0;
                  const isCurrentWeek = week.weekOffset === 0;
                  
                  return (
                    <div key={idx} className="graph-bar-wrapper">
                      <div className="graph-bar-container">
                        <div 
                          className={`graph-bar ${isCurrentWeek ? 'current' : ''} ${week.totalVolume === 0 ? 'empty' : ''}`}
                          style={{ height: `${Math.max(heightPercent, 2)}%` }}
                        >
                          {week.totalVolume > 0 && (
                            <span className="bar-value">{(week.totalVolume / 1000).toFixed(1)}k</span>
                          )}
                        </div>
                      </div>
                      <span className="graph-label">{week.weekLabel}</span>
                      <span className="graph-workouts">{week.totalWorkouts}w</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="week-navigator">
          <button 
            className="btn btn-ghost"
            onClick={() => setWeekOffset(prev => prev + 1)}
          >
            ← Older
          </button>
          <span className="week-label">{getWeekLabel(weekOffset)}</span>
          <button 
            className="btn btn-ghost"
            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
            disabled={weekOffset === 0}
          >
            Newer →
          </button>
        </div>

        {weekWorkouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="chart" size={48} /></div>
            <h3>No Workouts Yet</h3>
            <p>Complete and submit workouts to see your history here!</p>
          </div>
        ) : (
          <div className="history-list">
            {weekWorkouts.map(entry => (
              <div 
                key={entry.id} 
                className={`history-entry ${selectedEntry === entry.id ? 'expanded' : ''}`}
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              >
                <div className="history-entry-header">
                  <div className="history-entry-info">
                    <span className="history-day">{entry.dayOfWeek}</span>
                    <span className="history-name">{entry.workoutName}</span>
                  </div>
                  <div className="history-entry-meta">
                    <span className="history-date">{formatDate(entry.date)}</span>
                    <span className="history-volume">{(calculateVolume(entry) / 1000).toFixed(1)}k kg</span>
                  </div>
                </div>
                
                {selectedEntry === entry.id && (
                  <div className="history-entry-details">
                    <div className="history-exercises">
                      {entry.exercises.map((ex, idx) => (
                        <div key={idx} className="history-exercise">
                          <span className="history-exercise-name">{ex.name}</span>
                          <span className="history-exercise-stats">
                            {ex.sets} × {ex.reps} @ {ex.weight}kg
                          </span>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="btn btn-ghost btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                        setSelectedEntry(null);
                      }}
                    >
                      Delete Entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Day-by-Day Comparison Section */}
        {history.length >= 1 && (
          <div className="progress-section">
            <h3>Progress by Day</h3>
            <p className="progress-subtitle">Compare your {DAYS_OF_WEEK.filter(d => groupedByDay[d].length > 0).join(', ')} workouts week over week!</p>
            
            <div className="progress-days">
              {DAYS_OF_WEEK.filter(day => groupedByDay[day].length > 0).map(day => {
                const dayEntries = groupedByDay[day];
                const latestEntry = dayEntries[0];
                const previousEntry = dayEntries[1];
                
                // Calculate totals
                const latestVolume = latestEntry.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
                const previousVolume = previousEntry ? previousEntry.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0) : 0;
                const volumeChange = previousEntry ? latestVolume - previousVolume : 0;
                const volumePercent = previousVolume > 0 ? ((volumeChange / previousVolume) * 100).toFixed(0) : 0;
                
                return (
                  <div key={day} className="progress-day-card workout-progress-card">
                    <div className="progress-day-header">
                      <h4>{day}</h4>
                      <span className="progress-workout-name">{latestEntry.workoutName}</span>
                    </div>
                    
                    <div className="progress-comparison">
                      <div className="progress-latest">
                        <span className="progress-date">
                          {new Date(latestEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="progress-volume">{(latestVolume / 1000).toFixed(1)}k kg</span>
                        {previousEntry && volumeChange !== 0 && (
                          <span className={`progress-change ${volumeChange > 0 ? 'positive' : 'negative'}`}>
                            {volumeChange > 0 ? '↑' : '↓'} {(Math.abs(volumeChange) / 1000).toFixed(1)}k ({volumeChange > 0 ? '+' : ''}{volumePercent}%)
                          </span>
                        )}
                      </div>
                      
                      {/* Exercise-by-exercise comparison */}
                      {previousEntry && (
                        <div className="exercise-comparisons">
                          {latestEntry.exercises.map((ex, idx) => {
                            const prevEx = previousEntry.exercises.find(p => p.name.toLowerCase() === ex.name.toLowerCase());
                            if (!prevEx) return null;
                            
                            const weightChange = ex.weight - prevEx.weight;
                            const repsChange = ex.reps - prevEx.reps;
                            const hasImprovement = weightChange > 0 || repsChange > 0;
                            const hasDecline = weightChange < 0 || repsChange < 0;
                            
                            if (!hasImprovement && !hasDecline) return null;
                            
                            return (
                              <div key={idx} className={`exercise-comparison ${hasImprovement ? 'improved' : 'declined'}`}>
                                <span className="ex-name">{ex.name}</span>
                                <span className="ex-changes">
                                  {weightChange !== 0 && (
                                    <span className={weightChange > 0 ? 'positive' : 'negative'}>
                                      {weightChange > 0 ? '+' : ''}{weightChange}kg
                                    </span>
                                  )}
                                  {repsChange !== 0 && (
                                    <span className={repsChange > 0 ? 'positive' : 'negative'}>
                                      {repsChange > 0 ? '+' : ''}{repsChange} reps
                                    </span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {dayEntries.length > 1 && (
                        <div className="progress-history-mini">
                          <span className="history-label">Previous {day}s:</span>
                          {dayEntries.slice(1, 4).map((entry) => (
                            <span key={entry.id} className="history-mini-entry">
                              {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {(entry.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0) / 1000).toFixed(1)}k kg
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        {history.length > 0 && (
          <button className="btn btn-ghost" onClick={clearHistory}>
            Clear All History
          </button>
        )}
      </footer>
    </>
  );
}

function RunningSection() {
  const [subTab, setSubTab] = useState('plan');

  return (
    <>
      <div className="sub-tabs">
        <button 
          className={`sub-tab ${subTab === 'plan' ? 'active' : ''}`}
          onClick={() => setSubTab('plan')}
        >
          <Icon name="calendar" size={14} /> Weekly Plan
        </button>
        <button 
          className={`sub-tab ${subTab === 'history' ? 'active' : ''}`}
          onClick={() => setSubTab('history')}
        >
          <Icon name="chart" size={14} /> History
        </button>
      </div>

      {subTab === 'plan' && <RunPlanSection />}
      {subTab === 'history' && <RunHistorySection />}
    </>
  );
}

function RunPlanSection() {
  const { runPlan, updateDay, updateSegments, resetToDefault } = useRunPlan();
  const { submitRun, getThisWeekCompletedDays, deleteEntry, getWeekRuns } = useRunHistory();
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [isEditing, setIsEditing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  function getCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  const handleDayChange = (day) => {
    if (isEditing || isLogging) {
      setShowSaveWarning(true);
      setTimeout(() => setShowSaveWarning(false), 3000);
      return;
    }
    setSelectedDay(day);
  };

  const currentDayData = runPlan[selectedDay];
  const runType = RUN_TYPES[currentDayData.type] || RUN_TYPES.easy;
  const completedDays = getThisWeekCompletedDays();
  const isCompletedToday = completedDays.includes(selectedDay);

  // Calculate weekly totals
  const weeklyDistance = Object.values(runPlan).reduce((sum, day) => day.type !== 'rest' ? sum + (day.distance || 0) : sum, 0);
  const runDays = Object.values(runPlan).filter(day => day.type !== 'rest').length;

  const handleUndoRunLog = () => {
    const thisWeek = getWeekRuns(0);
    const todayEntry = thisWeek.find(entry => entry.dayOfWeek === selectedDay);
    if (todayEntry) {
      deleteEntry(todayEntry.id);
    }
  };

  const handleSubmitRun = (logData) => {
    if (currentDayData.type === 'rest') return;
    submitRun(selectedDay, currentDayData, logData);
    setIsLogging(false);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  return (
    <>
      {showSaveWarning && (
        <div className="save-warning">
          <span className="warning-icon"><Icon name="warning" size={16} /></span>
          Please save or cancel your edits first
        </div>
      )}
      <nav className="day-nav">
        {DAYS_OF_WEEK.map((day) => {
          const dayData = runPlan[day];
          const dayType = RUN_TYPES[dayData.type] || RUN_TYPES.easy;
          return (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? 'active' : ''} ${day === getCurrentDay() ? 'today' : ''}`}
              onClick={() => handleDayChange(day)}
              style={{ '--day-color': `var(--run-${dayData.type || 'rest'})` }}
            >
              <span className="day-short">{day.slice(0, 3)}</span>
              <span className="day-full">{day}</span>
              {completedDays.includes(day) ? (
                <span className="completed-indicator">★</span>
              ) : dayData.type !== 'rest' && (
                <span className="day-indicator" style={{ background: `var(--run-${dayData.type || 'rest'})` }}></span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="main">
        <div className="day-header">
          <div className="day-title">
            <h2>{selectedDay}</h2>
            {currentDayData.type !== 'rest' && (
              <span className="run-type-badge" style={{ background: `var(--run-${currentDayData.type || 'rest'})` }}>
                {currentDayData.type === 'other' && currentDayData.customType ? currentDayData.customType : runType.label}
              </span>
            )}
          </div>
          {runDays > 0 && (
            <div className="day-stats">
              <div className="stat">
                <span className="stat-value">{weeklyDistance}</span>
                <span className="stat-label">Weekly KM</span>
              </div>
              <div className="stat">
                <span className="stat-value">{runDays}</span>
                <span className="stat-label">Run Days</span>
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <RunPlanEditor
            day={selectedDay}
            data={currentDayData}
            onSave={(updates) => {
              updateDay(selectedDay, updates);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : isLogging ? (
          <RunLogForm
            day={selectedDay}
            data={currentDayData}
            onSubmit={handleSubmitRun}
            onCancel={() => setIsLogging(false)}
          />
        ) : (
          <RunPlanDisplay
            day={selectedDay}
            data={currentDayData}
            onEdit={() => setIsEditing(true)}
            onRestDay={() => {
              updateDay(selectedDay, {
                name: "Rest Day",
                type: "rest",
                customType: "",
                effort: "None",
                distance: 0,
                notes: "",
                segments: []
              });
            }}
            onSubmit={() => setIsLogging(true)}
            onUndoLog={handleUndoRunLog}
            justSubmitted={justSubmitted}
            isCompletedToday={isCompletedToday}
          />
        )}
      </main>

    </>
  );
}

function RunPlanDisplay({ day, data, onEdit, onRestDay, onSubmit, onUndoLog, justSubmitted, isCompletedToday }) {
  const runType = RUN_TYPES[data.type] || RUN_TYPES.easy;

  if (data.type === 'rest') {
    return (
      <div className="empty-state">
        <button className="btn btn-primary" onClick={onEdit}>
          Add a Run
        </button>
      </div>
    );
  }

  return (
    <div className="run-plan-card">
      <div className="run-plan-header" onClick={onEdit}>
        <h3>{data.name}</h3>
        <span className="run-distance">{data.distance} km</span>
      </div>

      <div className="run-effort" onClick={onEdit}>
        <span className="effort-label">Effort:</span>
        <span className="effort-value">{data.effort}</span>
      </div>

      {data.notes && (
        <p className="run-notes-text" onClick={onEdit}>{data.notes}</p>
      )}

      {data.segments && data.segments.length > 0 && (
        <div className="run-segments" onClick={onEdit}>
          <h4>Workout Structure</h4>
          <div className="segments-list">
            {data.segments.map((segment, index) => {
              const segType = SEGMENT_TYPES[segment.type] || SEGMENT_TYPES.steady;
              return (
                <div key={index} className="segment-item">
                  <span 
                    className="segment-type-dot" 
                    style={{ background: segType.color }}
                  ></span>
                  <span className="segment-distance">{segment.distance}</span>
                  <span className="segment-type-label" style={{ color: segType.color }}>
                    {segType.label}
                  </span>
                  {segment.description && (
                    <span className="segment-description">{segment.description}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="submit-run-section">
        {justSubmitted ? (
          <div className="submit-success">
            <Icon name="sparkle" size={16} /> Run logged! You're on fire! <Icon name="fire" size={16} />
          </div>
        ) : isCompletedToday ? (
          <button 
            className="btn btn-undo-log"
            onClick={onUndoLog}
          >
            Undo Log
          </button>
        ) : (
          <button 
            className="btn btn-submit-workout"
            onClick={onSubmit}
          >
            <span>✓</span> Log This Run
          </button>
        )}
      </div>

      <div className="run-plan-actions">
        <button className="btn btn-ghost" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-ghost btn-danger" onClick={onRestDay}>
          Delete Run
        </button>
      </div>
    </div>
  );
}

function RunLogForm({ day, data, onSubmit, onCancel }) {
  const [logData, setLogData] = useState({
    actualDistance: data.distance,
    duration: '',
    pace: '',
    avgHeartRate: '',
    feeling: 'good',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(logData);
  };

  // Calculate pace from duration and distance
  const calculatePace = () => {
    if (logData.duration && logData.actualDistance > 0) {
      const [mins, secs] = logData.duration.split(':').map(Number);
      if (!isNaN(mins)) {
        const totalMins = mins + (secs || 0) / 60;
        const pace = totalMins / logData.actualDistance;
        const paceMin = Math.floor(pace);
        const paceSec = Math.round((pace - paceMin) * 60);
        return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
      }
    }
    return '';
  };

  useEffect(() => {
    const calculatedPace = calculatePace();
    if (calculatedPace && !logData.pace) {
      setLogData(prev => ({ ...prev, pace: calculatedPace }));
    }
  }, [logData.duration, logData.actualDistance]);

  const runType = RUN_TYPES[data.type] || RUN_TYPES.easy;

  return (
    <div className="run-log-form">
      <div className="run-log-header">
        <h3>Log Your Run</h3>
        <span className="run-type-badge" style={{ background: `var(--run-${data.type || 'rest'})` }}>
          {data.name}
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              step="0.1"
              value={logData.actualDistance}
              onChange={(e) => setLogData(prev => ({ ...prev, actualDistance: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="form-group">
            <label>Duration (mm:ss)</label>
            <input
              type="text"
              placeholder="25:30"
              value={logData.duration}
              onChange={(e) => setLogData(prev => ({ ...prev, duration: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pace (min/km)</label>
            <input
              type="text"
              placeholder="5:30"
              value={logData.pace}
              onChange={(e) => setLogData(prev => ({ ...prev, pace: e.target.value }))}
            />
            <span className="form-hint">Auto-calculated from time & distance</span>
          </div>
          <div className="form-group">
            <label>Avg Heart Rate (bpm)</label>
            <input
              type="number"
              placeholder="145"
              value={logData.avgHeartRate}
              onChange={(e) => setLogData(prev => ({ ...prev, avgHeartRate: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>How did it feel?</label>
          <div className="feeling-options">
            {[
              { value: 'great', label: 'Great', desc: 'Crushed it!' },
              { value: 'good', label: 'Good', desc: 'Solid effort' },
              { value: 'tough', label: 'Tough', desc: 'Pushed through' },
              { value: 'struggled', label: 'Struggled', desc: 'Hard day' }
            ].map(option => (
              <button
                key={option.value}
                type="button"
                className={`feeling-btn ${logData.feeling === option.value ? 'active' : ''}`}
                onClick={() => setLogData(prev => ({ ...prev, feeling: option.value }))}
              >
                <span className="feeling-emoji">{option.label.split(' ')[0]}</span>
                <span className="feeling-label">{option.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            placeholder="How was the run? Any observations..."
            value={logData.notes}
            onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Run
          </button>
        </div>
      </form>
    </div>
  );
}

function RunPlanEditor({ day, data, onSave, onCancel }) {
  const isFromRest = data.type === 'rest';
  const [formData, setFormData] = useState({
    name: isFromRest ? '' : data.name,
    type: isFromRest ? 'easy' : data.type,
    customType: data.customType || '',
    effort: isFromRest ? '' : data.effort,
    distance: isFromRest ? 0 : data.distance,
    notes: isFromRest ? '' : data.notes,
    segments: isFromRest ? [] : (data.segments || []),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addSegment = () => {
    setFormData(prev => ({
      ...prev,
      segments: [...prev.segments, { distance: '', type: 'steady', description: '' }]
    }));
  };

  const updateSegment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.map((seg, i) => 
        i === index ? { ...seg, [field]: value } : seg
      )
    }));
  };

  const removeSegment = (index) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index)
    }));
  };

  return (
    <form className="add-form run-plan-form" onSubmit={handleSubmit}>
      <h3>Edit {day}'s Run</h3>
      
      <div className="run-form-grid">
        <div className="edit-field">
          <label>Run Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Easy Run, Intervals..."
          />
        </div>
        <div className="edit-field">
          <label>Run Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, customType: '' })}
          >
            {Object.entries(RUN_TYPES).filter(([key]) => key !== 'rest').map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        {formData.type === 'other' && (
          <div className="edit-field">
            <label>Custom Run Type</label>
            <input
              type="text"
              value={formData.customType || ''}
              onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
              placeholder="e.g., Trail, Treadmill..."
            />
          </div>
        )}
        <div className="edit-field">
          <label>Total Distance (km)</label>
          <input
            type="number"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
            step="0.5"
            min="0"
          />
        </div>
        <div className="edit-field full-width">
          <label>Effort Level</label>
          <input
            type="text"
            value={formData.effort}
            onChange={(e) => setFormData({ ...formData, effort: e.target.value })}
            placeholder="e.g., Low - Conversational pace"
          />
        </div>
        <div className="edit-field full-width">
          <label>Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="segments-editor">
        <div className="segments-editor-header">
          <h4><Icon name="segments" size={16} /> Workout Segments</h4>
          <button type="button" className="btn btn-small btn-ghost" onClick={addSegment}>
            + Add Segment
          </button>
        </div>

        {formData.segments.length > 0 ? (
          <div className="segments-edit-list">
            {formData.segments.map((segment, index) => (
              <div key={index} className="segment-edit-row">
                <input
                  type="text"
                  value={segment.distance}
                  onChange={(e) => updateSegment(index, 'distance', e.target.value)}
                  placeholder="Distance (e.g., 400m, 1km)"
                  className="segment-input"
                />
                <select
                  value={segment.type}
                  onChange={(e) => updateSegment(index, 'type', e.target.value)}
                  className="segment-select"
                >
                  {Object.entries(SEGMENT_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={segment.description}
                  onChange={(e) => updateSegment(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="segment-input description"
                />
                <button 
                  type="button" 
                  className="split-remove" 
                  onClick={() => removeSegment(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="segments-empty">
            No segments added. Add segments for interval or structured workouts.
          </p>
        )}
      </div>

      <div className="edit-actions">
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function RunLogSection() {
  const { runs, addRun, updateRun, deleteRun, clearAllRuns } = useRunning();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRun, setEditingRun] = useState(null);

  // Calculate totals
  const totalDistance = runs.reduce((sum, run) => sum + (parseFloat(run.distance) || 0), 0);
  const totalRuns = runs.length;
  const avgPace = runs.length > 0 
    ? runs.reduce((sum, run) => sum + (parseFloat(run.pace) || 0), 0) / runs.length 
    : 0;

  return (
    <>
      <main className="main">
        <div className="day-header">
          <div className="day-title">
            <h2>Run Log</h2>
            <span className="subtitle">Track your completed runs</span>
          </div>
          <div className="day-stats">
            <div className="stat">
              <span className="stat-value">{totalRuns}</span>
              <span className="stat-label">Total Runs</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalDistance.toFixed(1)}</span>
              <span className="stat-label">Total KM</span>
            </div>
            <div className="stat">
              <span className="stat-value">{avgPace.toFixed(1)}</span>
              <span className="stat-label">Avg Pace</span>
            </div>
          </div>
        </div>

        {!showAddForm && (
          <button className="add-run-btn" onClick={() => setShowAddForm(true)}>
            <Icon name="plus" size={14} /> Log Your Run
          </button>
        )}

        {showAddForm && (
          <AddRunForm
            onAdd={(run) => {
              addRun(run);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {runs.length === 0 && !showAddForm ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="running" size={48} /></div>
            <h3>Ready to Run?</h3>
            <p>Log your runs here and watch your progress grow!</p>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Log Your First Run
            </button>
          </div>
        ) : (
          <div className="runs-list">
            {runs.map((run, index) => (
              <RunCard
                key={run.id}
                run={run}
                index={index}
                isEditing={editingRun === run.id}
                onEdit={() => setEditingRun(run.id)}
                onSave={(updates) => {
                  updateRun(run.id, updates);
                  setEditingRun(null);
                }}
                onCancel={() => setEditingRun(null)}
                onDelete={() => deleteRun(run.id)}
              />
            ))}
          </div>
        )}
      </main>

      {runs.length > 0 && (
        <footer className="footer">
          <button className="btn btn-ghost" onClick={clearAllRuns}>
            Clear All Runs
          </button>
        </footer>
      )}
    </>
  );
}

function RunHistorySection() {
  const { history, getWeekRuns, deleteEntry, clearHistory, compareWeeks } = useRunHistory();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const weekRuns = getWeekRuns(weekOffset);
  const comparison = compareWeeks(weekOffset);
  
  const getWeekLabel = (offset) => {
    if (offset === 0) return "This Week";
    if (offset === 1) return "Last Week";
    return `${offset} Weeks Ago`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Group runs by day of week for comparison
  const groupedByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = history.filter(entry => entry.dayOfWeek === day).slice(0, 4);
    return acc;
  }, {});

  return (
    <>
      <main className="main">
        <div className="history-header">
          <h2>Run History</h2>
          <div className="history-stats">
            <div className="stat">
              <span className="stat-value">{history.length}</span>
              <span className="stat-label">Total Runs</span>
            </div>
            <div className="stat">
              <span className="stat-value">{comparison.current.totalDistance.toFixed(1)}</span>
              <span className="stat-label">KM {getWeekLabel(weekOffset)}</span>
            </div>
          </div>
        </div>

        {/* Weekly Insights Section */}
        {comparison.insights && comparison.insights.length > 0 && (
          <div className="weekly-insights">
            <div className="insights-header">
              <h3><Icon name="chart" size={18} /> Weekly Insights</h3>
              {comparison.previous.totalRuns > 0 && (
                <span className="insights-subtitle">vs. Last Week</span>
              )}
            </div>
            
            {/* Week Stats Comparison */}
            {comparison.previous.totalRuns > 0 && (
              <div className="week-stats-comparison">
                <div className="week-stat-card">
                  <div className="stat-comparison">
                    <span className="stat-current">{comparison.current.totalDistance.toFixed(1)} km</span>
                    <span className={`stat-change ${comparison.distanceChange >= 0 ? 'positive' : 'negative'}`}>
                      {comparison.distanceChange >= 0 ? '+' : ''}{comparison.distanceChange.toFixed(1)}
                    </span>
                  </div>
                  <span className="stat-label">Total Distance</span>
                </div>
                
                <div className="week-stat-card">
                  <div className="stat-comparison">
                    <span className="stat-current">{comparison.current.totalRuns} runs</span>
                    <span className={`stat-change ${comparison.runsChange >= 0 ? 'positive' : 'negative'}`}>
                      {comparison.runsChange >= 0 ? '+' : ''}{comparison.runsChange}
                    </span>
                  </div>
                  <span className="stat-label">Runs Completed</span>
                </div>
                
                {comparison.current.avgPace && (
                  <div className="week-stat-card">
                    <div className="stat-comparison">
                      <span className="stat-current">{comparison.current.avgPace}/km</span>
                      {comparison.paceChange !== null && (
                        <span className={`stat-change ${comparison.paceChange > 0 ? 'positive' : comparison.paceChange < 0 ? 'negative' : ''}`}>
                          {comparison.paceChange > 0 ? `${Math.round(comparison.paceChange * 60)}s faster` : 
                           comparison.paceChange < 0 ? `${Math.round(Math.abs(comparison.paceChange) * 60)}s slower` : 'same'}
                        </span>
                      )}
                    </div>
                    <span className="stat-label">Avg Pace</span>
                  </div>
                )}
                
                {comparison.current.avgHeartRate && (
                  <div className="week-stat-card">
                    <div className="stat-comparison">
                      <span className="stat-current">{comparison.current.avgHeartRate} bpm</span>
                      {comparison.hrChange !== null && (
                        <span className={`stat-change ${comparison.hrChange < 0 ? 'positive' : comparison.hrChange > 0 ? 'negative' : ''}`}>
                          {comparison.hrChange !== 0 ? `${comparison.hrChange > 0 ? '+' : ''}${comparison.hrChange}` : 'same'}
                        </span>
                      )}
                    </div>
                    <span className="stat-label">Avg Heart Rate</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Insight Cards */}
            <div className="insights-list">
              {comparison.insights.map((insight, idx) => (
                <div key={idx} className={`insight-card ${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-text">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="week-navigator">
          <button 
            className="btn btn-ghost"
            onClick={() => setWeekOffset(prev => prev + 1)}
          >
            ← Older
          </button>
          <span className="week-label">{getWeekLabel(weekOffset)}</span>
          <button 
            className="btn btn-ghost"
            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
            disabled={weekOffset === 0}
          >
            Newer →
          </button>
        </div>

        {weekRuns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="running" size={48} /></div>
            <h3>No Runs Yet</h3>
            <p>Complete runs from your weekly plan to see your history here!</p>
          </div>
        ) : (
          <div className="history-list">
            {weekRuns.map(entry => (
              <div 
                key={entry.id} 
                className={`history-entry ${selectedEntry === entry.id ? 'expanded' : ''}`}
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              >
                <div className="history-entry-header">
                  <div className="history-entry-info">
                    <span className="history-day">{entry.dayOfWeek}</span>
                    <span className="history-name">{entry.runName}</span>
                  </div>
                  <div className="history-entry-meta">
                    <span className="history-date">{formatDate(entry.date)}</span>
                    <span className="history-distance">{entry.actualDistance} km</span>
                  </div>
                </div>
                
                {selectedEntry === entry.id && (
                  <div className="history-entry-details">
                    <div className="run-details-grid">
                      {entry.duration && (
                        <div className="run-detail">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">{entry.duration}</span>
                        </div>
                      )}
                      {entry.pace && (
                        <div className="run-detail">
                          <span className="detail-label">Pace</span>
                          <span className="detail-value">{entry.pace} /km</span>
                        </div>
                      )}
                      {entry.avgHeartRate && (
                        <div className="run-detail">
                          <span className="detail-label">Avg HR</span>
                          <span className="detail-value">{entry.avgHeartRate} bpm</span>
                        </div>
                      )}
                      <div className="run-detail">
                        <span className="detail-label">Feeling</span>
                        <span className="detail-value feeling-value">
                          {entry.feeling === 'great' && 'Great'}
                          {entry.feeling === 'good' && 'Good'}
                          {entry.feeling === 'tough' && 'Tough'}
                          {entry.feeling === 'struggled' && 'Struggled'}
                        </span>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="run-history-notes">{entry.notes}</p>
                    )}
                    <button 
                      className="btn btn-ghost btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                        setSelectedEntry(null);
                      }}
                    >
                      Delete Entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progress Comparison Section */}
        {history.length >= 1 && (
          <div className="progress-section">
            <h3>Run Progress by Day</h3>
            <p className="progress-subtitle">Compare your runs week over week - same day comparisons!</p>
            
            <div className="progress-days">
              {DAYS_OF_WEEK.filter(day => groupedByDay[day].length > 0).map(day => {
                const dayEntries = groupedByDay[day];
                const latestEntry = dayEntries[0];
                const previousEntry = dayEntries[1];
                
                // Helper to parse pace string to minutes
                const parsePace = (pace) => {
                  if (!pace) return null;
                  const [min, sec] = pace.split(':').map(Number);
                  return min + (sec || 0) / 60;
                };
                
                // Calculate changes
                const latestPace = parsePace(latestEntry.pace);
                const previousPace = previousEntry ? parsePace(previousEntry.pace) : null;
                const paceChange = latestPace && previousPace ? previousPace - latestPace : null; // Negative is faster (better)
                
                const latestHR = parseInt(latestEntry.avgHeartRate) || null;
                const previousHR = previousEntry ? parseInt(previousEntry.avgHeartRate) : null;
                const hrChange = latestHR && previousHR ? latestHR - previousHR : null;
                
                return (
                  <div key={day} className="progress-day-card run-progress-card">
                    <div className="progress-day-header">
                      <h4>{day}</h4>
                      <span className="progress-run-name">{latestEntry.runName}</span>
                    </div>
                    
                    <div className="progress-metrics">
                      {/* Latest Run Stats */}
                      <div className="metrics-row latest-metrics">
                        <span className="metrics-date">
                          {new Date(latestEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="metrics-values">
                          <span className="metric">
                            <span className="metric-value">{latestEntry.actualDistance}</span>
                            <span className="metric-unit">km</span>
                          </span>
                          {latestEntry.duration && (
                            <span className="metric">
                              <span className="metric-value">{latestEntry.duration}</span>
                              <span className="metric-unit">time</span>
                            </span>
                          )}
                          {latestEntry.pace && (
                            <span className="metric">
                              <span className="metric-value">{latestEntry.pace}</span>
                              <span className="metric-unit">/km</span>
                            </span>
                          )}
                          {latestEntry.avgHeartRate && (
                            <span className="metric">
                              <span className="metric-value">{latestEntry.avgHeartRate}</span>
                              <span className="metric-unit">bpm</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Comparison with previous */}
                      {previousEntry && (
                        <div className="metrics-comparison">
                          <span className="comparison-label">vs {new Date(previousEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <div className="comparison-changes">
                            {paceChange !== null && paceChange !== 0 && (
                              <span className={`change-badge ${paceChange > 0 ? 'positive' : 'negative'}`}>
                                <Icon name={paceChange > 0 ? 'bolt' : 'turtle'} size={12} /> {Math.abs(paceChange * 60).toFixed(0)}s {paceChange > 0 ? 'faster' : 'slower'}
                              </span>
                            )}
                            {hrChange !== null && hrChange !== 0 && (
                              <span className={`change-badge ${hrChange < 0 ? 'positive' : 'neutral'}`}>
                                <Icon name="heart" size={12} /> {hrChange > 0 ? '+' : ''}{hrChange} bpm
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Previous runs mini history */}
                      {dayEntries.length > 1 && (
                        <div className="previous-runs">
                          <span className="previous-label">Previous {day}s:</span>
                          {dayEntries.slice(1, 4).map((entry) => (
                            <div key={entry.id} className="previous-run-entry">
                              <span className="prev-date">
                                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="prev-stats">
                                {entry.actualDistance}km
                                {entry.pace && ` • ${entry.pace}/km`}
                                {entry.avgHeartRate && ` • ${entry.avgHeartRate}bpm`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        {history.length > 0 && (
          <button className="btn btn-ghost" onClick={clearHistory}>
            Clear All History
          </button>
        )}
      </footer>
    </>
  );
}

function SplitsEditor({ splits, onChange }) {
  const addSplit = () => {
    const newSplit = {
      km: splits.length + 1,
      time: '',
      pace: '',
      heartRate: '',
    };
    onChange([...splits, newSplit]);
  };

  const updateSplit = (index, field, value) => {
    const newSplits = splits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    );
    onChange(newSplits);
  };

  const removeSplit = (index) => {
    const newSplits = splits.filter((_, i) => i !== index)
      .map((split, i) => ({ ...split, km: i + 1 }));
    onChange(newSplits);
  };

  return (
    <div className="splits-editor">
      <div className="splits-header">
        <h4><Icon name="chart" size={16} /> Kilometer Splits</h4>
        <button type="button" className="btn btn-small btn-ghost" onClick={addSplit}>
          + Add Split
        </button>
      </div>
      
      {splits.length > 0 && (
        <div className="splits-list">
          <div className="splits-table-header">
            <span>KM</span>
            <span>Time</span>
            <span>Pace</span>
            <span>HR</span>
            <span></span>
          </div>
          {splits.map((split, index) => (
            <div key={index} className="split-row">
              <span className="split-km">{split.km}</span>
              <input
                type="text"
                value={split.time}
                onChange={(e) => updateSplit(index, 'time', e.target.value)}
                placeholder="5:30"
                className="split-input"
              />
              <input
                type="text"
                value={split.pace}
                onChange={(e) => updateSplit(index, 'pace', e.target.value)}
                placeholder="5:30"
                className="split-input"
              />
              <input
                type="number"
                value={split.heartRate}
                onChange={(e) => updateSplit(index, 'heartRate', e.target.value)}
                placeholder="150"
                className="split-input"
              />
              <button 
                type="button" 
                className="split-remove" 
                onClick={() => removeSplit(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {splits.length === 0 && (
        <p className="splits-empty">No splits added. Click "Add Split" to track each kilometer.</p>
      )}
    </div>
  );
}

function SplitsDisplay({ splits }) {
  if (!splits || splits.length === 0) return null;

  return (
    <div className="splits-display">
      <h4 className="splits-title"><Icon name="chart" size={16} /> Splits</h4>
      <div className="splits-grid">
        {splits.map((split, index) => (
          <div key={index} className="split-card">
            <span className="split-card-km">KM {split.km}</span>
            <div className="split-card-stats">
              {split.time && (
                <span className="split-stat">
                  <span className="split-stat-value">{split.time}</span>
                  <span className="split-stat-label">time</span>
                </span>
              )}
              {split.pace && (
                <span className="split-stat">
                  <span className="split-stat-value">{split.pace}</span>
                  <span className="split-stat-label">/km</span>
                </span>
              )}
              {split.heartRate && (
                <span className="split-stat hr">
                  <span className="split-stat-value"><Icon name="heart" size={12} /> {split.heartRate}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RunCard({ run, index, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    ...run,
    splits: run.splits || [],
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleSave = () => {
    onSave({
      date: formData.date,
      distance: parseFloat(formData.distance) || 0,
      duration: formData.duration,
      pace: parseFloat(formData.pace) || 0,
      avgHeartRate: parseInt(formData.avgHeartRate) || 0,
      maxHeartRate: parseInt(formData.maxHeartRate) || 0,
      calories: parseInt(formData.calories) || 0,
      notes: formData.notes || '',
      splits: formData.splits || [],
    });
  };

  if (isEditing) {
    return (
      <div className="run-card editing" style={{ '--delay': `${index * 0.05}s` }}>
        <div className="run-form-grid">
          <div className="edit-field">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="edit-field">
            <label>Distance (km)</label>
            <input
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              step="0.1"
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Duration (mm:ss)</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="25:30"
            />
          </div>
          <div className="edit-field">
            <label>Pace (min/km)</label>
            <input
              type="number"
              value={formData.pace}
              onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
              step="0.1"
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Avg Heart Rate</label>
            <input
              type="number"
              value={formData.avgHeartRate}
              onChange={(e) => setFormData({ ...formData, avgHeartRate: e.target.value })}
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Max Heart Rate</label>
            <input
              type="number"
              value={formData.maxHeartRate}
              onChange={(e) => setFormData({ ...formData, maxHeartRate: e.target.value })}
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              min="0"
            />
          </div>
          <div className="edit-field full-width">
            <label>Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="How did it feel?"
            />
          </div>
        </div>
        
        <SplitsEditor 
          splits={formData.splits} 
          onChange={(splits) => setFormData({ ...formData, splits })}
        />
        
        <div className="edit-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="run-card" style={{ '--delay': `${index * 0.05}s` }} onClick={onEdit}>
      <div className="run-date">{formatDate(run.date)}</div>
      <div className="run-main-stats">
        <div className="run-stat primary">
          <span className="run-stat-value">{run.distance}</span>
          <span className="run-stat-label">km</span>
        </div>
        <div className="run-stat">
          <span className="run-stat-value">{run.duration || '--:--'}</span>
          <span className="run-stat-label">time</span>
        </div>
        <div className="run-stat">
          <span className="run-stat-value">{run.pace || '-'}</span>
          <span className="run-stat-label">min/km</span>
        </div>
      </div>
      <div className="run-secondary-stats">
        {run.avgHeartRate > 0 && (
          <div className="run-mini-stat">
            <span className="heart-icon"><Icon name="heart" size={14} /></span>
            <span>{run.avgHeartRate} avg</span>
            {run.maxHeartRate > 0 && <span className="max-hr">/ {run.maxHeartRate} max</span>}
          </div>
        )}
        {run.calories > 0 && (
          <div className="run-mini-stat">
            <span className="fire-icon"><Icon name="fire" size={14} /></span>
            <span>{run.calories} cal</span>
          </div>
        )}
      </div>
      
      <SplitsDisplay splits={run.splits} />
      
      {run.notes && <div className="run-notes">{run.notes}</div>}
      <div className="run-edit-hint">Click to edit</div>
    </div>
  );
}

function AddRunForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    pace: '',
    avgHeartRate: '',
    maxHeartRate: '',
    calories: '',
    notes: '',
    splits: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.distance) return;
    onAdd({
      date: formData.date,
      distance: parseFloat(formData.distance) || 0,
      duration: formData.duration,
      pace: parseFloat(formData.pace) || 0,
      avgHeartRate: parseInt(formData.avgHeartRate) || 0,
      maxHeartRate: parseInt(formData.maxHeartRate) || 0,
      calories: parseInt(formData.calories) || 0,
      notes: formData.notes,
      splits: formData.splits,
    });
  };

  // Auto-calculate pace when distance and duration change
  const calculatePace = () => {
    if (formData.distance && formData.duration) {
      const [mins, secs] = formData.duration.split(':').map(Number);
      if (!isNaN(mins) && !isNaN(secs)) {
        const totalMins = mins + secs / 60;
        const pace = totalMins / parseFloat(formData.distance);
        setFormData(prev => ({ ...prev, pace: pace.toFixed(2) }));
      }
    }
  };

  return (
    <form className="add-form run-form" onSubmit={handleSubmit}>
      <h3><Icon name="running" size={20} /> Log Your Run</h3>
      <div className="run-form-grid">
        <div className="edit-field">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="edit-field">
          <label>Distance (km) *</label>
          <input
            type="number"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            onBlur={calculatePace}
            step="0.1"
            min="0"
            placeholder="5.0"
            autoFocus
          />
        </div>
        <div className="edit-field">
          <label>Duration (mm:ss)</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            onBlur={calculatePace}
            placeholder="25:30"
          />
        </div>
        <div className="edit-field">
          <label>Pace (min/km)</label>
          <input
            type="number"
            value={formData.pace}
            onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
            step="0.1"
            min="0"
            placeholder="5.1"
          />
        </div>
        <div className="edit-field">
          <label>Avg Heart Rate (bpm)</label>
          <input
            type="number"
            value={formData.avgHeartRate}
            onChange={(e) => setFormData({ ...formData, avgHeartRate: e.target.value })}
            min="0"
            placeholder="145"
          />
        </div>
        <div className="edit-field">
          <label>Max Heart Rate (bpm)</label>
          <input
            type="number"
            value={formData.maxHeartRate}
            onChange={(e) => setFormData({ ...formData, maxHeartRate: e.target.value })}
            min="0"
            placeholder="172"
          />
        </div>
        <div className="edit-field">
          <label>Calories Burned</label>
          <input
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            min="0"
            placeholder="350"
          />
        </div>
        <div className="edit-field full-width">
          <label>Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="How did it feel? Weather? Route?"
          />
        </div>
      </div>
      
      <SplitsEditor 
        splits={formData.splits} 
        onChange={(splits) => setFormData({ ...formData, splits })}
      />
      
      <div className="edit-actions">
        <button type="submit" className="btn btn-primary">Log Run</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ExerciseCard({ exercise, index, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState(exercise);

  // Sync formData when exercise prop changes (e.g., when switching days)
  useEffect(() => {
    setFormData(exercise);
  }, [exercise]);

  const handleSave = () => {
    onSave({
      name: formData.name,
      sets: parseInt(formData.sets) || 0,
      reps: parseInt(formData.reps) || 0,
      weight: parseFloat(formData.weight) || 0,
    });
  };

  if (isEditing) {
    return (
      <div className="exercise-card editing" style={{ '--delay': `${index * 0.05}s` }}>
        <input
          type="text"
          className="edit-input edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Exercise name"
          autoFocus
        />
        <div className="edit-fields">
          <div className="edit-field">
            <label>Sets</label>
            <input
              type="number"
              value={formData.sets}
              onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Reps</label>
            <input
              type="number"
              value={formData.reps}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
              min="0"
            />
          </div>
          <div className="edit-field">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              min="0"
              step="2.5"
            />
          </div>
        </div>
        <div className="edit-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-card" style={{ '--delay': `${index * 0.05}s` }} onClick={onEdit}>
      <div className="exercise-number">{String(index + 1).padStart(2, '0')}</div>
      <h3 className="exercise-name">{exercise.name}</h3>
      <div className="exercise-details">
        <div className="detail">
          <span className="detail-value">{exercise.sets}</span>
          <span className="detail-label">sets</span>
        </div>
        <div className="detail-divider">×</div>
        <div className="detail">
          <span className="detail-value">{exercise.reps}</span>
          <span className="detail-label">reps</span>
        </div>
        {exercise.weight > 0 && (
          <>
            <div className="detail-divider">@</div>
            <div className="detail">
              <span className="detail-value">{exercise.weight}</span>
              <span className="detail-label">kg</span>
            </div>
          </>
        )}
      </div>
      <div className="exercise-edit-hint">Click to edit</div>
    </div>
  );
}

function AddExerciseForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAdd({
      name: formData.name.trim(),
      sets: parseInt(formData.sets) || 0,
      reps: parseInt(formData.reps) || 0,
      weight: parseFloat(formData.weight) || 0,
    });
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3><Icon name="dumbbell" size={20} /> Add New Exercise</h3>
      <input
        type="text"
        className="edit-input edit-name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Exercise name"
        autoFocus
      />
      <div className="edit-fields">
        <div className="edit-field">
          <label>Sets</label>
          <input
            type="number"
            value={formData.sets}
            onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
            min="0"
          />
        </div>
        <div className="edit-field">
          <label>Reps</label>
          <input
            type="number"
            value={formData.reps}
            onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
            min="0"
          />
        </div>
        <div className="edit-field">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            min="0"
            step="2.5"
          />
        </div>
      </div>
      <div className="edit-actions">
        <button type="submit" className="btn btn-primary">Add Exercise</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default App;
