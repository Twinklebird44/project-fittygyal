import { useState, useEffect } from 'react';
import { defaultWorkouts, DAYS_OF_WEEK } from '../data/defaultWorkouts';
import { useFirestoreDoc } from './useFirestoreDoc';

// Empty workout template for creating blank plans
const createEmptyWorkouts = () => {
  const emptyWorkouts = {};
  DAYS_OF_WEEK.forEach(day => {
    emptyWorkouts[day] = {
      name: 'Rest Day',
      exercises: []
    };
  });
  return emptyWorkouts;
};

const defaultPlans = [{
  id: 'default',
  name: 'My Plan',
  createdAt: new Date().toISOString(),
  workouts: defaultWorkouts
}];

export function useWorkoutPlans() {
  const { data: plans, setData: setPlans, loading: plansLoading } = useFirestoreDoc('workoutPlans', defaultPlans);
  const { data: activePlanId, setData: setActivePlanId, loading: activeLoading } = useFirestoreDoc('activePlanId', 'default');

  const loading = plansLoading || activeLoading;

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
    duplicatePlan,
    loading
  };
}
