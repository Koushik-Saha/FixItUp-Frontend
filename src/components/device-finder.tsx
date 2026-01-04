'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronRight, Smartphone, Package, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Brand = {
    name: string
    slug: string
    logo?: string
}

type PhoneModel = {
    name: string
    slug: string
    year?: number
    image?: string
}

type PartType = {
    type: string
    count: number
    sample_image: string | null
}

type Step = 'brand' | 'model' | 'part'

export default function DeviceFinder() {
    const router = useRouter()

    // State
    const [currentStep, setCurrentStep] = useState<Step>('brand')
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null)
    const [selectedPart, setSelectedPart] = useState<PartType | null>(null)

    // Data
    const [brands, setBrands] = useState<Brand[]>([])
    const [models, setModels] = useState<PhoneModel[]>([])
    const [partTypes, setPartTypes] = useState<PartType[]>([])

    // Loading states
    const [loadingBrands, setLoadingBrands] = useState(true)
    const [loadingModels, setLoadingModels] = useState(false)
    const [loadingParts, setLoadingParts] = useState(false)

    // Search
    const [searchQuery, setSearchQuery] = useState('')

    // Load brands on mount
    useEffect(() => {
        loadBrands()
    }, [])

    // Load models when brand is selected
    useEffect(() => {
        if (selectedBrand) {
            loadModels(selectedBrand.slug)
        }
    }, [selectedBrand])

    // Load part types when model is selected
    useEffect(() => {
        if (selectedBrand && selectedModel) {
            loadPartTypes(selectedBrand.name, selectedModel.name)
        }
    }, [selectedBrand, selectedModel])

    const loadBrands = async () => {
        try {
            setLoadingBrands(true)
            const res = await fetch('/api/nav/phone-models')
            const data = await res.json()

            const rowBrandData = Object.keys(data?.data)
            if (!rowBrandData) return

            // Extract brand names from response
            const brandNames = rowBrandData
            const brandList: Brand[] = brandNames.map(name => ({
                name,
                slug: name.toLowerCase()
            }))

            setBrands(brandList)
        } catch (error) {
            console.error('Failed to load brands:', error)
        } finally {
            setLoadingBrands(false)
        }
    }

    const slugify = (s: string) =>
        s
            .toLowerCase()
            .trim()
            .replace(/[()]/g, '')          // remove parentheses
            .replace(/[^a-z0-9]+/g, '-')   // non-alphanum -> dash
            .replace(/-+/g, '-')           // collapse dashes
            .replace(/^-|-$/g, '')         // trim dashes

    const loadModels = async (brandSlug: string) => {
        try {
            setLoadingModels(true)

            const res = await fetch('/api/nav/phone-models')
            const json = await res.json()

            // ✅ your API response has { success, data }
            const brandsMap = json?.data
            const brandData = brandsMap?.[selectedBrand!.name]

            if (!brandData?.bySubcategory) {
                setModels([]) // clear list if brand not found / no models
                return
            }

            const modelList: PhoneModel[] = []
            const seen = new Set<string>()

            Object.values(brandData.bySubcategory).forEach((subcat: any) => {
                subcat?.columns?.forEach((col: any) => {
                    col?.items?.forEach((item: any) => {
                        if (!item?.name) return

                        const model: PhoneModel = {
                            name: item.name,
                            slug: slugify(item.name),
                            year: item.new ? new Date().getFullYear() : undefined
                        }

                        // ✅ avoid duplicates (since models can appear across columns)
                        if (!seen.has(model.slug)) {
                            seen.add(model.slug)
                            modelList.push(model)
                        }
                    })
                })
            })

            setModels(modelList)
        } catch (error) {
            console.error('Failed to load models:', error)
            setModels([])
        } finally {
            setLoadingModels(false)
        }
    }

    const loadPartTypes = async (brand: string, model: string) => {
        try {
            setLoadingParts(true)
            const res = await fetch(
                `/api/device-finder/parts?brand=${encodeURIComponent(brand)}&device=${encodeURIComponent(model)}`
            )
            const json = await res.json()

            setPartTypes(json.data || [])
        } catch (error) {
            console.error('Failed to load part types:', error)
        } finally {
            setLoadingParts(false)
        }
    }

    const handleBrandSelect = (brand: Brand) => {
        setSelectedBrand(brand)
        setSelectedModel(null)
        setSelectedPart(null)
        setCurrentStep('model')
        setSearchQuery('')
    }

    const handleModelSelect = (model: PhoneModel) => {
        setSelectedModel(model)
        setSelectedPart(null)
        setCurrentStep('part')
        setSearchQuery('')
    }

    const handlePartSelect = (part: PartType) => {
        setSelectedPart(part)

        // Navigate to shop page with filters
        const params = new URLSearchParams({
            brand: selectedBrand!.name,
            device: selectedModel!.name,
            product_type: part.type
        })

        router.push(`/shop?${params.toString()}`)
    }

    const handleBack = () => {
        if (currentStep === 'part') {
            setCurrentStep('model')
            setSelectedModel(null)
            setSelectedPart(null)
        } else if (currentStep === 'model') {
            setCurrentStep('brand')
            setSelectedBrand(null)
            setSelectedModel(null)
        }
    }

    // Filter data based on search
    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredParts = partTypes.filter(p =>
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="w-full bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-blue-900/20 rounded-2xl p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Find Parts for Your Device
                </h2>
                <p className="text-neutral-400">
                    Select your device to find compatible parts and accessories
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <StepIndicator
                    label="Brand"
                    active={currentStep === 'brand'}
                    completed={selectedBrand !== null}
                />
                <ChevronRight className="w-4 h-4 text-neutral-600" />
                <StepIndicator
                    label="Model"
                    active={currentStep === 'model'}
                    completed={selectedModel !== null}
                />
                <ChevronRight className="w-4 h-4 text-neutral-600" />
                <StepIndicator
                    label="Part Type"
                    active={currentStep === 'part'}
                    completed={selectedPart !== null}
                />
            </div>

            {/* Breadcrumb */}
            {(selectedBrand || selectedModel) && (
                <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
                    <button
                        onClick={() => setCurrentStep('brand')}
                        className="hover:text-white transition-colors"
                    >
                        {selectedBrand?.name || 'Brand'}
                    </button>
                    {selectedModel && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <button
                                onClick={() => setCurrentStep('model')}
                                className="hover:text-white transition-colors"
                            >
                                {selectedModel.name}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                    type="text"
                    placeholder={
                        currentStep === 'brand' ? 'Search brands...' :
                        currentStep === 'model' ? 'Search models...' :
                        'Search parts...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {currentStep === 'brand' && (
                    <motion.div
                        key="brands"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loadingBrands ? (
                            <LoadingState />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {filteredBrands.map((brand) => (
                                    <BrandCard
                                        key={brand.slug}
                                        brand={brand}
                                        onClick={() => handleBrandSelect(brand)}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {currentStep === 'model' && (
                    <motion.div
                        key="models"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={handleBack}
                            className="mb-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            ← Back to brands
                        </button>
                        {loadingModels ? (
                            <LoadingState />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredModels.map((model) => (
                                    <ModelCard
                                        key={model.slug}
                                        model={model}
                                        onClick={() => handleModelSelect(model)}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {currentStep === 'part' && (
                    <motion.div
                        key="parts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={handleBack}
                            className="mb-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            ← Back to models
                        </button>
                        {loadingParts ? (
                            <LoadingState />
                        ) : partTypes.length === 0 ? (
                            <div className="text-center py-8 text-neutral-400">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No parts found for this device.</p>
                                <p className="text-sm mt-2">Try selecting a different model.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredParts.map((part) => (
                                    <PartCard
                                        key={part.type}
                                        part={part}
                                        onClick={() => handlePartSelect(part)}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Step Indicator Component
function StepIndicator({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    completed
                        ? 'bg-green-500 text-white'
                        : active
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-neutral-500'
                }`}
            >
                {completed ? '✓' : active ? '•' : ''}
            </div>
            <span className={`text-xs ${active ? 'text-white font-medium' : 'text-neutral-500'}`}>
                {label}
            </span>
        </div>
    )
}

// Brand Card Component
function BrandCard({ brand, onClick }: { brand: Brand; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group relative bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:scale-105"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                    <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-white font-medium text-center">{brand.name}</span>
            </div>
        </button>
    )
}

// Model Card Component
function ModelCard({ model, onClick }: { model: PhoneModel; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800 hover:border-blue-500/50 rounded-xl p-4 transition-all hover:scale-[1.02] text-left"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{model.name}</span>
                        {model.year && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                                New
                            </span>
                        )}
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 transition-colors" />
            </div>
        </button>
    )
}

// Part Card Component
function PartCard({ part, onClick }: { part: PartType; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800 hover:border-blue-500/50 rounded-xl p-4 transition-all hover:scale-[1.02] text-left"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate capitalize">
                            {part.type}
                        </div>
                        <div className="text-sm text-neutral-400">
                            {part.count} {part.count === 1 ? 'product' : 'products'}
                        </div>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </div>
        </button>
    )
}

// Loading State Component
function LoadingState() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">Loading...</p>
            </div>
        </div>
    )
}
