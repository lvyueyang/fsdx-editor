import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';

export interface TooltipProviderProps {
  delay?: number;
  closeDelay?: number;
  timeout?: number;
  children?: ReactNode;
}

export function TooltipProvider({
  delay = 600,
  closeDelay = 0,
  timeout = 400,
  children,
}: TooltipProviderProps) {
  return (
    <Tooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
      {children}
    </Tooltip.Provider>
  );
}

export interface UIProviderProps {
  children?: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
