'use client'

import { useState } from 'react'
import { Send, CheckCircle, Upload, X } from 'lucide-react'

export default function ContactForm() {
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
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 text-center border border-neutral-200 dark:border-neutral-700">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Message Sent!</h2>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', orderNumber: '' }); setAttachment(null) }} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Send Another Message</button>
            </div>
        )
    }

    return (
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
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white resize-none ${errors.message ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`} placeholder="We're here to help! Send us a message and we'll respond as soon as possible." />
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
    )
}
