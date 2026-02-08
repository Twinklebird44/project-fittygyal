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
  other: { label: "Custom Name", color: "#99AECC" },
  easy: { label: "Easy", color: "#6DD9A0" },
  intervals: { label: "Intervals", color: "#F0A050" },
  tempo: { label: "Tempo", color: "#E8955A" },
  long: { label: "Long Run", color: "#58BDD4" },
  fartlek: { label: "Fartlek", color: "#E0B85A" },
  hill: { label: "Hill", color: "#C4A06A" },
  progression: { label: "Progression", color: "#6AA0E0" },
  sprint: { label: "Sprint", color: "#F06060" },
  short: { label: "Short Run", color: "#82DCA0" },
  trail: { label: "Trail", color: "#8ABB5A" },
  treadmill: { label: "Treadmill", color: "#A0B0C8" },
  warmup: { label: "Warm Up", color: "#F0CC60" },
  cooldown: { label: "Cool Down", color: "#6CC0D8" },
  threshold: { label: "Threshold", color: "#E87850" },
  recovery: { label: "Recovery", color: "#A0DDBA" },
  race: { label: "Race", color: "#B870E0" },
  rest: { label: "Rest", color: "#B0B8C8" },
};

export const SEGMENT_TYPES = {
  warmup: { label: "Warm Up", color: "#F0CC60" },
  cooldown: { label: "Cool Down", color: "#6CC0D8" },
  fast: { label: "Fast", color: "#F0A050" },
  recovery: { label: "Recovery", color: "#A0DDBA" },
  tempo: { label: "Tempo", color: "#E8955A" },
  steady: { label: "Steady", color: "#58BDD4" },
  sprint: { label: "Sprint", color: "#B870E0" },
};
