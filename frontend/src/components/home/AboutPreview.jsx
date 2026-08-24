import { useState, useEffect } from 'react';
import Button from '../Button';
import SectionHeading from '../SectionHeading';

const DJ_PHOTO = '/public.png';
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
      onError={() => setImgSrc(DJ_PHOTO)}
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
        'DJ Adam is a professional DJ and event entertainer based in New Jersey, dedicated to creating celebrations that people remember for a lifetime.',
        'What sets This Magic Moment apart is the personal touch — curated soundtracks, seamless event flow, and entertainment that reflects your unique vision.',
      ];
  const images = getAboutImages(about);

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative animate-fade-in">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <AboutImage
                src={DJ_PHOTO}
                alt="DJ Adam at a live event"
                className="w-full h-[420px] md:h-[520px] object-cover object-top"
              />
            </div>

            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-teal text-navy rounded-2xl p-6 shadow-2xl animate-pulse-glow hidden sm:block">
              <p className="text-3xl font-black">30+</p>
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

            <p className="mt-6 text-2xl font-black text-navy uppercase tracking-wide">
              It&apos;s your day, your way.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Events DJ'd", value: '2500+' },
                { label: '5-Star Reviews', value: '250+' },
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
