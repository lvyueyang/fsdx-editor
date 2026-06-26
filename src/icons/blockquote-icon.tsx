import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const BlockquoteIcon = memo(({ className, ...props }: SvgProps) => {
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
      <path d="M21 4H3V6H21V4ZM21 11H8V13H21V11ZM21 18H8V20H21V18ZM5 11H3V20H5V11Z"></path>
    </svg>
  );
});

BlockquoteIcon.displayName = 'BlockquoteIcon';
