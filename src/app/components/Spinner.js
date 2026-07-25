export default function Spinner({ size = 'md', color = 'text-blue-600' }) {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5 border-[1.5px]', 
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <span className="inline-flex items-center justify-center vertical-align-middle mx-1">
      <div
        className={`
          ${sizeClasses[size]} 
          ${color} 
          animate-spin 
          rounded-full 
          border-solid 
          border-current 
          border-r-transparent 
          motion-reduce:animate-[spin_1.5s_linear_infinite]
        `}
        role="status"
      >
        <span className="sr-only">Laster inn...</span>
      </div>
    </span>
  );
}