import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  const { prompt, image, seed } = await req.json();
  if (!prompt || !image) return NextResponse.json({ error: "Missing prompt or image" }, { status: 400 });

  const prediction = await replicate.predictions.create({
    model: "stability-ai/stable-diffusion-img2img",
    input: {
      image,
      prompt: `${prompt}, photorealistic, professional interior photography, high quality`,
      negative_prompt: "ugly, blurry, low quality, deformed, cartoon, sketch",
      strength: 0.6,
      guidance_scale: 7.5,
      num_inference_steps: 30,
      seed: seed ?? Math.floor(Math.random() * 99999),
    },
  });

  return NextResponse.json({ predictionId: prediction.id });
}
