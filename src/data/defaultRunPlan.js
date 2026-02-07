const restDay = {
  name: "Rest Day",
  type: "rest",
  effort: "None",
  distance: 0,
  notes: "",
  segments: []
};

export const defaultRunPlan = {
  Monday: { ...restDay },
  Tuesday: { ...restDay },
  Wednesday: { ...restDay },
  Thursday: { ...restDay },
  Friday: { ...restDay },
  Saturday: { ...restDay },
  Sunday: { ...restDay },
};

export const RUN_TYPES = {
  other: { label: "Custom Name", color: "#C4836E" },
  easy: { label: "Easy", color: "#FFB347" },
  intervals: { label: "Intervals", color: "#FF6B35" },
  tempo: { label: "Tempo", color: "#F7567C" },
  long: { label: "Long Run", color: "#CC3F6E" },
  fartlek: { label: "Fartlek", color: "#E88D67" },
  hill: { label: "Hill", color: "#D4654A" },
  progression: { label: "Progression", color: "#B8547A" },
  sprint: { label: "Sprint", color: "#FF4757" },
  short: { label: "Short Run", color: "#F5A673" },
  trail: { label: "Trail", color: "#A8774B" },
  treadmill: { label: "Treadmill", color: "#D98E73" },
  warmup: { label: "Warm Up", color: "#FFD5A8" },
  cooldown: { label: "Cool Down", color: "#E6B09A" },
  threshold: { label: "Threshold", color: "#C94C60" },
  recovery: { label: "Recovery", color: "#FFCAB0" },
  race: { label: "Race", color: "#99294E" },
  rest: { label: "Rest", color: "#D4A5A5" },
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
