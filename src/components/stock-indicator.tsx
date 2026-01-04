'use client'

import { Check, AlertTriangle, XCircle, Package } from 'lucide-react'

interface StockIndicatorProps {
    stock: number
    showCount?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function StockIndicator({ stock, showCount = true, size = 'md' }: StockIndicatorProps) {
    const getStockStatus = () => {
        if (stock === 0) {
            return {
                label: 'Out of Stock',
                color: 'text-red-600 dark:text-red-400',
                bgColor: 'bg-red-100 dark:bg-red-900/20',
                borderColor: 'border-red-200 dark:border-red-800',
                icon: XCircle
            }
        } else if (stock <= 5) {
            return {
                label: `Only ${stock} left`,
                color: 'text-amber-600 dark:text-amber-400',
                bgColor: 'bg-amber-100 dark:bg-amber-900/20',
                borderColor: 'border-amber-200 dark:border-amber-800',
                icon: AlertTriangle
            }
        } else if (stock <= 20) {
            return {
                label: 'Low Stock',
                color: 'text-yellow-600 dark:text-yellow-400',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                borderColor: 'border-yellow-200 dark:border-yellow-800',
                icon: Package
            }
        } else {
            return {
                label: 'In Stock',
                color: 'text-green-600 dark:text-green-400',
                bgColor: 'bg-green-100 dark:bg-green-900/20',
                borderColor: 'border-green-200 dark:border-green-800',
                icon: Check
            }
        }
    }

    const status = getStockStatus()
    const Icon = status.icon

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    }

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    }

    return (
        <div className={`inline-flex items-center gap-2 rounded-lg border ${status.borderColor} ${status.bgColor} ${sizeClasses[size]}`}>
            <Icon className={`${iconSizes[size]} ${status.color}`} />
            <span className={`font-medium ${status.color}`}>
                {status.label}
                {showCount && stock > 0 && stock > 20 && ` - ${stock} available`}
            </span>
        </div>
    )
}
