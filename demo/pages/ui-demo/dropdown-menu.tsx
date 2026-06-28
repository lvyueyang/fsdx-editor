import { useState } from 'react';
import { Button } from '../../../src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../../src/components/ui/dropdown-menu';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoDropdownMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="demo-content">
      {pageTitle('DropdownMenu 下拉菜单')}
      {pageDesc(
        '基于 @radix-ui/react-dropdown-menu，支持分组、快捷键、分割线。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">完整菜单</h3>
          {componentBlock(
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="small">
                  {dropdownOpen ? '已打开' : '打开菜单'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>编辑</DropdownMenuLabel>
                  <DropdownMenuItem>
                    撤销
                    <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    重做
                    <DropdownMenuShortcut>⌘⇧Z</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>视图</DropdownMenuLabel>
                  <DropdownMenuItem inset>工具栏</DropdownMenuItem>
                  <DropdownMenuItem inset>状态栏</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  删除
                  <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>,
          )}
        </div>
      </div>
    </div>
  );
}
