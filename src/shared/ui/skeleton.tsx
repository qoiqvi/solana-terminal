interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '100%',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-full ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
    </div>
  );
}
