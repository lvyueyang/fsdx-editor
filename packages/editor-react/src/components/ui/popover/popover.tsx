import { Popover } from '@base-ui/react/popover';
import { cn } from '../../../core/editor-utils';
import './popover.scss';

function PopoverRoot({ ...props }: React.ComponentProps<typeof Popover.Root>) {
  return <Popover.Root {...props} />;
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof Popover.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <Popover.Trigger render={children as React.ReactElement} {...props} />
    );
  }
  return <Popover.Trigger {...props}>{children}</Popover.Trigger>;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof Popover.Popup> & {
  align?: 'center' | 'start' | 'end';
  sideOffset?: number;
}) {
  return (
    <Popover.Portal>
      <Popover.Positioner sideOffset={sideOffset} align={align}>
        <Popover.Popup
          className={cn('fsdx-editor-popover', className)}
          {...props}
        >
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export { PopoverContent, PopoverRoot as Popover, PopoverTrigger };
