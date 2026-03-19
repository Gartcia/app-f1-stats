export type CircuitType = "Permanente" | "Callejero";

export type CircuitSessionType =
  | "Race"
  | "Qualifying"
  | "Sprint"
  | "FP1"
  | "FP2"
  | "FP3";

export type CircuitSessionResult = {
  position: number;
  driver: string;
  team: string;
  laps?: number;
  gap?: string;
  status?: string;
};

export type CircuitSessionQuickStats = {
  winner?: string;
  pole?: string;
  fastestLap?: string;
  topSpeed?: string;
};

export type CircuitRecentSession = {
  id: string;
  year: number;
  sessionType: CircuitSessionType;
  date: string;
  headline: string;
  status?: "Completed" | "Latest" | "Archived";
  quickStats?: CircuitSessionQuickStats;
  results?: CircuitSessionResult[];
};

export type Circuit = {
  id: string;
  name: string;
  country: string;
  location: string;
  lengthKm: string;
  laps: number;
  type: CircuitType;
  firstGp: number;
  lapRecord: string;
  layoutLabel: string;
  layoutImage?: string;
  recentSessions?: CircuitRecentSession[];
};