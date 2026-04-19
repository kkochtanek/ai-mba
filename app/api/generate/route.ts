import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  const { prompt, image, seed } = await req.json();
  if (!prompt || !image) {
    return NextResponse.json({ error: "Missing prompt or image" }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-dev",
      input: {
        prompt,
        image,
        prompt_strength: 0.75,
        num_inference_steps: 28,
        guidance: 3.5,
        seed: seed ?? Math.floor(Math.random() * 99999),
      },
    });
    return NextResponse.json({ predictionId: prediction.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Replicate error: ${msg}` }, { status: 500 });
  }
}
