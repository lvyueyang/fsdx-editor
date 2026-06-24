import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const FitToWidthIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="15 7 21 12 15 17" />
    <polyline points="9 17 3 12 9 7" />
    <line x1="21" y1="12" x2="3" y2="12" />
  </svg>
));
FitToWidthIcon.displayName = 'FitToWidthIcon';
