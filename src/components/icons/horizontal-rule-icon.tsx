import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const HorizontalRuleIcon = memo(({ className, ...props }: SvgProps) => {
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
      <path
        d="M2 11C1.44772 11 1 11.4477 1 12C1 12.5523 1.44772 13 2 13L22 13C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11L2 11Z"
        fill="currentColor"
      />
      <path
        d="M6 9C5.44772 9 5 8.55228 5 8V7C5 6.44772 5.44772 6 6 6C6.55228 6 7 6.44772 7 7V8C7 8.55228 6.55228 9 6 9Z"
        fill="currentColor"
      />
      <path
        d="M2 9C1.44772 9 1 8.55228 1 8V7C1 6.44772 1.44772 6 2 6C2.55228 6 3 6.44772 3 7V8C3 8.55228 2.55228 9 2 9Z"
        fill="currentColor"
      />
      <path
        d="M22 9C21.4477 9 21 8.55228 21 8V7C21 6.44772 21.4477 6 22 6C22.5523 6 23 6.44772 23 7V8C23 8.55228 22.5523 9 22 9Z"
        fill="currentColor"
      />
      <path
        d="M18 9C17.4477 9 17 8.55228 17 8V7C17 6.44772 17.4477 6 18 6C18.5523 6 19 6.44772 19 7V8C19 8.55228 18.5523 9 18 9Z"
        fill="currentColor"
      />
      <path
        d="M6 18C5.44772 18 5 17.5523 5 17V16C5 15.4477 5.44772 15 6 15C6.55228 15 7 15.4477 7 16V17C7 17.5523 6.55228 18 6 18Z"
        fill="currentColor"
      />
      <path
        d="M2 18C1.44772 18 1 17.5523 1 17V16C1 15.4477 1.44772 15 2 15C2.55228 15 3 15.4477 3 16V17C3 17.5523 2.55228 18 2 18Z"
        fill="currentColor"
      />
      <path
        d="M22 18C21.4477 18 21 17.5523 21 17V16C21 15.4477 21.4477 15 22 15C22.5523 15 23 15.4477 23 16V17C23 17.5523 22.5523 18 22 18Z"
        fill="currentColor"
      />
      <path
        d="M18 18C17.4477 18 17 17.5523 17 17V16C17 15.4477 17.4477 15 18 15C18.5523 15 19 15.4477 19 16V17C19 17.5523 18.5523 18 18 18Z"
        fill="currentColor"
      />
    </svg>
  );
});

HorizontalRuleIcon.displayName = 'HorizontalRuleIcon';
