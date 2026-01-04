'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface QuickReorderButtonProps {
    orderId: string
    orderNumber: string
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
}

export default function QuickReorderButton({
    orderId,
    orderNumber,
    variant = 'default',
    size = 'md',
    showIcon = true
}: QuickReorderButtonProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleReorder = async () => {
        try {
            setLoading(true)

            const res = await fetch('/api/orders/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ order_id: orderId })
            })

            const json = await res.json()

            if (!res.ok) {
                toast.error(json.error || 'Failed to reorder')
                return
            }

            // Show success message
            const { data } = json
            if (data.unavailable_products && data.unavailable_products.length > 0) {
                toast.warning(
                    `Added ${data.added_count} of ${data.total_items} items to cart. ${data.unavailable_products.length} item(s) unavailable.`,
                    {
                        duration: 5000,
                        description: data.unavailable_products
                            .map((p: any) => `${p.name}: ${p.reason}`)
                            .join(', ')
                    }
                )
            } else {
                toast.success(`All ${data.added_count} items added to cart!`, {
                    duration: 3000,
                    action: {
                        label: 'View Cart',
                        onClick: () => window.location.href = '/cart'
                    }
                })
            }

            // Show success state briefly
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)

        } catch (error) {
            console.error('Reorder error:', error)
            toast.error('Failed to reorder. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        default: 'bg-blue-600 hover:bg-blue-700 text-white',
        outline: 'border border-neutral-700 hover:bg-neutral-800 text-white',
        ghost: 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <button
            onClick={handleReorder}
            disabled={loading || success}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
            title={`Reorder ${orderNumber}`}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reordering...
                </>
            ) : success ? (
                <>
                    {showIcon && <Check className="w-4 h-4" />}
                    Added to Cart
                </>
            ) : (
                <>
                    {showIcon && <ShoppingCart className="w-4 h-4" />}
                    Reorder
                </>
            )}
        </button>
    )
}
