export const defaultRunPlan = {
  Monday: {
    name: "Easy Run",
    type: "easy",
    effort: "Low - Conversational pace",
    distance: 6,
    notes: "Recovery run to start the week",
    segments: []
  },
  Tuesday: {
    name: "Interval Training",
    type: "intervals",
    effort: "High - 5km pace or faster",
    distance: 5.5,
    notes: "Focus on speed work",
    segments: [
      { distance: "1.5km", type: "warmup", description: "Easy warmup jog" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "200m", type: "recovery", description: "Walk/jog recovery" },
      { distance: "400m", type: "fast", description: "Fast pace" },
      { distance: "600m", type: "cooldown", description: "Easy cool down jog" },
    ]
  },
  Wednesday: {
    name: "Tempo Run",
    type: "tempo",
    effort: "Comfortable Hard Pace",
    distance: 6,
    notes: "",
    segments: [
      { distance: "1 km", type: "warmup", description: "" },
      { distance: "4 km", type: "fast", description: "" },
      { distance: "1 km", type: "cooldown", description: "" },
    ]
  },
  Thursday: {
    name: "Easiest Run",
    type: "easy",
    effort: "Low - Conversational Pace",
    distance: 5,
    notes: "",
    segments: []
  },
  Friday: {
    name: "Easy Run",
    type: "easy",
    effort: "Low - Conversational Pace",
    distance: 6,
    notes: "Add 0.5-1 km every 1-2 weeks",
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
