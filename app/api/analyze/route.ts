import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const JSON_SCHEMA = (roomType: string, budget: string, vibe: string) => `
Reply with ONLY a valid JSON object — no markdown, no explanation:
{
  "styleDNA": {
    "style": "one short phrase for the overall style",
    "palette": "color palette description",
    "elements": ["key element 1", "key element 2", "key element 3", "key element 4"],
    "vibe": "one sentence emotional description"
  },
  "summary": "2-3 sentences describing what the person loves about spaces, written directly to them using 'you'",
  "prompts": [
    "detailed photorealistic interior design prompt 1 for a ${roomType}, professional photography, high detail, ${budget} budget feel, ${vibe} vibe",
    "detailed photorealistic interior design prompt 2 for a ${roomType}, professional photography, high detail, ${budget} budget feel, ${vibe} vibe",
    "detailed photorealistic interior design prompt 3 for a ${roomType}, professional photography, high detail, ${budget} budget feel, ${vibe} vibe"
  ]
}`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const mode = (formData.get("mode") as string) || "upload";
  const roomType = (formData.get("roomType") as string) || "living room";
  const budget = (formData.get("budget") as string) || "mid-range";
  const vibe = (formData.get("vibe") as string) || "modern";
  const schema = JSON_SCHEMA(roomType, budget, vibe);

  let userContent: Anthropic.MessageParam["content"];

  if (mode === "upload") {
    const files = formData.getAll("images") as File[];
    if (files.length === 0) return NextResponse.json({ error: "No images provided" }, { status: 400 });

    const imageBlocks = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mediaType = (file.type || "image/jpeg") as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
        return { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: base64 } };
      })
    );

    userContent = [
      ...imageBlocks,
      {
        type: "text",
        text: `You are an expert interior designer. I uploaded ${files.length} photo(s) of homes/rooms I love. Analyze them to identify my design preferences, then write 3 distinct image generation prompts for my dream ${roomType} with a ${budget} budget feel and a ${vibe} vibe.\n\n${schema}`,
      },
    ];
  } else if (mode === "describe") {
    const description = formData.get("description") as string;
    if (!description) return NextResponse.json({ error: "No description provided" }, { status: 400 });

    userContent = `You are an expert interior designer. A user described their dream home style: "${description}". Based on this, identify their design preferences and write 3 distinct image generation prompts for a ${roomType} with a ${budget} budget feel and a ${vibe} vibe.\n\n${schema}`;
  } else {
    // social
    const handle = formData.get("handle") as string;
    if (!handle) return NextResponse.json({ error: "No handle provided" }, { status: 400 });

    userContent = `You are an expert interior designer. Using your knowledge of the designer, influencer, or brand "${handle}", characterize their interior design aesthetic in detail. Then write 3 distinct image generation prompts for a ${roomType} in their signature style, with a ${budget} budget feel and a ${vibe} vibe.\n\n${schema}`;
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: `Failed to parse response: ${text.slice(0, 200)}` }, { status: 500 });
  }
}
