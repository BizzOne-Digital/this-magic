import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';

const Footer = ({ content }) => {
  const social = content?.social || {};
  const footer = content?.footer || {};
  const contact = content?.contact || {};

  return (
    <footer className="bg-navy text-white">
      <div className="container-custom mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            {content?.logo?.imageUrl ? (
              <img src={content.logo.imageUrl} alt="This Magic Moment" className="h-10 w-auto" />
            ) : (
              <>
                <HiOutlineSpeakerWave className="text-teal text-2xl" />
                <div>
                  <span className="font-bold text-sm block">this magic moment</span>
                  <span className="text-teal text-xs">adam aronow</span>
                </div>
              </>
            )}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>{footer.copyright || '© 2026 This Magic Moment. All Rights Reserved.'}</p>
            <p className="mt-1 text-xs">{footer.tagline}</p>
          </div>

          {/* Social */}
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

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          <p>
            {contact.phone && <span>{contact.phone} • </span>}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="hover:text-teal transition-colors">
                {contact.email}
              </a>
            )}
          </p>
          <p className="mt-2">
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
