'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function BulkImportPage() {
    const router = useRouter()
    const [jsonInput, setJsonInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleImport = async () => {
        try {
            setLoading(true)
            setResult(null)

            let products = []
            try {
                products = JSON.parse(jsonInput)
            } catch (e) {
                toast.error('Invalid JSON format')
                setLoading(false)
                return
            }

            if (!Array.isArray(products)) {
                toast.error('Input must be an array of products')
                setLoading(false)
                return
            }

            const res = await fetch('/api/admin/products/bulk-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Import failed')
            }

            setResult(data)
            toast.success(data.message)

            if (data.data?.imported > 0) {
                setTimeout(() => {
                    router.push('/admin/products')
                }, 2000)
            }

        } catch (error: any) {
            toast.error(error.message)
            setResult({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    const loadSample = () => {
        const sample = [
            {
                "name": "iPhone 14 Screen",
                "sku": "SCR-IP14-OEM",
                "slug": "iphone-14-screen-replacement",
                "brand": "Apple",
                "device_model": "iPhone 14",
                "category_id": "category_id_here",
                "base_price": 150.00,
                "cost_price": 80.00,
                "total_stock": 50,
                "product_type": "Part"
            }
        ]
        setJsonInput(JSON.stringify(sample, null, 2))
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Bulk Import Products</h1>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">JSON Import</h2>
                    <button onClick={loadSample} className="text-sm text-blue-600 hover:underline">
                        Load Sample JSON
                    </button>
                </div>

                <p className="text-sm text-slate-500">
                    Paste your product data in JSON format below. Ensure fields match the API requirements (snake_case).
                </p>

                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={15}
                    className="w-full font-mono text-sm px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    placeholder={`[\n  {\n    "name": "Product Name",\n    "sku": "SKU-123",\n    ...\n  }\n]`}
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleImport}
                        disabled={loading || !jsonInput.trim()}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Import Products
                    </button>
                </div>
            </div>

            {result && (
                <div className={`p-4 rounded-lg border ${result.error || (result.data && result.data.failed > 0) ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    {result.error ? (
                        <div className="flex items-start gap-3 text-red-700">
                            <AlertCircle className="h-5 w-5 mt-0.5" />
                            <div>
                                <p className="font-medium">Import Failed</p>
                                <p className="text-sm mt-1">{result.error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-green-700">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">{result.message}</span>
                            </div>

                            {result.data?.errors?.length > 0 && (
                                <div className="mt-2 pl-8">
                                    <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                        {result.data.errors.map((err: string, i: number) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
