import { Link } from 'react-router-dom';
import { SERVICE_PLANNING } from '../data/service-planning';

export default function ServicePlanning({ slug }) {
  const planning = SERVICE_PLANNING[slug];
  if (!planning) return null;
  return <div className="border-t border-gray-200 pt-6 mb-7">
    <h3 className="font-bold text-navy mb-3">{planning.title}</h3>
    {planning.paragraphs.map((paragraph) => <p key={paragraph} className="text-gray-600 leading-relaxed text-sm mb-3">{paragraph}</p>)}
    {planning.example && <p className="text-gray-600 leading-relaxed text-sm mb-3">{planning.example} <Link to="/testimonials" className="text-teal underline">Read the client feedback.</Link></p>}
    {planning.guide && <p><Link to={planning.guide} className="text-teal font-semibold underline">{planning.guideLabel}</Link></p>}
    {planning.gallery && <p><Link to="/#event-gallery" className="text-teal font-semibold underline">View the event gallery</Link></p>}
  </div>;
}
