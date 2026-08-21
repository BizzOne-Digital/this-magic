import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingSpinner';
import Button from '../components/Button';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import AboutPreview from '../components/home/AboutPreview';
import PromotionsSection from '../components/home/PromotionsSection';
import TestimonialsPreview from '../components/home/TestimonialsPreview';
import GalleryPreview from '../components/home/GalleryPreview';
import VideoShowcase from '../components/home/VideoShowcase';
import { PHONE_DISPLAY, PHONE_TEL } from '../constants/site';
import {
  servicesAPI,
  testimonialsAPI,
  promotionsAPI,
  galleryAPI,
} from '../services/api';

const Home = () => {
  const { content } = useOutletContext();
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, testimonialsRes, promotionsRes, galleryRes] = await Promise.all([
          servicesAPI.getAll(),
          testimonialsAPI.getAll(),
          promotionsAPI.getAll(),
          galleryAPI.getAll({ limit: 8 }),
        ]);
        setServices(servicesRes.data.data || []);
        setTestimonials(testimonialsRes.data.data || []);
        setPromotions(promotionsRes.data.data || []);
        setGallery(galleryRes.data.data || []);
      } catch (err) {
        console.error('Home page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!content) return <PageLoader />;

  return (
    <>
      <SEO
        title={content.seo?.homeTitle?.split('|')[0]?.trim()}
        description={content.seo?.homeDescription}
      />

      <HeroSection content={content} />

      <ServicesSection services={services} loading={loading} />

      <AboutPreview content={content} />

      <VideoShowcase content={content} />

      <PromotionsSection promotions={promotions} loading={loading} />

      <TestimonialsPreview testimonials={testimonials} loading={loading} />

      <GalleryPreview gallery={gallery} loading={loading} />

      {/* CTA Banner */}
      <section className="section-padding bg-teal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <HiOutlineSpeakerWave className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-navy" />
        </div>
        <div className="container-custom relative text-center animate-slide-up">
          <p className="heading-script text-navy text-2xl md:text-3xl mb-2">Ready to Celebrate?</p>
          <h2 className="text-3xl md:text-5xl font-black text-navy uppercase tracking-wide mb-6">
            Let&apos;s Create Your Magic Moment
          </h2>
          <p className="text-navy/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Your date won&apos;t wait — and neither should you. Whether you&apos;re planning a dream wedding,
            an epic Sweet 16, or an unforgettable private celebration, DJ Adam is ready to bring the
            energy, elegance, and expertise your event deserves. Free consultations available.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`tel:${PHONE_TEL}`} variant="navy">
              Call or Text DJ Adam Today
            </Button>
            <Button href={`tel:${PHONE_TEL}`} variant="secondary" className="!border-navy !text-navy hover:!bg-navy hover:!text-white !text-lg !font-black">
              {PHONE_DISPLAY}
            </Button>
          </div>
          <p className="mt-8 text-navy/60 text-sm">
            {content.contact?.phone && (
              <span>
                Call us directly:{' '}
                <a href={`tel:${content.contact.phone}`} className="font-bold hover:underline">
                  {content.contact.phone}
                </a>
              </span>
            )}
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;
