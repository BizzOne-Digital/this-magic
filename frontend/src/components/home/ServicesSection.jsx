import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import SectionHeading from '../SectionHeading';
import Button from '../Button';
import { SkeletonCard } from '../LoadingSpinner';
import { getServiceIcon } from '../../utils/serviceIcons';

const IconicServicesRow = ({ services }) => {
  const topFive = services.slice(0, 5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
      {topFive.map((service, index) => {
        const Icon = getServiceIcon(service.icon);
        return (
          <div
            key={service._id}
            className="flex flex-col items-center text-center group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-navy flex items-center justify-center mb-3 group-hover:bg-teal group-hover:scale-110 transition-all duration-300 card-hover">
              <Icon className="text-teal text-2xl md:text-3xl group-hover:text-navy transition-colors" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-navy uppercase tracking-wide">
              {service.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 hidden md:block line-clamp-2">
              {service.shortDescription}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const ServicesSection = ({ services, loading }) => {
  const showIconRow = !loading && services.length > 0;

  return (
    <>
      {showIconRow && (
        <section className="section-padding bg-white -mt-16 relative z-10">
          <div className="container-custom">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 -translate-y-8">
              <IconicServicesRow services={services} />
            </div>
          </div>
        </section>
      )}

      <section id="services" className={`section-padding bg-navy ${showIconRow ? '' : 'pt-32'}`}>
        <div className="container-custom">
          <SectionHeading
            scriptAccent="What We Offer"
            title="Premium Event Services"
            subtitle="From intimate gatherings to grand ballroom celebrations, DJ Adam delivers professional DJ entertainment and complete event services tailored to your vision. Every package includes premium sound, expert MC services, and personalized planning."
            light
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <article
                    key={service._id}
                    className="bg-navy-light rounded-2xl overflow-hidden border border-white/10 card-hover group animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {service.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-light to-transparent" />
                        <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-teal flex items-center justify-center">
                          <Icon className="text-navy text-xl" />
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {service.shortDescription}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {service.features?.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {service.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                              <FiCheck className="text-teal mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link
                        to={service.ctaLink || '/contact'}
                        className="inline-flex items-center text-teal font-bold uppercase text-sm tracking-wider hover:text-white transition-colors"
                      >
                        {service.ctaLabel || 'Learn More'} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12 animate-fade-in space-y-4">
            <p className="text-gray-400 mb-2 max-w-2xl mx-auto">
              Need a custom package? Combine DJ services with photo booth, photography, and videography
              for complete event coverage — all from one trusted entertainment company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/services" variant="primary">
                View All Services
              </Button>
              <Button to="/contact" variant="outline" className="!border-teal !text-teal hover:!bg-teal hover:!text-navy">
                Get a Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;
