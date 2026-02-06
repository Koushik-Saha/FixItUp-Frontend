'use client'

import { useState } from 'react'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setMessage(data.message)
                setEmail('')
            } else {
                setStatus('error')
                setMessage(data.message || 'Something went wrong')
            }
        } catch {
            setStatus('error')
            setMessage('Failed to subscribe. Please try again.')
        }
    }

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Get Exclusive Deals
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                        Subscribe and get 10% off your first order
                    </p>

                    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto relative">
                        <div className="relative flex-1">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full px-4 py-3 bg-neutral-800/80 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-neutral-400 disabled:opacity-70 backdrop-blur-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-neutral-100 transition-colors disabled:opacity-70 whitespace-nowrap min-w-[120px] flex items-center justify-center"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                'Subscribe'
                            )}
                        </button>
                    </form>

                    {message && (
                        <p className={`text-sm mt-4 font-medium flex items-center justify-center gap-2 ${status === 'success' ? 'text-white' : 'text-red-200'
                            }`}>
                            {status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
