import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const OutdentIcon = memo(({ className, ...props }: SvgProps) => {
  return (
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
      <path d="M3 8h14" />
      <path d="M3 12h10" />
      <path d="M3 16h12" />
      <path d="M7 4v16l-4-8 4-8Z" />
    </svg>
  );
});

OutdentIcon.displayName = 'OutdentIcon';
