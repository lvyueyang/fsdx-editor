import { Button } from '../../../src/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '../../../src/components/ui/button-group';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoButtonGroup() {
  return (
    <div className="demo-content">
      {pageTitle('ButtonGroup 按钮组')}
      {pageDesc(
        '按钮组容器，支持 horizontal / vertical 排列，可配合 ButtonGroupText 和 ButtonGroupSeparator 使用。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">水平排列</h3>
          {componentBlock(
            <ButtonGroup orientation="horizontal">
              <Button variant="ghost" size="small">
                编辑
              </Button>
              <Button variant="ghost" size="small">
                预览
              </Button>
              <Button variant="ghost" size="small">
                导出
              </Button>
            </ButtonGroup>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">垂直排列 + 标签 + 分隔线</h3>
          {componentBlock(
            <ButtonGroup orientation="vertical">
              <ButtonGroupText>操作</ButtonGroupText>
              <Button variant="ghost" size="small">
                复制
              </Button>
              <Button variant="ghost" size="small">
                粘贴
              </Button>
              <ButtonGroupSeparator />
              <Button variant="ghost" size="small">
                删除
              </Button>
            </ButtonGroup>,
          )}
        </div>
      </div>
    </div>
  );
}
