import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conditional classes and removes conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Truncate text
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate SKU
 */
export function generateSKU(brand: string, model: string, part: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase()
  const modelCode = model.replace(/\s/g, '').substring(0, 5).toUpperCase()
  const partCode = part.substring(0, 3).toUpperCase()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `${brandCode}-${modelCode}-${partCode}-${random}`
}

/**
 * Check if item is in stock
 */
export function getStockStatus(quantity: number): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  label: string
  color: string
} {
  if (quantity === 0) {
    return {
      status: 'out-of-stock',
      label: 'Out of Stock',
      color: 'text-red-600 bg-red-50',
    }
  }
  if (quantity < 10) {
    return {
      status: 'low-stock',
      label: `Only ${quantity} left`,
      color: 'text-amber-600 bg-amber-50',
    }
  }
  return {
    status: 'in-stock',
    label: 'In Stock',
    color: 'text-green-600 bg-green-50',
  }
}

/**
 * Calculate bulk pricing
 */
export function calculateBulkPrice(
  basePrice: number,
  quantity: number,
  discountTiers: { min: number; discount: number }[]
): {
  price: number
  discount: number
  tier: string
} {
  // Sort tiers by minimum quantity descending
  const sortedTiers = [...discountTiers].sort((a, b) => b.min - a.min)

  // Find applicable tier
  const tier = sortedTiers.find((t) => quantity >= t.min)

  if (!tier) {
    return {
      price: basePrice,
      discount: 0,
      tier: '1-9 units',
    }
  }

  const discountedPrice = basePrice * (1 - tier.discount / 100)

  return {
    price: discountedPrice,
    discount: tier.discount,
    tier: `${tier.min}+ units`,
  }
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  
  return phone
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Calculate order total
 */
export function calculateOrderTotal(
  subtotal: number,
  discount: number = 0,
  tax: number = 0,
  shipping: number = 0
): {
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
} {
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (tax / 100)
  const total = taxableAmount + taxAmount + shipping

  return {
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    shipping,
    total,
  }
}
