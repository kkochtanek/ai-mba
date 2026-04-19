import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, seed } = await req.json();
  if (!prompt) return NextResponse.json({ error: "No prompt provided" }, { status: 400 });

  const encoded = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=768&model=flux&nologo=true&seed=${seed ?? Math.floor(Math.random() * 99999)}`;

  return NextResponse.json({ imageUrl });
}
