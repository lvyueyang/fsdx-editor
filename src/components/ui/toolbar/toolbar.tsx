import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { forwardRef } from 'react';
import { cn } from '../../../core/editor-utils';
import { ChevronDownIcon } from '../../../icons/chevron-down-icon';
import { Tooltip } from '../tooltip';
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

const ToolbarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
    showDropdown?: boolean;
    active?: boolean;
  }
>(
  (
    { label, showDropdown, active, className, children, disabled, ...props },
    ref,
  ) => {
    const btn = (
      <button
        ref={ref}
        data-slot="fsdx-editor-toolbar-button"
        data-active-state={active ? 'on' : 'off'}
        className={cn('fsdx-editor-toolbar-button', className)}
        disabled={disabled}
        tabIndex={-1}
        {...props}
      >
        {children}
        {showDropdown && (
          <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
        )}
      </button>
    );
    return label ? <Tooltip title={label}>{btn}</Tooltip> : btn;
  },
);
ToolbarButton.displayName = 'ToolbarButton';

const ToolbarSelect = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    displayText: string;
    active?: boolean;
  }
>(({ label, displayText, active, className, disabled, ...props }, ref) => (
  <Tooltip title={label}>
    <button
      ref={ref}
      data-slot="fsdx-editor-toolbar-select"
      data-active-state={active ? 'on' : 'off'}
      className={cn('fsdx-editor-toolbar-select', className)}
      disabled={disabled}
      tabIndex={-1}
      {...props}
    >
      <span className="fsdx-editor-button-text fsdx-editor-button-text-fixed">
        {displayText}
      </span>
      <ChevronDownIcon className="fsdx-editor-button-dropdown-small" />
    </button>
  </Tooltip>
));
ToolbarSelect.displayName = 'ToolbarSelect';

const ToolbarInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-slot="fsdx-editor-toolbar-input"
    className={cn('fsdx-editor-toolbar-input', className)}
    {...props}
  />
));
ToolbarInput.displayName = 'ToolbarInput';

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Select: ToolbarSelect,
  Input: ToolbarInput,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
});
