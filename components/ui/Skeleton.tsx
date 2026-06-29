type SkeletonProps = {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
};

export default function Skeleton({
  width = '100%',
  height = '16px',
  circle = false,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`marfa-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : '8px',
      }}
    />
  );
}
