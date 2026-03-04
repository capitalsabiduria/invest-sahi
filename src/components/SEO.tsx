import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  lang?: 'en' | 'or';
  slug?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  schema?: object;
}

const BASE_URL = 'https://investsahi.in';
const OG_IMAGE = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a593abcd-aad7-406b-837e-4b5c8833fcbd/id-preview-064882de--bde235f4-d83c-45d4-8193-53bf0902ecc6.lovable.app-1772437386738.png';

export default function SEO({ title, description, url, lang = 'en', slug, type = 'website', publishedAt, schema }: SEOProps) {
  const fullTitle = `${title} | InvestSahi`;
  const canonicalUrl = `${BASE_URL}${url}`;
  const enUrl = slug ? `${BASE_URL}/en/learn/${slug}` : null;
  const orUrl = slug ? `${BASE_URL}/or/learn/${slug}` : null;

  return (
    <Helmet>
      <html lang={lang === 'or' ? 'or' : 'en'} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {enUrl && <link rel="alternate" hrefLang="en-IN" href={enUrl} />}
      {orUrl && <link rel="alternate" hrefLang="or-IN" href={orUrl} />}
      {enUrl && <link rel="alternate" hrefLang="x-default" href={enUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="InvestSahi" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
