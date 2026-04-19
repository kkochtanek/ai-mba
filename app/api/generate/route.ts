import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// instruct-pix2pix: edits an existing image based on a text instruction
// preserves the room's layout while applying the style
const MODEL_VERSION = "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60aa2067c3fefee6b493b2094";

export async function POST(req: NextRequest) {
  const { prompt, image, seed } = await req.json();
  if (!prompt || !image) {
    return NextResponse.json({ error: "Missing prompt or image" }, { status: 400 });
  }

  let prediction;
  try {
    prediction = await replicate.predictions.create({
      version: MODEL_VERSION.split(":")[1],
      input: {
        image,
        prompt,
        negative_prompt: "ugly, blurry, low quality, deformed, extra furniture, unrealistic, cartoon",
        num_inference_steps: 20,
        image_guidance_scale: 1.5,
        guidance_scale: 7,
        seed: seed ?? Math.floor(Math.random() * 99999),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Replicate error: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ predictionId: prediction.id });
}
