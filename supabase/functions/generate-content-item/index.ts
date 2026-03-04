const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, category, slug, prompt } = await req.json();

    const systemPrompt = `You are a financial content writer for InvestSahi, Odisha's homegrown financial services platform. You write for two audiences simultaneously: English-literate urban readers and Odia-speaking families in semi-urban Odisha.

Generate a complete content item for the InvestSahi Learn / Money School section. Return ONLY a valid JSON object with exactly these six fields. No other text, no explanation.

Content type: ${type}
Category: ${category}
Slug: ${slug}
Topic: ${prompt}

ENGLISH BODY RULES:
- Warm, plain Indian English. Write like a knowledgeable friend in Bhubaneswar, not a bank brochure.
- Use specific Odisha references: real place names, NIT Rourkela, AIIMS Bhubaneswar, Puri, Cuttack, specific rupee amounts.
- Mention ₹500 somewhere in the first two paragraphs — signals accessibility to first-time investors.
- Never promise guaranteed returns. Never use superlatives like best, top, leading.
- Use markdown for structure: ## for main sections, ### for subsections, **bold** for key terms, - for bullet lists, > for important callouts.
- 400–600 words.
- End with a > blockquote that is warm and encouraging, specific to this content topic.

ODIA BODY RULES (Odia-English Code-Mix — strictly follow):
- Write ALL emotional context, storytelling, sentence connectors in native Odia script.
- Keep these ALWAYS in English script: SIP, Mutual Funds, NPS, FD, PPF, Term Insurance, Health Insurance, ELSS, Portfolio, SEBI, AMFI, IRDAI, Return, Corpus, Investment.
- Emotional and action words MUST be in Odia script: ଭବିଷ୍ୟତ, ସଞ୍ଚୟ, ପରିବାର, ଟଙ୍କା, ବିଶ୍ୱାସ, ନିରାପଦ, ସ୍ୱପ୍ନ, ଶିକ୍ଷା, ଅବସର, ପିଲା.
- Same markdown structure as English body.
- 300–450 words.

TITLE RULES:
- title_en: specific and compelling, max 10 words, no clickbait, no question marks
- title_or: same meaning expressed naturally in Odia script — do NOT translate word-for-word

PREVIEW RULES (shown on content listing cards — must standalone and compel a click):
- preview_en: exactly 1 punchy sentence, max 120 characters, must mention a specific rupee amount or concrete fact
- preview_or: same intent in natural Odia script, max 120 characters

Return exactly this JSON and nothing else:
{
  "title_en": "...",
  "title_or": "...",
  "preview_en": "...",
  "preview_or": "...",
  "body_en": "## Section Heading\n\nParagraph text...\n\n- bullet point\n\n> encouraging callout",
  "body_or": "## ଓଡ଼ିଆ ଶୀର୍ଷକ\n\nଓଡ଼ିଆ ଅନୁଚ୍ଛେଦ..."
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
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

    const geminiData = await response.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) throw new Error('Gemini returned empty response');

    const cleaned = rawText.trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError: unknown) {
      console.error('[generate-content-item] JSON parse failed. Raw text:', rawText);
      throw new Error(`Failed to parse Gemini response as JSON: ${(parseError as Error).message}`);
    }

    const required = ['title_en', 'title_or', 'preview_en', 'preview_or', 'body_en', 'body_or'];
    for (const field of required) {
      if (!parsed[field] || typeof parsed[field] !== 'string') {
        throw new Error(`Missing or invalid field: ${field}`);
      }
    }

    return new Response(
      JSON.stringify({
        title_en: parsed.title_en,
        title_or: parsed.title_or,
        preview_en: parsed.preview_en,
        preview_or: parsed.preview_or,
        body_en: parsed.body_en,
        body_or: parsed.body_or,
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
