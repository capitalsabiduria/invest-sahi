const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getLanguageInstructions(language: string, audience_style: string): string {
  if (language === 'or' && audience_style === 'mixed') {
    return `
LANGUAGE RULE — ODIA-ENGLISH CODE-MIX (strictly follow this):
- Write ALL emotional context, storytelling, explanations, and sentence connectors in native Odia script.
- Tone must sound exactly like a 30-year-old educated professional in Bhubaneswar speaking casually to a friend about money.
- MUST keep these words in English script always: SIP, Mutual Funds, NPS, ELSS, FD, EPF, PPF, Term Insurance, Health Insurance, Corpus, Return, Income Tax, 80C, Stock Market, Real Estate, Down Payment, Loan, Portfolio, SEBI, AMFI, IRDAI, Investment, Tax Planning.
- NEVER translate financial product names into Odia. "ପାରସ୍ପରିକ ପାଣ୍ଠି" for Mutual Funds is WRONG. Keep "Mutual Funds" in English.
- Emotional and action words MUST be in Odia: ଭବିଷ୍ୟତ (future), ସଞ୍ଚୟ (savings), ଅବସର (retirement), ପରିବାର (family), ଟଙ୍କା (money), ବିଶ୍ୱାସ (trust), ନିରାପଦ (safe), ସ୍ୱପ୍ନ (dream), ପିଲା (child), ଶିକ୍ଷା (education).
- Correct example: "ମାସିକ ₹2,000 SIP ଆରମ୍ଭ କଲେ, ୧୫ ବର୍ଷ ପରେ ଆପଣଙ୍କ ପିଲାର ଶିକ୍ଷା ପାଇଁ ଏକ ଭଲ Corpus ତିଆରି ହେବ।"
- Wrong example: "ମାସିକ ନିୟମିତ ନିବେଶ ଯୋଜନା ଆରମ୍ଭ କଲେ..." (SIP must stay as SIP)
`;
  }

  if (language === 'or' && audience_style === 'pure_odia') {
    return `
LANGUAGE RULE — FORMAL ACCESSIBLE ODIA (strictly follow this):
- Write in respectful, formal but accessible Odia script. Target audience is 45+ government employees, teachers, and Tier-2/3 city residents.
- Tone must sound like a trusted family advisor speaking respectfully to a senior government employee or schoolteacher.
- Use 90% Odia script. Focus heavily on safety, family security, government schemes, and trust.
- EXCEPTION — keep ONLY these exact product acronyms in English: SIP, NPS, FD, PPF, EPF, Term Insurance, Mutual Funds. Do not translate these specific names.
- Emotional words MUST be in Odia: ଭବିଷ୍ୟତ (future), ସଞ୍ଚୟ (savings), ଅବସର (retirement), ପରିବାର (family), ଟଙ୍କା (money), ବିଶ୍ୱାସ (trust), ନିରାପଦ (safe), ସୁରକ୍ଷା (protection), ଲକ୍ଷ୍ୟ (goal).
- Correct example: "ଆପଣଙ୍କ ପରିବାରର ସୁରକ୍ଷା ପାଇଁ ଏକ ଭଲ Term Insurance ଏବଂ ନିୟମିତ SIP ନିହାତି ଜରୁରୀ।"
- NEVER use casual or youth-oriented language. Keep it dignified and warm.
`;
  }

  return `
LANGUAGE RULE — PLAIN INDIAN ENGLISH:
- Write in warm, plain Indian English. No jargon without explanation.
- Use localized Odisha examples naturally — specific places, institutions, real community references.
- Tone is conversational and peer-like, not corporate.
`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, slug, title, meta_description, keywords, language = 'en', audience_style = 'standard' } = await req.json();

    const languageInstructions = getLanguageInstructions(language, audience_style);

    const prompt = `You are a financial content writer for InvestSahi, Odisha's homegrown financial services platform for Odia families. Generate SEO page content in JSON format ONLY. No markdown, no explanation, no code fences — just raw valid JSON.

${languageInstructions}

Brand voice rules (apply in whatever language you are writing):
- Warm, knowledgeable, honest, and genuinely caring tone. Never corporate, never pushy.
- Always mention ₹500 somewhere natural — it signals accessibility and trustworthiness.
- Never promise guaranteed returns or use superlatives like best, top, leading, greatest.
- Reference specific Odisha places, institutions, or community names naturally.
- Pick the 3 services most relevant to THIS specific audience — do not default to SIP/insurance/NPS every time. A fisherman page should mention APY and accident insurance. A NALCO employee page should lead with NPS optimization. An education fund page should lead with SIP and education loans. A doctor page should mention high SIP amounts, clinic financing, and tax planning.
- hero_headline must mention the specific location, profession, or institution — never generic.
- Every service entry_amount must be a specific rupee amount — never vague phrases.
- story_paragraph: 3-4 sentences about a fictional relatable Odia person. Real Odia name, specific rupee amounts, specific fear, specific outcome. Write in the language mode specified above.
- case_study: structured 3-part with real numbers. Write in the language mode specified above.
- faqs: 3 questions a real person from this location/profession would actually voice-search on Google. Write in the language mode specified above.
- local_insight: unique content that cannot apply to any other page. Write in the language mode specified above.

Return ONLY this JSON structure with no other text:
{
  "hero_headline": "compelling specific headline mentioning exact location/profession/institution (max 12 words)",
  "hero_subline": "1-2 warm sentences explaining what this page offers (max 30 words)",
  "story_paragraph": "3-4 sentence story about a fictional relatable Odia person. Real Odia name, specific rupee amounts, specific fear, specific outcome. (max 80 words)",
  "case_study": {
    "challenge": "one sentence naming a specific person type and their specific rupee goal (max 20 words)",
    "strategy": "one sentence naming the exact financial products and approach used (max 20 words)",
    "result": "one sentence with a specific rupee amount or measurable outcome (max 20 words)"
  },
  "how_it_works": "2-3 warm sentences explaining: free conversation, plain-language plan, start from ₹500. (max 50 words)",
  "why_section": {
    "heading": "Why InvestSahi for [specific audience/location]",
    "points": [
      "hyper-local point specific to this exact audience (max 15 words)",
      "specific point relevant to this audience (max 15 words)",
      "specific point relevant to this audience (max 15 words)"
    ]
  },
  "local_insight": "2-3 sentences of unique local financial insight for this specific location or community (max 60 words)",
  "services": [
    { "name": "most relevant service name", "entry_amount": "₹XXX/month or ₹XXX/year — must be a specific number", "description": "one warm sentence specific to this audience (max 20 words)" },
    { "name": "second most relevant service", "entry_amount": "₹XXX/month or ₹XXX/year", "description": "one warm sentence (max 20 words)" },
    { "name": "third most relevant service", "entry_amount": "₹XXX/month or ₹XXX/year", "description": "one warm sentence (max 20 words)" }
  ],
  "faqs": [
    { "question": "hyper-specific question a real person would voice-search", "answer": "2-3 sentence factual plain-language answer" },
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
Language mode: ${language === 'or' && audience_style === 'mixed' ? 'Odia-English Code-Mix' : language === 'or' && audience_style === 'pure_odia' ? 'Formal Odia' : 'Plain English'}

Every field must contain content that could only apply to this specific page. Nothing generic.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
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

    if (!rawText) throw new Error('Gemini returned empty response');

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
