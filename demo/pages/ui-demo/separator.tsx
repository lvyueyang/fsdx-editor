import { Separator } from '../../../src/components/ui/separator';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoSeparator() {
  return (
    <div className="demo-content">
      {pageTitle('Separator 分隔线')}
      {pageDesc('支持 horizontal / vertical 两种方向。')}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">水平分隔线</h3>
          {componentBlock(
            <div>
              <p style={{ padding: '8px 0', fontSize: 13 }}>上部内容</p>
              <Separator orientation="horizontal" />
              <p style={{ padding: '8px 0', fontSize: 13 }}>下部内容</p>
            </div>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">垂直分隔线</h3>
          {componentBlock(
            <div className="ui-demo-row" style={{ height: 40 }}>
              <span style={{ padding: '0 12px', fontSize: 13 }}>左</span>
              <Separator orientation="vertical" />
              <span style={{ padding: '0 12px', fontSize: 13 }}>右</span>
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}
