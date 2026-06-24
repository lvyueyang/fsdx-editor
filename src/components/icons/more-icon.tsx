import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const MoreIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="16"
    height="16"
    className={className}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="5" r="1.5" />
    <circle cx="11" cy="5" r="1.5" />
    <circle cx="5" cy="11" r="1.5" />
    <circle cx="11" cy="11" r="1.5" />
  </svg>
));
MoreIcon.displayName = 'MoreIcon';
