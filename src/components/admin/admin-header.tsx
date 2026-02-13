'use client'

import { useAuth } from '@/hooks/useAuth'
import { Bell, Search } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader() {
    const { user } = useAuth()

    return (
        <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                {/* Search Bar */}
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-neutral-900">{user?.full_name || 'Admin User'}</p>
                        <p className="text-xs text-neutral-500 capitalize">{user?.role || 'Administrator'}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user?.full_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    )
}
