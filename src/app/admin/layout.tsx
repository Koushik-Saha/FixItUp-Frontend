/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, init } = useAuth()
    const router = useRouter()
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                await init()
            }
            setIsInitialized(true)
        }
        checkAuth()
    }, [])

    useEffect(() => {
        if (isInitialized && !isLoading) {
            if (!user) {
                router.push('/auth/login')
            } else if (user.role !== 'admin') {
                router.push('/unauthorized')
            }
        }
    }, [user, isLoading, isInitialized, router])

    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!user || user.role !== 'admin') {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
