import { Menu } from '@base-ui/react/menu';
import { cn } from '../../../core/editor-utils';
import { CheckIcon } from '../../../icons/check-icon';

import './dropdown-menu.scss';

function DropdownMenu({ ...props }: React.ComponentProps<typeof Menu.Root>) {
  return <Menu.Root data-slot="fsdx-editor-dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof Menu.Portal>) {
  return (
    <Menu.Portal data-slot="fsdx-editor-dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof Menu.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <Menu.Trigger
        data-slot="fsdx-editor-dropdown-menu-trigger"
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return (
    <Menu.Trigger data-slot="fsdx-editor-dropdown-menu-trigger" {...props}>
      {children}
    </Menu.Trigger>
  );
}

function DropdownMenuContent({
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  portal = true,
  onCloseAutoFocus,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: 'center' | 'start' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  portal?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
}) {
  const popup = (
    <Menu.Positioner side={side} sideOffset={sideOffset} align={align}>
      <Menu.Popup
        data-slot="fsdx-editor-dropdown-menu-content"
        className={cn('fsdx-editor-dropdown-menu-content', className)}
        {...props}
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  );

  if (!portal) return popup;

  return <Menu.Portal>{popup}</Menu.Portal>;
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Group>) {
  return (
    <Menu.Group
      data-slot="fsdx-editor-dropdown-menu-group"
      className={cn('fsdx-editor-dropdown-menu-group', className)}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  asChild,
  children,
  ...props
}: React.ComponentProps<typeof Menu.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  asChild?: boolean;
}) {
  const itemProps = {
    'data-slot': 'fsdx-editor-dropdown-menu-item' as const,
    'data-inset': inset,
    'data-variant': variant,
    className: cn('fsdx-editor-dropdown-menu-item', className),
    ...props,
  };

  if (asChild) {
    return <Menu.Item render={children as React.ReactElement} {...itemProps} />;
  }
  return <Menu.Item {...itemProps}>{children}</Menu.Item>;
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <Menu.CheckboxItem
      data-slot="fsdx-editor-dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn('fsdx-editor-dropdown-menu-checkbox-item', className)}
      checked={checked}
      {...props}
    >
      <span
        className="fsdx-editor-dropdown-menu-item-indicator"
        data-slot="fsdx-editor-dropdown-menu-checkbox-item-indicator"
      >
        <Menu.CheckboxItemIndicator>
          <CheckIcon />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof Menu.RadioGroup>) {
  return (
    <Menu.RadioGroup
      data-slot="fsdx-editor-dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <Menu.RadioItem
      data-slot="fsdx-editor-dropdown-menu-radio-item"
      data-inset={inset}
      className={cn('fsdx-editor-dropdown-menu-radio-item', className)}
      {...props}
    >
      <span
        className="fsdx-editor-dropdown-menu-item-indicator"
        data-slot="fsdx-editor-dropdown-menu-radio-item-indicator"
      >
        <Menu.RadioItemIndicator>
          <CheckIcon />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <Menu.GroupLabel
      data-slot="fsdx-editor-dropdown-menu-label"
      data-inset={inset}
      className={cn('fsdx-editor-dropdown-menu-label', className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="fsdx-editor-dropdown-menu-separator"
      className={cn('fsdx-editor-dropdown-menu-separator', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="fsdx-editor-dropdown-menu-shortcut"
      className={cn('fsdx-editor-dropdown-menu-shortcut', className)}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof Menu.SubmenuRoot>) {
  return (
    <Menu.SubmenuRoot data-slot="fsdx-editor-dropdown-menu-sub" {...props} />
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof Menu.SubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <Menu.SubmenuTrigger
      data-slot="fsdx-editor-dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn('fsdx-editor-dropdown-menu-sub-trigger', className)}
      {...props}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fsdx-editor-dropdown-menu-sub-trigger-chevron"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Menu.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup
          data-slot="fsdx-editor-dropdown-menu-sub-content"
          className={cn('fsdx-editor-dropdown-menu-sub-content', className)}
          {...props}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
