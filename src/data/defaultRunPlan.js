export const defaultRunPlan = {
  Monday: {
    name: "Easy Run",
    type: "easy",
    effort: "Low - Conversational pace",
    distance: 5,
    notes: "Recovery run to start the week",
    segments: []
  },
  Tuesday: {
    name: "Interval Training",
    type: "intervals",
    effort: "High - 80-90% max effort on fast segments",
    distance: 6,
    notes: "Focus on speed work",
    segments: [
      { distance: "1 km", type: "warmup", description: "Easy warmup jog" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "1 km", type: "cooldown", description: "Easy cooldown jog" },
    ]
  },
  Wednesday: {
    name: "Rest Day",
    type: "rest",
    effort: "None",
    distance: 0,
    notes: "Active recovery - stretch or light walk",
    segments: []
  },
  Thursday: {
    name: "Tempo Run",
    type: "tempo",
    effort: "Medium-High - Comfortably hard",
    distance: 8,
    notes: "Sustained effort at threshold pace",
    segments: [
      { distance: "1 km", type: "warmup", description: "Easy warmup" },
      { distance: "5 km", type: "tempo", description: "Tempo pace - comfortably hard" },
      { distance: "1 km", type: "cooldown", description: "Easy cooldown" },
    ]
  },
  Friday: {
    name: "Easy Run",
    type: "easy",
    effort: "Low - Recovery pace",
    distance: 4,
    notes: "Short recovery run before weekend long run",
    segments: []
  },
  Saturday: {
    name: "Rest Day",
    type: "rest",
    effort: "None",
    distance: 0,
    notes: "Rest and recover",
    segments: []
  },
  Sunday: {
    name: "Rest Day",
    type: "rest",
    effort: "None",
    distance: 0,
    notes: "Full rest day",
    segments: []
  }
};

export const RUN_TYPES = {
  easy: { label: "Easy", color: "#FFB347" },
  intervals: { label: "Intervals", color: "#FF6B35" },
  tempo: { label: "Tempo", color: "#F7567C" },
  long: { label: "Long Run", color: "#CC3F6E" },
  rest: { label: "Rest", color: "#D4A5A5" },
  recovery: { label: "Recovery", color: "#FFCAB0" },
  race: { label: "Race", color: "#99294E" },
};

export const SEGMENT_TYPES = {
  warmup: { label: "Warm Up", color: "#FFB347" },
  cooldown: { label: "Cool Down", color: "#FFCAB0" },
  fast: { label: "Fast", color: "#F7567C" },
  recovery: { label: "Recovery", color: "#D4A5A5" },
  tempo: { label: "Tempo", color: "#FF6B35" },
  steady: { label: "Steady", color: "#CC3F6E" },
  sprint: { label: "Sprint", color: "#99294E" },
};
