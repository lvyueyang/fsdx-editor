import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const TextColorIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459Z"></path>
      <path d="M3 20H21V22H3V20Z" fill="var(--tt-color-text-blue)"></path>
    </svg>
  );
});

TextColorIcon.displayName = 'TextColorIcon';
