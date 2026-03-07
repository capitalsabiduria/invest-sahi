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
        title={currentLang === 'or' ? 'ଆମ ଲକ୍ଷ୍ୟ — InvestSahi' : 'Our Mission — InvestSahi'}
        description={
          currentLang === 'or'
            ? 'InvestSahi 2024ରେ ଓଡ଼ିଶାର ପ୍ରତ୍ୟେକ ପରିବାର ପାଇଁ ସଚ୍ଚୋଟ ଆର୍ଥିକ ମାର୍ଗଦର୍ଶନ ଆଣିବା ପାଇଁ ଆରମ୍ଭ ହୋଇଥିଲା।'
            : 'InvestSahi was built in 2024 to bring honest, clear financial guidance to every family in Odisha. In their language. At a price that does not exclude them.'
        }
        url={`/${currentLang}/about`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />

      {/* SECTION 1 — Hero */}
      <section className="bg-background py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-2">
            {currentLang === 'or' ? 'ଆମ ଲକ୍ଷ୍ୟ' : 'Our Mission'}
          </h1>
          <p className="font-odia text-xl text-muted-foreground">ଆମ ଲକ୍ଷ୍ୟ</p>
        </div>
      </section>

      {/* SECTION 2 — The Story + SECTION 3 — Founder Quote */}
      <section className="bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {currentLang === 'en' ? (
            <>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">Odisha is a state of hard workers.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">Teachers, auto drivers, factory supervisors, young engineers who are the first in their family to hold a degree. For generations, they have worked hard, spent carefully, and saved what they could.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">And yet, something kept going wrong.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">Savings sat in accounts earning less than inflation. Loans were taken that did not need to be taken. Retirements arrived with far less than deserved. Not because of bad luck. Because nobody ever sat down with these families and told them, clearly and honestly, what to do with the money they had worked so hard to earn.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">The advice existed. But it lived in English, behind jargon, inside offices that felt like they were built for someone else. The families who needed it most were told, directly or indirectly, that investing was not for them.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">InvestSahi was built in 2024 to prove that wrong.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">Sahi means correct. It means honest. Financial advice should be both. Correct in its guidance. Honest in its intent.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">Odisha has 4.6 crore people with real financial goals and real financial fears. They deserve real guidance. In their language. At a price that does not exclude them.</p>
              <p className="font-body text-foreground text-lg leading-relaxed mb-6">That is what InvestSahi is.</p>
            </>
          ) : (
            <>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ଓଡ଼ିଶା ପରିଶ୍ରମୀ ମଣିଷଙ୍କ ରାଜ୍ୟ।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ଶିକ୍ଷକ, ଅଟୋ ଚାଳକ, କାରଖାନା କର୍ମଚାରୀ, ପରିବାରରେ ପ୍ରଥମ ଡିଗ୍ରୀଧାରୀ ଯୁବ ଇଞ୍ଜିନିୟର। ପୁଷ୍ତ ପୁଷ୍ତ ଧରି ଏମାନେ କଷ୍ଟ କରିଛନ୍ତି, ସଞ୍ଚୟ କରିଛନ୍ତି, ପାରିଲା ଯେତେ ଜମାଇଛନ୍ତି।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ତଥାପି, କିଛି ଗୋଟେ ସବୁବେଳେ ଭୁଲ ହୋଇଯାଉଥିଲା।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ସଞ୍ଚୟ ଖାତାରେ ପଡ଼ି ରହୁଥିଲା, ମୂଲ୍ୟ ହ୍ରାସ ପାଉଥିଲା। ଅଦରକାରୀ ଋଣ ନିଆ ଯାଉଥିଲା। ଅବସର ଆସୁଥିଲା ଯାହା ପ୍ରାପ୍ୟ ତା'ଠାରୁ ବହୁ କମ ସଙ୍ଗେ। ଖରାପ ଭାଗ୍ୟ ଯୋଗୁ ନୁହଁ। ଏ ପରିବାରଗୁଡ଼ିକ ସହ ବସି, ସ୍ପଷ୍ଟ ଭାବରେ, ସଚ୍ଚୋଟ ଭାବରେ ସେ ଟଙ୍କା ସଂପର୍କରେ ପରାମର୍ଶ ଦେବାକୁ କେହି ନ ଥିଲା।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ସଠିକ ଉପଦେଶ ଥିଲା। କିନ୍ତୁ ତାହା ଇଂରାଜୀ ଭାଷାରେ, ଜଟିଳ ଶବ୍ଦ ଆଡ଼ାଳରେ, ଏଭଳି ଅଫିସ ଭିତରେ ରହୁଥିଲା ଯାହା ଅନ୍ୟ କାହାର ଲାଗୁ ଥିଲା। ଯେଉଁ ପରିବାରଗୁଡ଼ିକର ସବୁଠୁ ଅଧିକ ଦରକାର ଥିଲା, ସେମାନଙ୍କୁ ପ୍ରତ୍ୟକ୍ଷ ବା ପରୋକ୍ଷ ଭାବେ ବୁଝାଇ ଦିଆ ଯାଉଥିଲା ଯେ ବିନିଯୋଗ ସେମାନଙ୍କ ପାଇଁ ନୁହଁ।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">InvestSahi 2024ରେ ଏହାକୁ ଭୁଲ ପ୍ରମାଣ କରିବା ପାଇଁ ଆରମ୍ଭ ହେଲା।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ସହି ଅର୍ଥ ସଠିକ। ଅର୍ଥ ସଚ୍ଚୋଟ। ଆର୍ଥିକ ଉପଦେଶ ଦୁଇଟି ହେବା ଉଚିତ। ମାର୍ଗଦର୍ଶନରେ ସଠିକ। ଉଦ୍ଦେଶ୍ୟରେ ସଚ୍ଚୋଟ।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ଓଡ଼ିଶାରେ 4.6 କୋଟି ମଣିଷ ଆସଲ ଆର୍ଥିକ ଲକ୍ଷ୍ୟ ଓ ଆସଲ ଆର୍ଥିକ ଭୟ ସହ ଜୀବନ କଟାଉଛନ୍ତି। ସେମାନେ ଆସଲ ମାର୍ଗଦର୍ଶନ ପାଇବାର ଯୋଗ୍ୟ। ନିଜ ଭାଷାରେ। ଏମିତି ଦରରେ ଯାହା ସେମାନଙ୍କୁ ଦୂରେଇ ନ ଦିଏ।</p>
              <p className="font-odia text-foreground text-lg leading-relaxed mb-6">ସେଇଟା InvestSahi।</p>
            </>
          )}

          {/* SECTION 3 — Founder Quote Card */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-start gap-5">
              <img
                src="/rishab.jpg"
                alt="Rishab, Founder of InvestSahi"
                className="w-16 h-16 rounded-full object-cover border-2 shrink-0"
                style={{ borderColor: '#E8820C' }}
              />
              <div>
                <blockquote className="font-body text-foreground text-lg leading-relaxed italic mb-4">
                  {currentLang === 'or'
                    ? '"ଓଡ଼ିଶାରେ ବଡ଼ ହେଉଥିବା ବେଳେ, ଭଲ ମଣିଷଙ୍କ ଜୀବନରେ କ\'ଣ ହୁଏ ଯେବେ ଆର୍ଥିକ ମାର୍ଗଦର୍ଶନ ପାଇଁ ଫେରିବାର କେହି ନ ଥାଏ, ତାହା ମୁଁ ଦେଖିଛି। ଦଶନ୍ଧି ଧରି ପରିଶ୍ରମ କରି ପରିବାରଗୁଡ଼ିକ ଅବସର ପାଇଁ ଯୋଗ୍ୟ ଅପେକ୍ଷା ବହୁ କମ ନେଇ ଆସୁଥିବାର ଦେଖିଛି। ଏଥିରେ ସେମାନଙ୍କ କୌଣସି ଦୋଷ ନ ଥିଲା। ସେମାନଙ୍କ ବିକଳ୍ପ ସଚ୍ଚୋଟ ଭାବରେ ବୁଝାଇ ଦେବାକୁ କେହି ବସି ନ ଥିଲା। ଓଡ଼ିଶାର ପ୍ରତ୍ୟେକ ପରିବାର ପାଇଁ ସେ ମଣିଷ ହେବା ପାଇଁ InvestSahi ଗଢ଼ିଲି।"'
                    : '"Growing up in Odisha, I saw what happens when good people have no one to turn to for financial guidance. I watched families work hard for decades and still arrive at retirement with far less than they deserved. Not because they did anything wrong. Because nobody sat with them and explained their options honestly. I built InvestSahi to be that person for every family in Odisha."'
                  }
                </blockquote>
                <p className="font-heading font-bold text-foreground">Rishab</p>
                <p className="text-sm text-muted-foreground font-body">
                  {currentLang === 'or' ? 'ପ୍ରତିଷ୍ଠାତା, InvestSahi' : 'Founder, InvestSahi'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — What We Believe */}
      <section style={{ backgroundColor: '#F5EDD8' }}>
        <div className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
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
                    ? "ସମ୍ପଦ ଆପଣ କେତେ ରୋଜଗାର କରନ୍ତି ତା ଉପରେ ନ ନିର୍ଭର କରି, ଆପଣ ରୋଜଗାରରେ କ'ଣ କରନ୍ତି ତା ଉପରେ ନିର୍ଭର କରେ।"
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
                    ? "ଯେଉଁ ଭାଷା ଆପଣ ଭଲ ବୁଝନ୍ତି ନାହିଁ ସେଥିରେ ଦିଆ ଉପଦେଶ ଅଧା ଉପଦେଶ। ଆମେ ଓଡ଼ିଆରେ କଥା ହୁଉ କାରଣ ଆପଣ ପ୍ରତ୍ୟେକ ଶବ୍ଦ ବୁଝିବା ଯୋଗ୍ୟ।"
                    : "Financial advice in a language you don't fully understand is advice half received. We speak Odia because you deserve to understand every word."}
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
                    ? "ଆମେ ଆପଣଙ୍କୁ ସ୍ପଷ୍ଟ ଭାବରେ କହୁ ଯେ କ'ଣ ଆପଣଙ୍କ ପାଇଁ ଉଚିତ ଏବଂ କ'ଣ ନୁହେଁ। ଆପଣଙ୍କ ବିଶ୍ୱାସ ଅର୍ଜନ କରିବା ଆମ ଲକ୍ଷ୍ୟ।"
                    : 'We tell you when something is right for you and when it is not. We have no incentive to mislead you and every reason to earn your trust.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Trust paragraph */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="border-l-4 pl-6" style={{ borderColor: '#E8820C' }}>
            <h2 className="font-heading font-bold text-xl mb-4">
              {currentLang === 'or' ? 'ବିଶ୍ୱାସ ବିଷୟରେ ଏକ କଥା' : 'A word on trust'}
            </h2>
            <p className="font-body text-foreground text-base leading-relaxed mb-3">
              {currentLang === 'or'
                ? 'ଆମେ ଜାଣୁ ଅନେକ ଓଡ଼ିଆ ପରିବାର ଭୁଲ ନିଷ୍ପତ୍ତି ଏବଂ ଖରାପ ପରାମର୍ଶ ଯୋଗୁ ସଞ୍ଚୟ ହଜାଇଛନ୍ତି। ଆମେ ଏହା ଅସ୍ୱୀକାର କରୁ ନାହୁଁ।'
                : 'We know many families in Odisha lost savings due to poor advice and wrong financial decisions. We do not pretend that did not happen.'}
            </p>
            <p className="font-body text-foreground text-base leading-relaxed mb-3">
              {currentLang === 'or'
                ? 'ଏହା ଭିନ୍ନ। ଏଠାରେ ଠିକ୍ ଭାବରେ ବୁଝାଇ ଦଉଛୁ:'
                : 'This is different. Here is exactly why:'}
            </p>
            <ol className="space-y-3 mt-4 text-sm font-body text-foreground list-decimal pl-5">
              {currentLang === 'or' ? (
                <>
                  <li>ଆପଣଙ୍କ ଟଙ୍କା ସିଧା SEBI ପଞ୍ଜୀକୃତ ମ୍ୟୁଚୁଆଲ ଫଣ୍ଡ ଏବଂ IRDAI ଲାଇସେନ୍ସ ଥିବା ବୀମା କମ୍ପାନୀକୁ ଯାଏ। ଆମ ପାଖରେ କଦାପି ରହେ ନାହିଁ।</li>
                  <li>ଆମେ AMFI ଏବଂ IRDAI ସହ ପଞ୍ଜୀକୃତ। ଆମ ପଞ୍ଜୀକରଣ ନମ୍ବର ପ୍ରତ୍ୟେକ ପୃଷ୍ଠାରେ ଦେଖାଯାଏ।</li>
                  <li>ଆପଣ ଯେକୌଣସି ସମୟରେ ସିଧା ଫଣ୍ଡ ହାଉସ ବା ବୀମା କମ୍ପାନୀ ସହ ଆପଣଙ୍କ ଆକାଉଣ୍ଟ ଯାଞ୍ଚ କରି ପାରିବେ।</li>
                  <li>ଆମେ ନିର୍ଦ୍ଧିଷ୍ଟ ପରାମର୍ଶ ଫି ବା AMFI କମିଶନ ପାଉ। ଆପଣଙ୍କୁ ବିଭ୍ରାନ୍ତ କରିବାର ଆମ କୌଣସି କାରଣ ନାହିଁ।</li>
                </>
              ) : (
                <>
                  <li>Your money goes directly to SEBI regulated mutual funds and IRDAI licensed insurance companies. It is never held by us.</li>
                  <li>We are registered with AMFI and IRDAI. Our registration numbers are displayed on every page.</li>
                  <li>You can check your account balance directly with the fund house or insurer at any time, independent of us.</li>
                  <li>We earn a fixed advisory fee or AMFI commission. We have no incentive to mislead you.</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section style={{ backgroundColor: '#1B6B3A' }}>
        <div className="py-16 pb-20 md:pb-16 px-4 text-white text-center">
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
              href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi, I'd like to know more about InvestSahi")}`}
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
