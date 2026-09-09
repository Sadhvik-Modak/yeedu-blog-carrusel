import { NextResponse } from "next/server";
import { getVideoProgress } from "@/lib/export-video";
import { isFfmpegAvailable } from "@/lib/ffmpeg-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    progress: getVideoProgress(id),
    ffmpegAvailable: isFfmpegAvailable(),
  });
}
