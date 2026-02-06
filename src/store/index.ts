import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, CartItem, Product } from '@/types'

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Cart Store
interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                quantity,
                price: product.retailPrice, // Will be adjusted based on user type
              },
            ],
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// UI Store (for modals, drawers, etc.)
interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCartDrawerOpen: boolean
  isQuickViewOpen: boolean
  quickViewProduct: Product | null
  toggleMobileMenu: () => void
  toggleSearch: () => void
  toggleCartDrawer: () => void
  openQuickView: (product: Product) => void
  closeQuickView: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  openQuickView: (product) =>
    set({
      isQuickViewOpen: true,
      quickViewProduct: product,
    }),

  closeQuickView: () =>
    set({
      isQuickViewOpen: false,
      quickViewProduct: null,
    }),
}))

// Wishlist Store
interface WishlistState {
  items: string[] // Product IDs
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) =>
        set((state) => {
          if (!state.items.includes(productId)) {
            return { items: [...state.items, productId] }
          }
          return state
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      isInWishlist: (productId) => {
        const { items } = get()
        return items.includes(productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Recently Viewed Store
interface RecentlyViewedState {
  products: Product[]
  addProduct: (product: Product) => void
  clearHistory: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.products.filter((p) => p.id !== product.id)
          // Add to beginning, limit to 10 items
          return {
            products: [product, ...filtered].slice(0, 10),
          }
        }),

      clearHistory: () => set({ products: [] }),
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Filters Store (for product listing)
interface FiltersState {
  categories: string[]
  brands: string[]
  models: string[]
  qualityGrades: string[]
  priceRange: { min: number; max: number }
  inStock: boolean
  rating: number
  search: string
  setCategories: (categories: string[]) => void
  setBrands: (brands: string[]) => void
  setModels: (models: string[]) => void
  setQualityGrades: (grades: string[]) => void
  setPriceRange: (range: { min: number; max: number }) => void
  setInStock: (inStock: boolean) => void
  setRating: (rating: number) => void
  setSearch: (search: string) => void
  clearFilters: () => void
}

export const useFiltersStore = create<FiltersState>()((set) => ({
  categories: [],
  brands: [],
  models: [],
  qualityGrades: [],
  priceRange: { min: 0, max: 1000 },
  inStock: false,
  rating: 0,
  search: '',

  setCategories: (categories) => set({ categories }),
  setBrands: (brands) => set({ brands }),
  setModels: (models) => set({ models }),
  setQualityGrades: (qualityGrades) => set({ qualityGrades }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setInStock: (inStock) => set({ inStock }),
  setRating: (rating) => set({ rating }),
  setSearch: (search) => set({ search }),

  clearFilters: () =>
    set({
      categories: [],
      brands: [],
      models: [],
      qualityGrades: [],
      priceRange: { min: 0, max: 1000 },
      inStock: false,
      rating: 0,
      search: '',
    }),
}))
