'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Building2 } from 'lucide-react'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        retail:
          'bg-gradient-retail text-white shadow-sm',
        business:
          'bg-gradient-business text-white shadow-sm',
        default:
          'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
        secondary:
          'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
        success:
          'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300',
        warning:
          'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300',
        error:
          'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300',
        info:
          'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300',
        outline:
          'text-foreground border border-neutral-300 dark:border-neutral-700',
        discount:
          'bg-business-primary text-white font-bold',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {variant === 'business' && !icon && <Building2 className="h-3 w-3" />}
      {icon}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
