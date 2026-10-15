import { Helmet } from 'react-helmet-async';
import { PAGE_SEO, SITE_NAME, DEFAULT_OG_IMAGE, ORGANIZATION_SCHEMA, absoluteUrl } from '../constants/seo';

/**
 * Page metadata. Pass `page` (a key of PAGE_SEO) for public pages so the canonical,
 * og:url and copy always match the prerendered HTML. `noindex` is for utility pages.
 */
const SEO = ({ page, title, description, path, image, schema, noindex = false }) => {
  const config = page ? PAGE_SEO[page] : {};
  const fullTitle = title || config.title || SITE_NAME;
  const desc = description || config.description || PAGE_SEO.home.description;
  const pagePath = path || config.path;
  const pageUrl = pagePath ? absoluteUrl(pagePath) : null;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex" />}
      {pageUrl && <link rel="canonical" href={pageUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta property="og:type" content={schema ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage.url} />
      <meta property="og:image:width" content={String(ogImage.width)} />
      <meta property="og:image:height" content={String(ogImage.height)} />
      <meta property="og:image:alt" content={ogImage.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage.url} />
      <meta name="twitter:image:alt" content={ogImage.alt} />
      {!noindex && <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA).replace(/</g, '\\u003c')}</script>}
      {schema && <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>}
    </Helmet>
  );
};

export default SEO;
