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
- Warm, knowledgeable, honest, and genuinely caring tone. Never corporate, never pushy.
- Plain language, no financial jargon without explanation
- Always mention ₹500 somewhere natural — it signals that InvestSahi is accessible and trustworthy, not elitist. Even high-income audiences like doctors or PSU employees appreciate knowing there are no minimum thresholds.
- Never promise guaranteed returns or use superlatives like best, top, leading, greatest
- Reference specific Odisha places, institutions, or community names naturally — not just "Odisha" generically. Use real city names, real institutions, real community references.
- Pick the 3 services most relevant to THIS specific audience — do not default to SIP/insurance/NPS every time. A fisherman page should mention APY and accident insurance. A NALCO employee page should lead with NPS optimization. An education fund page should lead with SIP calculator and education loans. A doctor page should mention high SIP amounts, clinic financing, and tax planning.
- hero_headline must mention the specific location, profession, or institution — never a generic headline
- cta_headline must be specific to this audience
- Every service entry_amount must be a specific rupee amount — never a vague phrase like "as per your comfort" or "varies by plan"
- story_paragraph: write a 3-4 sentence story about a fictional but deeply relatable person from this exact location or profession. Give them a real Odia name (Mamata, Sushanta, Rabi, Pradip, Savitri, Bijay, Rekha, Subhash). Show their specific financial fear or hesitation. Include a real rupee amount (monthly savings, SIP amount, or goal amount). Show how starting changed their situation. This must feel like a real person, not a marketing testimonial.
- case_study: a structured 3-part mini case study with real numbers. Challenge should name a specific person type and a specific rupee goal. Strategy should name the actual financial product used. Result should include a specific rupee amount or percentage outcome. This gives AI models and search engines concrete factual data to index.
- how_it_works: 2-3 warm sentences explaining: free conversation to understand the situation, a plain-language plan built around their life, starting from ₹500 with no pressure.
- local_insight: 2-3 sentences of genuine local financial insight specific to this location or community. For district pages mention real local employers, economic activity, or financial patterns. For institution pages mention real education costs or planning timelines. For community pages mention profession-specific financial challenges. This must be unique content that cannot apply to any other page.
- faqs: 3 questions and answers highly specific to this audience. Questions should be what a real person from this location or profession would actually search on Google. Answers should be 2-3 sentences, factual, plain language, and genuinely useful. Never use generic questions like "why should I invest" — make them hyper-specific like "Can an auto driver in Bhubaneswar start a SIP?" or "How does NPS work for NALCO employees?"

Return ONLY this JSON structure with no other text:
{
  "hero_headline": "compelling specific headline mentioning exact location/profession/institution (max 12 words)",
  "hero_subline": "1-2 warm sentences explaining what this page offers (max 30 words)",
  "story_paragraph": "3-4 sentence story about a fictional relatable Odia person from this location/profession. Real Odia name, specific rupee amounts, specific fear, specific outcome. (max 80 words)",
  "case_study": {
    "challenge": "one sentence naming a specific person type and their specific rupee goal (max 20 words)",
    "strategy": "one sentence naming the exact financial products and approach used (max 20 words)",
    "result": "one sentence with a specific rupee amount or measurable outcome (max 20 words)"
  },
  "how_it_works": "2-3 warm sentences explaining the simple 3-step process: free conversation, plain-language plan, start from ₹500. (max 50 words)",
  "why_section": {
    "heading": "Why InvestSahi for [specific audience/location] — keyword-rich but natural, not corporate",
    "points": [
      "hyper-local point referencing something specific to this exact audience (max 15 words)",
      "specific point relevant to this audience (max 15 words)",
      "specific point relevant to this audience (max 15 words)"
    ]
  },
  "local_insight": "2-3 sentences of unique local financial insight for this specific location or community (max 60 words)",
  "services": [
    { "name": "most relevant service name", "entry_amount": "₹XXX/month or ₹XXX/year — must be a specific number", "description": "one warm sentence specific to this audience (max 20 words)" },
    { "name": "second most relevant service", "entry_amount": "₹XXX/month or ₹XXX/year — must be a specific number", "description": "one warm sentence (max 20 words)" },
    { "name": "third most relevant service", "entry_amount": "₹XXX/month or ₹XXX/year — must be a specific number", "description": "one warm sentence (max 20 words)" }
  ],
  "faqs": [
    { "question": "hyper-specific question a real person from this location/profession would search", "answer": "2-3 sentence factual plain-language answer" },
    { "question": "second hyper-specific question", "answer": "2-3 sentence answer" },
    { "question": "third hyper-specific question", "answer": "2-3 sentence answer" }
  ],
  "trust_note": "1-2 sentences about SEBI/AMFI/IRDAI regulation and transparent advisory (max 35 words)",
  "cta_headline": "action-oriented headline specific to this audience (max 10 words)",
  "cta_subline": "warm encouraging closing line specific to this audience (max 20 words)"
}

Generate content for this InvestSahi SEO/guide page:
Page type: ${type}
Slug: ${slug}
Title: ${title}
Meta description: ${meta_description}
Keywords: ${keywords?.join(', ')}

Make all content highly specific and locally relevant to this exact audience. Every field must contain content that could only apply to this specific page — nothing generic.`;

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
  .replace(/,(\s*[}\]])/g, '$1')
  .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('[generate-seo-content] JSON parse failed. Raw text:', rawText);
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    // Validate required fields are present
    if (!parsed.hero_headline || !parsed.why_section || !parsed.services || !parsed.faqs) {
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
