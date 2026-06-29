import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@fsdx/editor-react';
import { useState } from 'react';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoDropdownMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [sortValue, setSortValue] = useState('date');

  return (
    <div className="demo-content">
      {pageTitle('DropdownMenu 下拉菜单')}
      {pageDesc(
        '基于 @base-ui/react/menu，支持多级子菜单、复选、单选、禁用等。',
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
                  <DropdownMenuItem inset disabled>
                    状态栏
                  </DropdownMenuItem>
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

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">多级子菜单</h3>
          {componentBlock(
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="small">
                  多级菜单
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>新建文件</DropdownMenuItem>
                <DropdownMenuItem>打开文件</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>分享</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>导出为</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>PDF</DropdownMenuItem>
                        <DropdownMenuItem>PNG</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            纯文本
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>UTF-8</DropdownMenuItem>
                            <DropdownMenuItem>GBK</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>复制链接</DropdownMenuItem>
                    <DropdownMenuItem disabled>通过邮件发送</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">复选项</h3>
          {componentBlock(
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="small">
                  视图选项
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={showToolbar}
                  onCheckedChange={setShowToolbar}
                >
                  工具栏
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showBreadcrumb}
                  onCheckedChange={setShowBreadcrumb}
                >
                  面包屑
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showFooter}
                  onCheckedChange={setShowFooter}
                >
                  状态栏
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">单选项</h3>
          {componentBlock(
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="small">
                  排序方式
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={sortValue}
                  onValueChange={setSortValue}
                >
                  <DropdownMenuRadioItem value="date">
                    按日期
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">
                    按名称
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="type">
                    按类型
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size">
                    按大小
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>,
          )}
        </div>
      </div>
    </div>
  );
}
