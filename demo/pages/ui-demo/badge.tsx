import { Badge } from '../../../src/components/ui/badge';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoBadge() {
  return (
    <div className="demo-content">
      {pageTitle('Badge 徽标')}
      {pageDesc(
        '支持 ghost / white / gray / green / yellow / default 多种变体，以及 subdued / default / emphasized 外观。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">变体</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Badge variant="default">Default</Badge>
              <Badge variant="ghost">Ghost</Badge>
              <Badge variant="white">White</Badge>
              <Badge variant="gray">Gray</Badge>
              <Badge variant="green">Green</Badge>
              <Badge variant="yellow">Yellow</Badge>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">外观</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Badge variant="default" appearance="default">
                Default
              </Badge>
              <Badge variant="default" appearance="subdued">
                Subdued
              </Badge>
              <Badge variant="default" appearance="emphasized">
                Emphasized
              </Badge>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">尺寸</h3>
          {componentBlock(
            <div className="ui-demo-row">
              <Badge variant="green" size="default">
                Default 尺寸
              </Badge>
              <Badge variant="green" size="small">
                Small 尺寸
              </Badge>
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}
