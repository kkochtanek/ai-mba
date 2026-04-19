import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface StyleDNA {
  style: string;
  palette: string;
  elements: string[];
  vibe: string;
}

interface AnalyzeResponse {
  styleDNA: StyleDNA;
  summary: string;
  prompts: string[];
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];
  const roomType = (formData.get("roomType") as string) || "living room";
  const budget = (formData.get("budget") as string) || "mid-range";
  const vibe = (formData.get("vibe") as string) || "modern";

  if (files.length === 0) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  const imageBlocks = await Promise.all(
    files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mediaType = (file.type || "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      return {
        type: "image" as const,
        source: { type: "base64" as const, media_type: mediaType, data: base64 },
      };
    })
  );

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          ...imageBlocks,
          {
            type: "text",
            text: `You are an expert interior designer and architect. I uploaded ${files.length} photo(s) of homes and rooms I love.

Analyze them to identify my design preferences. Then write 3 distinct image generation prompts for a ${roomType} with a ${budget} budget feel and a ${vibe} vibe, staying true to my detected style.

Reply with ONLY a valid JSON object — no markdown fences, no explanation:
{
  "styleDNA": {
    "style": "one short phrase for the overall style",
    "palette": "color palette description",
    "elements": ["key element 1", "key element 2", "key element 3", "key element 4"],
    "vibe": "one sentence emotional description"
  },
  "summary": "2-3 sentences describing what I love about spaces, written directly to me using 'you'",
  "prompts": [
    "detailed photorealistic interior design prompt 1 for a ${roomType}, professional photography, high detail",
    "detailed photorealistic interior design prompt 2 for a ${roomType}, professional photography, high detail",
    "detailed photorealistic interior design prompt 3 for a ${roomType}, professional photography, high detail"
  ]
}`,
          },
        ],
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const data = JSON.parse(text) as AnalyzeResponse;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: `Failed to parse style analysis: ${text.slice(0, 200)}` },
      { status: 500 }
    );
  }
}
