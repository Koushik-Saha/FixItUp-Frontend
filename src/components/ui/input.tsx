'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm transition-colors',
                        'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
                        'focus:outline-none focus:ring-2 focus:ring-retail-primary focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'dark:border-neutral-600 dark:bg-neutral-800 dark:text-white',
                        error && 'border-red-500 focus:ring-red-500',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        {rightIcon}
                    </div>
                )}
                {error && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
