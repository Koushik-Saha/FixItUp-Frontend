'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User, Mail, Phone, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'

// Sample data
const BRANDS = ['Apple', 'Samsung', 'Google', 'Motorola', 'LG', 'OnePlus']

const ISSUES = [
    'Cracked/Broken Screen',
    'Battery Issues',
    'Charging Port',
    'Camera Problems',
    'Back Glass Broken',
    'Speaker/Audio Issues',
    'Water Damage',
    'Other Issue'
]

const STORES = [
    {
        id: 1,
        name: 'Santa Barbara Store',
        address: '110 S Hope Ave Suite H 123',
        city: 'Santa Barbara, CA 93105',
        phone: '(805) 555-0123'
    },
    {
        id: 2,
        name: 'Campbell Store',
        address: '1875 South Bascom Ave Suite 240',
        city: 'Campbell, CA 95008',
        phone: '(408) 555-0456'
    },
    {
        id: 3,
        name: 'San Francisco Store',
        address: '2145 Market Street',
        city: 'San Francisco, CA 94114',
        phone: '(415) 555-0789'
    }
]

// Generate time slots
const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
        for (let min of [0, 30]) {
            if (hour === 17 && min === 30) break // Stop at 5:00 PM
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
            const period = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour > 12 ? hour - 12 : hour
            slots.push({
                value: time,
                label: `${displayHour}:${min.toString().padStart(2, '0')} ${period}`
            })
        }
    }
    return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function BookRepairPage() {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        issue: '',
        storeId: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: ''
    })

    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [ticketNumber, setTicketNumber] = useState('')

    // Pre-fill from URL params if coming from price checker
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const brand = params.get('brand')
        const model = params.get('model')
        const issue = params.get('issue')

        if (brand || model || issue) {
            setFormData(prev => ({
                ...prev,
                ...(brand && { brand }),
                ...(model && { model }),
                ...(issue && { issue: issue.replace(/-/g, ' ') })
            }))
        }
    }, [])

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.brand) newErrors.brand = 'Please select a brand'
        if (!formData.model.trim()) newErrors.model = 'Please enter your device model'
        if (!formData.issue) newErrors.issue = 'Please select an issue'
        if (!formData.storeId) newErrors.storeId = 'Please select a store location'
        if (!formData.date) newErrors.date = 'Please select a date'
        if (!formData.time) newErrors.time = 'Please select a time'
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            // Generate ticket number
            const ticket = `RT-${Date.now().toString().slice(-6)}`
            setTicketNumber(ticket)

            // Here you would send to API
            console.log('Booking submitted:', formData)

            // Send confirmation email (simulated)
            console.log('Confirmation email sent to:', formData.email)

            setSubmitted(true)
        }
    }

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    // Get maximum date (30 days from now)
    const getMaxDate = () => {
        const maxDate = new Date()
        maxDate.setDate(maxDate.getDate() + 30)
        return maxDate.toISOString().split('T')[0]
    }

    const selectedStore = STORES.find(s => s.id === parseInt(formData.storeId))

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>

                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                            Repair Booked Successfully!
                        </h1>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Your Repair Ticket Number</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                {ticketNumber}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Keep this number for your records
                            </p>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Appointment Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Device:</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formData.brand} {formData.model}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Issue:</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">{formData.issue}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">{selectedStore?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Date & Time:</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">
                  {new Date(formData.date).toLocaleDateString()} at {TIME_SLOTS.find(t => t.value === formData.time)?.label}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Customer:</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formData.firstName} {formData.lastName}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-neutral-900 dark:text-white mb-1">Confirmation Email Sent</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Check {formData.email} for your appointment details and directions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-neutral-900 dark:text-white mb-1">Bring Your Device</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Please arrive 5 minutes early and bring your device with any accessories
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-neutral-900 dark:text-white mb-1">Backup Your Data</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    We recommend backing up your device before the repair
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Store Info */}
                    {selectedStore && (
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mb-6">
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-3">Store Information</h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-neutral-700 dark:text-neutral-300">{selectedStore.address}</p>
                                <p className="text-neutral-700 dark:text-neutral-300">{selectedStore.city}</p>
                                <p className="text-neutral-700 dark:text-neutral-300">Phone: {selectedStore.phone}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium"
                        >
                            Print Details
                        </button>
                        <a
                            href="/"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                        >
                            Back to Home
                        </a>
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
                        Book a Repair
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Schedule your device repair appointment in just a few minutes
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">

                        {/* Device Information */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Smartphone className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Device Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Device Brand <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.brand ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        >
                                            <option value="">Select Brand</option>
                                            {BRANDS.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                        {errors.brand && (
                                            <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Device Model <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            placeholder="e.g., iPhone 15 Pro Max"
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.model ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        />
                                        {errors.model && (
                                            <p className="text-red-600 text-sm mt-1">{errors.model}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        What's the Issue? <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="issue"
                                        value={formData.issue}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.issue ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                    >
                                        <option value="">Select Issue</option>
                                        {ISSUES.map(issue => (
                                            <option key={issue} value={issue}>{issue}</option>
                                        ))}
                                    </select>
                                    {errors.issue && (
                                        <p className="text-red-600 text-sm mt-1">{errors.issue}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Store Location */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Select Store Location
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {STORES.map(store => (
                                    <label
                                        key={store.id}
                                        className={`
                      block p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.storeId === store.id.toString()
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-400'
                                        }
                    `}
                                    >
                                        <input
                                            type="radio"
                                            name="storeId"
                                            value={store.id}
                                            checked={formData.storeId === store.id.toString()}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className="font-bold text-neutral-900 dark:text-white mb-1">{store.name}</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{store.address}</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{store.city}</p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{store.phone}</p>
                                            </div>
                                            {formData.storeId === store.id.toString() && (
                                                <CheckCircle className="h-6 w-6 text-blue-600" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.storeId && (
                                <p className="text-red-600 text-sm mt-2">{errors.storeId}</p>
                            )}
                        </div>

                        {/* Date & Time */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Calendar className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Choose Date & Time
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Appointment Date <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={getMinDate()}
                                        max={getMaxDate()}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.date ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                    />
                                    {errors.date && (
                                        <p className="text-red-600 text-sm mt-1">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Appointment Time <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`
                      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                      ${errors.time ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                    `}
                                    >
                                        <option value="">Select Time</option>
                                        {TIME_SLOTS.map(slot => (
                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                        ))}
                                    </select>
                                    {errors.time && (
                                        <p className="text-red-600 text-sm mt-1">{errors.time}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Your Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            First Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Last Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Smith"
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
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
                                            placeholder="john@example.com"
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
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
                                            placeholder="(555) 123-4567"
                                            className={`
                        w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                        ${errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}
                      `}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Any additional details about the issue or special instructions..."
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                            <button
                                type="submit"
                                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                            >
                                Book Repair Appointment
                            </button>
                            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                                You'll receive a confirmation email with your repair ticket number
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
