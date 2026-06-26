import type { ElementType } from 'react';
import type { ButtonProps } from '../button';
import { Button } from '../button';
import { DropdownMenuItem } from '../dropdown-menu';

export interface DropdownMenuButtonItemProps extends Omit<ButtonProps, 'type'> {
  active?: boolean;
  icon?: ElementType;
}

/**
 * 下拉菜单中的按钮项通用组件，封装 DropdownMenuItem + Button 的组合模式
 */
export function DropdownMenuButtonItem({
  active = false,
  icon: Icon,
  children,
  ...buttonProps
}: DropdownMenuButtonItemProps) {
  return (
    <DropdownMenuItem asChild>
      <Button
        type="button"
        variant="ghost"
        data-active-state={active ? 'on' : 'off'}
        showTooltip={false}
        {...buttonProps}
      >
        {Icon ? (
          <Icon className="tiptap-button-icon" />
        ) : (
          <span className="tiptap-button-icon" />
        )}
        {children}
      </Button>
    </DropdownMenuItem>
  );
}
