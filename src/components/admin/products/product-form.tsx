'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X, Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Assuming sonner is installed from package.json

const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    sku: z.string().min(2, 'SKU is required'),
    slug: z.string().min(3, 'Slug is required'),
    brand: z.string().min(1, 'Brand is required'),
    device_model: z.string().optional(),
    category_id: z.string().min(1, 'Category is required'),
    product_type: z.string().default('Part'),
    base_price: z.number().min(0),
    cost_price: z.number().min(0),
    total_stock: z.number().min(0),
    low_stock_threshold: z.number().min(0).default(10),
    description: z.string().min(10, 'Description too short'),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    is_new: z.boolean().default(false),
    wholesale_tier1_discount: z.number().min(0).max(100).default(0),
    wholesale_tier2_discount: z.number().min(0).max(100).default(0),
    wholesale_tier3_discount: z.number().min(0).max(100).default(0),
    images: z.array(z.string().url()).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
    id: string
    name: string,
    children?: Category[]
}

import { Product } from '@prisma/client'

// ...

interface ProductFormProps {
    initialData?: Partial<Product>
    isEditing?: boolean
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [imageInput, setImageInput] = useState('')

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            sku: initialData.sku,
            slug: initialData.slug,
            brand: initialData.brand,
            device_model: initialData.deviceModel || '',
            category_id: initialData.categoryId || '', // Prisma uses categoryId
            product_type: initialData.productType || 'Part',
            base_price: Number(initialData.basePrice) || 0,
            cost_price: Number(initialData.costPrice) || 0,
            total_stock: initialData.totalStock || 0,
            low_stock_threshold: initialData.lowStockThreshold || 10,
            description: initialData.description || '',
            is_active: initialData.isActive ?? true,
            is_featured: initialData.isFeatured ?? false,
            is_new: initialData.isNew ?? false,
            wholesale_tier1_discount: Number(initialData.tier1Discount) || 0, // Prisma uses tier1Discount
            wholesale_tier2_discount: Number(initialData.tier2Discount) || 0,
            wholesale_tier3_discount: Number(initialData.tier3Discount) || 0,
            images: (initialData.images as unknown as string[]) || [], // images is JsonValue[] in Prisma
        } : {
            is_active: true,
            is_featured: false,
            is_new: false,
            total_stock: 0,
            base_price: 0,
            cost_price: 0,
            low_stock_threshold: 10,
            wholesale_tier1_discount: 0,
            wholesale_tier2_discount: 0,
            wholesale_tier3_discount: 0,
            images: [],
            product_type: 'Part'
        }
    })

    const { fields: imageUrls, append: appendImage, remove: removeImage } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "images" as never, // cast to never to avoid type error with simple array
    })

    // Manual image array handling since useFieldArray is tricky with simple string arrays in some versions
    const watchedImages = watch('images') || []

    useEffect(() => {
        // Fetch categories
        fetch('/api/categories/tree')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err))
    }, [])

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true)
        try {
            const url = isEditing && initialData?.id
                ? `/api/admin/products/${initialData.id}`
                : '/api/admin/products'

            const method = isEditing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Failed to save product')
            }

            toast.success(isEditing ? 'Product updated' : 'Product created')
            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    const addImage = () => {
        if (imageInput && !watchedImages.includes(imageInput)) {
            setValue('images', [...watchedImages, imageInput])
            setImageInput('')
        }
    }

    const removeImageAtIndex = (index: number) => {
        const newImages = [...watchedImages]
        newImages.splice(index, 1)
        setValue('images', newImages)
    }

    // Recursive category options renderer
    const renderCategoryOptions = (cats: Category[], prefix = ''): React.ReactNode[] => {
        return cats.map(cat => (
            <>
                <option key={cat.id} value={cat.id}>{prefix}{cat.name}</option>
                {cat.children && renderCategoryOptions(cat.children, `${prefix}-- `)}
            </>
        ))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isEditing ? 'Edit Product' : 'New Product'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/products" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Save className="h-4 w-4" />
                        Save Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    {...register('name')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g. iPhone 13 Pro Screen Replacement"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                                <input
                                    {...register('sku')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="e.g. SCR-IP13P-OEM"
                                />
                                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    {...register('slug')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="iphone-13-pro-screen"
                                />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                                <input
                                    {...register('brand')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Apple"
                                />
                                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Device Model</label>
                                <input
                                    {...register('device_model')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="iPhone 13 Pro"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    {...register('category_id')}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Images</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                placeholder="Enter image URL"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            />
                            <button type="button" onClick={addImage} className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">
                                Add
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {watchedImages.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                    <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImageAtIndex(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Inventory */}
                <div className="space-y-6">
                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Pricing</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('base_price', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            {errors.base_price && <p className="text-red-500 text-xs mt-1">{errors.base_price.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('cost_price', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Wholesale Discounts (%)</label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 w-12">Tier 1</span>
                                    <input
                                        type="number"
                                        step="1"
                                        {...register('wholesale_tier1_discount', { valueAsNumber: true })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 w-12">Tier 2</span>
                                    <input
                                        type="number"
                                        step="1"
                                        {...register('wholesale_tier2_discount', { valueAsNumber: true })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 w-12">Tier 3</span>
                                    <input
                                        type="number"
                                        step="1"
                                        {...register('wholesale_tier3_discount', { valueAsNumber: true })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Inventory</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Stock</label>
                            <input
                                type="number"
                                {...register('total_stock', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                            <input
                                type="number"
                                {...register('low_stock_threshold', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800">Status</h2>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Active</span>
                            <input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Featured</span>
                            <input type="checkbox" {...register('is_featured')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">New Arrival</span>
                            <input type="checkbox" {...register('is_new')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
