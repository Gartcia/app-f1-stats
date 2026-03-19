import { getLatestCompletedMeeting, getSessionsByMeetingKey } from "@/lib/api/openf1";
import { circuitVisuals } from "@/lib/data/circuit-visuals";
import type { CircuitListItem } from "@/types/circuit";

type OpenF1MeetingLite = Awaited<ReturnType<typeof getLatestCompletedMeeting>>;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resolveCircuitVisual(meeting: OpenF1MeetingLite) {
  const values = [
    meeting.meeting_name,
    meeting.location,
    meeting.country_name,
    meeting.circuit_short_name,
  ].map(normalizeText);

  return (
    circuitVisuals.find((visual) =>
      visual.aliases.some((alias) =>
        values.some((value) => value.includes(normalizeText(alias)))
      )
    ) ?? null
  );
}

export async function getCircuitsListData(): Promise<CircuitListItem[]> {
  const latestMeeting = await getLatestCompletedMeeting();
  const visual = resolveCircuitVisual(latestMeeting);

  const single: CircuitListItem = {
    id: visual?.id ?? normalizeText(latestMeeting.circuit_short_name).replace(/\s+/g, "-"),
    name: visual?.name ?? latestMeeting.circuit_short_name,
    country: latestMeeting.country_name,
    location: latestMeeting.location,
    type: visual?.type,
    layoutLabel: visual?.layoutLabel,
    layoutImage: visual?.layoutImage,
    lastMeetingName: latestMeeting.meeting_name,
    year: latestMeeting.year,
  };

  return [single];
}