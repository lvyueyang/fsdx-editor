import { Button } from '../../../src/components/ui/button';
import { Tooltip } from '../../../src/components/ui/tooltip';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoTooltip() {
  return (
    <div className="demo-content">
      {pageTitle('Tooltip 提示框')}
      {pageDesc(
        '基于 @base-ui/react/tooltip，支持上下左右四个方向，可自定义延迟。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">四个方向</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Tooltip title="上方提示" side="top">
                <Button variant="ghost" size="small">
                  上
                </Button>
              </Tooltip>
              <Tooltip title="下方提示" side="bottom">
                <Button variant="ghost" size="small">
                  下
                </Button>
              </Tooltip>
              <Tooltip title="左侧提示" side="left">
                <Button variant="ghost" size="small">
                  左
                </Button>
              </Tooltip>
              <Tooltip title="右侧提示" side="right">
                <Button variant="ghost" size="small">
                  右
                </Button>
              </Tooltip>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">延迟与禁用</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Tooltip title="即时显示（0ms）" side="top" delay={0}>
                <Button variant="ghost" size="small">
                  无延迟
                </Button>
              </Tooltip>
              <Tooltip title="延迟 1000ms" side="top" delay={1000}>
                <Button variant="ghost" size="small">
                  慢提示
                </Button>
              </Tooltip>
              <Tooltip title="不会显示" side="top" disabled>
                <Button variant="ghost" size="small">
                  禁用提示
                </Button>
              </Tooltip>
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}
