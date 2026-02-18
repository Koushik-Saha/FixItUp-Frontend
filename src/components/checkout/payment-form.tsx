'use client'

import { useState, useEffect } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PaymentFormProps {
    orderId: string
    amount: number
    clientSecret: string
}

export default function PaymentForm({ orderId, amount, clientSecret }: PaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)
        setErrorMessage(null)

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
                },
            })

            if (error) {
                // This point will only be reached if there is an immediate error when
                // confirming the payment. Show error to your customer (e.g., payment
                // details incomplete)
                setErrorMessage(error.message ?? 'An unexpected error occurred')
                toast.error(error.message ?? 'Payment failed')
            } else {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.
            }
        } catch (e) {
            console.error(e)
            setErrorMessage('An unexpected error occurred')
            toast.error('An unexpected error occurred')
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Payment Details</h3>
                    <div className="flex items-center text-sm text-neutral-500">
                        <Lock className="w-4 h-4 mr-1" />
                        Secure Encrypted
                    </div>
                </div>

                <PaymentElement />

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-900/30">
                        {errorMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="w-full mt-6"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Pay $${amount.toFixed(2)}`
                    )}
                </Button>
            </div>
        </form>
    )
}
