import { useState, useEffect } from 'react';
import { defaultWorkouts, DAYS_OF_WEEK } from '../data/defaultWorkouts';

const PLANS_STORAGE_KEY = 'fitty-gyal-workout-plans';
const ACTIVE_PLAN_KEY = 'fitty-gyal-active-plan';

// Empty workout template for creating blank plans
const createEmptyWorkouts = () => {
  const emptyWorkouts = {};
  DAYS_OF_WEEK.forEach(day => {
    emptyWorkouts[day] = {
      name: '',
      exercises: []
    };
  });
  return emptyWorkouts;
};

export function useWorkoutPlans() {
  // Initialize with default plan if no plans exist
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem(PLANS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Create initial default plan
    return [{
      id: 'default',
      name: 'Starter Plan',
      createdAt: new Date().toISOString(),
      workouts: defaultWorkouts
    }];
  });

  const [activePlanId, setActivePlanId] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_PLAN_KEY);
    return saved || 'default';
  });

  // Save plans to localStorage
  useEffect(() => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  // Save active plan ID to localStorage
  useEffect(() => {
    localStorage.setItem(ACTIVE_PLAN_KEY, activePlanId);
  }, [activePlanId]);

  // Get the current active plan
  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  // Create a new plan (copy from current or start blank)
  const createPlan = (name, copyFromCurrent = true) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      workouts: copyFromCurrent ? JSON.parse(JSON.stringify(activePlan.workouts)) : createEmptyWorkouts()
    };
    setPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  // Switch to a different plan
  const switchPlan = (planId) => {
    if (plans.some(p => p.id === planId)) {
      setActivePlanId(planId);
    }
  };

  // Update the current plan's workouts
  const updateActivePlanWorkouts = (newWorkouts) => {
    setPlans(prev => prev.map(plan => 
      plan.id === activePlanId 
        ? { ...plan, workouts: newWorkouts }
        : plan
    ));
  };

  // Rename a plan
  const renamePlan = (planId, newName) => {
    setPlans(prev => prev.map(plan =>
      plan.id === planId
        ? { ...plan, name: newName }
        : plan
    ));
  };

  // Delete a plan (can't delete if it's the only one)
  const deletePlan = (planId) => {
    if (plans.length <= 1) return false;
    
    setPlans(prev => prev.filter(p => p.id !== planId));
    
    // If deleting active plan, switch to another
    if (planId === activePlanId) {
      const remaining = plans.filter(p => p.id !== planId);
      setActivePlanId(remaining[0].id);
    }
    return true;
  };

  // Duplicate a plan
  const duplicatePlan = (planId, newName) => {
    const planToCopy = plans.find(p => p.id === planId);
    if (!planToCopy) return null;

    const newPlan = {
      id: `plan-${Date.now()}`,
      name: newName || `${planToCopy.name} (Copy)`,
      createdAt: new Date().toISOString(),
      workouts: JSON.parse(JSON.stringify(planToCopy.workouts))
    };
    setPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  return {
    plans,
    activePlan,
    activePlanId,
    createPlan,
    switchPlan,
    updateActivePlanWorkouts,
    renamePlan,
    deletePlan,
    duplicatePlan
  };
}
