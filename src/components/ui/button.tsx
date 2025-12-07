'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Retail variants
        'retail-primary':
          'bg-retail-primary text-white shadow-sm hover:bg-retail-dark hover:shadow-retail hover:-translate-y-0.5 active:translate-y-0',
        'retail-secondary':
          'border-2 border-neutral-300 bg-transparent text-neutral-900 hover:border-retail-primary hover:text-retail-primary dark:text-white dark:border-neutral-700',
        'retail-outline':
          'border border-retail-primary text-retail-primary bg-transparent hover:bg-retail-primary hover:text-white',
        'retail-ghost':
          'text-retail-primary hover:bg-retail-primary/10',
        
        // Business variants
        'business-primary':
          'bg-business-primary text-white shadow-sm hover:bg-business-dark hover:shadow-business hover:-translate-y-0.5 active:translate-y-0',
        'business-secondary':
          'border-2 border-neutral-300 bg-transparent text-neutral-900 hover:border-business-primary hover:text-business-primary dark:text-white dark:border-neutral-700',
        'business-outline':
          'border border-business-primary text-business-primary bg-transparent hover:bg-business-primary hover:text-white',
        'business-ghost':
          'text-business-primary hover:bg-business-primary/10',
        
        // Neutral variants
        default:
          'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700',
        outline:
          'border-2 border-neutral-300 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white',
        link: 'text-retail-primary underline-offset-4 hover:underline',
        
        // Semantic variants
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        success:
          'bg-green-500 text-white hover:bg-green-600 shadow-sm',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 py-1.5 text-xs',
        lg: 'h-12 px-8 py-3 text-base',
        xl: 'h-14 px-10 py-4 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
