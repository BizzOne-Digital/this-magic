import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { FiMapPin } from 'react-icons/fi';
import { responsiveImage } from '../utils/images';

const ReviewSource = ({ testimonial, className = '' }) => {
  const parts = [testimonial.isUserSubmitted ? 'Submitted on this website' : testimonial.sourceLabel || 'Client testimonial; original source not supplied'];
  for (const [key, label] of [['eventDate', 'Event'], ['reviewDate', 'Review']]) {
    const date = testimonial[key] && new Date(testimonial[key]);
    if (date && !Number.isNaN(date.getTime())) parts.push(`${label}: ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}`);
  }
  const sourceUrl = /^https?:\/\/[^\s]+$/i.test(testimonial.sourceUrl || '') ? testimonial.sourceUrl : null;
  const service = /wedding/i.test(testimonial.eventType) ? ['wedding-dj', 'Wedding DJ services']
    : /sweet.?16/i.test(testimonial.eventType) ? ['sweet-16-dj', 'Sweet 16 DJ services']
    : /birthday/i.test(testimonial.eventType) ? ['birthday-parties', 'Birthday DJ services']
    : ['private-events', 'Private event entertainment'];
  return <div className={`text-xs text-white/70 mt-1 ${className}`}>
    <p>{parts.join(' ? ')} {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal underline">Read original review</a>}</p>
    <Link to={`/services#${service[0]}`} className="inline-block mt-2 text-teal underline">{service[1]}</Link>
  </div>;
};

const TestimonialImage = ({ src, alt, containerClass = '', imageClass = '' }) => (
  <div
    className={`w-full bg-navy/40 flex items-center justify-center overflow-hidden ${containerClass}`}
  >
    <img
      {...responsiveImage(src, [400, 800], '(min-width: 1024px) 33vw, 100vw')}
      alt={alt}
      className={`w-full h-full object-contain object-center ${imageClass}`}
      loading="lazy"
    />
  </div>
);

const TestimonialCard = ({ testimonial, variant = 'grid', className = '' }) => {
  const hasImage = !!testimonial.imageUrl;
  const imageAlt = `${testimonial.clientName} - ${testimonial.eventType}`;

  if (variant === 'featured') {
    return (
      <article
        className={`relative bg-navy rounded-2xl overflow-hidden card-hover animate-slide-up border border-white/10 ${className}`}
      >
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''}`}>
          {hasImage && (
            <TestimonialImage
              src={testimonial.imageUrl}
              alt={imageAlt}
              containerClass="min-h-[260px] lg:min-h-[320px] lg:max-h-[420px] p-3"
            />
          )}
          <div className="p-8 md:p-10 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <span className="inline-block bg-teal text-navy text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Featured Review
            </span>
            <StarRating rating={testimonial.rating} size="md" className="mb-4" />
            <blockquote className="text-white text-base md:text-lg leading-relaxed italic mb-6">
              &ldquo;{testimonial.review}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-teal font-bold">{testimonial.clientName}</p>
                <ReviewSource testimonial={testimonial} />
                {testimonial.location && (
                  <p className="text-white text-sm flex items-center gap-1 mt-1">
                    <FiMapPin className="text-teal" />
                    {testimonial.location}
                  </p>
                )}
              </div>
              <span className="bg-white/10 text-white text-xs font-semibold uppercase px-3 py-1 rounded-full">
                {testimonial.eventType}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'carousel') {
    return (
      <div className="bg-navy-light rounded-2xl border border-white/10 overflow-hidden">
        <div className={`${hasImage ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
          {hasImage && (
            <TestimonialImage
              src={testimonial.imageUrl}
              alt={testimonial.clientName}
              containerClass="aspect-[4/3] md:aspect-auto md:min-h-[280px] md:max-h-[380px] p-3"
            />
          )}
          <div className="p-8 md:p-10 text-center md:text-left">
            <StarRating rating={testimonial.rating} size="lg" className="justify-center md:justify-start mb-4" />
            <blockquote className="text-white text-lg leading-relaxed italic mb-6">
              &ldquo;{testimonial.review}&rdquo;
            </blockquote>
            <p className="text-teal font-bold">{testimonial.clientName}</p>
            <ReviewSource testimonial={testimonial} />
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2 text-sm text-white">
              <span className="bg-teal/20 text-teal px-3 py-1 rounded-full text-xs font-semibold uppercase">
                {testimonial.eventType}
              </span>
              {testimonial.location && (
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-teal" />
                  {testimonial.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grid variant
  return (
    <article
      className={`rounded-xl overflow-hidden border card-hover animate-fade-in ${
        testimonial.isFeatured ? 'bg-teal/10 border-teal/30' : 'bg-navy-light border-white/10'
      } ${className}`}
    >
      {hasImage && (
        <TestimonialImage
          src={testimonial.imageUrl}
          alt={imageAlt}
          containerClass="aspect-[4/3] max-h-64 p-2"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={testimonial.rating} size="sm" />
          <span className="bg-teal/20 text-teal text-xs font-bold uppercase px-2 py-1 rounded">
            {testimonial.eventType}
          </span>
        </div>
        <p className="text-white text-sm leading-relaxed mb-6 line-clamp-6">
          &ldquo;{testimonial.review}&rdquo;
        </p>
        <div className="border-t border-white/10 pt-4">
          <p className="text-white font-semibold text-sm">{testimonial.clientName}</p>
          <ReviewSource testimonial={testimonial} />
          {testimonial.location && (
            <p className="text-white text-xs mt-1 flex items-center gap-1">
              <FiMapPin className="text-teal" />
              {testimonial.location}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
