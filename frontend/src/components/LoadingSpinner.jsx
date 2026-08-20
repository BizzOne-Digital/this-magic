const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-3 border-teal/30 border-t-teal rounded-full animate-spin`} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy">
    <LoadingSpinner size="xl" />
  </div>
);

export const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-xl h-64" />
);

export default LoadingSpinner;
