'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Upload, X } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderNumber: ''
    })
    const [attachment, setAttachment] = useState<File | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const stores = [
        { name: 'Santa Barbara - Main Store', address: '123 State Street', city: 'Santa Barbara, CA 93101', phone: '(805) 555-0100', email: 'sb@maxfitit.com' },
        { name: 'Campbell Store', address: '456 Campbell Ave', city: 'Campbell, CA 95008', phone: '(408) 555-0200', email: 'campbell@maxfitit.com' },
        { name: 'San Francisco Store', address: '789 Market Street', city: 'San Francisco, CA 94103', phone: '(415) 555-0300', email: 'sf@maxfitit.com' }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB')
                return
            }
            setAttachment(file)
        }
    }

    const removeAttachment = () => {
        setAttachment(null)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.firstName.trim()) newErrors.firstName = 'First name required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject required'
        if (!formData.message.trim()) newErrors.message = 'Message required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            console.log('Contact form submitted:', formData, attachment)
            setSubmitted(true)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-lg p-8 text-center border border-neutral-200 dark:border-neutral-700">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Message Sent!</h2>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', orderNumber: '' }); setAttachment(null) }} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Send Another Message</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-blue-100">We're here to help! Get in touch with our team.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-8 max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">First Name *</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`} />
                                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Last Name *</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`} />
                                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`} />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Phone (optional)</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Subject *</label>
                                <select name="subject" value={formData.subject} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white ${errors.subject ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="repair">Repair Question</option>
                                    <option value="order">Order Status</option>
                                    <option value="wholesale">Wholesale Account</option>
                                    <option value="parts">Parts Availability</option>
                                    <option value="complaint">Complaint</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Order Number (if applicable)</label>
                                <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} placeholder="ORD-123456" className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Message *</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white resize-none ${errors.message ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`} placeholder="We&apos;re here to help! Send us a message and we&apos;ll respond as soon as possible." />
                                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Attachment (optional)</label>
                                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center">
                                    {attachment ? (
                                        <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded">
                                            <div className="flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /><span className="text-sm text-neutral-900 dark:text-white">{attachment.name}</span><span className="text-xs text-neutral-500">({(attachment.size / 1024).toFixed(1)} KB)</span></div>
                                            <button type="button" onClick={removeAttachment} className="text-red-600 hover:text-red-700"><X className="h-5 w-5" /></button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                                            <p className="text-neutral-600 dark:text-neutral-400 mb-2">Upload images or documents</p>
                                            <p className="text-xs text-neutral-500 mb-3">JPG, PNG, PDF (max 10MB)</p>
                                            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                                <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                                                Choose File
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2">
                                <Send className="h-6 w-6" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Phone Support</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">(800) 555-REPAIR</p>
                                        <p className="text-sm text-neutral-500">(800) 555-7372</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Email Support</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">support@maxfitit.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Business Hours</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">Mon-Sat: 9:00 AM - 7:00 PM</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">Sunday: 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Store Locations</h3>
                            <div className="space-y-4">
                                {stores.map((store, i) => (
                                    <div key={i} className="pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold text-neutral-900 dark:text-white mb-1">{store.name}</p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">{store.address}</p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">{store.city}</p>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{store.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-3">Need Immediate Help?</h3>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">For urgent repair questions or order issues, call us directly for fastest response.</p>
                            <a href="tel:8005557372" className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold">Call (800) 555-REPAIR</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
