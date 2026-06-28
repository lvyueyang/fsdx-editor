import { Button } from '../../../src/components/ui/button';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoButton() {
  return (
    <div className="demo-content">
      {pageTitle('Button 按钮')}
      {pageDesc(
        '支持 primary / ghost 两种样式变体和 small / default / large 三种尺寸。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">Primary</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Button variant="primary" size="small">
                Small
              </Button>
              <Button variant="primary" size="default">
                Default
              </Button>
              <Button variant="primary" size="large">
                Large
              </Button>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">Ghost</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Button variant="ghost" size="small">
                Small
              </Button>
              <Button variant="ghost" size="default">
                Default
              </Button>
              <Button variant="ghost" size="large">
                Large
              </Button>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">Disabled</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Button variant="primary" disabled>
                Primary Disabled
              </Button>
              <Button variant="ghost" disabled>
                Ghost Disabled
              </Button>
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}
