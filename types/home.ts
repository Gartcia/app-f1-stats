export type SessionType =
  | "race"
  | "qualifying"
  | "fp1"
  | "fp2"
  | "fp3";

export type SessionSummary = {
  grandPrixName: string;
  circuitName: string;
  location: string;
  date: string;
  sessionType: string;
  weatherSummary: string;
};

export type QuickStat = {
  label: string;
  value: string;
};

export type DriverResult = {
  position: number;
  driverName: string;
  teamName: string;
  startPosition: number;
  deltaPositions: number;
  lapsCompleted: number;
  pitStops: number;
  tyres: string;
  topSpeed: string;
  status: string;
};

export type HomeLatestResponse = {
  summary: SessionSummary;
  quickStats: QuickStat[];
  results: DriverResult[];
};