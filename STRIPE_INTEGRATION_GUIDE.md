# Stripe Payment Integration Guide

This guide explains how to integrate the Stripe payment form into your checkout page.

## ✅ What's Already Done

1. **Backend Stripe Integration** - Complete ✅
   - `/src/app/api/payments/create-intent/route.ts` - Creates payment intents
   - `/src/app/api/payments/webhook/route.ts` - Handles Stripe webhooks with email notifications
   - `/src/app/api/payments/refund/route.ts` - Processes refunds

2. **Stripe Payment Form Component** - Complete ✅
   - `/src/components/stripe-payment-form.tsx` - Ready-to-use payment form
   - Includes PaymentElement with cards, Klarna, Affirm support
   - Error handling and loading states
   - Secure payment confirmation

3. **Required Packages** - Already Installed ✅
   - `stripe` - Server-side Stripe SDK
   - `@stripe/stripe-js` - Client-side Stripe SDK
   - `@stripe/react-stripe-js` - React components for Stripe

## 🔧 Step-by-Step Integration

### Step 1: Update Environment Variables

Add to your `.env.local`:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 2: Modify Checkout Page

Update `/src/app/checkout/page.tsx`:

#### A. Add Imports (at the top)

```typescript
import { PaymentFormWrapper } from '@/components/stripe-payment-form'
import { useState, useEffect } from 'react'
```

#### B. Add State Variables (in the component)

```typescript
const [paymentIntent, setPaymentIntent] = useState<{
    clientSecret: string
    intentId: string
} | null>(null)
const [isCreatingIntent, setIsCreatingIntent] = useState(false)
```

#### C. Create Payment Intent Function

Add this function inside your component:

```typescript
async function createPaymentIntent() {
    if (isCreatingIntent || paymentIntent) return

    setIsCreatingIntent(true)
    try {
        // Calculate total
        const shippingCost = SHIPPING_METHODS.find(m => m.id === shippingMethod)?.price || 0
        const subtotal = cartSummary?.subtotal || 0
        const discountAmount = calculateDiscountAmount(discountCode, subtotal)
        const taxAmount = (subtotal - discountAmount) * 0.0825 // 8.25% tax
        const total = subtotal - discountAmount + taxAmount + shippingCost

        const response = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(total * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    customer_email: shippingInfo.email,
                    customer_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                },
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        setPaymentIntent({
            clientSecret: data.data.clientSecret,
            intentId: data.data.intentId,
        })
    } catch (error) {
        console.error('Error creating payment intent:', error)
        toast.error('Failed to initialize payment. Please try again.')
    } finally {
        setIsCreatingIntent(false)
    }
}
```

#### D. Create Payment Intent When Needed

Add this useEffect to create the payment intent when shipping info is filled:

```typescript
useEffect(() => {
    // Create payment intent when user provides email (for both guest and logged-in users)
    if (shippingInfo.email && !paymentIntent && paymentMethod === 'card') {
        createPaymentIntent()
    }
}, [shippingInfo.email, paymentMethod])
```

#### E. Replace Payment Form Section

Find the payment method section in your JSX (around line 600-700) and replace the card input fields with:

```tsx
{/* Payment Method */}
<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
    <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Secure payment powered by Stripe
            </p>
        </div>
    </div>

    {/* Payment Method Selection */}
    <div className="grid grid-cols-2 gap-4 mb-6">
        <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
        >
            <CreditCard className="h-6 w-6" />
            <span className="font-medium">Credit/Debit Card</span>
        </button>

        <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'paypal'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
            }`}
        >
            <span className="text-2xl">💳</span>
            <span className="font-medium">PayPal</span>
        </button>
    </div>

    {/* Stripe Payment Form */}
    {paymentMethod === 'card' && (
        <>
            {isCreatingIntent && (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Initializing secure payment...
                    </p>
                </div>
            )}

            {paymentIntent?.clientSecret && !isCreatingIntent && (
                <PaymentFormWrapper
                    clientSecret={paymentIntent.clientSecret}
                    amount={calculateTotalAmount()}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            )}

            {!paymentIntent && !isCreatingIntent && shippingInfo.email && (
                <button
                    type="button"
                    onClick={createPaymentIntent}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                    Initialize Payment
                </button>
            )}

            {!shippingInfo.email && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg text-sm">
                    Please fill in your email address above to proceed with payment.
                </div>
            )}
        </>
    )}

    {/* PayPal Placeholder */}
    {paymentMethod === 'paypal' && (
        <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
            <p>PayPal integration coming soon</p>
        </div>
    )}
