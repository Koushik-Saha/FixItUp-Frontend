/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useState } from 'react'
import { ChevronDown, Search, Package, Shield, RefreshCw, Users, Wrench, HelpCircle } from 'lucide-react'

const FAQ_CATEGORIES = [
    { id: 'shipping', label: 'Shipping', icon: Package },
    { id: 'warranty', label: 'Warranty', icon: Shield },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
    { id: 'wholesale', label: 'Wholesale', icon: Users },
    { id: 'repairs', label: 'Repairs', icon: Wrench },
    { id: 'account', label: 'Account Help', icon: HelpCircle }
]

const FAQ_DATA = {
    shipping: [
        { q: 'How long does shipping take?', a: 'Standard shipping (FREE for orders $50+) takes 5-7 business days. Express shipping is 2-3 business days ($15.99) and Overnight shipping arrives the next business day ($29.99).' },
        { q: 'Do you ship internationally?', a: 'Currently we only ship within the United States. We serve all 50 states including Alaska and Hawaii.' },
        { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order anytime on our Order Tracking page by entering your order number and email address.' },
        { q: 'What if my package is lost or damaged?', a: 'All shipments are insured. If your package is lost or arrives damaged, contact us immediately at support@maxfitit.com with photos if applicable. We\'ll send a replacement or issue a full refund.' },
        { q: 'Can I change my shipping address after ordering?', a: 'You can change your shipping address within 2 hours of placing your order. After that, the order enters processing and the address cannot be changed. Contact us immediately if you need to make changes.' },
        { q: 'Do you offer local pickup?', a: 'Yes! You can pick up your order at any of our 3 store locations in Santa Barbara, Campbell, or San Francisco. Select "Local Pickup" at checkout.' }
    ],
    warranty: [
        { q: 'What\'s covered under warranty?', a: 'All parts and repairs come with a 12-month warranty covering defects in materials and workmanship. This includes screen replacements, battery replacements, and other component repairs.' },
        { q: 'What\'s NOT covered under warranty?', a: 'The warranty does not cover physical damage, water damage, unauthorized repairs, normal wear and tear, or damage caused by accidents, drops, or misuse.' },
        { q: 'How do I file a warranty claim?', a: 'Contact us at support@maxfitit.com with your order number or repair ticket number, a description of the issue, and photos if applicable. We typically respond within 24 hours.' },
        { q: 'Do I need to keep my receipt?', a: 'Yes, please keep your order confirmation email or repair receipt. You\'ll need your order/ticket number to file a warranty claim.' },
        { q: 'What happens if my repair fails under warranty?', a: 'We\'ll repair or replace the component at no charge. If the same issue occurs twice, we\'ll provide a full refund.' },
        { q: 'Does the warranty transfer if I sell my device?', a: 'No, warranties are non-transferable and apply only to the original purchaser.' }
    ],
    returns: [
        { q: 'What is your return policy?', a: 'We offer a 30-day return policy for most products in new, unused condition with original packaging. Some items like opened software or custom orders are non-returnable.' },
        { q: 'How do I start a return?', a: 'Log into your account, go to Order History, and click "Return Item" next to the product. You\'ll receive a return shipping label via email within 24 hours.' },
        { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund goes back to your original payment method.' },
        { q: 'Who pays for return shipping?', a: 'If the return is due to our error (wrong item, defective product), we cover shipping. For other returns, a $9.99 return shipping fee is deducted from your refund.' },
        { q: 'Can I exchange an item instead of returning it?', a: 'Yes! Contact us at support@maxfitit.com to arrange an exchange. We\'ll send you the new item and provide a return label for the original item.' },
        { q: 'What items can\'t be returned?', a: 'The following items are non-returnable: opened software/licenses, custom orders, clearance items, and items purchased more than 30 days ago. Repair services cannot be refunded once completed.' }
    ],
    wholesale: [
        { q: 'How do I apply for a wholesale account?', a: 'Visit our Wholesale Application page, fill out the form with your business information, and upload your business license or tax ID. We review applications within 2-3 business days.' },
        { q: 'What are the requirements for wholesale pricing?', a: 'You must have a valid business license or resale certificate, a business address (no P.O. boxes), and plan to make regular purchases. Minimum first order is $500.' },
        { q: 'What discount do I get with wholesale pricing?', a: 'Wholesale customers receive tiered discounts: 8% off (10-49 units), 17% off (50-99 units), and 25% off (100+ units per order).' },
        { q: 'Is there a minimum order quantity?', a: 'The first order must be $500 minimum. After that, there\'s no minimum, but bulk discounts apply at 10+ units.' },
        { q: 'How long does approval take?', a: 'Most applications are approved within 2-3 business days. You\'ll receive an email with your wholesale account number and login credentials.' },
        { q: 'Can I order samples before buying in bulk?', a: 'Yes, we offer sample packs of our most popular items. Contact your wholesale account manager for details.' }
    ],
    repairs: [
        { q: 'How long does a typical repair take?', a: 'Most repairs (screens, batteries, charging ports) are completed in 30-90 minutes while you wait. Complex repairs may take 2-4 hours. We\'ll give you an estimated time when you drop off.' },
        { q: 'Do I need an appointment?', a: 'Walk-ins are welcome, but appointments get priority service. Book online to guarantee your preferred time slot and avoid waiting.' },
        { q: 'What if you can\'t fix my device?', a: 'If we determine your device cannot be repaired, there\'s no charge for the diagnostic. We\'ll explain the issue and discuss options like data recovery or replacement devices.' },
        { q: 'Do you use original manufacturer parts?', a: 'We use OEM-quality parts that meet or exceed manufacturer specifications. All parts come with a 12-month warranty.' },
        { q: 'Will my data be safe during repair?', a: 'Yes, we take data security seriously. We never access your personal data unless you specifically request data recovery services. We recommend backing up your device before any repair.' },
        { q: 'What devices do you repair?', a: 'We repair all major smartphone brands including Apple, Samsung, Google Pixel, Motorola, LG, and OnePlus. We also repair tablets and laptops.' },
        { q: 'Do repairs void my manufacturer warranty?', a: 'Third-party repairs may void manufacturer warranties. If your device is under manufacturer warranty, check with the manufacturer first. Our repairs come with their own 12-month warranty.' }
    ],
    account: [
        { q: 'How do I create an account?', a: 'Click "Sign Up" in the top right corner, enter your email and create a password. You\'ll receive a confirmation email to activate your account.' },
        { q: 'I forgot my password. What do I do?', a: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a password reset link within a few minutes.' },
        { q: 'Can I change my email address?', a: 'Yes, log into your account, go to Profile Settings, and update your email. You\'ll need to verify the new email address.' },
        { q: 'How do I view my order history?', a: 'Log into your account and click "Order History" in your dashboard. You\'ll see all past orders with tracking information and download invoices.' },
        { q: 'Can I save multiple shipping addresses?', a: 'Yes! In your account dashboard, go to "Addresses" and add as many addresses as you need. Mark one as default for faster checkout.' },
        { q: 'How do I delete my account?', a: 'Contact us at support@maxfitit.com with your account email. For security, we require email verification before deleting any account. This action cannot be undone.' },
        { q: 'Why should I create an account?', a: 'With an account you can: track orders easily, save addresses for faster checkout, view repair history, access wholesale pricing (if approved), reorder previous items, and save items to your wishlist.' }
    ]
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('shipping')
    const [openItems, setOpenItems] = useState<number[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        )
    }

    const filteredFAQs = searchQuery
        ? Object.entries(FAQ_DATA).flatMap(([category, items]) =>
            items.filter(item =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(item => ({ ...item, category }))
        )
        : FAQ_DATA[activeCategory as keyof typeof FAQ_DATA].map(item => ({ ...item, category: activeCategory }))

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-blue-100 mb-8">Find answers to common questions about our products and services</p>
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search FAQs..."
                            className="w-full pl-14 pr-6 py-4 rounded-lg border-2 border-white/20 focus:outline-none focus:border-white bg-white/10 text-white placeholder-white/60 text-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
                    {!searchQuery && (
                        <nav className="space-y-2 h-fit lg:sticky lg:top-4">
                            {FAQ_CATEGORIES.map(category => {
                                const Icon = category.icon
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => { setActiveCategory(category.id); setOpenItems([]) }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeCategory === category.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="font-medium">{category.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    )}

                    <div className={searchQuery ? 'lg:col-span-2' : ''}>
                        {searchQuery && (
                            <div className="mb-6">
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {filteredFAQs.length === 0 ? (
                                <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 text-center border border-neutral-200 dark:border-neutral-700">
                                    <Search className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No results found</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">Try a different search term or browse by category</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            ) : (
                                filteredFAQs.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleItem(index)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                                        >
                                            <div className="flex-1 pr-4">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white text-lg">{item.q}</h3>
                                                {searchQuery && (
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 capitalize">
                                                        Category: {item.category.replace('-', ' ')}
                                                    </p>
                                                )}
                                            </div>
                                            <ChevronDown
                                                className={`h-6 w-6 text-neutral-400 flex-shrink-0 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openItems.includes(index) && (
                                            <div className="px-6 pb-6 pt-0">
                                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{item.a}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Still have questions?</h2>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Contact Support
                        </a>
                        <a
                            href="tel:8005557372"
                            className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-semibold"
                        >
                            Call (800) 555-REPAIR
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
