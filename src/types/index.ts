// User Types
export type UserRole = 'guest' | 'retail' | 'business' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface RetailCustomer extends User {
  role: 'retail'
  phone?: string
  addresses: Address[]
  wishlist: string[] // Product IDs
}

export interface BusinessAccount extends User {
  role: 'business'
  companyName: string
  taxId: string
  businessType: string
  phone: string
  discountPercentage: number
  creditLimit: number
  paymentTerms: 'net-30' | 'net-60' | 'net-90'
  accountManager?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  approvedAt?: Date
  documents: BusinessDocument[]
  addresses: Address[]
}

export interface BusinessDocument {
  id: string
  type: 'license' | 'tax-id' | 'insurance' | 'other'
  fileName: string
  fileUrl: string
  uploadedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

export interface Address {
  id: string
  label: string // 'Home', 'Work', 'Business', etc.
  firstName: string
  lastName: string
  company?: string
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

// Product Types
export type QualityGrade = 'oem' | 'premium' | 'standard'
export type InstallDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  brand: string
  model: string
  category: Category
  images: ProductImage[]
  retailPrice: number
  wholesalePrice: number
  costPrice: number
  qualityGrade: QualityGrade
  installDifficulty: InstallDifficulty
  compatibility: string[] // Compatible device models
  specifications: Record<string, string>
  stock: number
  bulkPricing: BulkPricingTier[]
  warranty: number // Days
  features: string[]
  installationVideoUrl?: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

export interface BulkPricingTier {
  minQuantity: number
  discount: number // Percentage
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  icon?: string
  parentId?: string
  order: number
  productCount: number
}

// Cart Types
export interface CartItem {
  productId: string
  product: Product
  quantity: number
  price: number // Price at the time of adding to cart
  discount?: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'credit-card' | 'paypal' | 'net-terms' | 'purchase-order'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user: User
  items: OrderItem[]
  subtotal: number
  discount: number
  discountPercentage?: number
  tax: number
  shipping: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  trackingNumber?: string
  purchaseOrderNumber?: string // For business accounts
  notes?: string
  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  discount: number
  total: number
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId: string
  user: Pick<User, 'id' | 'name'>
  rating: number
  title: string
  comment: string
  verifiedPurchase: boolean
  helpful: number
  notHelpful: number
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

// Search & Filter Types
export interface ProductFilters {
  categories?: string[]
  brands?: string[]
  models?: string[]
  qualityGrade?: QualityGrade[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  rating?: number
  search?: string
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'popular'

export interface PaginationParams {
  page: number
  limit: number
  total?: number
  totalPages?: number
}

// Business Dashboard Types
export interface BusinessMetrics {
  monthlyOrders: number
  monthlySpent: number
  monthlySaved: number
  creditUsed: number
  creditAvailable: number
  outstandingBalance: number
  nextPaymentDue?: Date
  nextPaymentAmount?: number
}

export interface QuickOrderItem {
  sku: string
  quantity: number
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  read: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationParams
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface BusinessApplicationFormData {
  // Company Information
  companyName: string
  businessType: string
  taxId: string
  yearEstablished: number
  website?: string
  
  // Contact Person
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  
  // Business Address
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  
  // Business Details
  estimatedMonthlyVolume: string
  businessDescription: string
  
  // Documents
  businessLicense?: File
  taxIdDocument?: File
  
  // Terms
  agreeToTerms: boolean
}

// Device Finder Types
export interface DeviceBrand {
  id: string
  name: string
  logo?: string
}

export interface DeviceModel {
  id: string
  brandId: string
  name: string
  year?: number
  image?: string
}

export interface DevicePart {
  id: string
  modelId: string
  type: string
  products: Product[]
}
