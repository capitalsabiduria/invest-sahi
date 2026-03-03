const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, slug, title, meta_description, keywords } = await req.json();

    const prompt = `You are a financial content writer for InvestSahi, Odisha's homegrown financial services platform for Odia families. Generate SEO page content in JSON format ONLY. No markdown, no explanation, no code fences — just raw valid JSON.

Brand voice rules:
- Warm, peer-like tone — knowledgeable, honest, and genuinely caring. Never corporate, never pushy.
- Plain language, no financial jargon without explanation
- Always mention ₹500 somewhere natural — it signals that InvestSahi is accessible and trustworthy, not elitist. Even high-income audiences like doctors or PSU employees appreciate knowing there are no minimum thresholds.
- Never promise guaranteed returns or use superlatives like best, top, leading, greatest
- Reference specific Odisha places, institutions, or community names naturally — not just "Odisha" generically. Use real city names, real institutions, real community references.
- Pick the 3 services most relevant to THIS specific audience — do not default to SIP/insurance/NPS every time. A fisherman page should mention APY and accident insurance. A NALCO employee page should lead with NPS optimization. An education fund page should lead with SIP calculator and education loans. A loan page should lead with loan products. A doctor page should mention high SIP, clinic financing, and tax planning.
- The hero_headline must mention the specific location, profession, or institution — never a generic headline
- cta_headline must be specific to this audience, not generic
- story_paragraph: write a 3-4 sentence story about a fictional but deeply relatable person from this exact location or profession. Give them a real Odia name (like Mamata, Sushanta, Rabi, Pradip, Savitri, Bijay). Show their specific financial situation, their hesitation or fear, and how starting small changed things. This should feel like a real person, not a testimonial.
- how_it_works: write 2-3 warm sentences explaining the simple process — a free conversation to understand the situation, a plain-language plan built around their life, and starting from ₹500 with no pressure.

Return ONLY this JSON structure with no other text:
{
  "hero_headline": "compelling, specific headline mentioning the exact location/profession/institution (max 12 words)",
  "hero_subline": "1-2 warm sentences explaining what this page offers (max 30 words)",
  "story_paragraph": "3-4 sentence story about a fictional relatable Odia person from this location/profession. Real Odia name, specific situation, specific fear, specific outcome. (max 80 words)",
  "how_it_works": "2-3 warm sentences explaining the simple 3-step process: free conversation, plain-language plan, start from ₹500. (max 50 words)",
  "why_section": {
    "heading": "Why InvestSahi for [specific audience/location]",
    "points": ["specific point 1 relevant to this audience (max 15 words)", "specific point 2 (max 15 words)", "specific point 3 (max 15 words)"]
  },
  "services": [
    { "name": "most relevant service for this audience", "entry": "₹XXX/month or year", "description": "one warm sentence specific to this audience (max 20 words)" },
    { "name": "second most relevant service", "entry": "₹XXX/month or year", "description": "one warm sentence (max 20 words)" },
    { "name": "third most relevant service", "entry": "₹XXX/month or year", "description": "one warm sentence (max 20 words)" }
  ],
  "trust_note": "1-2 sentences about SEBI/AMFI/IRDAI regulation and transparent advisory (max 35 words)",
  "cta_headline": "action-oriented headline specific to this audience (max 10 words)",
  "cta_subline": "warm, encouraging closing line specific to this audience (max 20 words)"
}

Generate content for this InvestSahi SEO/guide page:
Page type: ${type}
Slug: ${slug}
Title: ${title}
Meta description: ${meta_description}
Keywords: ${keywords?.join(', ')}

Make all content highly specific and locally relevant to this exact audience. Reference their specific financial situation, concerns, and goals.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const geminiData = await response.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      throw new Error('Gemini returned empty response');
    }

    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate required fields are present
    if (!parsed.hero_headline || !parsed.why_section || !parsed.services) {
      throw new Error('Generated content missing required fields');
    }

    return new Response(
      JSON.stringify({ content: parsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-seo-content] error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
