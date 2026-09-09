import { NextResponse } from "next/server";
import { getCarousel } from "@/lib/carousels";
import { exportCarouselVideo, VideoExportError } from "@/lib/export-video";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carousel = await getCarousel(id);

  if (!carousel) {
    return NextResponse.json({ error: "Carousel not found" }, { status: 404 });
  }

  try {
    const mp4 = await exportCarouselVideo(carousel);
    const safeName = carousel.name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 64);

    return new Response(new Uint8Array(mp4), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(mp4.byteLength),
        "Content-Disposition": `attachment; filename="carousel-${safeName}.mp4"`,
      },
    });
  } catch (error) {
    if (error instanceof VideoExportError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Video export error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Video export failed: ${message}` },
      { status: 500 }
    );
  }
}
