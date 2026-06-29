// Supabase Edge Function: AI car-damage analysis (Stage C of "Išsami analizė").
//
// Receives a few photo URLs + car context, asks Claude (vision) to assess
// visible damage, and returns a structured JSON report. The Anthropic key
// lives in Supabase secrets — it is NEVER exposed to the browser.
//
// Deploy:
//   supabase functions deploy analyze-damage
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Cost note: model is a single constant below. Opus 4.8 = $5/$25 per 1M tokens
// (best quality). To cut cost, switch MODEL to "claude-haiku-4-5" ($1/$5).

import Anthropic from "npm:@anthropic-ai/sdk@^0.69.0";

const MODEL = "claude-opus-4-8";
const MAX_IMAGES = 8; // bound cost: only the first N photos are analysed

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

// Structured damage report — Claude must fill this exact shape (strict tool use).
const damageTool = {
  name: "report_damage",
  description:
    "Pateik matomos automobilio žalos ataskaitą iš nuotraukų. Vertink tik tai, kas REALIAI matosi nuotraukose; nespėliok apie nematomas dalis. Remonto kainas vertink Lietuvos rinkai, eurais, konservatyviai.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      overall_condition: {
        type: "string",
        enum: ["excellent", "good", "fair", "poor"],
        description: "Bendra būklė pagal nuotraukas",
      },
      summary: {
        type: "string",
        description: "1–2 sakinių santrauka lietuvių kalba",
      },
      estimated_repair_eur: {
        type: "object",
        additionalProperties: false,
        properties: {
          min: { type: "integer" },
          max: { type: "integer" },
        },
        required: ["min", "max"],
        description: "Bendra numatoma remonto sąmata, € (intervalas)",
      },
      damages: {
        type: "array",
        description: "Konkretūs matomi pažeidimai (tuščias masyvas, jei nematyti)",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            area: { type: "string", description: "Vieta, pvz. 'Priekinis bamperis'" },
            description: { type: "string", description: "Trumpas aprašymas lietuviškai" },
            severity: { type: "string", enum: ["low", "medium", "high"] },
            estimated_cost_eur: { type: "integer", description: "Apytikslė remonto kaina, €" },
          },
          required: ["area", "description", "severity", "estimated_cost_eur"],
        },
      },
    },
    required: ["overall_condition", "summary", "estimated_repair_eur", "damages"],
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const images: string[] = Array.isArray(body?.images)
    ? body.images.filter((u: unknown) => typeof u === "string" && /^https?:\/\//i.test(u)).slice(0, MAX_IMAGES)
    : [];
  if (!images.length) return json({ error: "Nėra nuotraukų analizei" }, 400);

  const ctx = [body?.make, body?.model, body?.year].filter(Boolean).join(" ");

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      tools: [damageTool as any],
      tool_choice: { type: "tool", name: "report_damage" },
      system:
        "Tu esi patyręs naudotų automobilių žalos vertintojas perpardavinėtojams. " +
        "Analizuok TIK tai, kas matosi pateiktose nuotraukose. Būk konservatyvus su kainomis " +
        "(Lietuvos rinka, eurai). Jei nuotraukose žala nematyti — grąžink tuščią 'damages' masyvą " +
        "ir mažą remonto sąmatą.",
      messages: [
        {
          role: "user",
          content: [
            ...images.map((url) => ({
              type: "image" as const,
              source: { type: "url" as const, url },
            })),
            {
              type: "text" as const,
              text: `Įvertink šio automobilio (${ctx || "nežinomas modelis"}) matomą žalą iš nuotraukų ir užpildyk įrankį.`,
            },
          ],
        },
      ],
    });

    // Strict tool use → the forced tool's input is our structured report.
    const block = message.content.find((b: any) => b.type === "tool_use");
    if (!block) return json({ error: "Modelis negrąžino struktūruotos ataskaitos" }, 502);

    return json({ report: (block as any).input, usage: message.usage });
  } catch (e: any) {
    console.error("analyze-damage failed:", e?.message || e);
    return json({ error: "Nepavyko atlikti žalos analizės" }, 502);
  }
});
