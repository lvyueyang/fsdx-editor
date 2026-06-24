import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const MergeCellsIcon = memo(({ className, ...props }: SvgProps) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="12" y1="9" x2="12" y2="15" strokeDasharray="2 2" />
  </svg>
));
MergeCellsIcon.displayName = 'MergeCellsIcon';

export const SplitCellsIcon = memo(({ className, ...props }: SvgProps) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" />
    <line x1="12" y1="12" x2="12" y2="12" />
  </svg>
));
SplitCellsIcon.displayName = 'SplitCellsIcon';
