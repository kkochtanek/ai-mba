import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchUrlText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 3000);
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const inspiration = (formData.get("inspiration") as string) || "";
  const budget = (formData.get("budget") as string) || "mid-range";
  const scope = (formData.get("scope") as string) || "full renovation";
  const files = formData.getAll("rooms") as File[];

  if (!inspiration) return NextResponse.json({ error: "No inspiration provided" }, { status: 400 });
  if (files.length === 0) return NextResponse.json({ error: "No room photos provided" }, { status: 400 });

  // If inspiration looks like a URL, try to fetch it
  let inspirationContext = inspiration;
  if (inspiration.startsWith("http")) {
    const fetched = await fetchUrlText(inspiration);
    if (fetched) inspirationContext = `URL: ${inspiration}\n\nPage content: ${fetched}`;
  }

  const roomImageBlocks = await Promise.all(
    files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mediaType = (file.type || "image/jpeg") as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
      return { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: base64 } };
    })
  );

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          ...roomImageBlocks,
          {
            type: "text",
            text: `You are a world-class interior designer specializing in high-end renovations.

STYLE INSPIRATION: ${inspirationContext}

I have uploaded ${files.length} photo(s) of rooms I want to completely transform. For each room, write a very detailed, specific image generation prompt that dramatically reimagines the space in the exact style of the inspiration. Be bold — this is a ${scope} with a ${budget} budget. Do NOT be conservative. Fully replace materials, finishes, fixtures, furniture, and atmosphere.

Describe the transformation in rich sensory detail: specific materials (e.g. "honed Calacatta marble", "cerused white oak", "unlacquered brass"), exact color tones, ceiling treatments, lighting fixtures, textiles, and the overall mood. The prompt should paint a vivid picture of a dramatically different, elegantly transformed room.

Reply with ONLY valid JSON — no markdown:
{
  "styleDNA": {
    "style": "one short phrase",
    "palette": "color description",
    "elements": ["element1", "element2", "element3", "element4"],
    "vibe": "one sentence"
  },
  "summary": "2-3 sentences describing the inspiration style and how it will dramatically transform these rooms, written to the user using 'you'",
  "rooms": [
    {
      "roomType": "detected room type",
      "currentState": "one sentence describing current state",
      "prompt": "Transform this room dramatically: [write 3-4 rich sentences describing the fully renovated space — specific stone, wood, metal finishes, cabinetry style, lighting, textiles, color palette, architectural details like arches/molding/beams, and overall elegant atmosphere] — photorealistic, professional interior photography, highly detailed, luxury renovation"
    }
  ]
}

Return exactly ${files.length} room object(s) in the array, one per uploaded photo in order.`,
          },
        ],
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  // Extract JSON by finding outermost { } — works regardless of markdown wrapping
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const jsonStr = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw;

  try {
    return NextResponse.json(JSON.parse(jsonStr));
  } catch {
    return NextResponse.json({ error: `Parse error: ${raw.slice(0, 200)}` }, { status: 500 });
  }
}
