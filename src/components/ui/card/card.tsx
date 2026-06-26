import { forwardRef } from 'react';
import { cn } from '../../../core/editor-utils';
import './card.scss';

const Card = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('fsdx-editor-card', className)} {...props} />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('fsdx-editor-card-header', className)}
        {...props}
      />
    );
  },
);
CardHeader.displayName = 'CardHeader';

const CardBody = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('fsdx-editor-card-body', className)}
        {...props}
      />
    );
  },
);
CardBody.displayName = 'CardBody';

const CardItemGroup = forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn('fsdx-editor-card-item-group', className)}
      {...props}
    />
  );
});
CardItemGroup.displayName = 'CardItemGroup';

const CardGroupLabel = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('fsdx-editor-card-group-label', className)}
        {...props}
      />
    );
  },
);
CardGroupLabel.displayName = 'CardGroupLabel';

const CardFooter = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('fsdx-editor-card-footer', className)}
        {...props}
      />
    );
  },
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardBody,
  CardFooter,
  CardGroupLabel,
  CardHeader,
  CardItemGroup,
};
