import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const AudioIcon = memo(({ className, ...props }: SvgProps) => {
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
        d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L17.7071 8.29289C17.8946 8.48043 18 8.73478 18 9V21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21V4C6 3.44772 6.44772 3 7 3H12ZM11 5H8V20H16V9.41421L11 4.41421V5ZM14 6.58579L15.5858 8.17157H14V6.58579ZM9 14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14ZM10 16C9.44772 16 9 16.4477 9 17C9 17.5523 9.44772 18 10 18H12C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16H10Z"
        fill="currentColor"
      />
    </svg>
  );
});

AudioIcon.displayName = 'AudioIcon';
