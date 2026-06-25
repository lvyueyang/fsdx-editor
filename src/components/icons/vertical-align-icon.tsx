import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const VerticalAlignTopIcon = memo(
  ({ className, ...props }: SvgProps) => (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 3H3V5L21 5V3ZM15 9V15H18V9H15ZM13 8C13 7.44772 13.4477 7 14 7L19 7C19.5523 7 20 7.44772 20 8V16C20 16.5523 19.5523 17 19 17H14C13.4477 17 13 16.5523 13 16V8ZM9 9L9 19H6L6 9H9ZM5 7C4.44772 7 4 7.44772 4 8L4 20C4 20.5523 4.44772 21 5 21H10C10.5523 21 11 20.5523 11 20L11 8C11 7.44772 10.5523 7 10 7L5 7Z"></path>
    </svg>
  ),
);
VerticalAlignTopIcon.displayName = 'VerticalAlignTopIcon';

export const VerticalAlignMiddleIcon = memo(
  ({ className, ...props }: SvgProps) => (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 18L9 6L6 6L6 18H9ZM5 20C4.44772 20 4 19.5523 4 19L4 13H2V11H4L4 5C4 4.44771 4.44771 4 5 4H10C10.5523 4 11 4.44771 11 5V11H13V7C13 6.44771 13.4477 6 14 6L19 6C19.5523 6 20 6.44772 20 7V11H22V13H20V17C20 17.5523 19.5523 18 19 18H14C13.4477 18 13 17.5523 13 17V13H11V19C11 19.5523 10.5523 20 10 20H5ZM15 16H18V8L15 8V16Z"></path>
    </svg>
  ),
);
VerticalAlignMiddleIcon.displayName = 'VerticalAlignMiddleIcon';

export const VerticalAlignBottomIcon = memo(
  ({ className, ...props }: SvgProps) => (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 5L9 15H6L6 5L9 5ZM5 3C4.44772 3 4 3.44772 4 4L4 16C4 16.5523 4.44772 17 5 17H10C10.5523 17 11 16.5523 11 16L11 4C11 3.44772 10.5523 3 10 3H5ZM15 9V15H18V9H15ZM13 8C13 7.44772 13.4477 7 14 7L19 7C19.5523 7 20 7.44772 20 8V16C20 16.5523 19.5523 17 19 17H14C13.4477 17 13 16.5523 13 16V8ZM21 19L3 19V21H21V19Z"></path>
    </svg>
  ),
);
VerticalAlignBottomIcon.displayName = 'VerticalAlignBottomIcon';
