'use client'

import { useState } from 'react'
import { Bell, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface NotifyWhenAvailableProps {
    productId: string
    productName: string
}

export default function NotifyWhenAvailable({ productId, productName }: NotifyWhenAvailableProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [subscribed, setSubscribed] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        try {
            setLoading(true)

            const res = await fetch('/api/notifications/stock-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    email
                })
            })

            const json = await res.json()

            if (!res.ok) {
                toast.error(json.error || 'Failed to subscribe')
                return
            }

            toast.success('You\'ll be notified when this item is back in stock!')
            setSubscribed(true)
            setShowForm(false)
            setEmail('')

        } catch (error) {
            console.error('Notification subscription error:', error)
            toast.error('Failed to subscribe. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (subscribed) {
        return (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    You&apos;ll be notified when available
                </span>
            </div>
        )
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
            >
                <Bell className="w-5 h-5" />
                Notify Me When Available
            </button>
        )
    }

    return (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Get notified when back in stock
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                We&apos;ll send you an email as soon as {productName} is available again.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            <>
                                <Bell className="w-4 h-4" />
                                Notify Me
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
