import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const TextColorIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.5 19L8.5 11H15.5L18.5 19H16.5L15.75 17H8.25L7.5 19H5.5ZM12 7.5L9.25 15H14.75L12 7.5Z"
        fill="currentColor"
      />
      <rect
        x="3"
        y="20"
        width="18"
        height="2.5"
        rx="1"
        fill="var(--tt-color-text-blue)"
      />
    </svg>
  );
});

TextColorIcon.displayName = 'TextColorIcon';
