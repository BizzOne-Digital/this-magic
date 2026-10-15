import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiAward, FiStar, FiUsers } from 'react-icons/fi';
import { MdCelebration } from 'react-icons/md';
import SEO from '../components/SEO';
import { PageLoader, SkeletonCard } from '../components/LoadingSpinner';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import SubmitTestimonialForm from '../components/SubmitTestimonialForm';
import Button from '../components/Button';
import ReviewLinks from '../components/ReviewLinks';
import { usePublicData } from '../context/PublicDataContext';
import { PAGE_SEO } from '../constants/seo';
import { responsiveImage } from '../utils/images';

const statItems = [
  { icon: MdCelebration, label: '2500+ Events', sub: 'Celebrations DJ\'d' },
  { icon: FiStar, label: '5-Star Rated', sub: 'Consistently Top Reviews' },
  { icon: FiUsers, label: 'Client Feedback', sub: 'Read Individual Stories' },
  { icon: FiAward, label: '30+ Years', sub: 'Professional Experience' },
];

const Testimonials = () => {
  const { content } = useOutletContext();
  const { testimonials } = usePublicData();
  const loading = false;
  const [filter, setFilter] = useState('All');

  if (!content) return <PageLoader />;

  const page = content.testimonialsPage || {};
  const eventTypes = ['All', ...new Set(testimonials.map((t) => t.eventType))];
  const filtered =
    filter === 'All' ? testimonials : testimonials.filter((t) => t.eventType === filter);
  const featured = testimonials.filter((t) => t.isFeatured).slice(0, 4);
  // Featured reviews are shown in full above; don't repeat them in the unfiltered list.
  const featuredIds = new Set(featured.map((t) => t._id));
  const listed = filter === 'All' ? filtered.filter((t) => !featuredIds.has(t._id)) : filtered;

  return (
    <>
      <SEO page="testimonials" />

      <section className="relative min-h-[50vh] flex items-center bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            {...responsiveImage('/images/hero-1672.webp')}
            alt="Guests celebrating on a dance floor"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative z-10 container-custom text-center px-4 pt-28 pb-16 animate-slide-up">
          <p className="heading-script text-2xl md:text-3xl mb-3">
            {page.heroTitle || 'What Our Clients Say'}
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-6">
            {PAGE_SEO.testimonials.h1}
          </h1>
          <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            {page.heroSubtitle ||
              'Real reviews from real celebrations across New Jersey and the Tri-State area'}
          </p>
          <Button href="#submit-review" variant="primary">
            Share Your Review
          </Button>
        </div>
      </section>

      <section className="bg-teal py-8 md:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="text-navy text-3xl mb-2" />
                <p className="text-navy font-black text-xl md:text-2xl">{stat.label}</p>
                <p className="text-navy/70 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy border-t border-white/10">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="Review Sources"
            title="Read More on The Knot, WeddingWire & Google"
            subtitle="Browse the business profiles on The Knot and WeddingWire, or search Google for reviews. These links are separate from the individual client feedback below."
            light
          />
          <ReviewLinks links={content.reviewLinks} />
        </div>
      </section>

      {!loading && featured.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <SectionHeading
              scriptAccent="Featured"
              title="Highlighted Reviews"
              subtitle="These standout testimonials represent the experience you can expect when you book This Magic Moment."
            />
            <div className="space-y-8">
              {featured.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-navy">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="All Reviews"
            title="Client Testimonials"
            subtitle="Filter by event type to find reviews from celebrations just like yours."
            light
          />

          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all ${
                  filter === type ? 'bg-teal text-navy' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listed.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} variant="grid" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-white py-12">No testimonials found for this event type.</p>
          )}
        </div>
      </section>

      <div id="submit-review">
        <SubmitTestimonialForm />
      </div>

      <section className="section-padding bg-teal text-center animate-slide-up">
        <div className="container-custom">
          <p className="heading-script text-navy text-2xl mb-2">Join Our Happy Clients</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy uppercase mb-6">
            Ready for Your Own Success Story?
          </h2>
          <p className="text-navy/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Book a free consultation and let&apos;s start planning the celebration your guests will rave about.
          </p>
          <Button to="/contact" variant="navy">Book Your Event</Button>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
