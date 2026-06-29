import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@fsdx/editor-react';
import { useState } from 'react';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoPopover() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="demo-content">
      {pageTitle('Popover 弹出框')}
      {pageDesc('基于 @base-ui/react/popover，点击触发弹出内容。')}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">基础用法</h3>
          {componentBlock(
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="primary" size="small">
                  {popoverOpen ? '已打开' : '点击打开'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="ui-demo-popover-content">
                <div style={{ padding: '8px 12px', fontSize: 13 }}>
                  <p style={{ margin: '0 0 8px' }}>这是一段弹出内容</p>
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--demo-text-muted)',
                      fontSize: 12,
                    }}
                  >
                    点击外部区域关闭
                  </p>
                </div>
              </PopoverContent>
            </Popover>,
          )}
        </div>
      </div>
    </div>
  );
}
