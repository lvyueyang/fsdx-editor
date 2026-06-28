import { useState } from 'react';
import { Input } from '../../../src/components/ui/input';
import { componentBlock, pageDesc, pageTitle } from './shared';

export function UiDemoInput() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="demo-content">
      {pageTitle('Input 输入框')}
      {pageDesc('基础输入框组件，透传所有原生 input 属性。')}

      <div className="ui-demo-section">
        <div className="ui-demo-group">
          <h3 className="ui-demo-group-title">基础用法</h3>
          {componentBlock(
            <div className="ui-demo-input-block">
              <div className="ui-demo-input-row">
                <label className="ui-demo-label" htmlFor="ui-demo-input-text">
                  文本输入
                </label>
                <Input
                  id="ui-demo-input-text"
                  placeholder="请输入内容..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="ui-demo-input-row">
                <label
                  className="ui-demo-label"
                  htmlFor="ui-demo-input-disabled"
                >
                  禁用状态
                </label>
                <Input
                  id="ui-demo-input-disabled"
                  placeholder="已禁用"
                  disabled
                />
              </div>
              <div className="ui-demo-input-row">
                <label
                  className="ui-demo-label"
                  htmlFor="ui-demo-input-readonly"
                >
                  只读状态
                </label>
                <Input id="ui-demo-input-readonly" value="只读内容" readOnly />
              </div>
              {inputValue && (
                <p className="ui-demo-input-hint">当前输入：{inputValue}</p>
              )}
            </div>,
          )}
        </div>
      </div>
    </div>
  );
}
