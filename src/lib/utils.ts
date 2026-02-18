import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function calculateDiscount(original: number, current: number): number {
  if (original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

export function generateSKU(brand: string, model: string, part: string): string {
  const b = brand.substring(0, 3).toUpperCase()
  const m = model.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()
  const p = part.substring(0, 3).toUpperCase()
  const random = Math.floor(Math.random() * 900) + 100
  return `${b}-${m}-${p}-${random}`
}

export function getStockStatus(qty: number): { status: string; label: string } {
  if (qty <= 0) return { status: 'out-of-stock', label: 'Out of Stock' }
  if (qty < 10) return { status: 'low-stock', label: `Only ${qty} left` }
  return { status: 'in-stock', label: 'In Stock' }
}

export function calculateBulkPrice(basePrice: number, qty: number, tiers: { min: number; discount: number }[]): { price: number; discount: number; tier: string } {
  let discount = 0
  let tier = '1-9 units'

  // Sort tiers by min desc
  const sorted = [...tiers].sort((a, b) => b.min - a.min)
  for (const t of sorted) {
    if (qty >= t.min) {
      discount = t.discount
      tier = `${t.min}+ units`
      break
    }
  }

  const price = basePrice * (1 - discount / 100)
  return { price, discount, tier }

}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize to NFD form
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
}

export function calculateOrderTotal(
  subtotal: number,
  discountPercent: number = 0,
  taxRate: number = 0,
  shipping: number = 0
) {
  const discountAmount = subtotal * (discountPercent / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxAmount + shipping

  return {
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    shipping,
    total
  }
}
