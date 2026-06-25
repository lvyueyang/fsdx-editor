import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const AlignJustifyIcon = memo(({ className, ...props }: SvgProps) => {
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
      <path d="M3 4H21V6H3V4ZM3 19H21V21H3V19ZM3 14H21V16H3V14ZM3 9H21V11H3V9Z"></path>
    </svg>
  );
});

AlignJustifyIcon.displayName = 'AlignJustifyIcon';
