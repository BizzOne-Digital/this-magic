import { REVIEW_LINKS } from '../constants/site';

const ReviewLinks = ({ links, className = '' }) => {
  const reviewLinks = {
    theKnot: links?.theKnot || REVIEW_LINKS.theKnot,
    weddingWire: links?.weddingWire || REVIEW_LINKS.weddingWire,
    google: links?.google || REVIEW_LINKS.google,
  };

  const items = [
    { label: 'The Knot', href: reviewLinks.theKnot, sub: '300+ reviews' },
    { label: 'WeddingWire', href: reviewLinks.weddingWire, sub: '147+ reviews' },
    { label: 'Google', href: reviewLinks.google, sub: 'Read our Google reviews' },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-white/10 bg-navy-light p-6 text-center hover:border-teal hover:bg-teal/10 transition-all card-hover"
        >
          <p className="text-white font-bold uppercase tracking-wide text-lg">{item.label}</p>
          <p className="text-teal text-sm mt-2">{item.sub}</p>
          <p className="text-gray-400 text-xs mt-3">View reviews →</p>
        </a>
      ))}
    </div>
  );
};

export default ReviewLinks;
