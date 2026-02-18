'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Loader2,
    CheckCircle,
    XCircle,
    AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

interface Product {
    id: string
    name: string
    sku: string
    brand: string
    deviceModel: string
    totalStock: number
    basePrice: number
    isActive: boolean
    category?: {
        name: string
    }
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export default function ProductsPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)

    // Filters
    const [statusFilter, setStatusFilter] = useState('all') // all, active, inactive
    const [stockFilter, setStockFilter] = useState('all') // all, in-stock, out-of-stock, low-stock

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (debouncedSearch) params.append('search', debouncedSearch)
            if (statusFilter !== 'all') params.append('status', statusFilter)
            if (stockFilter !== 'all') params.append('stock', stockFilter)
            params.append('page', '1') // Reset to page 1 on filter change for now
            params.append('limit', '20')

            const res = await fetch(`/api/admin/products?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            setProducts(data.data)
            setPagination(data.pagination)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [debouncedSearch, statusFilter, stockFilter])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchProducts()
            } else {
                alert('Failed to delete product')
            }
        } catch (error) {
            console.error(error)
            alert('Error deleting product')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by name, SKU, brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="all">All Stock</option>
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                            <p className="text-slate-500">Loading products...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-500">
                                        No products found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                            <div className="text-xs text-slate-500">SKU: {product.sku}</div>
                                            <div className="text-xs text-slate-400">{product.brand} {product.deviceModel}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">
                                            {product.category?.name || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-slate-900">
                                            {formatCurrency(product.basePrice)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${product.totalStock === 0 ? 'bg-red-100 text-red-800' :
                                                    product.totalStock <= 10 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-green-100 text-green-800'}
                                            `}>
                                                {product.totalStock}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {product.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                    <CheckCircle className="h-3 w-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                                                    <XCircle className="h-3 w-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Simple version) */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        {/* Add pagination controls logic later if needed */}
                    </div>
                )}
            </div>
        </div>
    )
}
