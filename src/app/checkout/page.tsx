'use client'

import { useState } from 'react'
import { CreditCard, Truck, Lock, Tag, ChevronRight, User, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

// Sample cart items
const CART_ITEMS = [
    {
        id: 1,
        name: 'iPhone 15 Pro Max OLED Display',
        sku: 'IP15PM-OLED-01',
        price: 89.99,
        quantity: 1,
        image: '/images/products/iphone-15-display.jpg'
    },
    {
        id: 2,
        name: 'Premium Phone Repair Tool Kit',
        sku: 'TK-PREM-01',
        price: 49.99,
        quantity: 1,
        image: '/images/products/tool-kit.jpg'
    }
]

const SHIPPING_METHODS = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 29.99 }
]

export default function CheckoutPage() {
    const [checkoutType, setCheckoutType] = useState<'guest' | 'login'>('guest')
    const [shippingMethod, setShippingMethod] = useState('standard')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [discountCode, setDiscountCode] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState<{code: string, amount: number} | null>(null)

    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    })

    const [billingInfo, setBillingInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    })

    const [sameAsShipping, setSameAsShipping] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo({
            ...billingInfo,
            [e.target.name]: e.target.value
        })
    }

    const applyDiscount = () => {
        // Sample discount codes
        const codes: Record<string, number> = {
            'SAVE10': 10,
            'WELCOME': 15,
            'REPAIR20': 20
        }

        if (codes[discountCode.toUpperCase()]) {
            setAppliedDiscount({
                code: discountCode.toUpperCase(),
                amount: codes[discountCode.toUpperCase()]
            })
            setDiscountCode('')
        } else {
            alert('Invalid discount code')
        }
    }

    const removeDiscount = () => {
        setAppliedDiscount(null)
    }

    // Calculate totals
    const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = SHIPPING_METHODS.find(m => m.id === shippingMethod)?.price || 0
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.amount / 100) : 0
    const subtotalAfterDiscount = subtotal - discountAmount
    const tax = subtotalAfterDiscount * 0.0875 // 8.75% tax
    const total = subtotalAfterDiscount + shipping + tax

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

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
        if (!shippingInfo.state.trim()) newErrors.state = 'State required'
        if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code required'

        if (paymentMethod === 'card') {
            if (!billingInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number required'
            if (!billingInfo.cardName.trim()) newErrors.cardName = 'Name on card required'
            if (!billingInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date required'
            if (!billingInfo.cvv.trim()) newErrors.cvv = 'CVV required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            // Process order
            const orderData = {
                items: CART_ITEMS,
                shipping: shippingInfo,
                shippingMethod,
                payment: paymentMethod,
                discount: appliedDiscount,
                subtotal,
                // shipping: shipping,
                tax,
                total
            }

            console.log('Order submitted:', orderData)

            // Redirect to confirmation
            window.location.href = '/order-confirmation?order=ORD-' + Date.now().toString().slice(-6)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        <Link href="/cart" className="hover:text-neutral-900 dark:hover:text-white">Cart</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-neutral-900 dark:text-white font-semibold">Checkout</span>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        Checkout
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">

                    {/* Left Column - Forms */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Checkout Type */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutType('guest')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                            checkoutType === 'guest'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }`}
                                    >
                                        Guest Checkout
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutType('login')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                            checkoutType === 'login'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }`}
                                    >
                                        Login
                                    </button>
                                </div>

                                {checkoutType === 'login' && (
                                    <div className="space-y-4">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                        >
                                            Login & Continue
                                        </button>
                                        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                                            Don't have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Sign up</Link>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center gap-2 mb-6">
                                    <Truck className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        Shipping Information
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={shippingInfo.firstName}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={shippingInfo.lastName}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={shippingInfo.email}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={shippingInfo.phone}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleShippingChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                errors.address ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                            }`}
                                        />
                                        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.city ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                State *
                                            </label>
                                            <select
                                                name="state"
                                                value={shippingInfo.state}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.state ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            >
                                                <option value="">Select</option>
                                                <option value="CA">California</option>
                                                <option value="TX">Texas</option>
                                                <option value="NY">New York</option>
                                                <option value="FL">Florida</option>
                                            </select>
                                            {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={shippingInfo.zipCode}
                                                onChange={handleShippingChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.zipCode ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Method */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Shipping Method
                                </h3>
                                <div className="space-y-3">
                                    {SHIPPING_METHODS.map(method => (
                                        <label
                                            key={method.id}
                                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                shippingMethod === method.id
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-400'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value={method.id}
                                                checked={shippingMethod === method.id}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-neutral-900 dark:text-white">{method.name}</p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{method.time}</p>
                                                </div>
                                                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                                                    {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        Payment Method
                                    </h2>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                            paymentMethod === 'card'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }`}
                                    >
                                        Credit Card
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                            paymentMethod === 'paypal'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }`}
                                    >
                                        PayPal
                                    </button>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Card Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={billingInfo.cardNumber}
                                                onChange={handleBillingChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.cardNumber ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                Name on Card *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={billingInfo.cardName}
                                                onChange={handleBillingChange}
                                                placeholder="John Smith"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                    errors.cardName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                }`}
                                            />
                                            {errors.cardName && <p className="text-red-600 text-sm mt-1">{errors.cardName}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                    Expiry Date *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={billingInfo.expiryDate}
                                                    onChange={handleBillingChange}
                                                    placeholder="MM/YY"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                        errors.expiryDate ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                    }`}
                                                />
                                                {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                    CVV *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={billingInfo.cvv}
                                                    onChange={handleBillingChange}
                                                    placeholder="123"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${
                                                        errors.cvv ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                                    }`}
                                                />
                                                {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="text-center py-8">
                                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                            You will be redirected to PayPal to complete your purchase securely.
                                        </p>
                                        <div className="inline-block px-6 py-3 bg-yellow-400 text-neutral-900 rounded-lg font-bold">
                                            PayPal
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                        Your payment information is encrypted and secure
                                    </p>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                            >
                                Place Order - ${total.toFixed(2)}
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 sticky top-4">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                                Order Summary
                            </h3>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {CART_ITEMS.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded flex items-center justify-center">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-neutral-900 dark:text-white text-sm">{item.name}</p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400">SKU: {item.sku}</p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-neutral-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Discount Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyDiscount}
                                        className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedDiscount && (
                                    <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm text-green-700 dark:text-green-400">
                      {appliedDiscount.code} applied ({appliedDiscount.amount}% off)
                    </span>
                                        <button
                                            type="button"
                                            onClick={removeDiscount}
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {appliedDiscount && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Discount ({appliedDiscount.amount}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                                    <span>Tax (8.75%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-700 pt-3">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
