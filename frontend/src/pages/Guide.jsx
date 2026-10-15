import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import Button from '../components/Button';
import NotFound from './NotFound';
import { GUIDES, GUIDES_PATH, guidePath } from '../data/guides';
import { SITE_URL, absoluteUrl } from '../constants/seo';

export default function Guide() {
  const { slug } = useParams();
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) return <NotFound />;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: absoluteUrl(guidePath(guide)),
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  return <>
    <SEO title={`${guide.title} | This Magic Moment`} description={guide.description} path={guidePath(guide)} schema={schema} />
    <article className="bg-white pt-32 pb-20">
      <div className="container-custom max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-8"><Link to="/">Home</Link> / <Link to={GUIDES_PATH}>Planning guides</Link></nav>
        <h1 className="text-3xl md:text-5xl font-black text-navy mb-6">{guide.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">{guide.summary}</p>
        {guide.sections.map((section) => <section key={section.title} className="mb-9">
          <h2 className="text-2xl font-bold text-navy mb-4">{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>)}
        </section>)}
        <aside className="rounded-2xl bg-navy p-8 text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">Talk through your event plans</h2>
          <p className="mb-6">Explore <Link to={`/services#${guide.service}`} className="text-teal underline">{guide.serviceLabel}</Link> or send your date and venue to DJ Adam.</p>
          <Button to="/contact#event-inquiry">Ask About Your Event</Button>
        </aside>
        <nav aria-label="Related planning guides" className="mt-12">
          <h2 className="text-2xl font-bold text-navy mb-4">More planning guides</h2>
          <ul className="space-y-3">{GUIDES.filter((item) => item.slug !== slug).map((item) => <li key={item.slug}><Link className="text-teal underline" to={guidePath(item)}>{item.title}</Link></li>)}</ul>
        </nav>
      </div>
    </article>
  </>;
}
