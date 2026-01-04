'use client'

import { useState } from 'react'
import { Check, X, Info, ChevronDown, ChevronUp, Shield, Star, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type QualityGrade = 'oem' | 'premium' | 'standard'

interface QualityFeature {
    name: string
    oem: boolean | string
    premium: boolean | string
    standard: boolean | string
    description?: string
}

const QUALITY_FEATURES: QualityFeature[] = [
    {
        name: 'Manufacturer Quality',
        oem: 'Original Equipment Manufacturer',
        premium: 'High-Quality Aftermarket',
        standard: 'Standard Aftermarket',
        description: 'Who manufactures the component'
    },
    {
        name: 'Warranty Coverage',
        oem: '12 months',
        premium: '12 months',
        standard: '6 months',
        description: 'Length of warranty protection'
    },
    {
        name: 'Display Quality',
        oem: 'True Tone & HDR',
        premium: 'HDR Support',
        standard: 'Standard LCD',
        description: 'Screen technology and color accuracy'
    },
    {
        name: 'Touch Sensitivity',
        oem: true,
        premium: true,
        standard: true,
        description: 'Responsive touch input'
    },
    {
        name: 'Original Connectors',
        oem: true,
        premium: true,
        standard: false,
        description: 'Uses original connector design'
    },
    {
        name: 'Pre-assembled',
        oem: true,
        premium: true,
        standard: true,
        description: 'Ready to install out of box'
    },
    {
        name: 'Color Calibration',
        oem: 'Factory Calibrated',
        premium: 'Pre-calibrated',
        standard: false,
        description: 'Accurate color reproduction'
    },
    {
        name: 'Brightness Level',
        oem: '2000 nits peak',
        premium: '1800 nits peak',
        standard: '1200 nits peak',
        description: 'Maximum screen brightness'
    },
    {
        name: 'Oleophobic Coating',
        oem: true,
        premium: true,
        standard: false,
        description: 'Fingerprint-resistant coating'
    },
    {
        name: 'Face ID Compatible',
        oem: true,
        premium: true,
        standard: 'Limited',
        description: 'Works with facial recognition'
    },
    {
        name: 'Lifespan',
        oem: '5+ years',
        premium: '3-5 years',
        standard: '2-3 years',
        description: 'Expected component lifetime'
    },
    {
        name: 'Price Range',
        oem: '$$$$',
        premium: '$$$',
        standard: '$$',
        description: 'Relative cost comparison'
    }
]

const QUALITY_INFO = {
    oem: {
        title: 'OEM (Original Equipment Manufacturer)',
        badge: 'Best Quality',
        color: 'blue',
        icon: Shield,
        description: 'Genuine parts from the original manufacturer. Identical to factory components with full compatibility and longest lifespan.',
        pros: [
            'Exact factory specifications',
            'Guaranteed compatibility',
            'Longest lifespan (5+ years)',
            'Premium warranty coverage',
            'True Tone and all features'
        ],
        cons: [
            'Highest price point',
            'Limited availability'
        ],
        bestFor: 'Premium devices, warranty preservation, maximum longevity'
    },
    premium: {
        title: 'Premium Aftermarket',
        badge: 'Great Value',
        color: 'green',
        icon: Star,
        description: 'High-quality aftermarket parts that closely match OEM specifications. Excellent balance of quality and price.',
        pros: [
            'Near-OEM quality',
            'Full feature support',
            'Good lifespan (3-5 years)',
            '12-month warranty',
            'Better availability'
        ],
        cons: [
            'Slight quality variation',
            'May lack True Tone'
        ],
        bestFor: 'Most repairs, business customers, quality-conscious buyers'
    },
    standard: {
        title: 'Standard Aftermarket',
        badge: 'Budget Option',
        color: 'amber',
        icon: DollarSign,
        description: 'Economy aftermarket parts for budget-conscious repairs. Functional quality at the lowest price point.',
        pros: [
            'Lowest cost',
            'Wide availability',
            'Basic functionality',
            '6-month warranty'
        ],
        cons: [
            'Lower brightness',
            'Shorter lifespan (2-3 years)',
            'Limited features',
            'May have color variance'
        ],
        bestFor: 'Older devices, temporary repairs, tight budgets'
    }
}

export default function QualityComparisonTool() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState<QualityGrade | null>(null)

    const renderValue = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            return value ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
            ) : (
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto" />
            )
        }
        return <span className="text-sm text-neutral-700 dark:text-neutral-300">{value}</span>
    }

    const getGradeBadgeColor = (grade: QualityGrade) => {
        const colors = {
            oem: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
            premium: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
            standard: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
        }
        return colors[grade]
    }

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Compare Quality Grades
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Understand the differences between OEM, Premium, and Standard parts
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-neutral-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                )}
            </button>

            {/* Comparison Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 border-t border-neutral-200 dark:border-neutral-700">
                            {/* Quality Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {(Object.keys(QUALITY_INFO) as QualityGrade[]).map((grade) => {
                                    const info = QUALITY_INFO[grade]
                                    const Icon = info.icon
                                    const isSelected = selectedGrade === grade

                                    return (
                                        <button
                                            key={grade}
                                            onClick={() => setSelectedGrade(isSelected ? null : grade)}
                                            className={`text-left p-4 rounded-lg border-2 transition-all ${
                                                isSelected
                                                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`p-2 rounded-lg ${getGradeBadgeColor(grade)}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                                        {info.title}
                                                    </h4>
                                                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${getGradeBadgeColor(grade)}`}>
                                                        {info.badge}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                {info.description}
                                            </p>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <div className="mb-3">
                                                        <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                                                            Pros:
                                                        </p>
                                                        <ul className="text-xs space-y-1">
                                                            {info.pros.map((pro, i) => (
                                                                <li key={i} className="flex items-start gap-1 text-neutral-700 dark:text-neutral-300">
                                                                    <Check className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                                    {pro}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                                                            Cons:
                                                        </p>
                                                        <ul className="text-xs space-y-1">
                                                            {info.cons.map((con, i) => (
                                                                <li key={i} className="flex items-start gap-1 text-neutral-700 dark:text-neutral-300">
                                                                    <X className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                                                    {con}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                            <span className="font-semibold">Best for:</span> {info.bestFor}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Feature Comparison Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50 dark:bg-neutral-800">
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700">
                                                Feature
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold border-b border-neutral-200 dark:border-neutral-700">
                                                <span className="text-blue-600 dark:text-blue-400">OEM</span>
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold border-b border-neutral-200 dark:border-neutral-700">
                                                <span className="text-green-600 dark:text-green-400">Premium</span>
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold border-b border-neutral-200 dark:border-neutral-700">
                                                <span className="text-amber-600 dark:text-amber-400">Standard</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {QUALITY_FEATURES.map((feature, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                            {feature.name}
                                                        </span>
                                                        {feature.description && (
                                                            <div className="group relative">
                                                                <Info className="h-3.5 w-3.5 text-neutral-400 cursor-help" />
                                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-48 p-2 bg-neutral-900 dark:bg-neutral-700 text-white text-xs rounded shadow-lg">
                                                                    {feature.description}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {renderValue(feature.oem)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {renderValue(feature.premium)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {renderValue(feature.standard)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom Note */}
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-900 dark:text-blue-100">
                                        <p className="font-semibold mb-1">Need help choosing?</p>
                                        <p className="text-blue-800 dark:text-blue-200">
                                            Our recommendation: Premium grade offers the best balance of quality and value for most repairs.
                                            Choose OEM for flagship devices or when preserving maximum resale value. Standard grade is suitable for older devices or budget-conscious repairs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
