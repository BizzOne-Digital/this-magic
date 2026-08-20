const SectionHeading = ({
  title,
  scriptAccent,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) => {
  const alignClass =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`${alignClass} mb-12 md:mb-16 ${className}`}>
      {scriptAccent && (
        <p className={`heading-script text-2xl md:text-3xl mb-2 animate-fade-in ${light ? 'text-teal-light' : ''}`}>
          {scriptAccent}
        </p>
      )}
      {title && (
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide animate-slide-up ${
            light ? 'text-white' : 'text-navy'
          }`}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in ${
            align === 'left' ? 'mx-0' : ''
          } ${light ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-1 w-20 bg-teal rounded-full ${align === 'center' ? 'mx-auto' : ''} ${
          align === 'right' ? 'ml-auto' : ''
        }`}
      />
    </div>
  );
};

export default SectionHeading;
