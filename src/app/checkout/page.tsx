'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createOrder } from '@/lib/api/orders'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import PaymentForm from '@/components/checkout/payment-form'

const checkoutSchema = z.object({
    full_name: z.string().min(1, 'Full Name is required'),
    address_line_1: z.string().min(1, 'Address is required'),
    address_line_2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Zip Code is required'),
    country: z.string().default('US'),
    phone: z.string().optional(),
    customer_notes: z.string().optional()
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const [submitting, setSubmitting] = useState(false)
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [orderAmount, setOrderAmount] = useState<number>(0)

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            country: 'US'
        }
    })

    const onSubmit = async (data: CheckoutFormData) => {
        try {
            setSubmitting(true)

            const payload = {
                items: [], // API trusts DB Cart
                shipping_address: {
                    full_name: data.full_name,
                    address_line_1: data.address_line_1,
                    address_line_2: data.address_line_2,
                    city: data.city,
                    state: data.state,
                    postal_code: data.postal_code,
                    country: data.country,
                    phone: data.phone
                },
                customer_notes: data.customer_notes
            }

            // 1. Create Order
            const orderResponse = await createOrder(payload as any)
            const createdOrderId = orderResponse.data.orderId
            setOrderId(createdOrderId)
            setOrderAmount(orderResponse.data.totalAmount)

            // 2. Create Payment Intent
            const paymentResponse = await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user!.id
                },
                body: JSON.stringify({ order_id: createdOrderId })
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.error || 'Failed to initialize payment');
            }

            const paymentData = await paymentResponse.json();

            // Check if already paid (unlikely in new flow but possible if retrying)
            if (paymentData.error === 'Order already paid') {
                router.push(`/orders/${createdOrderId}/confirmation`)
                return
            }

            setClientSecret(paymentData.data.client_secret);
            toast.success('Order created! Please complete payment.')

        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Failed to process checkout')
        } finally {
            setSubmitting(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!user) {
        router.push('/auth/login?redirect=/checkout')
        return null
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Checkout</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Complete your purchase</p>
                </div>

                {!clientSecret ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                            <CardDescription>Where should we send your order?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div className="grid gap-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input id="full_name" {...register('full_name')} placeholder="John Doe" />
                                    {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address_line_1">Address</Label>
                                    <Input id="address_line_1" {...register('address_line_1')} placeholder="123 Main St" />
                                    {errors.address_line_1 && <p className="text-sm text-red-500">{errors.address_line_1.message}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address_line_2">Apartment, Suite, etc. (Optional)</Label>
                                    <Input id="address_line_2" {...register('address_line_2')} placeholder="Apt 4B" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" {...register('city')} placeholder="New York" />
                                        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" {...register('state')} placeholder="NY" />
                                        {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="postal_code">Zip Code</Label>
                                        <Input id="postal_code" {...register('postal_code')} placeholder="10001" />
                                        {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" {...register('country')} disabled />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input id="phone" {...register('phone')} placeholder="(555) 123-4567" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="customer_notes">Order Notes (Optional)</Label>
                                    <Textarea id="customer_notes" {...register('customer_notes')} placeholder="Special instructions for delivery..." />
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Payment
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Elements stripe={stripePromise} options={{
                        clientSecret,
                        appearance: { theme: 'stripe' }
                    }}>
                        <PaymentForm
                            orderId={orderId!}
                            amount={orderAmount}
                            clientSecret={clientSecret}
                        />
                    </Elements>
                )}
            </div>
        </div>
    )
}
