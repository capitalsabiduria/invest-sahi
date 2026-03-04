import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

const content = [
  {
    type: 'story',
    slug: 'mamata-savings-vs-sip',
    category: 'savings-vs-sip',
    status: 'published',
    character_name: 'Mamata',
    character_profession_en: 'School Teacher, Kendrapara',
    character_profession_or: 'ବିଦ୍ୟାଳୟ ଶିକ୍ଷୟିତ୍ରୀ, କେନ୍ଦ୍ରାପଡ଼ା',
    title_en: 'Mamata: What 5 Years in a Bank Account Really Cost Her',
    title_or: 'ମମତା: 5 ବର୍ଷ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରେ ରଖିବାର ଅସଲ ମୂଲ୍ୟ',
    preview_en: 'Mamata saved ₹2,000 every month in her bank account for 5 years. See what she missed — and what she is doing differently now.',
    preview_or: 'ମମତା ପ୍ରତି ମାସ ₹2,000 ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରେ ଜମା କରୁଥିଲେ 5 ବର୍ଷ। ଦେଖନ୍ତୁ ସେ କଣ ଗୁମାଇଲେ।',
    body_en: `Mamata Rath teaches Class 7 in a government school in Kendrapara. Every month, without fail, she transferred ₹2,000 into her savings account. She was proud of her discipline.
After 5 years, she had saved ₹1,20,000. Her bank balance showed ₹1,31,400 — the extra ₹11,400 was interest at around 3.5% per year.
Then her colleague Sunita mentioned a SIP. Mamata did the math. ₹2,000 per month in a mutual fund SIP for the same 5 years, at a 12% average annual return, would have grown to ₹1,64,000.
The difference: ₹32,600. That is more than one month of her salary — simply from choosing a different place to put the same money.
Mamata is now 3 years into a SIP. She did not stop saving. She just started saving smarter.
If your situation is similar to Mamata's, let us talk.`,
    body_or: `ମମତା ରଥ କେନ୍ଦ୍ରାପଡ଼ାର ଏକ ସରକାରୀ ବିଦ୍ୟାଳୟରେ ସପ୍ତମ ଶ୍ରେଣୀ ପଢ଼ାନ୍ତି। ପ୍ରତି ମାସ, ବିନା ବ୍ୟତିକ୍ରମ, ସେ ₹2,000 ନିଜ ସଞ୍ଚୟ ଆକାଉଣ୍ଟକୁ ଜମା କରୁଥିଲେ।
5 ବର୍ଷ ପରେ, ତାଙ୍କ ପାଖରେ ₹1,20,000 ସଞ୍ଚୟ ଥିଲା। ବ୍ୟାଙ୍କ ବ୍ୟାଲାନ୍ସ ₹1,31,400 ଦେଖାଉଥିଲା।
ତାଙ୍କ ସହକର୍ମୀ ସୁନୀତା SIP ବିଷୟରେ କହିଲେ। ମମତା ହିସାବ କଲେ। SIP ରେ ₹2,000 ପ୍ରତି ମାସ ରଖିଥିଲେ 5 ବର୍ଷ ପାଇଁ, 12% ହାରରେ ₹1,64,000 ହୋଇ ଯାଆନ୍ତା।
ଫରକ: ₹32,600। ଏକା ଟଙ୍କା, ଅଲଗା ଜାଗା। ଏତିକି ଫରକ।
ମମତା ବର୍ତ୍ତମାନ 3 ବର୍ଷ ଧରି SIP ଚଲାଉଛନ୍ତି। ଆପଣଙ୍କ ପରିସ୍ଥିତି ମମତାଙ୍କ ପରି? ଆସନ୍ତୁ କଥା ହୁଅନ୍ତୁ।`,
  },
  {
    type: 'story',
    slug: 'rabi-auto-driver-sip',
    category: 'starting-from-zero',
    status: 'published',
    character_name: 'Rabi',
    character_profession_en: 'Auto Driver, Bhubaneswar',
    character_profession_or: 'Auto ଚାଳକ, ଭୁବନେଶ୍ୱର',
    title_en: 'Rabi: The Auto Driver Who Thought Investing Was Not for Him',
    title_or: 'ରବି: ଯେ Auto ଚାଳକ ଭାବୁଥିଲେ ବିନିଯୋଗ ତାଙ୍କ ପାଇଁ ନୁହେଁ',
    preview_en: 'Rabi thought investing was only for salaried people. He earns ₹18,000 a month. Here is what he started with ₹500.',
    preview_or: 'ରବି ଭାବୁଥିଲେ ବିନିଯୋଗ କେବଳ ଦରମା ଲୋକଙ୍କ ପାଇଁ। ତାଙ୍କ ଆୟ ₹18,000। ₹500ରୁ ଆରମ୍ଭ।',
    body_en: `Rabi Pradhan drives an auto in Bhubaneswar. Some months are good — ₹22,000. Some months are hard — ₹14,000. Average around ₹18,000.
He always thought SIPs were for people with fixed salaries. "What if I cannot pay one month?" he asked.
The answer surprised him: if you miss a SIP instalment, nothing happens. No penalty. No cancellation. The SIP simply skips that month. You can pause it, reduce it, or stop it anytime.
Rabi started a ₹500 SIP. On good months, he tops it up manually with ₹500 or ₹1,000 more. On hard months, he lets it run at ₹500.
After 18 months, he has ₹11,200 in his mutual fund — more than he ever managed to keep in his bank account. And it is still growing.
Your income does not need to be fixed. Your future does not need to wait.`,
    body_or: `ରବି ପ୍ରଧାନ ଭୁବନେଶ୍ୱରରେ Auto ଚଲାନ୍ତି। କେତେ ମାସ ଭଲ — ₹22,000। କେତେ ମାସ କଷ୍ଟ — ₹14,000। ହାରାହାରି ₹18,000।
ସେ ସବୁ ବେଳ ଭାବୁଥିଲେ SIP କେବଳ ଦରମା ଲୋକଙ୍କ ପାଇଁ। "ଏକ ମାସ ଦେଇ ନ ପାରିଲେ?" ସେ ପଚାରିଲେ।
ଉତ୍ତର ତାଙ୍କୁ ଆଶ୍ଚର୍ଯ୍ୟ କଲା: SIP ଏକ ମାସ ବନ୍ଦ ରହିଲେ କୌଣସି ଜରିମାନା ନାହିଁ। ଯେ କୌଣସି ସମୟ ରୋକି ହୁଏ।
ରବି ₹500 SIP ଆରମ୍ଭ କଲେ। ଭଲ ମାସ ରେ ₹500-1,000 ଅଧିକ ଦେନ୍ତି। କଷ୍ଟ ମାସ ରେ ₹500 ଚଲେ।
18 ମାସ ପରେ ତାଙ୍କ Mutual Fund ରେ ₹11,200 ଅଛି। ଆଜିର ଆୟ ଅନିୟମିତ ହୋଇ ପାରେ। ଭବିଷ୍ୟ ଅପେକ୍ଷା କରିବ ନାହିଁ।`,
  },
  {
    type: 'story',
    slug: 'sushanta-crpf-insurance',
    category: 'protection',
    status: 'published',
    character_name: 'Sushanta',
    character_profession_en: 'CRPF Jawan, Ganjam',
    character_profession_or: 'CRPF ଜୱାନ, ଗଞ୍ଜାମ',
    title_en: 'Sushanta: The Conversation His Family Wishes They Had',
    title_or: 'ସୁଶାନ୍ତ: ଆଲୋଚନା ଯାହା ତାଙ୍କ ପରିବାର ଚାହୁଁଥିଲ ଆଗରୁ ହୋଇ ଯାଆନ୍ତା',
    preview_en: 'Sushanta sent money home every month. He had no life insurance. This is the conversation his family wishes they had had.',
    preview_or: 'ସୁଶାନ୍ତ ପ୍ରତି ମାସ ଘରକୁ ଟଙ୍କା ପଠାଉଥିଲେ। ଜୀବନ ବୀମା ଛିଲ ନାହିଁ।',
    body_en: `Sushanta Nayak from Ganjam sends ₹8,000 home every month. His parents depend on it. His younger sister's college fees come from it.
He is 28. Healthy. Feels invincible.
He has no term life insurance.
If something happened to Sushanta tonight, his family would receive his CRPF service benefits — a process that takes months and requires paperwork most families struggle with. The monthly ₹8,000 would stop immediately.
A ₹50 lakh term insurance policy for Sushanta costs approximately ₹650 per month at his age. That is less than what he spends on mobile recharge and snacks combined.
If he bought it today and nothing ever happened — he would have spent money protecting his family. If something did happen — his family would receive ₹50 lakh. Enough to replace his income for years. Enough for his sister to finish college.
The question is not whether you can afford term insurance. The question is whether your family can afford it if you do not have it.`,
    body_or: `ଗଞ୍ଜାମର ସୁଶାନ୍ତ ନାୟକ ପ୍ରତି ମାସ ₹8,000 ଘରକୁ ପଠାନ୍ତି। ଭଉଣୀର College ଖର୍ଚ ଏଥିରୁ ଯାଏ।
ସେ 28 ବର୍ଷ। ସୁସ୍ଥ। ଜୀବନ ବୀମା ନାହିଁ।
ଆଜି ରାତି କିଛି ହେଲେ, ₹8,000 ମାସ ବନ୍ଦ। ତୁରନ୍ତ।
₹50 ଲକ୍ଷ Term Insurance ତାଙ୍କ ପାଇଁ ମାସ ₹650। Mobile Recharge ଠାରୁ କମ।
ଆଜି କିଣନ୍ତୁ, କିଛି ନ ହଉ — ପରିବାର ସୁରକ୍ଷିତ। କିଛି ହଉ — ₹50 ଲକ୍ଷ। ଭଉଣୀ College ଶେଷ କରିବ।
ପ୍ରଶ୍ନ ଏହା ନୁହେଁ ଯେ ଆପଣ ଦେଇ ପାରିବେ। ପ୍ରଶ୍ନ ଏହା ଯେ ଆପଣ ନ ଥିଲେ ଆପଣଙ୍କ ପରିବାର ଦେଇ ପାରିବ କି।`,
  },
  {
    type: 'glossary',
    slug: 'what-is-sip',
    category: 'glossary',
    status: 'published',
    character_name: null,
    character_profession_en: null,
    character_profession_or: null,
    title_en: 'What is a SIP?',
    title_or: 'SIP କଣ?',
    preview_en: 'SIP stands for Systematic Investment Plan. It means investing a fixed amount every month into a mutual fund — automatically.',
    preview_or: 'SIP ମାନେ Systematic Investment Plan। ପ୍ରତି ମାସ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ରାଶି Mutual Fund ରେ ସ୍ୱୟଂଚାଳିତ ଭାବେ ବିନିଯୋଗ।',
    body_en: `SIP stands for Systematic Investment Plan. It means investing a fixed amount every month into a mutual fund — automatically, on a date you choose.
Think of it like a fisherman casting his net into the Mahanadi at the same time every morning. He does not wait for the perfect day. He shows up consistently. Over months and years, the consistent effort builds something meaningful.
A SIP of ₹500 per month does the same thing with your money. On the 5th of every month, ₹500 moves from your bank account into a mutual fund. You do not need to remember. You do not need to time the market. It just happens.
Why SIP instead of a lump sum? Because most of us do not have a lump sum. We have income. SIPs are built for income earners.
Can you stop a SIP? Yes. Anytime. No penalty.
Minimum SIP amount: ₹500 per month. Less than a bag of rice.`,
    body_or: `SIP ମାନେ Systematic Investment Plan। ପ୍ରତି ମାସ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ତାରିଖ ରେ ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରୁ ଟଙ୍କା ସ୍ୱୟଂଚାଳିତ ଭାବେ Mutual Fund ରେ ଯାଏ।
ମହାନଦୀ ରେ ପ୍ରତି ଦିନ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ସମୟ ରେ ଜାଲ ପକାଉଥିବା ଜେଲ ବ୍ୟକ୍ତି ଭଳି — ସଠିକ ଦିନ ଅପେକ୍ଷା ନ କରି, ନିୟମିତ ଆସେ। ମାସ ପରେ ମାସ, ଏହି ନିୟମିତ ପ୍ରଚେଷ୍ଟା ଏକ ବଡ ଫଳ ଦେଏ।
₹500 ପ୍ରତି ମାସ SIP ଆପଣଙ୍କ ଟଙ୍କା ସହ ଏହା କରେ। ମାସ ର 5 ତାରିଖ ରେ ₹500 ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟ ରୁ Mutual Fund କୁ ଯାଏ। ଆପଣ ମନେ ରଖିବା ଦରକାର ନାହିଁ।
SIP ବନ୍ଦ କରି ହୁଏ? ହଁ। ଯେ କୌଣସି ସମୟ। ଜୁରିମାନା ନାହିଁ।
ସର୍ବ କମ SIP: ₹500 ପ୍ରତି ମାସ। ଏକ ଥଳି ଚାଉଳ ଠାରୁ କମ।`,
  },
  {
    type: 'glossary',
    slug: 'what-is-insurance',
    category: 'glossary',
    status: 'published',
    character_name: null,
    character_profession_en: null,
    character_profession_or: null,
    title_en: 'What is Insurance?',
    title_or: 'ବୀମା କଣ?',
    preview_en: 'Insurance is a promise. You pay a small amount every year. In return, if something bad happens, a large amount is paid to you or your family.',
    preview_or: 'ବୀମା ଏକ ପ୍ରତିଶ୍ରୁତି। ଆପଣ ପ୍ରତି ବର୍ଷ ଅଳ୍ପ ଟଙ୍କା ଦିଅନ୍ତି। ବଦଳ ରେ, ଖରାପ ଘଟଣା ହଲେ, ବଡ ଟଙ୍କା ମିଳେ।',
    body_en: `Insurance is a promise. You pay a small amount every year — called a premium. In return, if something bad happens — illness, accident, death — a large amount is paid to you or your family.
Think of it like the old Odia village tradition: when a cyclone damaged someone's house, the whole village came together to help rebuild. Everyone contributed a little. No one could afford to rebuild alone, but together they could.
Insurance works the same way. Thousands of people pay small premiums. The money pools together. When one person faces a disaster, the pool pays for it.
Types relevant to you:
Term Life Insurance — if you die, your family gets ₹50 lakh or more. Premium as low as ₹650 per month for a 28-year-old.
Health Insurance — if you are hospitalised, the bill is paid by the insurer, not from your savings.
Personal Accident — if you are injured and cannot work, you receive compensation.
The most important thing about insurance: buy it when you do not need it. By the time you need it, it is too late to buy.`,
    body_or: `ବୀମା ଏକ ପ୍ରତିଶ୍ରୁତି। ଆପଣ ପ୍ରତି ବର୍ଷ ଅଳ୍ପ ଟଙ୍କା ଦିଅନ୍ତି — Premium। ବଦଳ ରେ, ଅସୁସ୍ଥ, ଦୁର୍ଘଟଣା, ବା ମୃତ୍ୟୁ ହଲେ — ବଡ ଟଙ୍କା ଆପଣଙ୍କ ବା ପରିବାରକୁ ମିଳେ।
ଓଡ଼ିଶାର ପୁରୁଣା ଗ୍ରାମ ପରମ୍ପରା ଭଳି — ଝଡ ଘର ଭାଙ୍ଗିଲେ ସମ୍ପୂର୍ଣ୍ଣ ଗ୍ରାମ ଏକ ହୋଇ ସାହାଯ୍ୟ କଲା। ସମେ ସ୍ୱଳ୍ପ ଦଲ। ଏକାଠି ବଡ ସ୍ୱପ୍ନ।
ବୀମା ଏହିଭଳି। ହଜାର ଲୋକ ଅଳ୍ପ Premium ଦିଅନ୍ତି। ଟଙ୍କା ଏକ ଜାଗା ରୁହେ। ଯୋଗ୍ୟ ଲୋକ ଆବଶ୍ୟ ସମୟ ରେ ପାଆନ୍ତି।
ବୀମାର ସବୁଠୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କଥା: ଆବଶ୍ୟ ନ ଥିବା ବେଳ କିଣନ୍ତୁ। ଆବଶ୍ୟ ହେଲ ବେଳ କିଣିବା ଦେରି ହୋଇ ଯାଏ।`,
  },
];

async function seed() {
  console.log('Seeding content_items...');
  for (const item of content) {
    const { error } = await supabase
      .from('content_items')
      .upsert(item, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${item.slug}`, error.message);
    } else {
      console.log(`OK: ${item.slug}`);
    }
  }
  console.log('Done.');
}

seed();
