'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw, Star, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import StockIndicator from '@/components/stock-indicator'
import NotifyWhenAvailable from '@/components/notify-when-available'
import QualityComparisonTool from '@/components/quality-comparison-tool'
import RecentlyViewedProducts from '@/components/recently-viewed-products'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

// Sample product data
const PRODUCT = {
    id: '1',
    name: 'iPhone 15 Pro Max OLED Display Assembly',
    brand: 'Apple',
    sku: 'IP15PM-OLED-01',
    rating: 4.8,
    reviews: 124,
    retailPrice: 89.99,
    wholesalePrice: 59.99,
    inventory: 'In Stock',
    inventoryCount: 50,
    installationVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample YouTube embed URL
    installationDifficulty: 'Medium',
    installationTime: '15-20 minutes',
    images: [
        '/images/products/iphone-15-display-1.jpg',
        '/images/products/iphone-15-display-2.jpg',
        '/images/products/iphone-15-display-3.jpg',
        '/images/products/iphone-15-display-4.jpg'
    ],
    description: `Premium OEM-quality OLED display assembly for iPhone 15 Pro Max. This complete display assembly includes the LCD screen, digitizer, and front glass pre-assembled for easy installation. Features True Tone support, 120Hz ProMotion technology, and HDR display capabilities.

Each display is rigorously tested to ensure perfect pixel performance, accurate touch response, and seamless integration with Face ID. Backed by our comprehensive warranty and technical support.`,
    features: [
        'OEM-quality OLED display',
        'Pre-assembled with digitizer and glass',
        'True Tone support',
        '120Hz ProMotion technology',
        'HDR10 and Dolby Vision support',
        'Tested for dead pixels and touch accuracy',
        'Compatible with Face ID',
        'Easy plug-and-play installation'
    ],
    compatibility: [
        'iPhone 15 Pro Max (Model A3520)',
        'iPhone 15 Pro Max (Model A3258)',
        'iPhone 15 Pro Max (Model A3519)',
        'iPhone 15 Pro Max (Model A3521)'
    ],
    wholesaleTiers: [
        { quantity: '1-9 units', price: 59.99 },
        { quantity: '10-49 units', price: 54.99 },
        { quantity: '50-99 units', price: 49.99 },
        { quantity: '100+ units', price: 44.99 }
    ],
    specifications: {
        'Display Size': '6.7 inches',
        'Resolution': '2796 x 1290 pixels',
        'Technology': 'OLED (Super Retina XDR)',
        'Refresh Rate': '120Hz',
        'Brightness': '2000 nits (peak)',
        'Contrast Ratio': '2,000,000:1',
        'Color Gamut': 'P3 wide color',
        'True Tone': 'Yes',
        'HDR': 'HDR10, Dolby Vision',
        'Warranty': '12 months'
    },
    shipping: {
        standard: 'Free shipping on orders over $50 (3-5 business days)',
        expedited: '$15.99 (1-2 business days)',
        overnight: '$29.99 (Next business day)'
    },
    warranty: {
        duration: '12 months',
        coverage: 'Manufacturer defects, dead pixels, touch issues',
        excluded: 'Physical damage, liquid damage, improper installation',
        support: '24/7 technical support available'
    }
}

// Related products
const RELATED_PRODUCTS = [
    {
        id: 2,
        name: 'iPhone 15 Pro OLED Display',
        price: 79.99,
        image: '/images/products/iphone-15-pro-display.jpg',
        rating: 4.7
    },
    {
        id: 3,
        name: 'iPhone 15 Plus Display',
        price: 69.99,
        image: '/images/products/iphone-15-plus-display.jpg',
        rating: 4.8
    },
    {
        id: 4,
        name: 'iPhone 15 Display',
        price: 59.99,
        image: '/images/products/iphone-15-display.jpg',
        rating: 4.6
    },
    {
        id: 5,
        name: 'iPhone 15 Pro Max Battery',
        price: 44.99,
        image: '/images/products/iphone-15-battery.jpg',
        rating: 4.9
    }
]

