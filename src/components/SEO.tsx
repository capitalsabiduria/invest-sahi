import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  lang?: 'en' | 'or' | 'odia';
  slug?: string;
  slugBasePath?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  schema?: object;
  noindex?: boolean;
}

const BASE_URL = 'https://investsahi.in';
const OG_IMAGE = `${BASE_URL}/investsahi-logo.png`;

export default function SEO({ title, description, url, lang = 'en', slug, slugBasePath, type = 'website', publishedAt, schema, noindex }: SEOProps) {
  const fullTitle = `${title} | InvestSahi`;
  const canonicalUrl = `${BASE_URL}${url}`;

  // Handle the custom /odia path (which is technically the 'or' language, code-mixed)
  const isMixedPath = url.startsWith('/odia') || lang === 'odia';
  const actualLangCode = isMixedPath || lang === 'or' ? 'or-IN' : 'en-IN';

  const basePath = slugBasePath ? slugBasePath : '';
  const enUrl = slug
    ? `${BASE_URL}/en${basePath}/${slug}`
    : `${BASE_URL}${url.replace(/^\/(en|or|odia)\//, '/en/')}`;
  const orFormalUrl = slug
    ? `${BASE_URL}/or${basePath}/${slug}`
    : `${BASE_URL}${url.replace(/^\/(en|or|odia)\//, '/or/')}`;
  const odiaMixedUrl = slug
    ? `${BASE_URL}/odia${basePath}/${slug}`
    : `${BASE_URL}${url.replace(/^\/(en|or|odia)\//, '/odia/')}`;

  return (
    <Helmet>
      <html lang={actualLangCode} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      {enUrl && <link rel="alternate" hrefLang="en-IN" href={enUrl} />}
      {odiaMixedUrl && <link rel="alternate" hrefLang="or" href={odiaMixedUrl} />}
      {orFormalUrl && <link rel="alternate" hrefLang="or-IN" href={orFormalUrl} />}
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
