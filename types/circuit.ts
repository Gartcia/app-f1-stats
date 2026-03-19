export type CircuitType = "Permanente" | "Callejero";

export type CircuitSessionType =
  | "Race"
  | "Qualifying"
  | "Sprint"
  | "FP1"
  | "FP2"
  | "FP3";

export type CircuitRecentSession = {
  year: number;
  sessionType: CircuitSessionType;
  date: string;
  headline: string;
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