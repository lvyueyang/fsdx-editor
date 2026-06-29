import { Input as BaseUIInput } from '@base-ui/react/input';
import { cn } from '../../../core/editor-utils';
import './input.scss';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <BaseUIInput
      data-slot="fsdx-editor-input"
      className={cn('fsdx-editor-input', className)}
      {...props}
    />
  );
}

export { Input };
