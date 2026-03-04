import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

const GUIDE_PLACEHOLDERS = [
  // Family
  { slug: 'sip-mutual-funds', category: 'Mutual Funds', title_en: 'What is a SIP? Your Complete Guide', title_or: 'SIP କ\'ଣ? ସମ୍ପୂର୍ଣ ଗାଇଡ୍' },
  { slug: 'term-life-insurance', category: 'Insurance', title_en: 'Term Life Insurance: What Your Family Needs to Know', title_or: 'Term Life Insurance: ଆପଣଙ୍କ ପରିବାର ଜାଣିବା ଉଚିତ' },
  { slug: 'health-insurance', category: 'Insurance', title_en: 'Health Insurance in Odisha: A Plain Language Guide', title_or: 'Health Insurance: ସରଳ ଭାଷାରେ ବୁଝନ୍ତୁ' },
  { slug: 'sukanya-samriddhi-yojana', category: 'Government Schemes', title_en: 'Sukanya Samriddhi Yojana: Your Daughter\'s Future Starts Here', title_or: 'ସୁକନ୍ୟା ସମୃଦ୍ଧି ଯୋଜନା: ଆପଣଙ୍କ ଝିଅର ଭବିଷ୍ୟତ' },
  { slug: 'public-provident-fund', category: 'Government Schemes', title_en: 'PPF: The Safest Long-Term Investment in India', title_or: 'PPF: ଭାରତରେ ସବୁଠାରୁ ନିରାପଦ ଦୀର୍ଘମିଆଦୀ ବିନିଯୋଗ' },
  { slug: 'education-loans', category: 'Loans', title_en: 'Education Loans for NIT, AIIMS and Beyond', title_or: 'ଶିକ୍ଷା ଋଣ: NIT, AIIMS ଏବଂ ଅଧିକ' },
  // Future
  { slug: 'national-pension-system', category: 'Retirement', title_en: 'NPS Guide for Odisha Government Employees', title_or: 'ଓଡ଼ିଶା ସରକାରୀ କର୍ମଚାରୀଙ୍କ ପାଇଁ NPS ଗାଇଡ୍' },
  { slug: 'atal-pension-yojana', category: 'Retirement', title_en: 'Atal Pension Yojana: Guaranteed Pension for Everyone', title_or: 'ଅଟଳ ପେନ୍‌ସନ ଯୋଜନା: ସମସ୍ତଙ୍କ ପାଇଁ ଗ୍ୟାରେଣ୍ଟିଡ ପେନ୍‌ସନ' },
  { slug: 'recurring-deposits', category: 'Savings', title_en: 'Recurring Deposits: Safe Savings for First-Time Investors', title_or: 'Recurring Deposit: ପ୍ରଥମ ଥର ବିନିଯୋଗ ପାଇଁ ନିରାପଦ ସଞ୍ଚୟ' },
  { slug: 'fixed-deposits', category: 'Savings', title_en: 'Fixed Deposits: Which Bank, Which Tenure, Which Rate', title_or: 'Fixed Deposit: କେଉଁ ବ୍ୟାଙ୍କ, କେତେ ଦିନ, କେତେ ସୁଧ' },
  { slug: 'sovereign-gold-bonds', category: 'Gold', title_en: 'Sovereign Gold Bonds: Smarter Than Physical Gold', title_or: 'Sovereign Gold Bonds: ଭୌତିକ ସୁନାଠାରୁ ଚାଲାଖ ବିକଳ୍ପ' },
  { slug: 'investment-insurance', category: 'Insurance', title_en: 'ULIP Explained: When It Makes Sense and When It Doesn\'t', title_or: 'ULIP: କଣ ଭଲ, କ\'ଣ ଖରାପ — ସ୍ପଷ୍ଟ ଭାବେ ବୁଝନ୍ତୁ' },
  // Business
  { slug: 'mudra-loans', category: 'Business Loans', title_en: 'MUDRA Loans: Free Money for Odisha\'s Small Businesses', title_or: 'MUDRA Loan: ଓଡ଼ିଶାର ଛୋଟ ବ୍ୟବସାୟ ପାଇଁ ଋଣ' },
  { slug: 'shop-insurance', category: 'Insurance', title_en: 'Shop Insurance: Protect Your Business Premises', title_or: 'Shop Insurance: ଆପଣଙ୍କ ଦୋକାନ ସୁରକ୍ଷିତ ରଖନ୍ତୁ' },
  { slug: 'personal-accident-cover', category: 'Insurance', title_en: 'Personal Accident Cover: Essential for Every Working Adult', title_or: 'Personal Accident Cover: ପ୍ରତ୍ୟେକ କର୍ମଜୀବୀ ପାଇଁ ଜରୁରୀ' },
  { slug: 'home-insurance', category: 'Insurance', title_en: 'Home Insurance in Odisha: Cyclone, Flood and Beyond', title_or: 'Home Insurance: ବାତ୍ୟା, ବନ୍ୟା ଏବଂ ଅଧିକ ବିପଦ ବିରୁଦ୍ଧ ସୁରକ୍ଷା' },
  { slug: 'personal-loans', category: 'Loans', title_en: 'Personal Loans: How to Get the Best Rate', title_or: 'Personal Loan: ସର୍ବୋତ୍ତମ ସୁଧ ହାରରେ ଋଣ କିପରି ପାଇବେ' },
];

export async function seedGuides() {
  const rows = GUIDE_PLACEHOLDERS.map((g) => ({
    slug: g.slug,
    type: 'glossary',
    status: 'published',
    category: g.category,
    title_en: g.title_en,
    title_or: g.title_or,
    body_en: `This guide covers everything you need to know about ${g.title_en}. We explain it in plain language with examples relevant to Odisha families. Full guide coming soon — chat with us on WhatsApp for personalised advice.`,
    body_or: `ଏହି ଗାଇଡ୍‌ରେ ଆପଣ ${g.title_or} ସମ୍ପର୍କରେ ସବୁ ଜାଣିପାରିବେ। ଆମେ ଏହାକୁ ଓଡ଼ିଶା ପରିବାରଙ୍କ ପାଇଁ ସରଳ ଭାଷାରେ ବୁଝାଇଛୁ। ସମ୍ପୂର୍ଣ ଗାଇଡ୍ ଶୀଘ୍ର ଆସୁଛି — ବ୍ୟକ୍ତିଗତ ପରାମର୍ଶ ପାଇଁ WhatsApp ରେ ଆମ ସହ କଥା ହୁଅନ୍ତୁ।`,
    published_at: new Date().toISOString(),
  }));

  for (const row of rows) {
    const { error } = await supabase
      .from('content_items')
      .upsert(row, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting ${row.slug}:`, error.message);
    } else {
      console.log(`✓ ${row.slug}`);
    }
  }
}

seedGuides();
