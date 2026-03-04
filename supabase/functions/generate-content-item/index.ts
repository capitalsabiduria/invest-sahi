const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }
  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!rawText) throw new Error('Gemini returned empty response');
  return rawText.trim();
}

function parseAndValidate(
  rawText: string,
  requiredFields: string[]
): Record<string, string> {
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(rawText);
  } catch (e: any) {
    console.error('[generate-content-item] JSON parse failed. Raw text:', rawText);
    throw new Error(`JSON parse failed: ${e.message}`);
  }
  for (const field of requiredFields) {
    if (!parsed[field] || typeof parsed[field] !== 'string') {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }
  return parsed;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, category, slug, prompt } = await req.json();

    // ── Call 1: English ──────────────────────────────────────────
    const enPrompt = `You are a financial content writer for InvestSahi, Odisha's homegrown financial services platform.

Generate ONLY the English content fields for a content item. Return ONLY a valid JSON object with exactly these three fields. No other text.

Content type: ${type}
Category: ${category}
Slug: ${slug}
Topic: ${prompt}

ENGLISH RULES:
- Warm, plain Indian English. Write like a knowledgeable friend in Bhubaneswar, not a bank brochure.
- Use specific Odisha references: real place names, NIT Rourkela, AIIMS Bhubaneswar, Puri, Cuttack, specific rupee amounts.
- Mention ₹500 somewhere in the first two paragraphs.
- Never promise guaranteed returns. Never use superlatives.
- Use markdown: ## for main sections, ### for subsections, **bold** for key terms, - for bullets, > for callouts.
- 400–600 words.
- End with a > blockquote that is warm and encouraging.

TITLE: specific and compelling, max 10 words, no clickbait, no question marks.
PREVIEW: exactly 1 punchy sentence, max 120 characters, must mention a specific rupee amount or concrete fact.

Return exactly:
{
  "title_en": "...",
  "preview_en": "...",
  "body_en": "## Section\\n\\nParagraph...\\n\\n> callout"
}`;

    const enRaw = await callGemini(enPrompt);
    const enResult = parseAndValidate(enRaw, ['title_en', 'preview_en', 'body_en']);

    // ── Call 2: Odia ───────────────────────────────────────────────
    const orPrompt = `You are a financial content writer for InvestSahi, Odisha's homegrown financial services platform.

Generate ONLY the Odia content fields for a content item. Return ONLY a valid JSON object with exactly these three fields. No other text.

Content type: ${type}
Category: ${category}
Slug: ${slug}
Topic: ${prompt}
English title for reference (do not translate directly — express the same idea naturally in Odia): ${enResult.title_en}

ODIA RULES (Odia-English Code-Mix — strictly follow):
- Write ALL emotional context, storytelling, sentence connectors in native Odia script.
- Keep these ALWAYS in English script: SIP, Mutual Funds, NPS, FD, PPF, Term Insurance, Health Insurance, ELSS, Portfolio, SEBI, AMFI, IRDAI, Return, Corpus, Investment.
- Emotional and action words MUST be in Odia script: ଭବିଷ୍ୟତ, ସଞ୍ଚୟ, ପରିବାର, ଟଙ୍କା, ବିଶ୍ୱାସ, ନିରାପଦ, ସ୍ୱପ୍ନ, ଶିକ୍ଷା, ଅବସର, ପିଲା.
- Same markdown structure as English: ## sections, **bold**, - bullets, > callouts.
- 300–450 words.
- End with a > blockquote that is warm and encouraging in Odia.

TITLE: same meaning as the English title expressed naturally in Odia script — do NOT translate word-for-word.
PREVIEW: exactly 1 punchy sentence in Odia script, max 120 characters, mention a specific rupee amount.

Return exactly:
{
  "title_or": "...",
  "preview_or": "...",
  "body_or": "## ଶୀର୍ଷକ\\n\\nଅନୁଚ୍ଛେଦ...\\n\\n> ଓଡ଼ିଆ callout"
}`;

    const orRaw = await callGemini(orPrompt);
    const orResult = parseAndValidate(orRaw, ['title_or', 'preview_or', 'body_or']);

    // ── Return merged result ────────────────────────────────────────
    return new Response(
      JSON.stringify({
        title_en: enResult.title_en,
        title_or: orResult.title_or,
        preview_en: enResult.preview_en,
        preview_or: orResult.preview_or,
        body_en: enResult.body_en,
        body_or: orResult.body_or,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[generate-content-item] error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
