import { FloatingPortal } from '@floating-ui/react';

interface BubbleMenuWrapperProps {
  visible: boolean;
  refs: { setFloating: (node: HTMLElement | null) => void };
  floatingStyles: React.CSSProperties;
  hideMenu: () => void;
  className: string;
  children: React.ReactNode;
}

/**
 * 悬浮菜单共享外包装：封装 FloatingPortal、可见性切换、焦点保护、Escape 关闭
 * 文字和媒体悬浮菜单统一使用
 */
export function BubbleMenuWrapper({
  visible,
  refs,
  floatingStyles,
  hideMenu,
  className,
  children,
}: BubbleMenuWrapperProps) {
  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        className={className}
        data-visible={visible ? '' : undefined}
        style={{
          ...floatingStyles,
          visibility: visible ? 'visible' : 'hidden',
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT'
          )
            return;
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            hideMenu();
          }
        }}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
