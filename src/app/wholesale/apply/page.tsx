'use client'

import { useState } from 'react'
import { Upload, CheckCircle, Building2, User, MapPin, Package, FileText } from 'lucide-react'
import Link from 'next/link'

export default function WholesaleApplicationPage() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerFullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        expectedVolume: '',
        businessLicense: null as File | null,
        taxId: ''
    })

    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                businessLicense: e.target.files[0]
            })
            if (errors.businessLicense) {
                setErrors({ ...errors, businessLicense: '' })
            }
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
        if (!formData.ownerFullName.trim()) newErrors.ownerFullName = 'Owner name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.state.trim()) newErrors.state = 'State is required'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
        if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required'
        if (!formData.expectedVolume) newErrors.expectedVolume = 'Expected volume is required'
        if (!formData.businessLicense) newErrors.businessLicense = 'Business license is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            // Here you would send to API
            console.log('Form submitted:', formData)
            setSubmitted(true)

            // Simulate admin notification
            console.log('Admin notification sent')
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        Application Submitted!
                    </h1>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
                            Application ID: <span className="font-bold text-blue-600 dark:text-blue-400">WA-2024-{Math.floor(Math.random() * 1000)}</span>
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Status: <span className="font-semibold text-orange-600 dark:text-orange-400">Pending Approval</span>
                        </p>
                    </div>

                    <div className="text-left space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300">
                                Your application has been received and is under review by our wholesale team.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300">
                                You&apos;ll receive an email confirmation at <span className="font-semibold">{formData.email}</span>
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300">
                                Our team typically reviews applications within 2-3 business days.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300">
                                Once approved, you&apos;ll receive login credentials to access the wholesale portal.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            Questions about your application?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a
                                href="mailto:wholesale@maxfitit.com"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Contact Us
                            </a>
                            <Link
                                href="/"
                                className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">

            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        Wholesale Account Application
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Join our wholesale program and get access to bulk pricing and exclusive benefits.
                    </p>
                </div>
            </div>

            {/* Benefits Banner */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8" />
                            <div>
                                <p className="font-bold">Bulk Discounts</p>
                                <p className="text-sm text-blue-100">Save up to 25% on large orders</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8" />
                            <div>
                                <p className="font-bold">Quick Order System</p>
                                <p className="text-sm text-blue-100">SKU-based ordering for speed</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8" />
                            <div>
                                <p className="font-bold">Dedicated Support</p>
                                <p className="text-sm text-blue-100">Priority customer service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">

                        {/* Business Information */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Building2 className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Business Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Business Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.businessName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                        placeholder="Acme Repair Shop Inc."
                                    />
                                    {errors.businessName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.businessName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Tax ID / EIN <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.taxId ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                        placeholder="12-3456789"
                                    />
                                    {errors.taxId && (
                                        <p className="text-red-600 text-sm mt-1">{errors.taxId}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Business License Upload <span className="text-red-600">*</span>
                                    </label>
                                    <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${errors.businessLicense ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-neutral-300 dark:border-neutral-600 hover:border-blue-500 dark:hover:border-blue-400'}
                  `}>
                                        <input
                                            type="file"
                                            id="businessLicense"
                                            onChange={handleFileUpload}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                        />
                                        <label htmlFor="businessLicense" className="cursor-pointer">
                                            <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                                            {formData.businessLicense ? (
                                                <div>
                                                    <p className="text-green-600 dark:text-green-400 font-medium mb-1">
                                                        ✓ {formData.businessLicense.name}
                                                    </p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Click to change file
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                                                        Click to upload business license
                                                    </p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        PDF, JPG, or PNG (Max 10MB)
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {errors.businessLicense && (
                                        <p className="text-red-600 text-sm mt-1">{errors.businessLicense}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Owner Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Full Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerFullName"
                                        value={formData.ownerFullName}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.ownerFullName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                        placeholder="John Smith"
                                    />
                                    {errors.ownerFullName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.ownerFullName}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                            placeholder="john@acmerepair.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Phone <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                            placeholder="(555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Address */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Business Address
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Street Address <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.address ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                        placeholder="123 Main Street"
                                    />
                                    {errors.address && (
                                        <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            City <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.city ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                            placeholder="Santa Barbara"
                                        />
                                        {errors.city && (
                                            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            State <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.state ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        >
                                            <option value="">Select State</option>
                                            <option value="CA">California</option>
                                            <option value="TX">Texas</option>
                                            <option value="NY">New York</option>
                                            <option value="FL">Florida</option>
                                            {/* Add more states */}
                                        </select>
                                        {errors.state && (
                                            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            ZIP Code <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.zipCode ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                            placeholder="93105"
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Volume */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Order Volume
                                </h2>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Expected Monthly Volume <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="expectedVolume"
                                    value={formData.expectedVolume}
                                    onChange={handleChange}
                                    className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                    ${errors.expectedVolume ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                  `}
                                >
                                    <option value="">Select expected volume</option>
                                    <option value="10-50">$500 - $2,500 (10-50 units)</option>
                                    <option value="50-100">$2,500 - $5,000 (50-100 units)</option>
                                    <option value="100-500">$5,000 - $25,000 (100-500 units)</option>
                                    <option value="500+">$25,000+ (500+ units)</option>
                                </select>
                                {errors.expectedVolume && (
                                    <p className="text-red-600 text-sm mt-1">{errors.expectedVolume}</p>
                                )}
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                    This helps us determine your discount tier and account settings.
                                </p>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                            <button
                                type="submit"
                                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                            >
                                Submit Application
                            </button>
                            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                                By submitting, you agree to our wholesale terms and conditions.
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
