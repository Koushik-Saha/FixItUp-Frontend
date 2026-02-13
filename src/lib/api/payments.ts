// lib/api/payments.ts
// Payments API client

export interface PaymentIntentResponse {
    data: {
        client_secret: string
        payment_intent_id: string
    }
}

// Create payment intent for order
export async function createPaymentIntent(orderId: string): Promise<PaymentIntentResponse> {
    const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
    }

    return response.json()
}

// Process refund
export async function processRefund(paymentIntentId: string, amount?: number): Promise<{ message: string; data: unknown }> {
    const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            payment_intent_id: paymentIntentId,
            amount
        }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process refund')
    }

    return response.json()
}