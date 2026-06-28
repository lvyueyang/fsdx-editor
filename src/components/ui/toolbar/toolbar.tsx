import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { forwardRef } from 'react';
import { cn } from '../../../core/editor-utils';
import './toolbar.scss';

type ToolbarProps = React.ComponentProps<typeof BaseToolbar.Root> & {
  variant?: 'fixed' | 'floating';
};

const ToolbarRoot = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, className, variant = 'fixed', ...props }, ref) => (
    <BaseToolbar.Root
      ref={ref}
      data-variant={variant}
      className={cn('fsdx-editor-toolbar', className)}
      {...props}
    >
      {children}
    </BaseToolbar.Root>
  ),
);
ToolbarRoot.displayName = 'Toolbar';

const ToolbarGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Group>) => (
  <BaseToolbar.Group
    className={cn('fsdx-editor-toolbar-group', className)}
    {...props}
  />
);
ToolbarGroup.displayName = 'ToolbarGroup';

const ToolbarSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Separator>) => (
  <BaseToolbar.Separator
    className={cn('fsdx-editor-separator', className)}
    {...props}
  />
);
ToolbarSeparator.displayName = 'ToolbarSeparator';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: BaseToolbar.Button,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
});
