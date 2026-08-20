import { FaTag, FaGift, FaPercent } from 'react-icons/fa';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import SectionHeading from '../SectionHeading';
import Button from '../Button';
import { SkeletonCard } from '../LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const iconMap = {
  tag: FaTag,
  gift: FaGift,
  percent: FaPercent,
};

const PromotionsSection = ({ promotions, loading }) => {
  if (!loading && promotions.length === 0) return null;

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container-custom relative">
        <SectionHeading
          scriptAccent="Limited Time"
          title="Special Offers"
          subtitle="Take advantage of our current promotions and save on premium DJ entertainment for your next celebration. Premium dates fill up quickly — secure your savings today."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo, index) => {
              const Icon = iconMap[promo.icon] || FaTag;
              return (
                <article
                  key={promo._id}
                  className="relative bg-navy rounded-2xl overflow-hidden card-hover animate-slide-up group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                  <div className="p-8 md:p-10 relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center">
                          <Icon className="text-navy text-xl" />
                        </div>
                        {promo.badge && (
                          <span className="bg-teal/20 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            {promo.badge}
                          </span>
                        )}
                      </div>
                      {promo.discountAmount && (
                        <div className="text-right">
                          <p className="text-teal text-3xl md:text-4xl font-black">{promo.discountAmount}</p>
                          <p className="text-gray-500 text-xs uppercase tracking-wider">OFF</p>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide mb-4">
                      {promo.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6">{promo.description}</p>

                    {promo.terms && (
                      <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                        <FiCheckCircle className="text-teal mt-0.5 flex-shrink-0" />
                        <span>{promo.terms}</span>
                      </div>
                    )}

                    {promo.expiryDate && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FiClock className="text-teal" />
                        <span>Valid through {formatDate(promo.expiryDate)}</span>
                      </div>
                    )}

                    <div className="mt-8">
                      <Button to="/contact" variant="primary" className="!text-sm">
                        Claim This Offer
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-10 max-w-2xl mx-auto animate-fade-in">
          Promotions cannot be combined unless otherwise noted. Contact us for custom package pricing
          and to verify availability for your event date.
        </p>
      </div>
    </section>
  );
};

export default PromotionsSection;
