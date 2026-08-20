import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/SEO';
import { PageLoader, SkeletonCard } from '../components/LoadingSpinner';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { servicesAPI } from '../services/api';
import { getServiceIcon } from '../utils/serviceIcons';
import VideoShowcase from '../components/home/VideoShowcase';

const Services = () => {
  const { content } = useOutletContext();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesAPI
      .getAll()
      .then((res) => setServices(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!content) return <PageLoader />;

  return (
    <>
      <SEO
        title="Our Services | Premium DJ & Event Entertainment"
        description="Explore wedding DJ, Sweet 16, birthday party, photo booth, photography, and videography services from This Magic Moment — Adam Aronow, New Jersey."
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container-custom relative z-10 text-center px-4">
          <p className="text-teal font-semibold uppercase tracking-[0.3em] text-sm mb-4 animate-fade-in">
            What We Offer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6 animate-slide-up">
            Our <span className="heading-script normal-case text-teal">Services</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in">
            From unforgettable wedding receptions to high-energy Sweet 16s, milestone birthdays, and premium private
            events — Adam Aronow delivers professional DJ entertainment and complete event services across New Jersey
            and the Tri-State area. Every service is personalized, professionally executed, and designed to create
            moments your guests will talk about for years.
          </p>
        </div>
      </section>

      {/* Services List — one per row, image + text side by side */}
      <section className="bg-white">
        {loading ? (
          <div className="container-custom section-padding space-y-12">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          services.map((service, index) => {
            const Icon = getServiceIcon(service.icon);
            const imageLeft = index % 2 === 0;

            return (
              <article
                key={service._id}
                id={service.slug}
                className={`border-b border-gray-100 last:border-b-0 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div
                  className={`container-custom flex flex-col ${
                    imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-stretch gap-0 min-h-[420px] lg:min-h-[480px]`}
                >
                  {/* Image — half width, same row as text */}
                  <div className="w-full lg:w-1/2 min-h-[280px] lg:min-h-[480px]">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full min-h-[280px] lg:min-h-[480px] object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[280px] lg:min-h-[480px] bg-navy flex items-center justify-center">
                        <Icon className="text-teal text-6xl opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Text — half width, same row as image */}
                  <div className="w-full lg:w-1/2 flex items-center px-4 md:px-8 py-10 lg:py-12">
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                          <Icon className="text-navy text-xl" />
                        </div>
                        <span className="text-teal text-xs font-bold uppercase tracking-[0.2em]">
                          Service {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-navy uppercase tracking-tight mb-3">
                        {service.title}
                      </h2>
                      <p className="text-teal font-semibold text-base md:text-lg mb-4">{service.shortDescription}</p>
                      <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

                      {service.features?.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                              <FiCheck className="text-teal mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button to={service.ctaLink || '/contact'} variant="primary">
                          {service.ctaLabel || 'Book This Service'}
                        </Button>
                        <Button to="/contact" variant="secondary">
                          Get a Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <VideoShowcase content={content} showCta={false} />

      {/* Bundle CTA */}
      <section className="section-padding bg-navy">
        <div className="container-custom text-center">
          <SectionHeading
            scriptAccent="Save More"
            title="Bundle & Save"
            subtitle="Combine DJ services with photo booth, photography, and videography for complete event coverage — one trusted partner, one seamless experience, and exclusive package pricing."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {[
              { title: 'DJ + Photo Booth', desc: 'Keep the dance floor packed and guests entertained between sets.' },
              { title: 'DJ + Photo + Video', desc: 'Complete coverage of every speech, dance, and magical moment.' },
              { title: 'Full Event Package', desc: 'Everything you need for a flawless, unforgettable celebration.' },
            ].map((pkg) => (
              <div
                key={pkg.title}
                className="bg-navy-light border border-white/10 rounded-2xl p-6 text-left card-hover"
              >
                <h3 className="text-white font-bold uppercase tracking-wide mb-2">{pkg.title}</h3>
                <p className="text-gray-400 text-sm">{pkg.desc}</p>
              </div>
            ))}
          </div>
          <Button to="/contact" variant="primary">
            Request a Custom Package <FiArrowRight className="inline ml-1" />
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-teal">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-black text-navy uppercase mb-4">
            Ready to Make Your Event Unforgettable?
          </h2>
          <p className="text-navy/80 text-lg max-w-2xl mx-auto mb-8">
            Check availability, get a personalized quote, and let Adam Aronow bring the vibe, the voice, and the DJ
            your event needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/contact" variant="navy">
              Book Your Date
            </Button>
            <Button to="/testimonials" variant="secondary" className="!border-navy !text-navy hover:!bg-navy hover:!text-white">
              Read Reviews
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