export default function ProductDetailPage() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [userRole, setUserRole] = useState<'retail' | 'wholesale'>('retail')
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'warranty'>('description')
    const { addProduct } = useRecentlyViewed()

    const currentPrice = userRole === 'retail' ? PRODUCT.retailPrice : PRODUCT.wholesalePrice
    const totalPrice = currentPrice * quantity

    // Track this product as recently viewed
    useEffect(() => {
        addProduct({
            id: PRODUCT.id,
            name: PRODUCT.name,
            brand: PRODUCT.brand,
            deviceModel: 'iPhone 15 Pro Max', // You would get this from the product data
            thumbnail: PRODUCT.images[0] || null,
            price: PRODUCT.retailPrice
        })
    }, [addProduct])

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % PRODUCT.images.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + PRODUCT.images.length) % PRODUCT.images.length)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">

            {/* Breadcrumbs */}
            <div className="border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white">Shop</Link>
                        <span>/</span>
                        <span className="text-neutral-900 dark:text-white">iPhone 15 Pro Max Display</span>
                    </nav>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 mb-16">

                    {/* Left: Images */}
                    <div>
                        {/* Main Image */}
                        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4 overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-8xl text-neutral-300 dark:text-neutral-600">📱</div>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="h-6 w-6 text-neutral-900 dark:text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="h-6 w-6 text-neutral-900 dark:text-white" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                {selectedImage + 1} / {PRODUCT.images.length}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {PRODUCT.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`
                    aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${selectedImage === index
                                        ? 'border-blue-600 dark:border-blue-400'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                    }
                  `}
                                >
                                    <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div>

                        {/* Title & Rating */}
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                            {PRODUCT.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-4">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.floor(PRODUCT.rating)
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-neutral-300 dark:text-neutral-600'
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                  {PRODUCT.rating} ({PRODUCT.reviews} reviews)
                </span>
                            </div>

                            {/* SKU */}
                            <span className="text-neutral-500 dark:text-neutral-400">
                SKU: {PRODUCT.sku}
              </span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            {userRole === 'retail' ? (
                                <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                                    ${PRODUCT.retailPrice.toFixed(2)}
                                </div>
                            ) : (
                                <div>
                                    <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                                        Wholesale Pricing
                                    </div>
                                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                        {PRODUCT.wholesaleTiers.map((tier, index) => (
                                            <div key={index} className="flex justify-between items-center py-2">
                                                <span className="text-neutral-700 dark:text-neutral-300">{tier.quantity}</span>
                                                <span className="font-bold text-neutral-900 dark:text-white">${tier.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inventory Status */}
                        <div className="mb-6">
                            <StockIndicator stock={PRODUCT.inventoryCount} showCount={true} size="md" />
                        </div>

                        {/* Installation Video Preview */}
                        {PRODUCT.installationVideo && (
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                            Installation Video Available
                                        </h3>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                                            Watch step-by-step installation guide · {PRODUCT.installationTime} · {PRODUCT.installationDifficulty} difficulty
                                        </p>
                                        <button
                                            onClick={() => {
                                                const videoSection = document.getElementById('installation-video')
                                                videoSection?.scrollIntoView({ behavior: 'smooth' })
                                            }}
                                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Watch Video Below ↓
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pricing Toggle */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                View Pricing
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setUserRole('retail')}
                                    className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    ${userRole === 'retail'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                    }
                  `}
                                >
                                    Retail Price
                                </button>
                                <button
                                    onClick={() => setUserRole('wholesale')}
                                    className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    ${userRole === 'wholesale'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                    }
                  `}
                                >
                                    Wholesale Price
                                </button>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 text-center border-x border-neutral-300 dark:border-neutral-600 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Total: ${totalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {PRODUCT.inventoryCount === 0 ? (
                            <div className="mb-6">
                                <NotifyWhenAvailable
                                    productId={PRODUCT.id}
                                    productName={PRODUCT.name}
                                />
                            </div>
                        ) : (
                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold">
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </button>
                                <button className="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Quick Info Icons */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-200 dark:border-neutral-700">
                            <div className="text-center">
                                <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">Free Shipping</p>
                                <p className="text-xs text-neutral-500">Orders over $50</p>
                            </div>
                            <div className="text-center">
                                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">12 Month Warranty</p>
                                <p className="text-xs text-neutral-500">Full coverage</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">Easy Returns</p>
                                <p className="text-xs text-neutral-500">30-day policy</p>
                            </div>
                        </div>

                        {/* Compatibility List */}
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                                Compatible Models
                            </h3>
                            <ul className="space-y-2">
                                {PRODUCT.compatibility.map((model, index) => (
                                    <li key={index} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        {model}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Tabs Section */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8 mb-16">

                    {/* Tab Headers */}
                    <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-700 mb-8">
                        {(['description', 'specifications', 'shipping', 'warranty'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                  px-4 py-3 font-medium transition-colors border-b-2 capitalize
                  ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-4xl">
                        {activeTab === 'description' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Product Description
                                </h2>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line mb-6">
                                        {PRODUCT.description}
                                    </p>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                        Key Features
                                    </h3>
                                    <ul className="space-y-2">
                                        {PRODUCT.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Technical Specifications
                                </h2>
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    {Object.entries(PRODUCT.specifications).map(([key, value], index) => (
                                        <div
                                            key={key}
                                            className={`
                        flex py-3 px-4
                        ${index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800'}
                      `}
                                        >
                                            <span className="w-1/3 font-semibold text-neutral-900 dark:text-white">{key}</span>
                                            <span className="w-2/3 text-neutral-700 dark:text-neutral-300">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Shipping Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Standard Shipping</h3>
                                            <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.shipping.standard}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Expedited Shipping</h3>
                                            <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.shipping.expedited}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Overnight Shipping</h3>
                                            <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.shipping.overnight}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'warranty' && (
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                                    Warranty & Support
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Warranty Duration</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.warranty.duration}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Coverage Includes</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.warranty.coverage}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Not Covered</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.warranty.excluded}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Technical Support</h3>
                                        <p className="text-neutral-700 dark:text-neutral-300">{PRODUCT.warranty.support}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Installation Video Section */}
                {PRODUCT.installationVideo && (
                    <div id="installation-video" className="mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            Installation Guide
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Watch our comprehensive step-by-step installation video to help you replace this component with confidence.
                        </p>

                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            {/* Video Player */}
                            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                <iframe
                                    src={PRODUCT.installationVideo}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Installation Guide Video"
                                />
                            </div>

                            {/* Video Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Duration</h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{PRODUCT.installationTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Difficulty</h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{PRODUCT.installationDifficulty}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Tools Required</h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Basic repair kit</p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Tips */}
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Installation Tips
                                </h3>
                                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                    <li>• Power off the device completely before starting</li>
                                    <li>• Work in a clean, well-lit environment</li>
                                    <li>• Keep track of all screws and small components</li>
                                    <li>• Take your time and follow each step carefully</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quality Comparison Tool */}
                <div className="mb-16">
                    <QualityComparisonTool />
                </div>

                {/* Recently Viewed Products */}
                <div className="mb-16">
                    <RecentlyViewedProducts limit={8} />
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                        Related Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RELATED_PRODUCTS.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                    <span className="text-6xl">📱</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{product.rating}</span>
                                    </div>
                                    <p className="text-xl font-bold text-neutral-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
