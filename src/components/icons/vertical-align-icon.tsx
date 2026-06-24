import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const VerticalAlignTopIcon = memo(
  ({ className, ...props }: SvgProps) => (
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
      <line x1="4" y1="4" x2="20" y2="4" />
      <rect x="6" y="6" width="12" height="6" rx="1" />
      <line x1="8" y1="6" x2="8" y2="12" />
      <line x1="12" y1="6" x2="12" y2="12" />
    </svg>
  ),
);
VerticalAlignTopIcon.displayName = 'VerticalAlignTopIcon';

export const VerticalAlignMiddleIcon = memo(
  ({ className, ...props }: SvgProps) => (
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
      <line x1="4" y1="12" x2="20" y2="12" />
      <rect x="6" y="9" width="12" height="6" rx="1" />
      <line x1="8" y1="9" x2="8" y2="15" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  ),
);
VerticalAlignMiddleIcon.displayName = 'VerticalAlignMiddleIcon';

export const VerticalAlignBottomIcon = memo(
  ({ className, ...props }: SvgProps) => (
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
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="12" width="12" height="6" rx="1" />
      <line x1="8" y1="12" x2="8" y2="18" />
      <line x1="12" y1="12" x2="12" y2="18" />
    </svg>
  ),
);
VerticalAlignBottomIcon.displayName = 'VerticalAlignBottomIcon';
