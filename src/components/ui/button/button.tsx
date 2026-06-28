import { forwardRef } from 'react';
import { cn } from '../../../core/editor-utils';
import './button.scss';

export type ButtonVariant = 'ghost' | 'primary';
export type ButtonSize = 'small' | 'default' | 'large';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <button
        data-slot="fsdx-editor-button"
        className={cn('fsdx-editor-button', className)}
        ref={ref}
        data-style={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
