'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface StripePaymentFormProps {
    amount: number
    onSuccess: () => void
    onError: (error: string) => void
}

export function StripePaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setErrorMessage('')

        try {
            // Confirm the payment
            const { error: submitError } = await elements.submit()
            if (submitError) {
                throw new Error(submitError.message)
            }

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: 'if_required',
            })

            if (error) {
                // Payment failed
                setErrorMessage(error.message || 'Payment failed')
                onError(error.message || 'Payment failed')
                toast.error(error.message || 'Payment failed')
            } else {
                // Payment succeeded
                toast.success('Payment successful!')
                onSuccess()
            }
        } catch (err: any) {
            const message = err.message || 'An error occurred during payment'
            setErrorMessage(message)
            onError(message)
            toast.error(message)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stripe Payment Element */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card', 'klarna', 'affirm'],
                    }}
                />
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                    <p className="text-sm">{errorMessage}</p>
                </div>
            )}

            {/* Payment Amount */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400">Total Amount:</span>
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                        ${amount.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-6 text-lg"
                size="lg"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    `Pay $${amount.toFixed(2)}`
                )}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure payment powered by Stripe
                </p>
                <p className="mt-1">Your payment information is encrypted and secure</p>
            </div>
        </form>
    )
}

// Wrapper component that includes Stripe Elements Provider
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormWrapperProps {
    clientSecret: string
    amount: number
    onSuccess: () => void
    onError: (error: string) => void
}

export function PaymentFormWrapper({ clientSecret, amount, onSuccess, onError }: PaymentFormWrapperProps) {
    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#ef4444',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '8px',
            },
        },
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </Elements>
    )
}
