export type CircuitType = "Permanente" | "Callejero";

export type CircuitSessionType =
  | "Race"
  | "Qualifying"
  | "Sprint"
  | "Sprint Shootout"
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

export type CircuitWeekendSession = {
  id: string;
  sessionKey: number;
  meetingKey: number;
  year: number;
  sessionType:
    | "Race"
    | "Qualifying"
    | "Sprint"
    | "Sprint Shootout"
    | "FP1"
    | "FP2"
    | "FP3";
  sessionName: string;
  date: string;
  headline: string;
  status?: "Completed" | "Latest" | "Archived";
  isAvailable?: boolean;
};

export type CircuitWeekend = {
  id: string; // String(meeting_key)
  meetingKey: number;
  year: number;
  meetingName: string;
  officialName?: string;
  location: string;
  country: string;
  circuitShortName?: string;
  dateStart?: string;
  dateEnd?: string;
  sessions: CircuitWeekendSession[];
};

export type CircuitListItem = {
  id: string;
  name: string;
  country: string;
  location: string;
  type?: CircuitType;
  layoutLabel?: string;
  layoutImage?: string;
  lastMeetingName?: string;
  year?: number;
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
  recentWeekends?: CircuitWeekend[];
};