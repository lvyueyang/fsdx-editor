import './separator.scss';
import { cn } from '../../../core/editor-utils';

export type Orientation = 'horizontal' | 'vertical';

export function Separator({
  decorative,
  orientation = 'vertical',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: Orientation;
  decorative?: boolean;
}) {
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
  const semanticProps = decorative
    ? { role: 'none' }
    : { 'aria-orientation': ariaOrientation, role: 'separator' };

  return (
    <div
      className={cn('fsdx-editor-separator', className)}
      data-orientation={orientation}
      {...semanticProps}
      {...props}
    />
  );
}
