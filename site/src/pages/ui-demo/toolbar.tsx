import { Button, Toolbar } from '@fsdx/editor-react';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoToolbar() {
  return (
    <div className="demo-content">
      {pageTitle('Toolbar 工具栏')}
      {pageDesc(
        '支持 fixed / floating 两种变体，内置键盘导航（方向键切换焦点）。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">Fixed 工具栏</h3>
          {componentBlock(
            <Toolbar variant="fixed">
              <Button variant="ghost" size="small">
                B
              </Button>
              <Button variant="ghost" size="small">
                I
              </Button>
              <Button variant="ghost" size="small">
                U
              </Button>
              <Button variant="ghost" size="small">
                S
              </Button>
              <Button variant="ghost" size="small" disabled>
                禁用
              </Button>
            </Toolbar>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">Floating 工具栏</h3>
          {componentBlock(
            <Toolbar variant="floating">
              <Button variant="ghost" size="small">
                粗体
              </Button>
              <Button variant="ghost" size="small">
                斜体
              </Button>
              <Button variant="ghost" size="small">
                删除线
              </Button>
            </Toolbar>,
          )}
        </div>
      </div>
    </div>
  );
}
