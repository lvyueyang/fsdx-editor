import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const HeadingIcon = memo(({ className, ...props }: SvgProps) => {
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
      <path d="M17 11V4H19V21H17V13H7V21H5V4H7V11H17Z"></path>
    </svg>
  );
});

HeadingIcon.displayName = 'HeadingIcon';
