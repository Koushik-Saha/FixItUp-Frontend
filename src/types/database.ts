// lib/types/database.ts
// Database types - Auto-generated from Supabase

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone: string | null
                    role: 'customer' | 'wholesale' | 'admin'
                    wholesale_status: 'pending' | 'approved' | 'rejected' | null
                    wholesale_tier: 'tier1' | 'tier2' | 'tier3' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'customer' | 'wholesale' | 'admin'
                    wholesale_status?: 'pending' | 'approved' | 'rejected' | null
                    wholesale_tier?: 'tier1' | 'tier2' | 'tier3' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'customer' | 'wholesale' | 'admin'
                    wholesale_status?: 'pending' | 'approved' | 'rejected' | null
                    wholesale_tier?: 'tier1' | 'tier2' | 'tier3' | null
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                }
            }
            products: {
                Row: {
                    id: string
                    sku: string
                    name: string
                    slug: string
                    category_id: string | null
                    brand: string
                    device_model: string | null
                    product_type: string | null
                    description: string | null
                    specifications: Json | null
                    base_price: number
                    cost_price: number | null
                    wholesale_tier1_discount: number
                    wholesale_tier2_discount: number
                    wholesale_tier3_discount: number
                    total_stock: number
                    low_stock_threshold: number
                    images: string[]
                    thumbnail: string | null
                    is_active: boolean
                    is_featured: boolean
                    is_new: boolean
                    is_bestseller: boolean
                    meta_title: string | null
                    meta_description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sku: string
                    name: string
                    slug: string
                    category_id?: string | null
                    brand: string
                    device_model?: string | null
                    product_type?: string | null
                    description?: string | null
                    specifications?: Json | null
                    base_price: number
                    cost_price?: number | null
                    wholesale_tier1_discount?: number
                    wholesale_tier2_discount?: number
                    wholesale_tier3_discount?: number
                    total_stock?: number
                    low_stock_threshold?: number
                    images?: string[]
                    thumbnail?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    is_new?: boolean
                    is_bestseller?: boolean
                    meta_title?: string | null
                    meta_description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    sku?: string
                    name?: string
                    slug?: string
                    category_id?: string | null
                    brand?: string
                    device_model?: string | null
                    product_type?: string | null
                    description?: string | null
                    specifications?: Json | null
                    base_price?: number
                    cost_price?: number | null
                    wholesale_tier1_discount?: number
                    wholesale_tier2_discount?: number
                    wholesale_tier3_discount?: number
                    low_stock_threshold?: number
                    images?: string[]
                    thumbnail?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    is_new?: boolean
                    is_bestseller?: boolean
                    meta_title?: string | null
                    meta_description?: string | null
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string | null
                    subtotal: number
                    discount_amount: number
                    tax_amount: number
                    shipping_cost: number
                    total_amount: number
                    is_wholesale: boolean
                    wholesale_tier: string | null
                    shipping_address: Json
                    billing_address: Json | null
                    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
                    payment_method: string | null
                    payment_intent_id: string | null
                    tracking_number: string | null
                    carrier: string | null
                    customer_notes: string | null
                    admin_notes: string | null
                    shipped_at: string | null
                    delivered_at: string | null
                    cancelled_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    user_id?: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone?: string | null
                    subtotal: number
                    discount_amount?: number
                    tax_amount?: number
                    shipping_cost?: number
                    total_amount: number
                    is_wholesale?: boolean
                    wholesale_tier?: string | null
                    shipping_address: Json
                    billing_address?: Json | null
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
                    payment_method?: string | null
                    payment_intent_id?: string | null
                    created_at?: string
                }
                Update: {
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
                    tracking_number?: string | null
                    carrier?: string | null
                    admin_notes?: string | null
                    shipped_at?: string | null
                    delivered_at?: string | null
                    cancelled_at?: string | null
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    product_name: string
                    product_sku: string
                    product_image: string | null
                    unit_price: number
                    discount_percentage: number
                    quantity: number
                    subtotal: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    product_name: string
                    product_sku: string
                    product_image?: string | null
                    unit_price: number
                    discount_percentage?: number
                    quantity: number
                    subtotal: number
                    created_at?: string
                }
            }
            repair_tickets: {
                Row: {
                    id: string
                    ticket_number: string
                    customer_id: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    device_brand: string
                    device_model: string
                    imei_serial: string | null
                    issue_description: string
                    issue_category: string | null
                    assigned_store_id: string | null
                    assigned_technician: string | null
                    appointment_date: string | null
                    status: 'submitted' | 'confirmed' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled' | 'customer_pickup'
                    priority: 'low' | 'normal' | 'high' | 'urgent'
                    estimated_cost: number | null
                    actual_cost: number | null
                    parts_cost: number | null
                    labor_cost: number | null
                    technician_notes: string | null
                    internal_notes: string | null
                    customer_notes: string | null
                    device_images: string[]
                    confirmed_at: string | null
                    started_at: string | null
                    completed_at: string | null
                    cancelled_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    ticket_number: string
                    customer_id?: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    device_brand: string
                    device_model: string
                    imei_serial?: string | null
                    issue_description: string
                    issue_category?: string | null
                    assigned_store_id?: string | null
                    customer_notes?: string | null
                    created_at?: string
                }
                Update: {
                    assigned_store_id?: string | null
                    assigned_technician?: string | null
                    appointment_date?: string | null
                    status?: 'submitted' | 'confirmed' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled' | 'customer_pickup'
                    priority?: 'low' | 'normal' | 'high' | 'urgent'
                    estimated_cost?: number | null
                    actual_cost?: number | null
                    parts_cost?: number | null
                    labor_cost?: number | null
                    technician_notes?: string | null
                    internal_notes?: string | null
                    confirmed_at?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    cancelled_at?: string | null
                    updated_at?: string
                }
            }
            wholesale_applications: {
                Row: {
                    id: string
                    user_id: string
                    business_name: string
                    business_type: string | null
                    tax_id: string
                    website: string | null
                    business_phone: string
                    business_email: string
                    business_address: Json
                    documents: string[]
                    status: 'pending' | 'approved' | 'rejected'
                    requested_tier: 'tier1' | 'tier2' | 'tier3' | null
                    approved_tier: 'tier1' | 'tier2' | 'tier3' | null
                    reviewed_by: string | null
                    reviewed_at: string | null
                    rejection_reason: string | null
                    admin_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    business_name: string
                    business_type?: string | null
                    tax_id: string
                    website?: string | null
                    business_phone: string
                    business_email: string
                    business_address: Json
                    documents?: string[]
                    requested_tier?: 'tier1' | 'tier2' | 'tier3' | null
                    created_at?: string
                }
                Update: {
                    status?: 'pending' | 'approved' | 'rejected'
                    approved_tier?: 'tier1' | 'tier2' | 'tier3' | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    rejection_reason?: string | null
                    admin_notes?: string | null
                    updated_at?: string
                }
            }
            stores: {
                Row: {
                    id: string
                    name: string
                    address: string
                    city: string
                    state: string
                    zip_code: string
                    phone: string | null
                    email: string | null
                    operating_hours: Json
                    is_active: boolean
                    created_at: string
                }
            }
            cart_items: {
                Row: {
                    id: string
                    user_id: string | null
                    session_id: string | null
                    product_id: string
                    quantity: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    product_id: string
                    quantity?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    quantity?: number
                    updated_at?: string
                }
            }
            inventory: {
                Row: {
                    id: string
                    product_id: string
                    store_id: string
                    quantity: number
                    reserved_quantity: number
                    last_restocked_at: string | null
                    created_at: string
                    updated_at: string
                }
                Update: {
                    quantity?: number
                    reserved_quantity?: number
                    last_restocked_at?: string | null
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string
                    order_id: string | null
                    rating: number
                    title: string | null
                    comment: string | null
                    images: string[]
                    is_verified_purchase: boolean
                    is_approved: boolean
                    helpful_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id: string
                    order_id?: string | null
                    rating: number
                    title?: string | null
                    comment?: string | null
                    images?: string[]
                    is_verified_purchase?: boolean
                    is_approved?: boolean
                    helpful_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    rating?: number
                    title?: string | null
                    comment?: string | null
                    images?: string[]
                    is_approved?: boolean
                    helpful_count?: number
                    updated_at?: string
                }
            }
            wishlists: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    notify_on_price_drop: boolean
                    notify_on_back_in_stock: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    notify_on_price_drop?: boolean
                    notify_on_back_in_stock?: boolean
                    created_at?: string
                }
                Update: {
                    notify_on_price_drop?: boolean
                    notify_on_back_in_stock?: boolean
                }
            }
            coupons: {
                Row: {
                    id: string
                    code: string
                    description: string | null
                    discount_type: 'percentage' | 'fixed'
                    discount_value: number
                    minimum_purchase: number | null
                    maximum_discount: number | null
                    max_uses: number | null
                    max_uses_per_user: number | null
                    times_used: number
                    applies_to: 'all' | 'products' | 'categories'
                    product_ids: string[]
                    category_ids: string[]
                    user_restrictions: 'all' | 'new_customers' | 'wholesale' | 'retail'
                    start_date: string
                    end_date: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    description?: string | null
                    discount_type: 'percentage' | 'fixed'
                    discount_value: number
                    minimum_purchase?: number | null
                    maximum_discount?: number | null
                    max_uses?: number | null
                    max_uses_per_user?: number | null
                    times_used?: number
                    applies_to?: 'all' | 'products' | 'categories'
                    product_ids?: string[]
                    category_ids?: string[]
                    user_restrictions?: 'all' | 'new_customers' | 'wholesale' | 'retail'
                    start_date?: string
                    end_date?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    code?: string
                    description?: string | null
                    discount_type?: 'percentage' | 'fixed'
                    discount_value?: number
                    minimum_purchase?: number | null
                    maximum_discount?: number | null
                    max_uses?: number | null
                    max_uses_per_user?: number | null
                    times_used?: number
                    applies_to?: 'all' | 'products' | 'categories'
                    product_ids?: string[]
                    category_ids?: string[]
                    user_restrictions?: 'all' | 'new_customers' | 'wholesale' | 'retail'
                    start_date?: string
                    end_date?: string | null
                    is_active?: boolean
                    updated_at?: string
                }
            }
            coupon_usage: {
                Row: {
                    id: string
                    coupon_id: string
                    user_id: string
                    order_id: string
                    used_at: string
                }
                Insert: {
                    id?: string
                    coupon_id: string
                    user_id: string
                    order_id: string
                    used_at?: string
                }
            }
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    type: 'shipping' | 'billing' | 'both'
                    full_name: string
                    address_line1: string
                    address_line2: string | null
                    city: string
                    state: string
                    zip_code: string
                    country: string
                    phone: string | null
                    is_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type?: 'shipping' | 'billing' | 'both'
                    full_name: string
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    state: string
                    zip_code: string
                    country?: string
                    phone?: string | null
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    type?: 'shipping' | 'billing' | 'both'
                    full_name?: string
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    state?: string
                    zip_code?: string
                    country?: string
                    phone?: string | null
                    is_default?: boolean
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: 'order_update' | 'repair_update' | 'wholesale_update' | 'price_drop' | 'back_in_stock' | 'promotion'
                    title: string
                    message: string
                    link: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'order_update' | 'repair_update' | 'wholesale_update' | 'price_drop' | 'back_in_stock' | 'promotion'
                    title: string
                    message: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    is_read?: boolean
                }
            }
            stock_alerts: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string
                    email: string
                    is_notified: boolean
                    notified_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id: string
                    email: string
                    is_notified?: boolean
                    notified_at?: string | null
                    created_at?: string
                }
                Update: {
                    is_notified?: boolean
                    notified_at?: string | null
                }
            }
            homepage_banners: {
                Row: {
                    id: string
                    title: string
                    subtitle: string | null
                    image_url: string
                    mobile_image_url: string | null
                    link_url: string | null
                    link_text: string | null
                    background_color: string | null
                    text_color: string | null
                    display_order: number
                    is_active: boolean
                    start_date: string | null
                    end_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    subtitle?: string | null
                    image_url: string
                    mobile_image_url?: string | null
                    link_url?: string | null
                    link_text?: string | null
                    background_color?: string | null
                    text_color?: string | null
                    display_order?: number
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    title?: string
                    subtitle?: string | null
                    image_url?: string
                    mobile_image_url?: string | null
                    link_url?: string | null
                    link_text?: string | null
                    background_color?: string | null
                    text_color?: string | null
                    display_order?: number
                    is_active?: boolean
                    start_date?: string | null
                    end_date?: string | null
                    updated_at?: string
                }
            }
        }
        Functions: {
            get_wholesale_price: {
                Args: { base_price: number; tier: string }
                Returns: number
            }
            generate_order_number: {
                Args: Record<string, never>
                Returns: string
            }
            generate_ticket_number: {
                Args: Record<string, never>
                Returns: string
            }
            validate_coupon: {
                Args: {
                    coupon_code: string
                    user_id: string | null
                    cart_total: number
                    product_ids: string[]
                }
                Returns: {
                    is_valid: boolean
                    error_message: string | null
                    discount_amount: number | null
                    coupon_id: string | null
                }
            }
        }
    }
}
