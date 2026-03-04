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

    const systemPrompt = `You are a financial content writer for InvestSahi, Odisha's bilingual financial advisory platform for middle-class families.

Generate a complete content item for the InvestSahi Learn/Money School section. Return ONLY raw valid JSON — no markdown, no code fences, no explanation.

Content type: ${type}
Category: ${category}
Slug: ${slug}
Topic/instructions: ${prompt}

ENGLISH BODY RULES:
- Write warm, plain Indian English. No jargon without explanation.
- Use specific Odisha references (places, institutions, real scenarios).
- Structure with HTML tags: use <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul>/<li> for lists, <strong> for key terms, <blockquote> for important callouts.
- 400-700 words. Must feel like it was written by a knowledgeable friend in Bhubaneswar, not a generic financial website.
- End with a <blockquote> that says something warm and encouraging.

ODIA BODY RULES (Odia-English Code-Mix):
- Write ALL emotional context, storytelling, explanations in native Odia script.
- Keep financial product names in English: SIP, Mutual Funds, NPS, FD, PPF, Term Insurance, Health Insurance, ELSS, Portfolio, SEBI, AMFI.
- Emotional words MUST be Odia: ଭବିଷ୍ୟତ, ସଞ୍ଚୟ, ପରିବାର, ଟଙ୍କା, ବିଶ୍ୱାସ, ନିରାପଦ, ସ୍ୱପ୍ନ, ଶିକ୍ଷା.
- Same HTML structure as English body.
- 300-500 words.

TITLE RULES:
- title_en: compelling, specific, max 10 words, no clickbait
- title_or: same meaning in Odia script, natural not translated

Return ONLY this JSON:
{
  "title_en": "...",
  "title_or": "...",
  "body_en": "<h2>...</h2><p>...</p>...",
  "body_or": "<h2>...</h2><p>...</p>..."
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
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

    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/,(\s*[}\]])/g, '$1')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError: unknown) {
      console.error('[generate-content-item] JSON parse failed. Raw text:', rawText);
      throw new Error(`Failed to parse Gemini response as JSON: ${(parseError as Error).message}`);
    }

    if (!parsed.title_en || !parsed.title_or || !parsed.body_en || !parsed.body_or) {
      throw new Error('Generated content missing required fields');
    }

    const { title_en, title_or, body_en, body_or } = parsed;

    return new Response(
      JSON.stringify({ title_en, title_or, body_en, body_or }),
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
