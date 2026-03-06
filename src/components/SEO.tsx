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
const OG_IMAGE = `${BASE_URL}/investsahi-logo.png`;

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
