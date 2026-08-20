import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionHeading from '../SectionHeading';
import Button from '../Button';
import TestimonialCard from '../TestimonialCard';
import { SkeletonCard } from '../LoadingSpinner';

const TestimonialsPreview = ({ testimonials, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = testimonials.filter((t) => t.isFeatured).length
    ? testimonials.filter((t) => t.isFeatured)
    : testimonials.slice(0, 6);

  const next = () => setActiveIndex((i) => (i + 1) % featured.length);
  const prev = () => setActiveIndex((i) => (i - 1 + featured.length) % featured.length);

  return (
    <section className="section-padding bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-teal rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-teal rounded-full" />
      </div>

      <div className="container-custom relative">
        <SectionHeading
          scriptAccent="Client Love"
          title="What People Are Saying"
          subtitle="Real reviews from couples, families, and event planners who trusted This Magic Moment with their most important celebrations."
          light
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <>
            <div className="relative max-w-5xl mx-auto mb-12 animate-fade-in">
              <TestimonialCard testimonial={featured[activeIndex]} variant="carousel" />

              {featured.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-all"
                    aria-label="Previous testimonial"
                  >
                    <FiChevronLeft />
                  </button>
                  <div className="flex gap-2">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2.5 rounded-full transition-all ${
                          i === activeIndex ? 'bg-teal w-8' : 'bg-white/30 w-2.5 hover:bg-white/50'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-all"
                    aria-label="Next testimonial"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} variant="grid" />
              ))}
            </div>
          </>
        ) : null}

        <div className="text-center mt-12 animate-fade-in flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/testimonials" variant="outline">
            Read All Testimonials
          </Button>
          <Button href="/testimonials#submit-review" variant="primary">
            Share Your Review
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
