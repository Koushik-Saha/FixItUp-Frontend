'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { getCart, updateCartItem, removeFromCart, CartItem, CartSummary } from '@/lib/api/cart'
import { toast } from 'sonner'

export default function CartPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [summary, setSummary] = useState<CartSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const fetchCart = async () => {
        try {
            setLoading(true)
            const response = await getCart()
            setCartItems(response.data.items)
            setSummary(response.data.summary)
        } catch (error) {
            console.error('Failed to load cart', error)
            toast.error('Failed to load cart')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                // Redirect logic handled by protected route usually, but here we can just show empty or redirect
                // For now, let's fetch (API returns empty for guest)
                fetchCart()
            } else {
                fetchCart()
            }
        }
    }, [user, authLoading])

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return

        try {
            setUpdatingId(itemId)
            await updateCartItem(itemId, newQuantity)
            // Optimistic update or refetch
            fetchCart()
        } catch (error) {
            toast.error('Failed to update quantity')
        } finally {
            setUpdatingId(null)
        }
    }

    const handleRemoveItem = async (itemId: string) => {
        try {
            setUpdatingId(itemId)
            await removeFromCart(itemId)
            fetchCart()
            toast.success('Item removed')
        } catch (error) {
            toast.error('Failed to remove item')
        } finally {
            setUpdatingId(null)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-12">
                        <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                            Your cart is empty
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/shop">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
                    Your Cart ({summary?.total_items || 0} items)
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4 flex gap-4">
                                    {/* Image */}
                                    <div className="h-24 w-24 bg-neutral-100 rounded-md flex-shrink-0 relative overflow-hidden">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-neutral-400">
                                                No Img
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">
                                                    <Link href={`/products/${item.product.id}`} className="hover:underline">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-neutral-500">
                                                    SKU: {item.product.sku}
                                                </p>
                                            </div>
                                            <p className="font-bold text-lg text-neutral-900 dark:text-white">
                                                ${item.pricing.subtotal.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingId === item.id}
                                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">
                                                    {updatingId === item.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updatingId === item.id}
                                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={updatingId === item.id}
                                                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                        <span>Subtotal</span>
                                        <span>${summary?.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                        <span>Shipping</span>
                                        <span>{summary?.subtotal && summary.subtotal > 100 ? 'Free' : '$10.00'}</span>
                                    </div>
                                    {summary?.total_savings && summary.total_savings > 0 ? (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Savings</span>
                                            <span>-${summary.total_savings.toFixed(2)}</span>
                                        </div>
                                    ) : null}
                                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>
                                            ${((summary?.subtotal || 0) + (summary?.subtotal && summary.subtotal > 100 ? 0 : 10)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="block w-full">
                                    <Button className="w-full" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <div className="mt-4 text-center">
                                    <Link href="/shop" className="text-sm text-blue-600 hover:underline">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
