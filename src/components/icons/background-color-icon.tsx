import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const BackgroundColorIcon = memo(({ className, ...props }: SvgProps) => {
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
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="7"
        width="12"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M6 14.5L10 10.5L13 13.5L18 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

BackgroundColorIcon.displayName = 'BackgroundColorIcon';
