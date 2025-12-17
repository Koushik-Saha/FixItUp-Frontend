// src/components/homepage/newsletter.tsx
'use client'
import { useState } from 'react'

export function Newsletter() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Add your newsletter API call here
        alert('Subscribed: ' + email)
        setEmail('')
    }

    return (
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            NEWSLETTER
          </span>
                    <h2 className="text-2xl font-bold text-white">Get Exclusive Deals</h2>
                </div>
                <p className="text-white/90 mb-6 text-center">
                    Subscribe to our newsletter and get exclusive deals you won't find anywhere else!
                </p>
                <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}
