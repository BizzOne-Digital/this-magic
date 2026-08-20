import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../SectionHeading';
import { SkeletonCard } from '../LoadingSpinner';

const GalleryPreview = ({ gallery, loading }) => {
  const items = gallery.slice(0, 8);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          scriptAccent="Our Work"
          title="Event Gallery"
          subtitle="Browse moments from weddings, Sweet 16s, birthday celebrations, and premium private events across New Jersey. Every image tells a story of energy, emotion, and unforgettable entertainment."
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {items.map((item, index) => (
              <figure
                key={item._id}
                className={`relative overflow-hidden rounded-xl group card-hover animate-fade-in ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={`${index === 0 ? 'aspect-square md:aspect-auto md:h-full min-h-[280px]' : 'aspect-square'}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <figcaption className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                  <span className="text-teal text-xs font-bold uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-sm md:text-base">{item.title}</h3>
                  {item.caption && (
                    <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.caption}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <p className="text-gray-500 text-sm text-center max-w-xl">
            Want to see more? Follow us on Instagram{' '}
            <a
              href="https://instagram.com/this_magic_moment_nj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal font-semibold hover:underline"
            >
              @this_magic_moment_nj
            </a>{' '}
            for the latest event highlights and behind-the-scenes content.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-teal font-bold uppercase tracking-wider text-sm hover:text-navy transition-colors"
          >
            Book Your Event <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
