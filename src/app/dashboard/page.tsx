'use client'

import {useEffect, useState} from 'react'
import { User, MapPin, Package, Wrench, Shield, Edit, Key, Download, Eye } from 'lucide-react'
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'repairs', label: 'Repair Tickets', icon: Wrench },
    { id: 'wholesale', label: 'Wholesale Status', icon: Shield }
]

export default function CustomerDashboard() {
    const router = useRouter();
    const { user, isLoading, init, applyWholesale, logout } = useAuth();

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500 text-sm">Loading dashboard...</div>
            </div>
        );
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({ firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '(555) 123-4567' })
    const [addresses, setAddresses] = useState([
        { id: 1, label: 'Home', address: '123 Main St', city: 'Santa Barbara', state: 'CA', zip: '93105', isDefault: true },
        { id: 2, label: 'Work', address: '456 Office Blvd', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: false }
    ])
    const orders = [
        { id: 'ORD-123456', date: '2024-12-05', items: 2, total: 139.98, status: 'Delivered' },
        { id: 'ORD-789012', date: '2024-11-28', items: 1, total: 89.99, status: 'Shipped' },
        { id: 'ORD-345678', date: '2024-11-15', items: 3, total: 249.97, status: 'Delivered' }
    ]
    const repairs = [
        { id: 'RT-123456', date: '2024-12-01', device: 'iPhone 15 Pro Max', issue: 'Screen Repair', status: 'Completed', store: 'Santa Barbara' },
        { id: 'RT-789012', date: '2024-11-20', device: 'Samsung S24 Ultra', issue: 'Battery Replacement', status: 'In Progress', store: 'Campbell' }
    ]
    const wholesale = { status: 'Approved', accountNumber: 'WS-12345', tier: 'Gold', discount: '25%', since: 'January 2024' }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">My Account</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">Welcome back, {profile.firstName}!</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[250px_1fr] gap-8">
                    <nav className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 h-fit">
                        {TABS.map(tab => {
                            const Icon = tab.icon
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>

                    <div>
                        {activeTab === 'profile' && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile Information</h2>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Edit className="h-4 w-4" />Edit</button>
                                </div>
                                <div className="space-y-4">
                                    <div><label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">First Name</label><p className="text-neutral-900 dark:text-white">{profile.firstName}</p></div>
                                    <div><label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Last Name</label><p className="text-neutral-900 dark:text-white">{profile.lastName}</p></div>
                                    <div><label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email</label><p className="text-neutral-900 dark:text-white">{profile.email}</p></div>
                                    <div><label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone</label><p className="text-neutral-900 dark:text-white">{profile.phone}</p></div>
                                </div>
                                <button className="mt-6 px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"><Key className="h-4 w-4" />Reset Password</button>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2"><h3 className="font-bold text-neutral-900 dark:text-white">{addr.label}</h3>{addr.isDefault && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Default</span>}</div>
                                                <p className="text-neutral-700 dark:text-neutral-300">{addr.address}</p>
                                                <p className="text-neutral-700 dark:text-neutral-300">{addr.city}, {addr.state} {addr.zip}</p>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-700"><Edit className="h-5 w-5" /></button>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full px-6 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">+ Add New Address</button>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700"><h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Order History</h2></div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-neutral-50 dark:bg-neutral-900">
                                        <tr><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Order</th><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Date</th><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Items</th><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Total</th><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Status</th><th className="text-left py-3 px-6 text-neutral-600 dark:text-neutral-400">Actions</th></tr>
                                        </thead>
                                        <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} className="border-b border-neutral-200 dark:border-neutral-700">
                                                <td className="py-4 px-6 font-semibold text-neutral-900 dark:text-white">{order.id}</td>
                                                <td className="py-4 px-6 text-neutral-700 dark:text-neutral-300">{order.date}</td>
                                                <td className="py-4 px-6 text-neutral-700 dark:text-neutral-300">{order.items}</td>
                                                <td className="py-4 px-6 font-bold text-neutral-900 dark:text-white">${order.total.toFixed(2)}</td>
                                                <td className="py-4 px-6"><span className={`px-3 py-1 rounded text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{order.status}</span></td>
                                                <td className="py-4 px-6"><div className="flex gap-2"><button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Eye className="h-4 w-4" /></button><button className="p-2 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded"><Download className="h-4 w-4" /></button></div></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'repairs' && (
                            <div className="space-y-4">
                                {repairs.map(repair => (
                                    <div key={repair.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-start justify-between mb-4">
                                            <div><h3 className="font-bold text-neutral-900 dark:text-white mb-1">{repair.id}</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">{repair.date}</p></div>
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${repair.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>{repair.status}</span>
                                        </div>
                                        <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Device:</span><span className="font-semibold text-neutral-900 dark:text-white">{repair.device}</span></div><div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Issue:</span><span className="font-semibold text-neutral-900 dark:text-white">{repair.issue}</span></div><div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">Store:</span><span className="font-semibold text-neutral-900 dark:text-white">{repair.store}</span></div></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'wholesale' && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Wholesale Status</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg"><h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Status</h3><p className="text-2xl font-bold text-green-600 dark:text-green-400">{wholesale.status}</p></div>
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Account Number</h3><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wholesale.accountNumber}</p></div>
                                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Tier</h3><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wholesale.tier}</p></div>
                                    <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg"><h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Discount</h3><p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{wholesale.discount}</p></div>
                                </div>
                                <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">Member since: {wholesale.since}</p>
                                <a href="/wholesale" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Go to Wholesale Portal</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
