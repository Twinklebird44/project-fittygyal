export const defaultWorkouts = {
  Monday: {
    name: "Lower Body Strength",
    exercises: [
      { id: 1, name: "Deadlift", sets: 4, reps: 6, weight: 60 },
      { id: 2, name: "Back Squat", sets: 4, reps: 6, weight: 60 },
      { id: 3, name: "Reverse Lunges", sets: 3, reps: 8, weight: 20 },
      { id: 4, name: "Leg Curls", sets: 3, reps: 12, weight: 10 },
      { id: 5, name: "Calf Raises", sets: 4, reps: 15, weight: 0 },
    ]
  },
  Tuesday: {
    name: "Upper Body",
    exercises: [
      { id: 1, name: "Chest Press", sets: 4, reps: 8, weight: 40 },
      { id: 2, name: "Lat Pulldowns", sets: 4, reps: 10, weight: 25 },
      { id: 3, name: "Rows", sets: 3, reps: 10, weight: 25 },
      { id: 4, name: "Shoulder Press", sets: 3, reps: 8, weight: 20 },
      { id: 5, name: "Dips", sets: 3, reps: 10, weight: 25 },
    ]
  },
  Wednesday: {
    name: "Legs & Core",
    exercises: [
      { id: 1, name: "Bulgarian Split Squats", sets: 3, reps: 10, weight: 10 },
      { id: 2, name: "Leg Press", sets: 3, reps: 12, weight: 80 },
      { id: 3, name: "Leg Extension", sets: 3, reps: 15, weight: 20 },
      { id: 4, name: "Leg Curls", sets: 3, reps: 12, weight: 20 },
      { id: 5, name: "Hanging Knee Raises", sets: 3, reps: 15, weight: 0 },
      { id: 6, name: "Pallof Press", sets: 2, reps: 12, weight: 0 },
    ]
  },
  Thursday: {
    name: "Upper Body",
    exercises: [
      { id: 1, name: "Chest Press", sets: 3, reps: 12, weight: 35 },
      { id: 2, name: "Chin Ups", sets: 3, reps: 8, weight: 20 },
      { id: 3, name: "Rows", sets: 3, reps: 12, weight: 30 },
      { id: 4, name: "Shoulder Press", sets: 3, reps: 12, weight: 15 },
      { id: 5, name: "Face Pulls", sets: 3, reps: 15, weight: 10 },
      { id: 6, name: "Lat Raises", sets: 3, reps: 15, weight: 5 },
    ]
  },
  Friday: {
    name: "Rest Day",
    exercises: []
  },
  Saturday: {
    name: "Rest Day",
    exercises: []
  },
  Sunday: {
    name: "Rest Day",
    exercises: []
  }
};

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
