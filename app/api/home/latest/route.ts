import { NextRequest, NextResponse } from "next/server";
import { getHomeLatestData } from "@/lib/mappers/home-latest.mapper";
import { SessionNotAvailableError } from "@/lib/api/openf1";
import type { SessionType } from "@/types/home";

const ALLOWED_TYPES: SessionType[] = [
  "race",
  "qualifying",
  "fp1",
  "fp2",
  "fp3",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get("type") ?? "race";

    if (!ALLOWED_TYPES.includes(typeParam as SessionType)) {
      return NextResponse.json(
        {
          error: "Invalid type parameter. Use race, qualifying, fp1, fp2 or fp3.",
        },
        { status: 400 }
      );
    }

    const data = await getHomeLatestData(typeParam as SessionType);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof SessionNotAvailableError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SESSION_NOT_AVAILABLE",
        },
        { status: 404 }
      );
    }

    console.error("GET /api/home/latest error", error);

    return NextResponse.json(
      {
        error: "No se pudo obtener la data de OpenF1",
      },
      { status: 500 }
    );
  }
}