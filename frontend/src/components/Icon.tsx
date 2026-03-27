type IconProps = {
  href: string;
  size?: number;
  className?: string;
};

export default function Icon({ href, size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={href} />
    </svg>
  );
}
