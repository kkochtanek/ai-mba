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

  // Known influencer style profiles — detailed aesthetic briefs
  const STYLE_PROFILES: Record<string, string> = {
    "apriljoy_ful": `April Joy (@apriljoy_ful) is a lifestyle creator with 966K followers renovating her 2004 home in San Marcos, CA. Her signature aesthetic:
- Warm European farmhouse meets collected elegance
- Palette: creamy ivories, warm greiges, biscuit tones, soft taupes, warm whites — never cool or gray
- Plaster-finish walls with subtle texture, often in warm bone or clay tones
- Arched doorways, arched cabinet insets, arched niches — architectural arches are her signature
- Statement range hoods: large, plaster-finished or custom wood hoods that anchor the kitchen
- Cabinetry: inset shaker or flat-panel in creamy white or warm greige, often two-toned
- Hardware: unlacquered brass, antique brass, or brushed gold — never chrome or nickel
- Countertops: honed or leathered natural stone — Calacatta marble, quartzite, warm-veined stone
- Open shelving with curated ceramic, terracotta, and wooden objects
- Statement pendant lighting: rattan, aged brass, blown glass, or forged iron
- Flooring: wide-plank white oak, warm honey wood tones, or terracotta tile
- Layered textiles: linen, cotton, jute, natural fibers — never synthetic-looking
- Collected, lived-in feel — not sterile or overly staged
- Plants and greenery woven throughout, terracotta pots
- Overall mood: warm, elegant, deeply personal, quietly luxurious`,
    "studio mcgee": `Studio McGee (Shea McGee) signature aesthetic:
- Clean transitional style — classic bones with fresh, airy execution
- Palette: crisp whites, soft warm creams, greige, navy accents
- Statement lighting as focal points in every room
- Mix of textures: linen, velvet, jute, wood, marble
- Shaker cabinetry in white or soft greige, often floor-to-ceiling
- Quartz or marble countertops, waterfall islands
- Polished nickel or brushed gold hardware
- Layered rugs, throw pillows, curated styling
- Tall ceilings, large windows, natural light
- Elegant but approachable, family-friendly luxury`,
  };

  // If inspiration looks like a URL, try to fetch it
  let inspirationContext = inspiration;

  // Check known style profiles first
  const profileKey = Object.keys(STYLE_PROFILES).find((k) =>
    inspiration.toLowerCase().includes(k.toLowerCase())
  );
  if (profileKey) {
    inspirationContext = STYLE_PROFILES[profileKey];
  } else if (inspiration.startsWith("http")) {
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
      "prompt": "The exact same room — identical layout, same island/furniture positions, same window and door placement, same ceiling height and proportions — but every surface, material, and finish has been transformed: [write 3-4 rich sentences describing ONLY the new materials and finishes: specific countertop stone, cabinet paint color and style, hardware metal finish, flooring, lighting fixtures, textiles, decorative objects, wall color, and overall elegant atmosphere in the inspiration style] — photorealistic, professional interior photography, highly detailed, luxury renovation, same room architecture"
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
