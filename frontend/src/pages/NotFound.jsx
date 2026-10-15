import SEO from '../components/SEO';
import Button from '../components/Button';
import { NOT_FOUND_SEO } from '../constants/seo';

const NotFound = () => (
  <>
    <SEO title={NOT_FOUND_SEO.title} description={NOT_FOUND_SEO.description} noindex />
    <section className="min-h-[70vh] flex items-center bg-navy">
      <div className="container-custom text-center px-4 pt-32 pb-20">
        <p className="heading-script text-2xl md:text-3xl mb-3">Error 404</p>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-6">
          Page Not Found
        </h1>
        <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          This page has moved or no longer exists. Explore our DJ and event services, or get in touch to
          check your event date.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/services" variant="primary">View Services</Button>
          <Button to="/contact" variant="outline">Contact DJ Adam</Button>
        </div>
      </div>
    </section>
  </>
);

export default NotFound;
