/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Sample data
const BRANDS = ['Apple', 'Samsung', 'Google', 'Motorola', 'LG', 'OnePlus']

const MODELS: Record<string, string[]> = {
    Apple: [
        'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
        'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
        'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
        'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
        'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
        'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
        'iPhone 8 Plus', 'iPhone 8'
    ],
    Samsung: [
        'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
        'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
        'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
        'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
        'Galaxy Note 20 Ultra', 'Galaxy Note 20',
        'Galaxy Z Fold 5', 'Galaxy Z Flip 5'
    ],
    Google: [
        'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
        'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
        'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
        'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a'
    ],
    Motorola: [
        'Moto Edge 50 Pro', 'Moto Edge 40 Pro',
        'Moto G Power (2024)', 'Moto G Stylus (2024)',
        'Razr+', 'Razr (2024)'
    ],
    LG: [
        'LG V60 ThinQ', 'LG Velvet', 'LG Wing',
        'LG G8 ThinQ', 'LG G7 ThinQ'
    ],
    OnePlus: [
        'OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro',
        'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 8T'
    ]
}

const ISSUES = [
    {
        id: 'screen',
        name: 'Cracked/Broken Screen',
        description: 'Display is cracked, shattered, or has dead pixels',
        icon: '📱'
    },
    {
        id: 'battery',
        name: 'Battery Issues',
        description: 'Poor battery life, won\'t charge, or drains quickly',
        icon: '🔋'
    },
    {
        id: 'charging-port',
        name: 'Charging Port',
        description: 'Won\'t charge, loose connection, or damaged port',
        icon: '🔌'
    },
    {
        id: 'camera',
        name: 'Camera Problems',
        description: 'Blurry, won\'t focus, or camera not working',
        icon: '📷'
    },
    {
        id: 'back-glass',
        name: 'Back Glass Broken',
        description: 'Rear glass is cracked or shattered',
        icon: '🪟'
    },
    {
        id: 'speaker',
        name: 'Speaker/Audio Issues',
        description: 'No sound, distorted audio, or microphone issues',
        icon: '🔊'
    },
    {
        id: 'water-damage',
        name: 'Water Damage',
        description: 'Device exposed to water or liquid',
        icon: '💧'
    },
    {
        id: 'other',
        name: 'Other Issue',
        description: 'Different problem or need diagnosis',
        icon: '🔧'
    }
]

// Price data (in reality, this would come from API)
const REPAIR_PRICES: Record<string, Record<string, number>> = {
    'iPhone 15 Pro Max': { screen: 89, battery: 49, 'charging-port': 39, camera: 69, 'back-glass': 79, speaker: 49, 'water-damage': 99, other: 0 },
    'iPhone 15 Pro': { screen: 79, battery: 49, 'charging-port': 39, camera: 69, 'back-glass': 79, speaker: 49, 'water-damage': 99, other: 0 },
    'iPhone 14 Pro Max': { screen: 79, battery: 49, 'charging-port': 39, camera: 59, 'back-glass': 69, speaker: 49, 'water-damage': 89, other: 0 },
    'Galaxy S24 Ultra': { screen: 129, battery: 59, 'charging-port': 49, camera: 79, 'back-glass': 89, speaker: 49, 'water-damage': 99, other: 0 },
    'Pixel 9 Pro': { screen: 99, battery: 49, 'charging-port': 39, camera: 59, 'back-glass': 69, speaker: 49, 'water-damage': 89, other: 0 }
}

