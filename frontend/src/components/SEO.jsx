import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteName = 'This Magic Moment';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Premium DJ & Event Entertainment | Adam Aronow`;
  const desc = description || 'Professional DJ services for weddings, Sweet 16s, birthdays & private events in New Jersey. Photo booth, photography & videography available.';
  const ogImage = image || 'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=1200&q=80';
  const pageUrl = url || 'https://www.thismagicmomentnj.com';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
};

export default SEO;
