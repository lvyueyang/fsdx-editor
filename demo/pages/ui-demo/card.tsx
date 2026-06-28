import {
  Card,
  CardBody,
  CardFooter,
  CardGroupLabel,
  CardHeader,
  CardItemGroup,
} from '../../../src/components/ui/card';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoCard() {
  return (
    <div className="demo-content">
      {pageTitle('Card 卡片')}
      {pageDesc(
        '包含 Card / CardHeader / CardBody / CardFooter / CardItemGroup / CardGroupLabel 子组件。',
      )}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">基础卡片</h3>
          {componentBlock(
            <Card style={{ maxWidth: 360 }}>
              <CardHeader>卡片标题</CardHeader>
              <CardBody>
                这是一段卡片内容，支持任意 React 子元素。 Card
                组件本身不限制内部内容的结构。
              </CardBody>
              <CardFooter>底部操作区</CardFooter>
            </Card>,
          )}
        </div>

        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">带 ItemGroup 的卡片</h3>
          {componentBlock(
            <Card style={{ maxWidth: 360 }}>
              <CardHeader>设置</CardHeader>
              <CardBody>
                <CardItemGroup orientation="vertical">
                  <CardGroupLabel>通用设置</CardGroupLabel>
                  <div
                    style={{
                      padding: '8px 0',
                      fontSize: 13,
                      color: 'var(--demo-text-muted)',
                    }}
                  >
                    语言：中文
                  </div>
                  <div
                    style={{
                      padding: '8px 0',
                      fontSize: 13,
                      color: 'var(--demo-text-muted)',
                    }}
                  >
                    时区：Asia/Shanghai
                  </div>
                </CardItemGroup>
                <CardItemGroup orientation="vertical">
                  <CardGroupLabel>安全设置</CardGroupLabel>
                  <div
                    style={{
                      padding: '8px 0',
                      fontSize: 13,
                      color: 'var(--demo-text-muted)',
                    }}
                  >
                    密码：••••••••
                  </div>
                </CardItemGroup>
              </CardBody>
            </Card>,
          )}
        </div>
      </div>
    </div>
  );
}
