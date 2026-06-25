import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const VideoIcon = memo(({ className, ...props }: SvgProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4ZM5.77778 8.66667C5.77778 8.29848 6.07626 8 6.44444 8H8.22222C8.59041 8 8.88889 8.29848 8.88889 8.66667V15.3333C8.88889 15.7015 8.59041 16 8.22222 16H6.44444C6.07626 16 5.77778 15.7015 5.77778 15.3333V8.66667ZM15.1111 8.66667C15.1111 8.29848 14.8126 8 14.4444 8H12.6667C12.2985 8 12 8.29848 12 8.66667V15.3333C12 15.7015 12.2985 16 12.6667 16H14.4444C14.8126 16 15.1111 15.7015 15.1111 15.3333V8.66667ZM18.6667 9.77778L16.4444 11.3333V12.6667L18.6667 14.2222C19.0566 14.496 19.5556 14.2173 19.5556 13.7433V10.2567C19.5556 9.7827 19.0566 9.50399 18.6667 9.77778Z"
        fill="currentColor"
      />
    </svg>
  );
});

VideoIcon.displayName = 'VideoIcon';
