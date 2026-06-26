import { cn } from '../../../core/editor-utils';
import './input.scss';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="fsdx-editor-input"
      className={cn('fsdx-editor-input', className)}
      {...props}
    />
  );
}

export { Input };
