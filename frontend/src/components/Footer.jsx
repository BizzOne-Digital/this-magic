import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { getLogoUrl, LOGO_PATH, PHONE_TEL } from '../constants/site';

const Footer = ({ content }) => {
  const social = content?.social || {};
  const footer = content?.footer || {};
  const contact = content?.contact || {};
  const phone = contact.phone || '732-829-2344';
  const email = contact.email || 'djadam@thismagicmomentnj.com';
  const logoSrc = getLogoUrl(content?.logo?.imageUrl);

  return (
    <footer className="bg-navy text-white">
      <div className="container-custom mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <Link to="/" className="flex items-center justify-center md:justify-start">
            <img
              src={logoSrc}
              alt="This Magic Moment — DJ Adam"
              className="h-16 md:h-20 w-auto max-w-[240px] object-contain"
              onError={(e) => {
                e.currentTarget.src = LOGO_PATH;
              }}
            />
          </Link>

          <div className="text-center text-sm text-gray-400">
            <p>{footer.copyright || '© 2026 This Magic Moment. All Rights Reserved.'}</p>
            <p className="mt-1 text-xs">{footer.tagline}</p>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end">
            <a
              href={social.instagramUrl || 'https://instagram.com/this_magic_moment_nj'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-teal hover:border-teal transition-all"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href={social.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-teal hover:border-teal transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-lg md:text-xl font-bold text-white">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-teal transition-colors">
              {phone}
            </a>
          </p>
          <p className="mt-2 text-base md:text-lg">
            <a href={`mailto:${email}`} className="text-teal hover:text-white transition-colors font-semibold">
              {email}
            </a>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            <Link to="/admin/login" className="hover:text-teal transition-colors opacity-50">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
