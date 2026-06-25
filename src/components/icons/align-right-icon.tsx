import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const AlignRightIcon = memo(({ className, ...props }: SvgProps) => {
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
      <path d="M3 4H21V6H3V4ZM7 19H21V21H7V19ZM3 14H21V16H3V14ZM7 9H21V11H7V9Z"></path>
    </svg>
  );
});

AlignRightIcon.displayName = 'AlignRightIcon';
