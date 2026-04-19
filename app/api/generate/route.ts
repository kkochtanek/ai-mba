import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "No prompt provided" }, { status: 400 });

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input: {
      prompt,
      num_outputs: 1,
      aspect_ratio: "4:3",
      output_format: "webp",
      output_quality: 90,
    },
  });

  const images = Array.isArray(output) ? output : [output];
  if (images.length === 0) {
    return NextResponse.json({ error: "No image generated" }, { status: 500 });
  }

  // Handle both plain string URLs and Replicate FileOutput objects
  const imageUrl = String(images[0]);
  return NextResponse.json({ imageUrl });
}
