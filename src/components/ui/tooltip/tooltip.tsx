import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cloneElement, isValidElement } from 'react';
import './tooltip.scss';

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

/** 需要从 children 原始 props 中优先保留的事件处理器 */
const PRESERVE_EVENT_HANDLERS = [
  'onClick',
  'onPointerDown',
  'onMouseDown',
] as const;

export function Tooltip({
  title,
  children,
  side = 'top',
  delay = 600,
  disabled = false,
  className,
  ...restProps
}: TooltipProps) {
  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger
        render={(props) => {
          const childProps = children.props as Record<string, unknown>;
          const preserved: Record<string, unknown> = {};
          for (const key of PRESERVE_EVENT_HANDLERS) {
            if (childProps[key] !== undefined) {
              preserved[key] = childProps[key];
            }
          }
          return cloneElement(children, {
            ...props,
            ...restProps,
            ...preserved,
          });
        }}
        delay={delay}
        disabled={disabled}
      />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          sideOffset={6}
          className="fsdx-editor-tooltip-positioner"
        >
          <BaseTooltip.Popup
            className={`fsdx-editor-tooltip ${className ?? ''}`}
          >
            <BaseTooltip.Arrow className="fsdx-editor-tooltip-arrow" />
            {title}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export default Tooltip;
