import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Button = ({ children, to, href, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-white',
    navy: 'inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300',
  };

  const classes = `${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
        {variant === 'primary' && <FiArrowRight />}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {variant === 'primary' && <FiArrowRight />}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
      {variant === 'primary' && <FiArrowRight />}
    </button>
  );
};

export default Button;
