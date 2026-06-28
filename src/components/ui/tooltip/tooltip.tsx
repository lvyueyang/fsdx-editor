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
        render={(props) => cloneElement(children, { ...props, ...restProps })}
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
