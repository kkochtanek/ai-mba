import { NextRequest, NextResponse } from "next/server";

// Site is inactive — short-circuited before any Replicate API spend.
// Remove this handler and restore the block below to re-enable.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ error: "This feature is temporarily disabled." }, { status: 503 });
}

/*
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  try {
    const prediction = await replicate.predictions.get(id);

    if (prediction.status === "succeeded") {
      const out = prediction.output;
      const imageUrl = Array.isArray(out) ? String(out[0]) : String(out);
      return NextResponse.json({ status: "succeeded", imageUrl });
    }

    if (prediction.status === "failed" || prediction.status === "canceled") {
      return NextResponse.json({
        status: "failed",
        error: String(prediction.error ?? "Generation failed"),
      });
    }

    return NextResponse.json({ status: prediction.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "failed", error: msg }, { status: 500 });
  }
}
*/
