// lib/api/orders.ts
// Orders API client

export interface OrderItem {
    product_id: string
    quantity: number
}

export interface Address {
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
    shipping_address: Address
    billing_address?: Address
    customer_notes?: string
}

export interface Order {
    id: string
    order_number: string
    user_id: string
    customer_name: string
    customer_email: string
    customer_phone?: string
    subtotal: number
    discount_amount: number
    tax_amount: number
    shipping_cost: number
    total_amount: number
    is_wholesale: boolean
    wholesale_tier?: string
    shipping_address: Address
    billing_address: Address
    customer_notes?: string
    status: string
    payment_status: string
    payment_intent_id?: string
    payment_method?: string
    created_at: string
    updated_at: string
    orderItems?: any[]
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
        order_id: string
        order_number: string
        total_amount: number
        client_secret?: string // For Stripe payment intent
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
        throw new Error(errorData.error || 'Failed to create order')
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
        throw new Error(errorData.error || 'Failed to fetch orders')
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
        throw new Error(errorData.error || 'Failed to fetch order')
    }

    return response.json()
}