import StarRating from './StarRating';
import { FiMapPin } from 'react-icons/fi';

const TestimonialImage = ({ src, alt, containerClass = '', imageClass = '' }) => (
  <div
    className={`w-full bg-navy/40 flex items-center justify-center overflow-hidden ${containerClass}`}
  >
    <img
      src={src}
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
                {testimonial.location && (
                  <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
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
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-400">
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
        <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-6">
          &ldquo;{testimonial.review}&rdquo;
        </p>
        <div className="border-t border-white/10 pt-4">
          <p className="text-white font-semibold text-sm">{testimonial.clientName}</p>
          {testimonial.location && (
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
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
