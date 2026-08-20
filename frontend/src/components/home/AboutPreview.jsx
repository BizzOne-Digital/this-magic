import { useState, useEffect } from 'react';
import Button from '../Button';
import SectionHeading from '../SectionHeading';

const collageImages = ['/img1.png', '/img2.png', '/img3.png', '/img4.png'];

const AboutImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc('/img1.png')}
    />
  );
};

const getAboutImages = (about) => {
  const managed = (about?.imageUrls || []).filter((url) => url?.includes('cloudinary.com'));
  if (managed.length >= 4) return managed.slice(0, 4);
  return collageImages;
};

const AboutPreview = ({ content }) => {
  const about = content?.about || {};
  const paragraphs = about.paragraphs?.length
    ? about.paragraphs
    : [
        'Adam Aronow is a professional DJ and event entertainer based in New Jersey, dedicated to creating celebrations that people remember for a lifetime.',
        'What sets This Magic Moment apart is the personal touch — curated soundtracks, seamless event flow, and entertainment that reflects your unique vision.',
      ];
  const images = getAboutImages(about);

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl card-hover">
                  <AboutImage
                    src={images[0]}
                    alt="DJ Adam Aronow at a live event"
                    className="w-full h-64 md:h-72 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl card-hover">
                  <AboutImage
                    src={images[2]}
                    alt="Photo booth fun at celebration"
                    className="w-full h-40 md:h-48 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-xl card-hover">
                  <AboutImage
                    src={images[1]}
                    alt="Wedding dance floor celebration"
                    className="w-full h-40 md:h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl card-hover">
                  <AboutImage
                    src={images[3]}
                    alt="Private event entertainment"
                    className="w-full h-64 md:h-72 object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-teal text-navy rounded-2xl p-6 shadow-2xl animate-pulse-glow hidden sm:block">
              <p className="text-3xl font-black">10+</p>
              <p className="text-xs font-bold uppercase tracking-wider">Years Experience</p>
            </div>
          </div>

          <div className="animate-slide-up">
            <SectionHeading
              scriptAccent={about.scriptAccent || 'Unforgettable'}
              title={about.headline || 'Making Moments'}
              align="left"
              className="mb-8 !mb-8"
            />

            <div className="space-y-5 text-gray-600 leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Events DJ'd", value: '500+' },
                { label: '5-Star Reviews', value: '100+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-navy/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-teal">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-navy font-semibold mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button to="/about">{about.ctaLabel || 'Learn More'}</Button>
              <Button to="/contact" variant="secondary">
                Book a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
