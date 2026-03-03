import { supabase } from '@/integrations/supabase/client';

const content = [
  {
    type: 'story',
    slug: 'mamata-savings-vs-sip',
    language: 'en',
    title: 'Mamata: What 5 Years in a Bank Account Really Cost Her',
    category: 'Savings vs SIP',
    character_name: 'Mamata',
    character_profession: 'School Teacher, Kendrapara',
    preview: 'Mamata saved ₹2,000 every month in her bank account for 5 years. See what she missed — and what she is doing differently now.',
    body: `Mamata Rath teaches Class 7 in a government school in Kendrapara. Every month, without fail, she transferred ₹2,000 into her savings account. She was proud of her discipline.
After 5 years, she had saved ₹1,20,000. Her bank balance showed ₹1,31,400 — the extra ₹11,400 was interest at around 3.5% per year.
Then her colleague Sunita mentioned a SIP. Mamata did the math. ₹2,000 per month in a mutual fund SIP for the same 5 years, at a 12% average annual return, would have grown to ₹1,64,000.
The difference: ₹32,600. That is more than one month of her salary — simply from choosing a different place to put the same money.
Mamata is now 3 years into a SIP. She did not stop saving. She just started saving smarter.
If your situation is similar to Mamata's, let us talk.`,
    status: 'published',
  },
  {
    type: 'story',
    slug: 'mamata-savings-vs-sip',
    language: 'or',
    title: 'ମମତା: 5 ବର୍ଷ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରେ ରଖିବାର ଅସଲ ମୂଲ୍ୟ',
    category: 'ସଞ୍ଚୟ ବନାମ SIP',
    character_name: 'ମମତା',
    character_profession: 'ବିଦ୍ୟାଳୟ ଶିକ୍ଷୟିତ୍ରୀ, କେନ୍ଦ୍ରାପଡ଼ା',
    preview: 'ମମତା ପ୍ରତି ମାସ ₹2,000 ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରେ ଜମା କରୁଥିଲେ 5 ବର୍ଷ। ଦେଖନ୍ତୁ ସେ କ\'ଣ ଗୁମାଇଲେ।',
    body: `ମମତା ରଥ କେନ୍ଦ୍ରାପଡ଼ାର ଏକ ସରକାରୀ ବିଦ୍ୟାଳୟରେ ସପ୍ତମ ଶ୍ରେଣୀ ପଢ଼ାନ୍ତି। ପ୍ରତି ମାସ, ବିନା ବ୍ୟତିକ୍ରମ, ସେ ₹2,000 ନିଜ ସଞ୍ଚୟ ଆକାଉଣ୍ଟକୁ ଜମା କରୁଥିଲେ।
5 ବର୍ଷ ପରେ, ତାଙ୍କ ପାଖରେ ₹1,20,000 ସଞ୍ଚୟ ଥିଲା। ବ୍ୟାଙ୍କ ବ୍ୟାଲାନ୍ସ ₹1,31,400 ଦେଖାଉଥିଲା।
ତାଙ୍କ ସହକର୍ମୀ ସୁନୀତା SIP ବିଷୟରେ କହିଲେ। ମମତା ହିସାବ କଲେ। ସେ SIP ରେ ₹2,000 ପ୍ରତି ମାସ ରଖିଥିଲେ 5 ବର୍ଷ ପାଇଁ, 12% ହାରରେ ₹1,64,000 ହୋଇ ଯାଆନ୍ତା।
ଫରକ: ₹32,600। ଏକା ଟଙ୍କା, ଅଲଗା ଜାଗା। ଏତିକି ଫରକ।
ମମତା ବର୍ତ୍ତମାନ 3 ବର୍ଷ ଧରି SIP ଚଲାଉଛନ୍ତି। ଆପଣଙ୍କ ପରିସ୍ଥିତି ମମତାଙ୍କ ପରି? ଆସନ୍ତୁ କଥା ହୁଅନ୍ତୁ।`,
    status: 'published',
  },
  {
    type: 'story',
    slug: 'rabi-auto-driver-sip',
    language: 'en',
    title: 'Rabi: The Auto Driver Who Thought Investing Was Not for Him',
    category: 'Starting from Zero',
    character_name: 'Rabi',
    character_profession: 'Auto Driver, Bhubaneswar',
    preview: 'Rabi thought investing was only for salaried people. He earns ₹18,000 a month. Here is what he started with ₹500.',
    body: `Rabi Pradhan drives an auto in Bhubaneswar. Some months are good — ₹22,000. Some months are hard — ₹14,000. Average around ₹18,000.
He always thought SIPs were for people with fixed salaries. "What if I can't pay one month?" he asked.
The answer surprised him: if you miss a SIP instalment, nothing happens. No penalty. No cancellation. The SIP simply skips that month. You can pause it, reduce it, or stop it anytime.
Rabi started a ₹500 SIP. On good months, he tops it up manually with ₹500 or ₹1,000 more. On hard months, he lets it run at ₹500.
After 18 months, he has ₹11,200 in his mutual fund — more than he ever managed to keep in his bank account. And it is still growing.
Your income does not need to be fixed. Your future does not need to wait.`,
    status: 'published',
  },
  {
    type: 'story',
    slug: 'rabi-auto-driver-sip',
    language: 'or',
    title: 'ରବି: ଯେ Auto ଚାଳକ ଭାବୁଥିଲେ ବିନିଯୋଗ ତାଙ୍କ ପାଇଁ ନୁହେଁ',
    category: 'ଶୂନ୍ୟରୁ ଆରମ୍ଭ',
    character_name: 'ରବି',
    character_profession: 'Auto ଚାଳକ, ଭୁବନେଶ୍ୱର',
    preview: 'ରବି ଭାବୁଥିଲେ ବିନିଯୋଗ କେବଳ ଦରମା ଲୋକଙ୍କ ପାଇଁ। ତାଙ୍କ ଆୟ ₹18,000। ₹500ରୁ ଆରମ୍ଭ।',
    body: `ରବି ପ୍ରଧାନ ଭୁବନେଶ୍ୱରରେ Auto ଚଲାନ୍ତି। କେତେ ମାସ ଭଲ — ₹22,000। କେତେ ମାସ କଷ୍ଟ — ₹14,000। ହାରାହାରି ₹18,000।
ସେ ସବୁ ବେଳ ଭାବୁଥିଲେ SIP କେବଳ ଦରମା ଲୋକଙ୍କ ପାଇଁ। "ଏକ ମାସ ଦେଇ ନ ପାରିଲେ?" ସେ ପଚାରିଲେ।
ଉତ୍ତର ତାଙ୍କୁ ଆଶ୍ଚର୍ଯ୍ୟ କଲା: SIP ଏକ ମାସ ବନ୍ଦ ରହିଲେ କୌଣସି ଜରିମାନା ନାହିଁ। ଯେ କୌଣସି ସମୟ ରୋକି ହୁଏ।
ରବି ₹500 SIP ଆରମ୍ଭ କଲେ। ଭଲ ମାସ ରେ ₹500-1,000 ଅଧିକ ଦେନ୍ତି। କଷ୍ଟ ମାସ ରେ ₹500 ଚଲେ।
18 ମାସ ପରେ ତାଙ୍କ Mutual Fund ରେ ₹11,200 ଅଛି। ଆଜିର ଆୟ ଅନିୟମିତ ହୋଇ ପାରେ। ଭବିଷ୍ୟ ଅପେକ୍ଷା କରିବ ନାହିଁ।`,
    status: 'published',
  },
  {
    type: 'story',
    slug: 'sushanta-crpf-insurance',
    language: 'en',
    title: 'Sushanta: The Conversation His Family Wishes They Had',
    category: 'Protection',
    character_name: 'Sushanta',
    character_profession: 'CRPF Jawan, Ganjam',
    preview: 'Sushanta sent money home every month. He had no life insurance. This is the conversation his family wishes they had had.',
    body: `Sushanta Nayak from Ganjam sends ₹8,000 home every month. His parents depend on it. His younger sister's college fees come from it.
He is 28. Healthy. Feels invincible.
He has no term life insurance.
If something happened to Sushanta tonight, his family would receive his CRPF service benefits — a process that takes months and requires paperwork most families struggle with. The monthly ₹8,000 would stop immediately.
A ₹50 lakh term insurance policy for Sushanta costs approximately ₹650 per month at his age. That is less than what he spends on mobile recharge and snacks.
If he bought it today and nothing ever happened — he would have spent money protecting his family. If something did happen — his family would receive ₹50 lakh. Enough to replace his income for years. Enough for his sister to finish college.
The question is not whether you can afford term insurance. The question is whether your family can afford it if you do not have it.`,
    status: 'published',
  },
  {
    type: 'story',
    slug: 'sushanta-crpf-insurance',
    language: 'or',
    title: 'ସୁଶାନ୍ତ: ଆଲୋଚନା ଯାହା ତାଙ୍କ ପରିବାର ଚାହୁଁଥିଲ ଆଗରୁ ହୋଇ ଯାଆନ୍ତା',
    category: 'ସୁରକ୍ଷା',
    character_name: 'ସୁଶାନ୍ତ',
    character_profession: 'CRPF ଜୱାନ, ଗଞ୍ଜାମ',
    preview: 'ସୁଶାନ୍ତ ପ୍ରତି ମାସ ଘରକୁ ଟଙ୍କା ପଠାଉଥିଲେ। ଜୀବନ ବୀମା ଛିଲ ନାହିଁ।',
    body: `ଗଞ୍ଜାମର ସୁଶାନ୍ତ ନାୟକ ପ୍ରତି ମାସ ₹8,000 ଘରକୁ ପଠାନ୍ତି। ଭଉଣୀର College ଖର୍ଚ ଏଥିରୁ ଯାଏ।
ସେ 28 ବର୍ଷ। ସୁସ୍ଥ। ଜୀବନ ବୀମା ନାହିଁ।
ଆଜି ରାତି କିଛି ହେଲେ, ₹8,000 ମାସ ବନ୍ଦ। ତୁରନ୍ତ।
₹50 ଲକ୍ଷ Term Insurance ତାଙ୍କ ପାଇଁ ମାସ ₹650। Mobile Recharge ଠାରୁ କମ।
ଆଜି କିଣନ୍ତୁ, କିଛି ନ ହଉ — ପରିବାର ସୁରକ୍ଷିତ। କିଛି ହଉ — ₹50 ଲକ୍ଷ। ଭଉଣୀ College ଶେଷ କରିବ।
ପ୍ରଶ୍ନ ଏହା ନୁହେଁ ଯେ ଆପଣ ଦେଇ ପାରିବେ। ପ୍ରଶ୍ନ ଏହା ଯେ ଆପଣ ନ ଥିଲେ ଆପଣଙ୍କ ପରିବାର ଦେଇ ପାରିବ କି।`,
    status: 'published',
  },
  {
    type: 'glossary',
    slug: 'what-is-sip',
    language: 'en',
    title: 'What is a SIP?',
    category: 'Glossary',
    preview: 'SIP stands for Systematic Investment Plan. It means investing a fixed amount every month into a mutual fund — automatically.',
    body: `SIP stands for Systematic Investment Plan. It means investing a fixed amount every month into a mutual fund — automatically, on a date you choose.
Think of it like a fisherman casting his net into the Mahanadi at the same time every morning. He does not wait for the perfect day. He shows up consistently. Over months and years, the consistent effort builds something meaningful.
A SIP of ₹500/month does the same thing with your money. On the 5th of every month (or whichever date you pick), ₹500 moves from your bank account into a mutual fund. You do not need to remember. You do not need to time the market. It just happens.
Why SIP instead of a lump sum? Because most of us do not have a lump sum lying around. We have income. SIPs are built for income earners.
Can you stop a SIP? Yes. Anytime. No penalty. No paperwork beyond a simple request.
Minimum SIP amount: ₹500/month. That is less than a bag of rice.`,
    status: 'published',
  },
  {
    type: 'glossary',
    slug: 'what-is-sip',
    language: 'or',
    title: 'SIP କ\'ଣ?',
    category: 'ଶବ୍ଦ ଭଣ୍ଡାର',
    preview: 'SIP ମାନେ Systematic Investment Plan। ପ୍ରତି ମାସ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ରାଶି Mutual Fund ରେ ସ୍ୱୟଂଚାଳିତ ଭାବେ ବିନିଯୋଗ।',
    body: `SIP ମାନେ Systematic Investment Plan। ପ୍ରତି ମାସ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ତାରିଖ ରେ ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରୁ ଟଙ୍କା ସ୍ୱୟଂଚାଳିତ ଭାବେ Mutual Fund ରେ ଯାଏ।
ମହାନଦୀ ରେ ପ୍ରତି ଦିନ ଏକ ନିର୍ଦ୍ଧିଷ୍ଟ ସମୟ ରେ ଜାଲ ପକାଉଥିବା ଜେଲ ବ୍ୟକ୍ତି ଭଳି — ସଠିକ ଦିନ ଅପେକ୍ଷା ନ କରି, ନିୟମିତ ଆସେ। ମାସ ପରେ ମାସ, ଏହି ନିୟମିତ ପ୍ରଚେଷ୍ଟା ଏକ ବଡ ଫଳ ଦେଏ।
₹500/ମାସ SIP ଆପଣଙ୍କ ଟଙ୍କା ସହ ଏହା କରେ। ମାସ ର 5 ତାରିଖ ରେ ₹500 ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟ ରୁ Mutual Fund କୁ ଯାଏ। ଆପଣ ମନେ ରଖିବା ଦରକାର ନାହିଁ।
SIP ବନ୍ଦ କରି ହୁଏ? ହଁ। ଯେ କୌଣସି ସମୟ। ଜୁରିମାନା ନାହିଁ।
ସର୍ବ କମ SIP: ₹500/ମାସ। ଏକ ଥଳି ଚାଉଳ ଠାରୁ କମ।`,
    status: 'published',
  },
  {
    type: 'glossary',
    slug: 'what-is-insurance',
    language: 'en',
    title: 'What is Insurance?',
    category: 'Glossary',
    preview: 'Insurance is a promise. You pay a small amount every year. In return, if something bad happens, a large amount is paid to you or your family.',
    body: `Insurance is a promise. You pay a small amount every year — called a premium. In return, if something bad happens — illness, accident, death — a large amount is paid to you or your family.
Think of it like the old Odishan village tradition: when a cyclone damaged someone's house, the whole village came together to help rebuild. Everyone contributed a little. No one could afford to rebuild alone, but together they could.
Insurance works the same way. Thousands of people pay small premiums. The money pools together. When one person faces a disaster, the pool pays for it.
Types relevant to you:
Term Life Insurance — if you die, your family gets ₹50 lakh or more. Premium as low as ₹650/month for a 28-year-old.
Health Insurance — if you are hospitalised, the bill is paid by the insurer. Not from your savings.
Personal Accident — if you are injured and cannot work, you receive compensation.
The most important thing about insurance: buy it when you do not need it. By the time you need it, it is too late to buy.`,
    status: 'published',
  },
  {
    type: 'glossary',
    slug: 'what-is-insurance',
    language: 'or',
    title: 'ବୀମା କ\'ଣ?',
    category: 'ଶବ୍ଦ ଭଣ୍ଡାର',
    preview: 'ବୀମା ଏକ ପ୍ରତିଶ୍ରୁତି। ଆପଣ ପ୍ରତି ବର୍ଷ ଅଳ୍ପ ଟଙ୍କା ଦିଅନ୍ତି। ବଦଳ ରେ, ଖରାପ ଘଟଣା ହଲେ, ବଡ ଟଙ୍କା ମିଳେ।',
    body: `ବୀମା ଏକ ପ୍ରତିଶ୍ରୁତି। ଆପଣ ପ୍ରତି ବର୍ଷ ଅଳ୍ପ ଟଙ୍କା ଦିଅନ୍ତି — Premium। ବଦଳ ରେ, ଅସୁସ୍ଥ, ଦୁର୍ଘଟଣା, ବା ମୃତ୍ୟୁ ହଲେ — ବଡ ଟଙ୍କା ଆପଣଙ୍କ ବା ପରିବାରକୁ ମିଳେ।
ଓଡ଼ିଶାର ପୁରୁଣା ଗ୍ରାମ ପରମ୍ପରା ଭଳି — ଝଡ ଘର ଭାଙ୍ଗିଲେ ସମ୍ପୂର୍ଣ୍ଣ ଗ୍ରାମ ଏକ ହୋଇ ସାହାଯ୍ୟ କଲା। ସମେ ସ୍ୱଳ୍ପ ଦଲ। ଏକାଠି ବଡ ସ୍ୱପ୍ନ।
ବୀମା ଏହିଭଳି। ହଜାର ଲୋକ ଅଳ୍ପ Premium ଦିଅନ୍ତି। ଟଙ୍କା ଏକ ଜାଗା ରୁହେ। ଯୋଗ୍ୟ ଲୋକ ଆବଶ୍ୟ ସମୟ ରେ ପାଆନ୍ତି।
ବୀମାର ସବୁଠୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କଥା: ଆବଶ୍ୟ ନ ଥିବା ବେଳ କିଣନ୍ତୁ। ଆବଶ୍ୟ ହେଲ ବେଳ କିଣିବା ଦେରି ହୋଇ ଯାଏ।`,
    status: 'published',
  },
];

async function seed() {
  console.log('Seeding content_items...');
  for (const item of content) {
    const { error } = await supabase.from('content_items').upsert(item, {
      onConflict: 'slug,language',
    });
    if (error) {
      console.error(`Failed: ${item.slug} (${item.language})`, error.message);
    } else {
      console.log(`OK: ${item.slug} (${item.language})`);
    }
  }
  console.log('Done.');
}

seed();
