import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiClock,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingSpinner';
import SectionHeading from '../components/SectionHeading';
import ContactForm from '../components/ContactForm';
import Button from '../components/Button';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden animate-fade-in">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-white hover:bg-gray-50 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-bold text-navy pr-4">{question}</span>
      {isOpen ? (
        <FiChevronUp className="text-teal text-xl flex-shrink-0" />
      ) : (
        <FiChevronDown className="text-teal text-xl flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="px-5 md:px-6 pb-5 md:pb-6 bg-gray-50 animate-slide-up">
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    )}
  </div>
);

const Contact = () => {
  const { content } = useOutletContext();
  const [openFaq, setOpenFaq] = useState(0);

  if (!content) return <PageLoader />;

  const contactPage = content.contactPage || {};
  const contact = content.contact || {};
  const social = content.social || {};
  const faqs = contactPage.faqs?.length
    ? contactPage.faqs
    : [
        {
          question: 'How far in advance should I book?',
          answer: 'We recommend booking 6-12 months in advance for weddings and popular dates.',
        },
      ];

  const contactInfo = [
    {
      icon: FiPhone,
      label: 'Phone',
      value: contact.phone || '732-829-2344',
      href: `tel:${contact.phone || '7328292344'}`,
    },
    {
      icon: FiMail,
      label: 'Email',
      value: contact.email || 'djadam@thismagicmomentnj.com',
      href: `mailto:${contact.email || 'djadam@thismagicmomentnj.com'}`,
    },
    {
      icon: FiMapPin,
      label: 'Service Area',
      value: contact.serviceArea || 'New Jersey, New York, Pennsylvania & Connecticut',
    },
    {
      icon: FiGlobe,
      label: 'Website',
      value: contact.website || 'www.thismagicmomentnj.com',
      href: `https://${(contact.website || 'www.thismagicmomentnj.com').replace(/^https?:\/\//, '')}`,
    },
    {
      icon: FiClock,
      label: 'Response Time',
      value: 'Within 24 hours — usually same day',
    },
  ];

  return (
    <>
      <SEO
        title={content.seo?.contactTitle?.split('|')[0]?.trim() || 'Contact'}
        description={content.seo?.contactDescription}
        url="https://www.thismagicmomentnj.com/contact"
      />

      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
            alt="Event celebration contact"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-navy/90" />
        <div className="relative z-10 container-custom text-center px-4 pt-28 pb-12 animate-slide-up">
          <p className="heading-script text-2xl md:text-3xl mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-6">
            {contactPage.heroTitle || "Let's Connect"}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {contactPage.heroSubtitle ||
              'Ready to create magic? Tell us about your event and let\'s start planning something unforgettable.'}
          </p>
        </div>
      </section>

      {/* Two Column: Info + Form */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 animate-fade-in">
              <SectionHeading
                scriptAccent="Reach Out"
                title="Contact Information"
                subtitle="Prefer to talk directly? Adam is always happy to discuss your event over the phone, via email, or in a complimentary video consultation."
                align="left"
                className="!mb-8"
              />

              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-navy/5 hover:bg-teal/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-navy text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-navy font-semibold hover:text-teal transition-colors break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-navy font-semibold">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm font-bold uppercase tracking-wider text-navy mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href={social.instagramUrl || 'https://instagram.com/this_magic_moment_nj'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white hover:bg-teal hover:text-navy transition-all"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href={social.facebookUrl || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white hover:bg-teal hover:text-navy transition-all"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                </div>
              </div>

              {/* Quick note */}
              <div className="mt-8 bg-teal/10 rounded-xl p-6 border border-teal/20">
                <p className="text-navy font-bold uppercase text-sm tracking-wide mb-2">
                  Complimentary Consultations
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every booking starts with a free, no-obligation consultation. Share your vision, ask questions,
                  and get a custom quote tailored to your event — in person, by phone, or via video call.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3 animate-slide-up">
              <ContactForm intro={contactPage.formIntro} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding bg-navy">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            scriptAccent="Questions?"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before booking This Magic Moment for your celebration."
            light
          />
          <div className="space-y-3 -mt-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map / Service Area */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            scriptAccent="Where We Play"
            title="Service Area"
            subtitle="Based in New Jersey, This Magic Moment regularly travels throughout the Tri-State area to bring premium DJ entertainment to your venue."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-72 md:h-96 bg-navy/5 animate-fade-in">
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-navy/10 to-teal/10">
                <FiMapPin className="text-teal text-5xl mb-4" />
                <p className="text-navy font-bold text-xl uppercase tracking-wide mb-2">
                  Tri-State Coverage
                </p>
                <p className="text-gray-600 max-w-sm leading-relaxed">
                  {contact.serviceArea ||
                    'Serving New Jersey, New York, Pennsylvania & Connecticut. Travel fees may apply for events outside our primary service area.'}
                </p>
                {contact.address && (
                  <p className="text-teal font-semibold mt-4">{contact.address}</p>
                )}
              </div>
            </div>
            <div className="animate-slide-up">
              <h3 className="text-xl font-bold text-navy uppercase tracking-wide mb-4">
                Popular Event Locations
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  'Monmouth County',
                  'Ocean County',
                  'Middlesex County',
                  'Essex County',
                  'Bergen County',
                  'Morris County',
                  'New York City',
                  'Philadelphia Area',
                ].map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 p-3 rounded-lg bg-navy/5 text-sm text-navy font-medium"
                  >
                    <FiMapPin className="text-teal flex-shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Don&apos;t see your area listed? No problem — we travel throughout the region for weddings,
                Sweet 16s, corporate events, and private celebrations. Contact us with your venue details
                and we&apos;ll confirm availability and any applicable travel arrangements.
              </p>
              <Button to="/contact" variant="primary">Check Your Date</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
