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
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 90,
    },
  });

  const images = output as string[];
  if (!images || images.length === 0) {
    return NextResponse.json({ error: "No image generated" }, { status: 500 });
  }

  return NextResponse.json({ imageUrl: images[0] });
}
