export const defaultWorkouts = {
  Monday: {
    name: "Push Day",
    exercises: [
      { id: 1, name: "Bench Press", sets: 4, reps: 8, weight: 60 },
      { id: 2, name: "Overhead Press", sets: 4, reps: 8, weight: 40 },
      { id: 3, name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 22 },
      { id: 4, name: "Tricep Pushdowns", sets: 3, reps: 12, weight: 18 },
      { id: 5, name: "Lateral Raises", sets: 3, reps: 15, weight: 7 },
    ]
  },
  Tuesday: {
    name: "Pull Day",
    exercises: [
      { id: 1, name: "Deadlift", sets: 4, reps: 5, weight: 100 },
      { id: 2, name: "Barbell Rows", sets: 4, reps: 8, weight: 60 },
      { id: 3, name: "Lat Pulldowns", sets: 3, reps: 10, weight: 55 },
      { id: 4, name: "Face Pulls", sets: 3, reps: 15, weight: 14 },
      { id: 5, name: "Barbell Curls", sets: 3, reps: 12, weight: 22 },
    ]
  },
  Wednesday: {
    name: "Leg Day",
    exercises: [
      { id: 1, name: "Squats", sets: 4, reps: 6, weight: 85 },
      { id: 2, name: "Romanian Deadlift", sets: 4, reps: 8, weight: 60 },
      { id: 3, name: "Leg Press", sets: 3, reps: 12, weight: 120 },
      { id: 4, name: "Leg Curls", sets: 3, reps: 12, weight: 36 },
      { id: 5, name: "Calf Raises", sets: 4, reps: 15, weight: 45 },
    ]
  },
  Thursday: {
    name: "Rest Day",
    exercises: []
  },
  Friday: {
    name: "Upper Body",
    exercises: [
      { id: 1, name: "Incline Bench Press", sets: 4, reps: 8, weight: 52 },
      { id: 2, name: "Pull-ups", sets: 4, reps: 8, weight: 0 },
      { id: 3, name: "Dumbbell Shoulder Press", sets: 3, reps: 10, weight: 18 },
      { id: 4, name: "Cable Rows", sets: 3, reps: 12, weight: 45 },
      { id: 5, name: "Dips", sets: 3, reps: 10, weight: 0 },
    ]
  },
  Saturday: {
    name: "Lower Body",
    exercises: [
      { id: 1, name: "Front Squats", sets: 4, reps: 6, weight: 60 },
      { id: 2, name: "Hip Thrusts", sets: 4, reps: 10, weight: 85 },
      { id: 3, name: "Walking Lunges", sets: 3, reps: 12, weight: 18 },
      { id: 4, name: "Leg Extensions", sets: 3, reps: 15, weight: 32 },
      { id: 5, name: "Seated Calf Raises", sets: 4, reps: 15, weight: 40 },
    ]
  },
  Sunday: {
    name: "Rest Day",
    exercises: []
  }
};

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
