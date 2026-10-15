import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { GUIDES, guidePath } from '../data/guides';

export default function Guides() {
  return <>
    <SEO page="guides" />
    <section className="bg-navy pt-32 pb-16 text-white">
      <div className="container-custom max-w-4xl">
        <p className="heading-script text-2xl mb-3">Plan Your Celebration</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6">New Jersey DJ & Party Planning Guides</h1>
        <p className="text-lg leading-relaxed">Practical ideas for wedding entertainment, Mitzvah celebrations and Sweet 16 music. Use these guides to prepare questions for your venue and DJ, then confirm the details for your own event.</p>
        <Link to="/services" className="inline-block text-teal font-bold mt-6">Explore DJ and event services →</Link>
      </div>
    </section>
    <section className="section-padding bg-white">
      <div className="container-custom grid md:grid-cols-2 gap-8">
        {GUIDES.map((guide) => <article key={guide.slug} className="p-8 rounded-2xl bg-navy/5 border border-gray-100">
          <h2 className="text-2xl font-bold text-navy mb-4"><Link to={guidePath(guide)} className="hover:text-teal">{guide.title}</Link></h2>
          <p className="text-gray-600 leading-relaxed mb-5">{guide.summary}</p>
          <Link to={guidePath(guide)} className="font-bold text-teal">Read the guide →</Link>
        </article>)}
      </div>
    </section>
  </>;
}
