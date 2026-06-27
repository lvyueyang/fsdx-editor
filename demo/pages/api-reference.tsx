export function ApiReference() {
  return (
    <div className="demo-content">
      <h1 className="demo-cover-title">API 参考</h1>
      <p
        style={{
          color: 'var(--demo-text-muted)',
          fontSize: 15,
          marginBottom: 32,
        }}
      >
        <span className="demo-inline-code">&lt;Editor /&gt;</span> 组件的完整
        Props 说明，以及相关类型定义。
      </p>

      <h2 className="demo-section-title">EditorProps</h2>
      <table className="demo-props-table">
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>value</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>—</td>
            <td>编辑器的初始或受控 HTML 内容</td>
          </tr>
          <tr>
            <td>onChange</td>
            <td>
              <span className="demo-prop-type">{'(html: string) => void'}</span>
            </td>
            <td>—</td>
            <td>编辑器内容变更回调，返回当前 HTML 字符串</td>
          </tr>
          <tr>
            <td>options</td>
            <td>
              <span className="demo-prop-type">EditorOptions</span>
            </td>
            <td>
              <span className="demo-inline-code">{'{}'}</span>
            </td>
            <td>编辑器功能配置，覆盖媒体上传、列表查询等可选能力</td>
          </tr>
          <tr>
            <td>theme</td>
            <td>
              <span className="demo-prop-type">EditorTheme</span>
            </td>
            <td>
              <span className="demo-inline-code">&apos;auto&apos;</span>
            </td>
            <td>
              编辑器视觉主题，可选{' '}
              <span className="demo-inline-code">&apos;light&apos;</span> |{' '}
              <span className="demo-inline-code">&apos;dark&apos;</span> |{' '}
              <span className="demo-inline-code">&apos;auto&apos;</span>
            </td>
          </tr>
          <tr>
            <td>className</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>
              <span className="demo-inline-code">undefined</span>
            </td>
            <td>编辑器根元素的额外 CSS 类名</td>
          </tr>
          <tr>
            <td>placeholder</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>
              <span className="demo-inline-code">undefined</span>
            </td>
            <td>编辑器为空时显示的占位文字</td>
          </tr>
        </tbody>
      </table>

      <h2 className="demo-section-title">EditorOptions</h2>
      <table className="demo-props-table">
        <thead>
          <tr>
            <th>字段</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>image</td>
            <td>
              <span className="demo-prop-type">MediaUploadConfig</span>
            </td>
            <td>图片上传与列表配置</td>
          </tr>
          <tr>
            <td>video</td>
            <td>
              <span className="demo-prop-type">MediaUploadConfig</span>
            </td>
            <td>视频上传与列表配置</td>
          </tr>
          <tr>
            <td>audio</td>
            <td>
              <span className="demo-prop-type">MediaUploadConfig</span>
            </td>
            <td>音频上传与列表配置</td>
          </tr>
          <tr>
            <td>attachment</td>
            <td>
              <span className="demo-prop-type">MediaUploadConfig</span>
            </td>
            <td>附件上传与列表配置</td>
          </tr>
        </tbody>
      </table>

      <h2 className="demo-section-title">MediaUploadConfig</h2>
      <table className="demo-props-table">
        <thead>
          <tr>
            <th>字段</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>upload</td>
            <td>
              <span className="demo-prop-type">
                {
                  '(file: File, onProgress?: UploadProgressCallback) => Promise<MediaItem>'
                }
              </span>
            </td>
            <td>文件上传函数，支持进度回调</td>
          </tr>
          <tr>
            <td>getList</td>
            <td>
              <span className="demo-prop-type">
                {'(params: MediaListParams) => Promise<MediaListResult>'}
              </span>
            </td>
            <td>媒体列表分页查询函数</td>
          </tr>
        </tbody>
      </table>

      <h2 className="demo-section-title">MediaItem</h2>
      <table className="demo-props-table">
        <thead>
          <tr>
            <th>字段</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>id</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>媒体唯一标识</td>
          </tr>
          <tr>
            <td>url</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>媒体资源地址</td>
          </tr>
          <tr>
            <td>name</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>媒体显示名称</td>
          </tr>
          <tr>
            <td>size</td>
            <td>
              <span className="demo-prop-type">number</span>
            </td>
            <td>文件大小（字节）</td>
          </tr>
          <tr>
            <td>thumbnailUrl</td>
            <td>
              <span className="demo-prop-type">string</span>
            </td>
            <td>缩略图地址（可选）</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
