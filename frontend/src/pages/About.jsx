import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FaHeart,
  FaStar,
  FaCheckCircle,
  FaBolt,
  FaShieldAlt,
  FaHandshake,
  FaComments,
  FaMusic,
} from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingSpinner';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { servicesAPI } from '../services/api';

const valueIconMap = {
  heart: FaHeart,
  star: FaStar,
  check: FaCheckCircle,
  zap: FaBolt,
};

const whyIcons = [FaShieldAlt, FaHandshake, FaComments, FaMusic, FaStar, FaCheckCircle];

const About = () => {
  const { content } = useOutletContext();
  const [services, setServices] = useState([]);

  useEffect(() => {
    servicesAPI
      .getAll()
      .then((res) => setServices(res.data.data || []))
      .catch(console.error);
  }, []);

  if (!content) return <PageLoader />;

  const aboutPage = content.aboutPage || {};
  const storyContent = aboutPage.storyContent?.length
    ? aboutPage.storyContent
    : [
        'Music has always been my passion. What started as mixing tracks for friends\' parties evolved into a full-time calling — helping people celebrate life\'s most important moments.',
        'Every event is different, and that\'s what I love about this work. I take pride in being more than a DJ — I\'m your event partner, your MC, and the person who makes sure your dance floor is the place everyone wants to be.',
      ];

  const values = aboutPage.values?.length
    ? aboutPage.values
    : [
        { title: 'Personalized Service', description: 'Every playlist tailored to your vision.', icon: 'heart' },
        { title: 'Professional Excellence', description: 'Premium equipment at every event.', icon: 'star' },
      ];

  const stats = aboutPage.stats?.length
    ? aboutPage.stats
    : [
        { label: 'Events DJ\'d', value: '2500+' },
        { label: 'Years Experience', value: '30+' },
        { label: '5-Star Reviews', value: '250+' },
        { label: 'Tri-State Events', value: '1000+' },
      ];

  const whyChooseUs = aboutPage.whyChooseUs?.length
    ? aboutPage.whyChooseUs
    : [
        {
          title: 'One-Stop Entertainment',
          description:
            'DJ, photo booth, photography, and videography — everything you need from one trusted entertainment company.',
        },
        {
          title: 'Premium Equipment',
          description:
            'Professional-grade sound systems, wireless microphones, dynamic lighting, special effects, and photo booths.',
        },
        {
          title: 'Responsive Communication',
          description:
            'Quick responses and dedicated contact with DJ Adam from booking until the end of your event.',
        },
      ];

  return (
    <>
      <SEO
        title={content.seo?.aboutTitle?.split('|')[0]?.trim() || 'About'}
        description={content.seo?.aboutDescription}
        url="https://www.thismagicmomentnj.com/about"
      />

      {/* Hero Banner */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              aboutPage.heroImageUrl ||
              'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=1920&q=80'
            }
            alt="DJ Adam at event"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 container-custom text-center px-4 pt-28 pb-16 animate-slide-up">
          <p className="heading-script text-2xl md:text-3xl mb-3">Meet Your DJ</p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-6">
            {aboutPage.heroTitle || 'About DJ Adam'}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {aboutPage.heroSubtitle ||
              'The DJ Who Brings Energy, Elegance & Unforgettable Moments to Every Celebration'}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutPage.storyImageUrl || '/public.png'}
                  alt="DJ Adam professional photo"
                  className="w-full h-[400px] md:h-[500px] object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="animate-slide-up">
              <SectionHeading
                scriptAccent="The Journey"
                title={aboutPage.storyTitle || 'My Story'}
                align="left"
                className="!mb-8"
              />
              <div className="space-y-5 text-gray-600 leading-relaxed">
                {storyContent.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-navy">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <SectionHeading
              scriptAccent="Our Purpose"
              title={aboutPage.missionTitle || 'My Mission'}
              light
            />
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed -mt-8">
              {aboutPage.missionContent ||
                'To create unforgettable celebrations by combining professional DJ expertise, personalized service, and genuine passion for making people happy. Every event is treated as if it were our own family\'s celebration. It\'s your day, your way.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="section-padding bg-teal">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-4xl md:text-5xl font-black text-navy">{stat.value}</p>
                <p className="text-navy/70 text-sm md:text-base font-semibold uppercase tracking-wider mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="What Drives Us"
            title="Our Core Values"
            subtitle="These principles guide every event we DJ — from the first consultation to the final song of the night."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = valueIconMap[value.icon] || FaStar;
              return (
                <article
                  key={value.title}
                  className="bg-navy/5 rounded-2xl p-8 text-center card-hover animate-fade-in border border-transparent hover:border-teal/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-navy text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-navy uppercase tracking-wide mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-navy">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="The Difference"
            title="Why Choose This Magic Moment"
            subtitle="When you book DJ Adam, you're not just hiring a DJ — you're partnering with a dedicated entertainment company that treats your celebration like our own."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = whyIcons[index % whyIcons.length];
              return (
                <article
                  key={item.title}
                  className="bg-navy-light rounded-xl p-6 border border-white/10 animate-slide-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Icon className="text-teal text-2xl mb-4" />
                  <h3 className="text-white font-bold uppercase tracking-wide mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="Full Service"
            title="Entertainment Services"
            subtitle="Complete event entertainment solutions for weddings, Sweet 16s, birthdays, corporate events, and private celebrations across the Tri-State area."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <div
                key={service._id}
                className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-teal/30 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div>
                  <h3 className="font-bold text-navy uppercase text-sm tracking-wide">{service.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{service.shortDescription}</p>
                  <ul className="mt-2 space-y-1">
                    {service.features?.slice(0, 2).map((f) => (
                      <li key={f} className="flex items-center gap-1 text-xs text-gray-400">
                        <FiCheck className="text-teal" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-teal">
        <div className="container-custom text-center animate-slide-up">
          <p className="heading-script text-navy text-2xl mb-2">Your Event Awaits</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy uppercase mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-navy/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Schedule a free consultation to discuss your vision, check availability for your date,
            and discover why hundreds of couples and families across New Jersey trust This Magic Moment
            with their most important celebrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/contact" variant="navy">Book a Consultation</Button>
            <Button to="/testimonials" variant="secondary" className="!border-navy !text-navy hover:!bg-navy hover:!text-white">
              Read Client Reviews
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
