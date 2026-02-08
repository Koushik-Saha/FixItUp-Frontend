'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Wrench,
    Settings,
    LogOut,
    Store
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users
    },
    {
        title: 'Repairs',
        href: '/admin/repairs',
        icon: Wrench
    },
    {
        title: 'Stores',
        href: '/admin/stores',
        icon: Store
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings
    }
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto">
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-blue-500">FixItUp</span> Admin
                </Link>
            </div>

            <div className="flex flex-col h-[calc(100vh-4rem)] justify-between p-4">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                <div className="border-t border-slate-800 pt-4">
                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    )
}
