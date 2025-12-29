'use client'

import { useEffect, useState } from 'react'
import {
    CreditCard,
    Truck,
    Lock,
    Tag,
    ChevronRight,
    User,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Types that roughly match /api/cart response
type CartItem = {
    id: string
    product_id: string
    quantity: number
    product: {
        id: string
        sku?: string
        name: string
        slug?: string
        brand?: string
        device_model?: string
        image?: string | null
        in_stock: boolean
        available_quantity: number
    }
    pricing: {
        unit_price: number
        original_price: number
        discount_percentage: number
        subtotal: number
    }
}

type CartSummary = {
    subtotal: number
    total_items: number
    total_savings: number
    is_wholesale: boolean
    wholesale_tier: string | null
}

type CartResponse = {
    data: {
        items: CartItem[]
        summary: CartSummary
    }
}

// Local UI types
type ShippingInfo = {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

type BillingInfo = {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
}

type ErrorMap = Record<string, string>

const SHIPPING_METHODS = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 29.99 },
] as const

export default function CheckoutPage() {
    const router = useRouter()

    // Cart state
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [cartSummary, setCartSummary] = useState<CartSummary | null>(null)
    const [cartLoading, setCartLoading] = useState(true)

    // Checkout state
    const [checkoutType, setCheckoutType] = useState<'guest' | 'login'>('guest')
    const [shippingMethod, setShippingMethod] = useState<string>('standard')
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
    const [discountCode, setDiscountCode] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null)
    const [sameAsShipping, setSameAsShipping] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<ErrorMap>({})

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    })

    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    })

    // 1) Load cart from API
    useEffect(() => {
        const loadCart = async () => {
            try {
                setCartLoading(true)
                const res = await fetch('/api/cart', { credentials: 'include' })
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    throw new Error(err.error || 'Failed to load cart')
                }
                const json: CartResponse = await res.json()
                setCartItems(json.data.items)
                setCartSummary(json.data.summary)
            } catch (err: any) {
                console.error(err)
                toast.error(err.message || 'Failed to load cart')
            } finally {
                setCartLoading(false)
            }
        }

        loadCart()
    }, [])

    // 2) Helpers

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setShippingInfo((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            const newErrors = { ...errors }
            delete newErrors[name]
            setErrors(newErrors)
        }
    }

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBillingInfo((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            const newErrors = { ...errors }
            delete newErrors[name]
            setErrors(newErrors)
        }
    }

    const applyDiscount = () => {
        // Fake front-end codes – real discounts should come from backend later
        const codes: Record<string, number> = {
            SAVE10: 10,
            WELCOME: 15,
            REPAIR20: 20,
        }
        const normalized = discountCode.trim().toUpperCase()
        if (codes[normalized]) {
            setAppliedDiscount({ code: normalized, amount: codes[normalized] })
            setDiscountCode('')
            toast.success(`Applied ${codes[normalized]}% discount`)
        } else {
            toast.error('Invalid discount code')
        }
    }

    const removeDiscount = () => {
        setAppliedDiscount(null)
    }

    // 3) Totals (based on real cart summary)
    const subtotal = cartSummary?.subtotal ?? 0
    const shippingPrice = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 0
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.amount) / 100 : 0
    const subtotalAfterDiscount = subtotal - discountAmount
    const tax = subtotalAfterDiscount * 0.0875 // 8.75% example
    const total = subtotalAfterDiscount + shippingPrice + tax

    // 4) Basic client-side validation before hitting Zod on backend
    const validateForm = () => {
        const newErrors: ErrorMap = {}

        if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name required'
        if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name required'

        if (!shippingInfo.email.trim()) {
            newErrors.email = 'Email required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
            newErrors.email = 'Invalid email'
        }

        if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone required'
        if (!shippingInfo.address.trim()) newErrors.address = 'Address required'
        if (!shippingInfo.city.trim()) newErrors.city = 'City required'
        if (!shippingInfo.state.trim()) newErrors.state = 'State required (2-letter code)'
        if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code required'

        if (paymentMethod === 'card') {
            if (!billingInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number required'
            if (!billingInfo.cardName.trim()) newErrors.cardName = 'Name on card required'
            if (!billingInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date required'
            if (!billingInfo.cvv.trim()) newErrors.cvv = 'CVV required'
        }

        if (cartItems.length === 0) {
            newErrors.cart = 'Your cart is empty'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // 5) Submit handler – calls POST /api/orders
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setSubmitting(true)

            // Build payload matching createOrderSchema
            const shipping_address = {
                full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
                address_line1: shippingInfo.address,
                address_line2: '',
                city: shippingInfo.city,
                state: shippingInfo.state,
                zip_code: shippingInfo.zipCode,
                phone: shippingInfo.phone,
            }

            const billing_address = sameAsShipping
                ? undefined
                : {
                    full_name: billingInfo.cardName || shipping_address.full_name,
                    address_line1: shippingInfo.address,
                    address_line2: '',
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zip_code: shippingInfo.zipCode,
                    phone: shippingInfo.phone,
                }

            const payload = {
                items: cartItems.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
                shipping_address,
                billing_address,
                customer_notes: '', // you can add a notes textarea later
            }

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            })

            const json = await res.json().catch(() => ({}))

            if (!res.ok) {
                console.error('Order error:', json)
                const msg =
                    json.message || json.error || 'Failed to place order. Please check your details.'
                toast.error(msg)
                // If backend sent validation errors, map them to form
                if (json.details?.validationErrors) {
                    const fieldErrors: ErrorMap = {}
                    Object.entries(json.details.validationErrors).forEach(([field, msgs]) => {
                        fieldErrors[field] = (msgs as string[])[0]
                    })
                    setErrors((prev) => ({ ...prev, ...fieldErrors }))
                }
                return
            }

            toast.success('Order placed successfully')

            const data = json.data || {}
            const orderId = data.order_id
            const orderNumber = data.order_number

            // Redirect to order confirmation with order id + number
            router.push(
                `/order-confirmation?orderId=${encodeURIComponent(
                    orderId,
                )}&orderNumber=${encodeURIComponent(orderNumber)}`,
            )
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || 'Failed to place order')
        } finally {
            setSubmitting(false)
        }
    }

    // 6) Render

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
                <p className="text-lg">Loading your cart...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
                    <Link href="/cart" className="hover:text-white">
                        Cart
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-neutral-200">Checkout</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Checkout</h1>
                        <p className="mt-1 text-neutral-400 text-sm">
                            Secure checkout •{' '}
                            <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SSL encrypted
              </span>
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1.15fr)] gap-8"
                >
                    {/* LEFT COLUMN - FORMS */}
                    <div className="space-y-6">
                        {/* Checkout Type */}
                        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                            <p className="text-xs font-medium uppercase text-neutral-500 tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Checkout Options
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCheckoutType('guest')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                                        checkoutType === 'guest'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    Guest Checkout
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCheckoutType('login')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                                        checkoutType === 'login'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    Login
                                </button>
                            </div>

                            {checkoutType === 'login' && (
                                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-neutral-400">
                    Already have an account?{' '}
                      <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                      Login &amp; Continue
                    </Link>
                  </span>
                                    <Link
                                        href="/auth/register"
                                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                    >
                                        Sign up
                                        <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Shipping Information */}
                        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <h2 className="text-base font-semibold">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                        <User className="w-3 h-3" />
                                        First Name *
                                    </label>
                                    <input
                                        name="firstName"
                                        value={shippingInfo.firstName}
                                        onChange={handleShippingChange}
                                        className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                        <User className="w-3 h-3" />
                                        Last Name *
                                    </label>
                                    <input
                                        name="lastName"
                                        value={shippingInfo.lastName}
                                        onChange={handleShippingChange}
                                        className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                        <Mail className="w-3 h-3" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleShippingChange}
                                        className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                        <Phone className="w-3 h-3" />
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="(555) 123-4567"
                                        value={shippingInfo.phone}
                                        onChange={handleShippingChange}
                                        className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                        Address *
                                    </label>
                                    <input
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleShippingChange}
                                        className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                            City *
                                        </label>
                                        <input
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleShippingChange}
                                            className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                            State *
                                        </label>
                                        <input
                                            name="state"
                                            placeholder="CA"
                                            value={shippingInfo.state}
                                            onChange={handleShippingChange}
                                            className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.state && <p className="mt-1 text-xs text-red-400">{errors.state}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                            ZIP Code *
                                        </label>
                                        <input
                                            name="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={handleShippingChange}
                                            className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.zipCode && (
                                            <p className="mt-1 text-xs text-red-400">{errors.zipCode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-400" />
                                <h2 className="text-base font-semibold">Shipping Method</h2>
                            </div>
                            <div className="grid gap-3">
                                {SHIPPING_METHODS.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                                            shippingMethod === method.id
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-neutral-800 hover:border-neutral-700'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-medium">{method.name}</p>
                                            <p className="text-xs text-neutral-400">{method.time}</p>
                                        </div>
                                        <div className="text-right text-sm font-semibold">
                                            {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                                        </div>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value={method.id}
                                            checked={shippingMethod === method.id}
                                            onChange={(e) => setShippingMethod(e.target.value)}
                                            className="hidden"
                                        />
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-400" />
                                <h2 className="text-base font-semibold">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                                        paymentMethod === 'card'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    Credit Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                                        paymentMethod === 'paypal'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    PayPal
                                </button>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="grid gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                            Card Number *
                                        </label>
                                        <input
                                            name="cardNumber"
                                            value={billingInfo.cardNumber}
                                            onChange={handleBillingChange}
                                            className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.cardNumber && (
                                            <p className="mt-1 text-xs text-red-400">{errors.cardNumber}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                            Name on Card *
                                        </label>
                                        <input
                                            name="cardName"
                                            value={billingInfo.cardName}
                                            onChange={handleBillingChange}
                                            className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.cardName && (
                                            <p className="mt-1 text-xs text-red-400">{errors.cardName}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                                Expiry Date *
                                            </label>
                                            <input
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                                value={billingInfo.expiryDate}
                                                onChange={handleBillingChange}
                                                className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.expiryDate && (
                                                <p className="mt-1 text-xs text-red-400">{errors.expiryDate}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                                                CVV *
                                            </label>
                                            <input
                                                name="cvv"
                                                value={billingInfo.cvv}
                                                onChange={handleBillingChange}
                                                className="mt-1 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.cvv && <p className="mt-1 text-xs text-red-400">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'paypal' && (
                                <p className="mt-2 text-sm text-neutral-400">
                                    You will be redirected to PayPal to complete your purchase securely.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* RIGHT COLUMN - ORDER SUMMARY */}
                    <aside className="space-y-4">
                        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">Order Summary</h2>
                                <span className="text-xs text-neutral-400">
                  {cartSummary?.total_items || 0} item
                                    {(cartSummary?.total_items || 0) !== 1 ? 's' : ''}
                </span>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-lg border border-neutral-800 px-3 py-2"
                                    >
                                        <div className="h-12 w-12 rounded-md bg-neutral-800 flex items-center justify-center text-xs text-neutral-300">
                                            {item.product.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-12 w-12 object-cover rounded-md"
                                                />
                                            ) : (
                                                <span>{item.product.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-neutral-400">
                                                Qty {item.quantity} · ${item.pricing.unit_price.toFixed(2)} each
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            ${item.pricing.subtotal.toFixed(2)}
                                        </div>
                                    </div>
                                ))}

                                {cartItems.length === 0 && (
                                    <p className="text-sm text-neutral-400">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="border-t border-neutral-800 pt-3 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Shipping</span>
                                    <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">Estimated Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                {appliedDiscount && (
                                    <div className="flex items-center justify-between text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Discount ({appliedDiscount.code})
                    </span>
                                        <span>- ${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Discount code */}
                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    placeholder="Discount code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="flex-1 rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={applyDiscount}
                                    className="px-3 py-2 rounded-lg bg-neutral-800 text-sm font-medium hover:bg-neutral-700"
                                >
                                    Apply
                                </button>
                            </div>

                            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase text-neutral-400 tracking-wide">Total</p>
                                    <p className="text-xl font-semibold">${total.toFixed(2)}</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || cartItems.length === 0}
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold shadow-sm disabled:opacity-60 disabled:pointer-events-none"
                                >
                                    {submitting ? 'Placing order...' : 'Place Order Securely'}
                                </button>
                            </div>

                            {errors.cart && <p className="mt-2 text-xs text-red-400">{errors.cart}</p>}

                            <p className="mt-2 text-[11px] text-neutral-500 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                All transactions are secure and encrypted.
                            </p>
                        </section>
                    </aside>
                </form>
            </div>
        </div>
    )
}
