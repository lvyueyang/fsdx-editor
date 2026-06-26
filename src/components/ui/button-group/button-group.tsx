import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../core/editor-utils';
import { Separator } from '../separator';
import './button-group.scss';

const buttonGroupVariants = cva('fsdx-editor-button-group', {
  variants: {
    orientation: {
      horizontal: 'fsdx-editor-button-group-horizontal',
      vertical: 'fsdx-editor-button-group-vertical',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="fsdx-editor-button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      { className: cn('fsdx-editor-button-group-text', className) },
      props,
    ),
    render,
    state: { slot: 'fsdx-editor-button-group-text' },
  });
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="fsdx-editor-button-group-separator"
      orientation={orientation}
      className={cn('fsdx-editor-button-group-separator', className)}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
