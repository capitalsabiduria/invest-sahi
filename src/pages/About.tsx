import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import SEO from '@/components/SEO';
import { WHATSAPP_URL } from '@/config/constants';

const About = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or' ? 'ଆମ କଥା — InvestSahi' : 'Our Story — InvestSahi'}
        description={
          currentLang === 'or'
            ? 'InvestSahi 2024ରେ ରିଷଭଙ୍କ ଦ୍ୱାରା ଆରମ୍ଭ ହୋଇଥିଲା, ଯାଦ୍ୱାରା ଓଡ଼ିଶାର ପ୍ରତିଟି ପରିବାର ସଠିକ ଆର୍ଥିକ ମାର୍ଗଦର୍ଶନ ପାଇ ପାରିବେ।'
            : 'InvestSahi was started in 2024 by Rishab, born and raised in Odisha, to bring honest financial guidance to every family in Odisha. Investments starting from Rs500.'
        }
        url={`/${currentLang}/about`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />

      {/* SECTION 1 — Hero */}
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-2">
            {currentLang === 'or' ? 'ଆମ କଥା' : 'Our Story'}
          </h1>
          <p className="font-odia text-xl text-muted-foreground mb-8">ଆମ କଥା</p>
        </div>
      </section>

      {/* SECTION 2 — The Story */}
      <section className="bg-background">
        <div className="max-w-2xl mx-auto px-4 pb-8">
          {currentLang === 'en' ? (
            <>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                Growing up in Odisha, I watched people around me work hard their entire lives and still struggle. Not because they didn't earn enough. But because nobody told them what to do with what they earned.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                I saw families put their savings in the wrong places. I saw people take loans they didn't need, miss opportunities they didn't know existed, and retire with far less than they deserved. All because they never had anyone in their corner who could give them honest, clear financial guidance.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                The painful part? It wasn't ignorance. It was access. The right advice existed but it was buried in English, wrapped in jargon, and priced for people who were already wealthy.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                The families who needed it most, the government teacher saving ₹3,000 a month, the auto driver in Bhubaneswar, the young engineer sending money home to Ganjam, they were told directly or indirectly that investing was not for them.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                I started InvestSahi in 2024 because I refused to accept that.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                The name means everything. Sahi means correct, honest, and rooted in your own neighbourhood. That is what financial advice should be. Not complicated. Not exclusive. Not in a language that feels foreign in your own home.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                We built InvestSahi to be the trusted older cousin who went to college, came back, and sat down with the family to finally explain how money actually works. In Odia. In English. With investments starting as low as ₹500. Without judgment, without jargon, and without an agenda.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                Odisha has 4.6 crore people with real financial goals and real financial fears. They deserve real guidance.
              </p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">
                That is why InvestSahi exists.
              </p>
            </>
          ) : (
            <>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ଓଡ଼ିଶାରେ ବଡ଼ ହେଉଥିବା ବେଳେ, ମୁଁ ମୋ ଚାରିପଟେ ଲୋକଙ୍କୁ ସାରା ଜୀବନ ପରିଶ୍ରମ କରି ତଥାପି ସଂଘର୍ଷ କରୁଥିବାର ଦେଖିଛି। ଏହା ସେମାନଙ୍କ ରୋଜଗାର କମ ଥିଲା ବୋଲି ନୁହେଁ। ବରଂ ସେ ରୋଜଗାରରେ କ'ଣ କରିବେ, ଏହା କେହି କହି ନଥିଲେ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ମୁଁ ଦେଖିଛି ପରିବାରଗୁଡ଼ିକ ଭୁଲ ଜାଗାରେ ସଞ୍ଚୟ ରଖୁଛନ୍ତି। ଅଦରକାରୀ ଋଣ ନେଉଛନ୍ତି। ଅବସର ସମୟ ଆସିବା ବେଳକୁ ଯାହା ପ୍ରାପ୍ୟ ତାର ଅଧାରୁ ଅଧିକ ହଜାଇ ଦେଇଛନ୍ତି। ସଠିକ ପରାମର୍ଶ ଦେଇ ସାହାଯ୍ୟ କରିବାକୁ କେହି ନଥିଲେ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ଯନ୍ତ୍ରଣାର କଥା ଏଇଠି। ସମସ୍ୟା ଜ୍ଞାନ ନ ଥିବା ନୁହେଁ, ସମସ୍ୟା ହେଉଛି ସୁଯୋଗ ନ ଥିବା। ସଠିକ ଉପଦେଶ ଥିଲା କିନ୍ତୁ ଇଂରାଜୀରେ, ଜଟିଳ ଭାଷାରେ ଘୋଡ଼େଇ, ଏବଂ ଯେଉଁମାନେ ଆଗରୁ ଧନୀ ସେମାନଙ୍କ ପାଇଁ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ଯେଉଁ ପରିବାରଗୁଡ଼ିକର ସବୁଠୁ ଅଧିକ ଦରକାର ଥିଲା, ମାସକୁ ₹3,000 ସଞ୍ଚୟ କରୁଥିବା ସ୍କୁଲ ଶିକ୍ଷକ, ଭୁବନେଶ୍ୱରରେ ଅଟୋ ଚଲାଉଥିବା ଭାଇ, ଗଞ୍ଜାମରୁ ଆସି ପ୍ରଥମ ଚାକିରି କରୁଥିବା ଯୁବ ଇଞ୍ଜିନିୟର, ସେମାନଙ୍କୁ ପ୍ରତ୍ୟକ୍ଷ ବା ପରୋକ୍ଷ ଭାବେ ବୁଝାଇ ଦିଆ ଯାଉଥିଲା ଯେ ବିନିଯୋଗ ସେମାନଙ୍କ ପାଇଁ ନୁହେଁ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ମୁଁ 2024ରେ InvestSahi ଆରମ୍ଭ କଲି କାରଣ ଏହା ମୁଁ ମାନି ନେଇ ପାରୁ ନ ଥିଲି।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ଏହି ନାମ ସବୁ କଥା କୁହେ। ସହି ଅର୍ଥ ସଠିକ, ସତ୍ୟ, ଏବଂ ଆମ ନିଜ ଅଞ୍ଚଳର। ଆର୍ଥିକ ଉପଦେଶ ଠିକ ଏମିତି ହେବା ଉଚିତ। ଜଟିଳ ନୁହେଁ। ଦୂରରେ ନୁହେଁ। ଆପଣଙ୍କ ନିଜ ଘରେ ଅଜଣା ଭାଷାରେ ନୁହେଁ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                InvestSahi ହେଉଛି ସେ ବିଶ୍ୱସ୍ତ ବଡ଼ ଭାଇ ଭଳି ଯିଏ ପଢ଼ିଲା, ଫେରି ଆଲ, ଏବଂ ପରିବାର ସହ ବସି ସ୍ପଷ୍ଟ ଭାଷାରେ ବୁଝାଇଲା ଯେ ଟଙ୍କା ଆସଲରେ କିପରି କାମ କରେ। ଓଡ଼ିଆରେ। ଇଂରାଜୀରେ। ମାତ୍ର ₹500 ରୁ ବିନିଯୋଗ ଆରମ୍ଭ ହୁଏ। ବିନା ଦ୍ୱିଧାରେ, ବିନା ଜଟିଳ ଭାଷାରେ, ବିନା ଛଳନାରେ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ଓଡ଼ିଶାରେ 4.6 କୋଟି ମଣିଷ। ସବୁଙ୍କର ଆସଲ ଆର୍ଥିକ ଲକ୍ଷ୍ୟ ଅଛି, ଆସଲ ଡର ଅଛି। ସେମାନେ ଆସଲ ମାର୍ଗଦର୍ଶନ ପାଇବାର ଯୋଗ୍ୟ।
              </p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">
                ସେଇଥି ପାଇଁ InvestSahi ଅଛି।
              </p>
            </>
          )}
        </div>

        {/* SECTION 3 — Founder card */}
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-5 mt-10 pt-8 border-t border-border">
            <img
              src="/rishab.jpg"
              alt="Rishab, Founder of InvestSahi"
              className="w-16 h-16 rounded-full object-cover border-2 border-saffron"
            />
            <div>
              <p className="font-heading font-bold text-foreground text-lg">Rishab</p>
              <p className="text-sm text-muted-foreground font-body">Founder, InvestSahi</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">Bhubaneswar, Odisha</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — What We Believe */}
      <section style={{ backgroundColor: '#F5EDD8' }}>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="font-heading font-bold text-3xl text-foreground text-center mb-10">
            {currentLang === 'or' ? 'ଆମ ବିଶ୍ୱାସ' : 'What We Believe'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-saffron-light rounded-full flex items-center justify-center mb-4">
                <span className="text-saffron font-bold text-sm">₹</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {currentLang === 'or' ? '₹500 ଯଥେଷ୍ଟ' : '₹500 is enough to start'}
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                {currentLang === 'or'
                  ? 'ସମ୍ପଦ ଆପଣ କେତେ ରୋଜଗାର କରନ୍ତି ତା ଉପରେ ନ ନିର୍ଭର କରି, ଆପଣ ରୋଜଗାରରେ କ\'ଣ କରନ୍ତି ତା ଉପରେ ନିର୍ଭର କରେ।'
                  : 'Wealth is not about how much you earn. It is about what you do with what you earn. We celebrate every ₹500 investment as loudly as any big one.'}
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-green-light rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-green" size={20} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {currentLang === 'or' ? 'ଆପଣଙ୍କ ଭାଷା, ଆପଣଙ୍କ ଆତ୍ମବିଶ୍ୱାସ' : 'Your language, your confidence'}
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                {currentLang === 'or'
                  ? 'ଯେଉଁ ଭାଷା ଆପଣ ଭଲ ବୁଝନ୍ତି ନାହିଁ ସେଥିରେ ଦିଆ ଉପଦେଶ ଅଧା ଉପଦେଶ। ଆମେ ଓଡ଼ିଆରେ କଥା ହୁଉ କାରଣ ଆପଣ ପ୍ରତ୍ୟେକ ଶବ୍ଦ ବୁଝିବା ଯୋଗ୍ୟ।'
                  : 'Financial advice in a language you don\'t fully understand is advice half received. We speak Odia because you deserve to understand every word.'}
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="w-10 h-10 bg-blue-light rounded-full flex items-center justify-center mb-4">
                <Shield className="text-blue" size={20} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {currentLang === 'or' ? 'ଛଳନା ନାହିଁ, କେବଳ ସତ୍ୟ' : 'No agenda, just honesty'}
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                {currentLang === 'or'
                  ? 'ଆମେ ଆପଣଙ୍କୁ ସ୍ପଷ୍ଟ ଭାବରେ କହୁ ଯେ କ\'ଣ ଆପଣଙ୍କ ପାଇଁ ଉଚିତ ଏବଂ କ\'ଣ ନୁହେଁ। ଆପଣଙ୍କ ବିଶ୍ୱାସ ଅର୍ଜନ କରିବା ଆମ ଲକ୍ଷ୍ୟ।'
                  : 'We tell you when something is right for you and when it is not. We have no incentive to mislead you and every reason to earn your trust.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Trust paragraph */}
      <section className="bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="border-l-4 pl-6" style={{ borderColor: '#E8820C' }}>
            <h2 className="font-heading font-bold text-xl mb-4">
              {currentLang === 'or' ? 'ବିଶ୍ୱାସ ବିଷୟରେ ଏକ କଥା' : 'A word on trust'}
            </h2>
            <p className="font-body text-foreground text-base leading-relaxed mb-3">
              {currentLang === 'or'
                ? 'ଆମେ ଜାଣୁ ଅନେକ ଓଡ଼ିଆ ପରିବାର ଭୁଲ ନିଷ୍ପତ୍ତି ଏବଂ ଖରାପ ପରାମର୍ଶ ଯୋଗୁ ସଞ୍ଚୟ ହଜାଇଛନ୍ତି। ଆମେ ଏହା ଅସ୍ୱୀକାର କରୁ ନାହୁଁ।'
                : 'We know many Odia families lost savings due to poor advice and wrong financial decisions. We do not pretend that did not happen.'}
            </p>
            <p className="font-body text-foreground text-base leading-relaxed mb-3">
              {currentLang === 'or'
                ? 'ଏହା ଭିନ୍ନ। ଏଠାରେ ଠିକ୍ ଭାବରେ ବୁଝାଇ ଦଉଛୁ:'
                : 'This is different. Here is exactly why:'}
            </p>
            <ol className="space-y-3 mt-4 text-sm font-body text-foreground">
              {currentLang === 'or' ? (
                <>
                  <li>1. ଆପଣଙ୍କ ଟଙ୍କା ସିଧା SEBI ପଞ୍ଜୀକୃତ ମ୍ୟୁଚୁଆଲ ଫଣ୍ଡ ଏବଂ IRDAI ଲାଇସେନ୍ସ ଥିବା ବୀମା କମ୍ପାନୀକୁ ଯାଏ। ଆମ ପାଖରେ କଦାପି ରହେ ନାହିଁ।</li>
                  <li>2. ଆମେ AMFI ଏବଂ IRDAI ସହ ପଞ୍ଜୀକୃତ। ଆମ ପଞ୍ଜୀକରଣ ନମ୍ବର ପ୍ରତ୍ୟେକ ପୃଷ୍ଠାରେ ଦେଖାଯାଏ।</li>
                  <li>3. ଆପଣ ଯେକୌଣସି ସମୟରେ ସିଧା ଫଣ୍ଡ ହାଉସ ବା ବୀମା କମ୍ପାନୀ ସହ ଆପଣଙ୍କ ଆକାଉଣ୍ଟ ଯାଞ୍ଚ କରି ପାରିବେ।</li>
                  <li>4. ଆମେ ନିର୍ଦ୍ଧିଷ୍ଟ ପରାମର୍ଶ ଫି ବା AMFI କମିଶନ ପାଉ। ଆପଣଙ୍କୁ ବିଭ୍ରାନ୍ତ କରିବାର ଆମ କୌଣସି କାରଣ ନାହିଁ।</li>
                </>
              ) : (
                <>
                  <li>1. Your money goes directly to SEBI regulated mutual funds and IRDAI licensed insurance companies. It is never held by us.</li>
                  <li>2. We are registered with AMFI and IRDAI. Our registration numbers are displayed on every page.</li>
                  <li>3. You can check your account balance directly with the fund house or insurer at any time, independent of us.</li>
                  <li>4. We earn a fixed advisory fee or AMFI commission. We have no incentive to mislead you.</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section style={{ backgroundColor: '#1B6B3A' }}>
        <div className="text-white text-center py-16 px-4">
          <h2 className="font-heading font-bold text-3xl mb-3">
            {currentLang === 'or' ? 'ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ?' : 'Ready to start your journey?'}
          </h2>
          <p className="font-body text-white/80 mb-8">
            {currentLang === 'or'
              ? 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ। କୌଣସି ଚାପ ନାହିଁ, ସରଳ ଏବଂ ସଚ୍ଚୋଟ ପରାମର୍ଶ।'
              : 'Book a free call. No pressure, no jargon, just honest advice.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/${currentLang}/book`}
              className="bg-white font-heading font-semibold px-8 py-3 rounded-xl"
              style={{ color: '#E8820C' }}
            >
              {currentLang === 'or' ? 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ' : 'Book a Free Call'}
            </Link>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hi, I would like to know more about InvestSahi')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white font-heading font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              {currentLang === 'or' ? 'WhatsApp କରନ୍ତୁ' : 'WhatsApp Us'}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

export default About;
