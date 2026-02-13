// lib/api/orders.ts
// Orders API client

export interface OrderItem {
    product_id: string
    quantity: number
}

export interface OrderAddress {
    fullName: string
    phone?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
}

export interface AddressInput {
    full_name: string
    phone?: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
}

export interface CreateOrderRequest {
    items: OrderItem[]
    shipping_address: AddressInput
    billing_address?: AddressInput
    customer_notes?: string
}

// Detailed item for Order response
export interface OrderDetailsItem {
    id: string
    productName: string
    productSku: string
    unitPrice: number
    quantity: number
    productImage?: string
    productId: string
}

export interface Order {
    id: string
    orderNumber: string
    userId: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    subtotal: number
    discountAmount: number
    taxAmount: number
    shippingCost: number
    totalAmount: number
    isWholesale: boolean
    wholesaleTier?: string
    shippingAddress: OrderAddress
    billingAddress: OrderAddress
    customerNotes?: string
    status: string
    paymentStatus: string
    paymentIntentId?: string
    paymentMethod?: string
    createdAt: string
    updatedAt: string
    orderItems?: OrderDetailsItem[]
}

export interface OrderResponse {
    data: Order[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface CreateOrderResponse {
    message: string
    data: {
        orderId: string
        orderNumber: string
        totalAmount: number
        clientSecret?: string // For Stripe payment intent
    }
}

// Create new order
export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })

    if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = typeof errorData.error === 'string'
            ? errorData.error
            : errorData.error?.message || 'Failed to create order'
        throw new Error(errorMessage)
    }

    return response.json()
}

// Get user's orders
export async function getOrders(params: {
    page?: number
    limit?: number
    status?: string
} = {}): Promise<OrderResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.status) searchParams.set('status', params.status)

    const response = await fetch(`/api/orders?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = typeof errorData.error === 'string'
            ? errorData.error
            : errorData.error?.message || 'Failed to fetch orders'
        throw new Error(errorMessage)
    }

    return response.json()
}

// Get single order
export async function getOrder(orderId: string): Promise<{ data: Order }> {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = typeof errorData.error === 'string'
            ? errorData.error
            : errorData.error?.message || 'Failed to fetch order'
        throw new Error(errorMessage)
    }

    return response.json()
}