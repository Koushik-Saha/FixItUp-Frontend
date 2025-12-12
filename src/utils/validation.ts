// lib/utils/validation.ts
// Input validation utilities

import { z } from 'zod'

// Product validation
export const productSchema = z.object({
    sku: z.string().min(3).max(50),
    name: z.string().min(3).max(200),
    slug: z.string().min(3).max(200),
    category_id: z.string().uuid().optional(),
    brand: z.string().min(2).max(100),
    device_model: z.string().max(100).optional(),
    product_type: z.string().max(50).optional(),
    description: z.string().optional(),
    base_price: z.number().positive(),
    cost_price: z.number().positive().optional(),
    images: z.array(z.string().url()).optional(),
    is_active: z.boolean().optional(),
    is_featured: z.boolean().optional(),
})

// Order validation
export const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
})

export const shippingAddressSchema = z.object({
    full_name: z.string().min(2),
    address_line1: z.string().min(5),
    address_line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().length(2), // US state code
    zip_code: z.string().regex(/^\d{5}(-\d{4})?$/), // US zip code
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/), // (555) 123-4567
})

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1),
    shipping_address: shippingAddressSchema,
    billing_address: shippingAddressSchema.optional(),
    customer_notes: z.string().max(500).optional(),
})

// Repair ticket validation
export const createRepairTicketSchema = z.object({
    customer_name: z.string().min(2),
    customer_email: z.string().email(),
    customer_phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
    device_brand: z.string().min(2),
    device_model: z.string().min(2),
    imei_serial: z.string().optional(),
    issue_description: z.string().min(10).max(1000),
    issue_category: z.string().optional(),
    appointment_date: z.string().datetime().optional(),
    customer_notes: z.string().max(500).optional(),
})

// Wholesale application validation
export const wholesaleApplicationSchema = z.object({
    business_name: z.string().min(2),
    business_type: z.string().optional(),
    tax_id: z.string().regex(/^\d{2}-\d{7}$/), // EIN format
    website: z.string().url().optional(),
    business_phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
    business_email: z.string().email(),
    business_address: z.object({
        address_line1: z.string().min(5),
        address_line2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().length(2),
        zip_code: z.string().regex(/^\d{5}(-\d{4})?$/),
    }),
    requested_tier: z.enum(['tier1', 'tier2', 'tier3']).optional(),
})

// User profile validation
export const updateProfileSchema = z.object({
    full_name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/).optional(),
})

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean
    data?: T
    errors?: z.ZodError
} {
    try {
        const validData = schema.parse(data)
        return { success: true, data: validData }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: error }
        }
        throw error
    }
}

// Format validation errors for API responses
export function formatValidationErrors(errors: z.ZodError): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {}

    errors.errors.forEach((error) => {
        const path = error.path.join('.')
        if (!formattedErrors[path]) {
            formattedErrors[path] = []
        }
        formattedErrors[path].push(error.message)
    })

    return formattedErrors
}
