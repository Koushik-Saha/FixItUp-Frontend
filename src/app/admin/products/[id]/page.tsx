'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/admin/products/product-form'
import { Loader2 } from 'lucide-react'

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${params.id}`)
                if (!res.ok) throw new Error('Failed to fetch product')
                const data = await res.json()

                // Map camelCase to snake_case for the form
                const mappedData = {
                    ...data.data,
                    category_id: data.data.categoryId,
                    device_model: data.data.deviceModel,
                    base_price: data.data.basePrice,
                    cost_price: data.data.costPrice,
                    total_stock: data.data.totalStock,
                    low_stock_threshold: data.data.lowStockThreshold,
                    is_active: data.data.isActive,
                    is_featured: data.data.isFeatured,
                    is_new: data.data.isNew,
                    product_type: data.data.productType,
                    wholesale_tier1_discount: data.data.tier1Discount,
                    wholesale_tier2_discount: data.data.tier2Discount,
                    wholesale_tier3_discount: data.data.tier3Discount,
                    meta_title: data.data.metaTitle,
                    meta_description: data.data.metaDescription,
                    // Keep original ID for submission URL
                    id: data.data.id
                }

                setProduct(mappedData)
            } catch (error) {
                console.error(error)
                router.push('/admin/products')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProduct()
        }
    }, [params.id, router])

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!product) return null

    return <ProductForm initialData={product} isEditing />
}