</div>
```

#### F. Add Payment Success/Error Handlers

Add these handler functions:

```typescript
async function handlePaymentSuccess() {
    try {
        // Create the order in your database
        const shippingCost = SHIPPING_METHODS.find(m => m.id === shippingMethod)?.price || 0
        const subtotal = cartSummary?.subtotal || 0
        const discountAmount = calculateDiscountAmount(discountCode, subtotal)
        const taxAmount = (subtotal - discountAmount) * 0.0825
        const total = subtotal - discountAmount + taxAmount + shippingCost

        const orderPayload = {
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.pricing.unit_price,
                discount_percentage: item.pricing.discount_percentage,
            })),
            shipping_address: {
                full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                address_line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zip_code: shippingInfo.zipCode,
                country: shippingInfo.country,
                phone: shippingInfo.phone,
            },
            customer_email: shippingInfo.email,
            customer_notes: '',
            payment_method: 'stripe',
            payment_intent_id: paymentIntent?.intentId,
            shipping_method: shippingMethod,
            discount_code: discountCode,
            is_guest: checkoutType === 'guest',
        }

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create order')
        }

        // Clear cart and redirect to order confirmation
        toast.success('Order placed successfully!')
        router.push(`/order-confirmation?orderId=${result.data.id}`)
    } catch (error: any) {
        console.error('Order creation error:', error)
        toast.error(error.message || 'Failed to create order')
    }
}

function handlePaymentError(error: string) {
    console.error('Payment error:', error)
    toast.error(error)
}

function calculateTotalAmount() {
    const shippingCost = SHIPPING_METHODS.find(m => m.id === shippingMethod)?.price || 0
    const subtotal = cartSummary?.subtotal || 0
    const discountAmount = calculateDiscountAmount(discountCode, subtotal)
    const taxAmount = (subtotal - discountAmount) * 0.0825
    return subtotal - discountAmount + taxAmount + shippingCost
}

function calculateDiscountAmount(code: string, subtotal: number): number {
    const discounts: Record<string, number> = {
        'SAVE10': subtotal * 0.10,
        'WELCOME': subtotal * 0.15,
        'REPAIR20': subtotal * 0.20,
    }
    return discounts[code.toUpperCase()] || 0
}
```

#### G. Remove Old Submit Button

Remove or hide the old "Place Order" button at the bottom since the payment form now has its own submit button.

### Step 3: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Use Stripe test cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC

3. **Test the full flow**:
   - Add items to cart
   - Go to checkout
   - Fill in shipping information
   - Payment form should appear automatically
   - Complete payment with test card
   - Should redirect to order confirmation
   - Check email for order confirmation (if RESEND_API_KEY is configured)

### Step 4: Setup Stripe Webhook

For production, you need to set up a webhook endpoint:

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)

2. Click "Add endpoint"

3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/payments/webhook
   ```

4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`

5. Copy the webhook signing secret and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 5: Testing Webhooks Locally

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/payments/webhook

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded
```

## 🔒 Security Checklist

- ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
- ✅ Always validate payment on server-side (webhook)
- ✅ Use HTTPS in production
- ✅ Verify webhook signatures
- ✅ Use environment variables for keys
- ✅ Enable 3D Secure for cards that support it
- ✅ Log all payment attempts for audit trail

## 📝 Additional Features to Consider

1. **Save Payment Methods** - Allow users to save cards for future purchases
2. **Apple Pay / Google Pay** - Enable with Stripe Payment Element
3. **Subscriptions** - For recurring orders or membership
4. **Split Payments** - For wholesale orders
5. **Multi-currency** - International customers
6. **Payment Plans** - Installment payments with Klarna/Affirm

## 🐛 Troubleshooting

### "Invalid API Key"
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_`
- Check that `STRIPE_SECRET_KEY` starts with `sk_`
- Ensure no extra spaces in `.env.local`

### "Payment Intent already confirmed"
- Clear the `paymentIntent` state when user changes cart
- Create a new intent if cart total changes significantly

### Webhook not receiving events
- Check webhook URL is accessible from internet
- Verify webhook signature matches your secret
- Check Stripe Dashboard > Developers > Webhooks for failed attempts

### Payment succeeds but order not created
- Check browser console for errors
- Verify order API endpoint is working
- Check database permissions

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React SDK](https://stripe.com/docs/stripe-js/react)
- [Payment Element Guide](https://stripe.com/docs/payments/payment-element)
- [Test Cards](https://stripe.com/docs/testing)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

## ✅ Implementation Checklist

- [ ] Add Stripe environment variables
- [ ] Import PaymentFormWrapper component
- [ ] Add payment intent state
- [ ] Add createPaymentIntent function
- [ ] Add useEffect to create intent
- [ ] Replace payment form section with Stripe component
- [ ] Add handlePaymentSuccess function
- [ ] Add handlePaymentError function
- [ ] Test with Stripe test cards
- [ ] Set up webhook endpoint in Stripe Dashboard
- [ ] Test webhook events
- [ ] Deploy to production
- [ ] Update Stripe keys to live mode
- [ ] Test live payment (small amount)

---

**Need Help?** Check the Stripe documentation or reach out to their support team.