export default function RepairPriceChecker() {
    const [step, setStep] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [selectedModel, setSelectedModel] = useState<string | null>(null)
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

    const getPrice = () => {
        if (!selectedModel || !selectedIssue) return 0
        return REPAIR_PRICES[selectedModel]?.[selectedIssue] || 69
    }

    const getRepairTime = () => {
        if (!selectedIssue) return '30-60 minutes'
        const times: Record<string, string> = {
            screen: '30-60 minutes',
            battery: '20-45 minutes',
            'charging-port': '45-90 minutes',
            camera: '60-90 minutes',
            'back-glass': '90-120 minutes',
            speaker: '45-75 minutes',
            'water-damage': '2-4 hours',
            other: 'Varies'
        }
        return times[selectedIssue] || '30-60 minutes'
    }

    const resetChecker = () => {
        setStep(1)
        setSelectedBrand(null)
        setSelectedModel(null)
        setSelectedIssue(null)
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Repair Price Checker
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Get an instant price estimate for your device repair in 3 simple steps
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Select Brand' },
                            { num: 2, label: 'Select Model' },
                            { num: 3, label: 'Select Issue' },
                            { num: 4, label: 'Get Price' }
                        ].map((s, index) => (
                            <div key={s.num} className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${step > s.num ? 'bg-green-600 text-white' : step === s.num ? 'bg-blue-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'}
                  `}>
                                        {step > s.num ? <CheckCircle className="h-6 w-6" /> : s.num}
                                    </div>
                                    <span className={`
                    hidden sm:block font-medium
                    ${step >= s.num ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}
                  `}>
                                        {s.label}
                                    </span>
                                </div>
                                {index < 3 && (
                                    <ChevronRight className="h-5 w-5 text-neutral-400 mx-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Step 1: Select Brand */}
                    {step === 1 && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                                Select Your Device Brand
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {BRANDS.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => {
                                            setSelectedBrand(brand)
                                            setStep(2)
                                        }}
                                        className="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-center group"
                                    >
                                        <div className="text-4xl mb-3">
                                            {brand === 'Apple' && '🍎'}
                                            {brand === 'Samsung' && '📱'}
                                            {brand === 'Google' && '🔵'}
                                            {brand === 'Motorola' && '📞'}
                                            {brand === 'LG' && '📺'}
                                            {brand === 'OnePlus' && '1️⃣'}
                                        </div>
                                        <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {brand}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Model */}
                    {step === 2 && selectedBrand && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Select Your {selectedBrand} Model
                                </h2>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Change Brand
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                                {MODELS[selectedBrand].map(model => (
                                    <button
                                        key={model}
                                        onClick={() => {
                                            setSelectedModel(model)
                                            setStep(3)
                                        }}
                                        className="p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                                    >
                                        <p className="font-semibold text-neutral-900 dark:text-white">
                                            {model}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Select Issue */}
                    {step === 3 && selectedModel && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                                        What's the Issue?
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {selectedBrand} {selectedModel}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Change Model
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ISSUES.map(issue => (
                                    <button
                                        key={issue.id}
                                        onClick={() => {
                                            setSelectedIssue(issue.id)
                                            setStep(4)
                                        }}
                                        className="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="text-4xl">{issue.icon}</div>
                                            <div>
                                                <p className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                                                    {issue.name}
                                                </p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    {issue.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Price Result */}
                    {step === 4 && selectedIssue && (
                        <div>
                            {/* Price Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-6">
                                <div className="text-center mb-6">
                                    <p className="text-blue-100 mb-2">Estimated Repair Cost</p>
                                    <div className="text-6xl font-bold mb-4">
                                        {getPrice() > 0 ? `$${getPrice()}` : 'FREE'}
                                    </div>
                                    {getPrice() === 0 && (
                                        <p className="text-blue-100">Free diagnostic included</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-blue-400 pt-6">
                                    <div className="text-center">
                                        <Clock className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm text-blue-100 mb-1">Repair Time</p>
                                        <p className="font-semibold">{getRepairTime()}</p>
                                    </div>
                                    <div className="text-center">
                                        <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm text-blue-100 mb-1">Warranty</p>
                                        <p className="font-semibold">
                                            {selectedIssue === 'screen' || selectedIssue === 'battery' ? '12 months' : '6 months'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm text-blue-100 mb-1">Service</p>
                                        <p className="font-semibold">Same Day</p>
                                    </div>
                                </div>
                            </div>

                            {/* Device Summary */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Repair Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Device:</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                            {selectedBrand} {selectedModel}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Issue:</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                            {ISSUES.find(i => i.id === selectedIssue)?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Repair Price:</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {getPrice() > 0 ? `$${getPrice()}` : 'FREE'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Link
                                    href={`/book-repair?brand=${selectedBrand}&model=${selectedModel}&issue=${selectedIssue}`}
                                    className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                                >
                                    Book This Repair
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={resetChecker}
                                    className="px-6 py-4 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-semibold"
                                >
                                    Check Another Device
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                                <h4 className="font-bold text-neutral-900 dark:text-white mb-3">What's Included:</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        Free diagnostic and inspection
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        OEM-quality parts
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        Professional installation by certified technicians
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        Full warranty coverage
                                    </li>
                                    <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        Quality testing before return
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
