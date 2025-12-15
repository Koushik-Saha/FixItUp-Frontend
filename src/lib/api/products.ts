// lib/api/products.ts
// Products API client

export interface Product {
    id: string
    name: string
    slug: string
    sku: string
    description: string
    brand: string
    device_model: string
    category_id: string
    base_price: number
    wholesale_tier1_discount: number
    wholesale_tier2_discount: number
    wholesale_tier3_discount: number
    images: string[]
    thumbnail: string
    total_stock: number
    is_active: boolean
    is_featured: boolean
    is_new: boolean
    created_at: string
    updated_at: string
    
    // Calculated fields
    displayPrice?: number
    originalPrice?: number
    discountPercentage?: number
    isWholesale?: boolean
    
    // Category data (joined)
    category?: {
        id: string
        name: string
        slug: string
    }
}

export interface ProductsResponse {
    data: Product[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface SearchResponse {
    data: Product[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    search: {
        query: string
        filters: {
            category?: string
            brand?: string
            min_price?: string
            max_price?: string
        }
        results: number
    }
}

// Get products with filtering and pagination
export async function getProducts(params: {
    category?: string
    brand?: string
    device?: string
    search?: string
    featured?: boolean
    new?: boolean
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
} = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.category) searchParams.set('category', params.category)
    if (params.brand) searchParams.set('brand', params.brand)
    if (params.device) searchParams.set('device', params.device)
    if (params.search) searchParams.set('search', params.search)
    if (params.featured) searchParams.set('featured', 'true')
    if (params.new) searchParams.set('new', 'true')
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.order) searchParams.set('order', params.order)

    const response = await fetch(`/api/products?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    return response.json()
}

// Search products with advanced filtering
export async function searchProducts(params: {
    query?: string
    category?: string
    brand?: string
    min_price?: number
    max_price?: number
    page?: number
    limit?: number
} = {}): Promise<SearchResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.query) searchParams.set('q', params.query)
    if (params.category) searchParams.set('category', params.category)
    if (params.brand) searchParams.set('brand', params.brand)
    if (params.min_price) searchParams.set('min_price', params.min_price.toString())
    if (params.max_price) searchParams.set('max_price', params.max_price.toString())
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`/api/products/search?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`)
    }

    return response.json()
}

// Get single product by ID
export async function getProduct(id: string): Promise<{ data: Product }> {
    const response = await fetch(`/api/products/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`)
    }

    return response.json()
}