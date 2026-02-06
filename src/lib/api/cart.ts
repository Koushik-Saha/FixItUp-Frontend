// lib/api/cart.ts
// Cart API client

export interface CartItem {
    id: string
    product_id: string
    quantity: number
    product: {
        id: string
        sku: string
        name: string
        slug: string
        brand: string
        device_model: string
        image: string
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

export interface CartSummary {
    subtotal: number
    total_items: number
    total_savings: number
    is_wholesale: boolean
    wholesale_tier?: string
}

export interface CartResponse {
    data: {
        items: CartItem[]
        summary: CartSummary
    }
}

// Get user's cart
export async function getCart(): Promise<CartResponse> {
    const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch cart')
    }

    return response.json()
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1): Promise<{ message: string; data: unknown }> {
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: productId,
            quantity,
        }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add item to cart')
    }

    return response.json()
}

// Update cart item quantity
export async function updateCartItem(itemId: string, quantity: number): Promise<{ message: string; data: unknown }> {
    const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update cart item')
    }

    return response.json()
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<{ message: string }> {
    const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove item from cart')
    }

    return response.json()
}
