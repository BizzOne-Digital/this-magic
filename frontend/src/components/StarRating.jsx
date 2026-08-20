import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating = 5, size = 'md', showValue = false, className = '', interactive = false, onChange }) => {
  const sizes = {
    sm: 'text-sm gap-0.5',
    md: 'text-base gap-1',
    lg: 'text-xl gap-1',
    xl: 'text-2xl gap-1.5',
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    const StarIcon = half ? FaStarHalfAlt : FaStar;
    const colorClass = filled || half ? 'text-teal' : 'text-gray-300';

    stars.push(
      interactive ? (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          className={`${colorClass} hover:scale-110 transition-transform`}
          aria-label={`Rate ${i} stars`}
        >
          <StarIcon />
        </button>
      ) : (
        <StarIcon key={i} className={colorClass} />
      )
    );
  }

  return (
    <div className={`inline-flex items-center ${sizes[size]} ${className}`} aria-label={`${rating} out of 5 stars`}>
      {stars}
      {showValue && <span className="ml-2 text-sm font-semibold text-navy">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
