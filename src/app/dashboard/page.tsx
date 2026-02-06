"use client";

import { useEffect, useState } from "react";
import {
    User,
    MapPin,
    Package,
    Wrench,
    Shield,
    Eye,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { getOrders, Order } from "@/lib/api/orders";
import { getRepairs, Repair } from "@/lib/api/repairs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Order History", icon: Package },
    { id: "repairs", label: "Repair Tickets", icon: Wrench },
    { id: "wholesale", label: "Wholesale Status", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Address = {
    id: number;
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
};

const INITIAL_ADDRESSES: Address[] = [
    {
        id: 1,
        label: "Home",
        address: "123 Main St",
        city: "Santa Barbara",
        state: "CA",
        zip: "93105",
        isDefault: true,
    },
    {
        id: 2,
        label: "Work",
        address: "456 Office Blvd",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        isDefault: false,
    },
];

export default function CustomerDashboard() {
    const router = useRouter();
    const { user, isLoading: authLoading, init, applyWholesale, logout } = useAuth();

    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [addresses] = useState<Address[]>(INITIAL_ADDRESSES);

    // Data states
    const [orders, setOrders] = useState<Order[]>([]);
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Init auth if needed
        if (!user) {
            init();
        }
    }, [user, init]);

    // Fetch dashboard data when user is available
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                setDataLoading(true);
                setError(null);

                const [ordersData, repairsData] = await Promise.all([
                    getOrders({ limit: 5 }).catch(err => {
                        console.error("Failed to fetch orders:", err);
                        return { data: [] }; // Fallback to empty array
                    }),
                    getRepairs().catch(err => {
                        console.error("Failed to fetch repairs:", err);
                        return { repairs: [] }; // Fallback
                    })
                ]);

                setOrders(ordersData.data || []);
                setRepairs(repairsData.repairs || []);
            } catch (err) {
                console.error("Error loading dashboard data:", err);
                setError("Failed to load some dashboard information");
            } finally {
                setDataLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (authLoading || (!user && dataLoading)) {
        return <DashboardSkeleton />
    }

    if (!user) {
        // Redirection should happen in useAuth or via middleware, but as safety:
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <div className="text-center">
                    <p className="text-lg text-neutral-200">Please log in to view your dashboard.</p>
                    <Link href="/auth/login" className="mt-4 inline-block text-blue-500 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    const fullName = user.full_name || "Customer";

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
                <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            My Account
                        </h1>
                        <p className="mt-2 text-neutral-400">
                            Welcome back, {fullName}!
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            logout().then(() => router.push("/auth/login"))
                        }
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Logout
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
                    {/* Sidebar tabs */}
                    <aside className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm text-neutral-400">Signed in as</p>
                                <p className="font-medium text-sm truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-neutral-300 hover:bg-neutral-800"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main panel */}
                    <main className="space-y-8">
                        {error && (
                            <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle className="h-5 w-5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Profile Information
                                        </h2>
                                        <p className="text-sm text-neutral-400">
                                            Manage your personal details and account settings.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-2">
                                    <div>
                                        <p className="text-xs uppercase text-neutral-500">
                                            Full Name
                                        </p>
                                        <p className="mt-1 text-sm">{fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-neutral-500">
                                            Email
                                        </p>
                                        <p className="mt-1 text-sm">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-neutral-500">
                                            Phone
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {user.phone || "Not provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-neutral-500">
                                            Role
                                        </p>
                                        <p className="mt-1 text-sm capitalize">{user.role}</p>
                                    </div>
                                </div>

                                {user.role === "wholesale" && (
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800 mt-2">
                                        <div>
                                            <p className="text-xs uppercase text-neutral-500">
                                                Wholesale Status
                                            </p>
                                            <p className="mt-1 text-sm capitalize">
                                                {user.wholesale_status}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-neutral-500">
                                                Wholesale Tier
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {user.wholesale_tier ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* ADDRESSES TAB */}
                        {activeTab === "addresses" && (
                            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">Addresses</h2>
                                        <p className="text-sm text-neutral-400">
                                            Manage your saved shipping locations.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className="border border-neutral-800 rounded-xl p-4 space-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-sm">
                                                    {addr.label}
                                                </h3>
                                                {addr.isDefault && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-neutral-300">
                                                {addr.address}
                                                <br />
                                                {addr.city}, {addr.state} {addr.zip}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === "orders" && (
                            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">Order History</h2>
                                        <p className="text-sm text-neutral-400">
                                            Track your previous purchases.
                                        </p>
                                    </div>
                                </div>

                                {dataLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p>No orders found.</p>
                                        <Link href="/shop" className="text-blue-500 hover:underline mt-2 inline-block">
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-neutral-800 rounded-xl p-4">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                                    <div>
                                                        <span className="text-sm font-medium text-white">#{order.order_number}</span>
                                                        <span className="text-xs text-neutral-500 ml-2">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                                                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                'bg-neutral-700 text-neutral-300'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                        <span className="font-semibold text-white">
                                                            ${Number(order.total_amount).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Link href={`/orders/${order.id}`} className="text-sm text-blue-400 hover:underline">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 text-center">
                                            <Button
                                                onClick={() => router.push('/orders')}
                                                variant="secondary"
                                                className="bg-neutral-800 hover:bg-neutral-700 text-white"
                                            >
                                                View all orders
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* REPAIRS TAB */}
                        {activeTab === "repairs" && (
                            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Repair Tickets
                                        </h2>
                                        <p className="text-sm text-neutral-400">
                                            View the status of your repair orders.
                                        </p>
                                    </div>
                                </div>

                                {dataLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                                    </div>
                                ) : repairs.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Wrench className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p>No repair tickets found.</p>
                                        <Link href="/book-repair" className="text-blue-500 hover:underline mt-2 inline-block">
                                            Book a Repair
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {repairs.map((repair) => (
                                            <div
                                                key={repair.id}
                                                className="border border-neutral-800 rounded-xl p-4 space-y-1"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-sm">
                                                        {repair.id} // Probably ticket number
                                                    </h3>
                                                    <span className="text-xs text-neutral-400">
                                                        {new Date(repair.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className={`text-xs uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${repair.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                                                    repair.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                                                        'bg-neutral-700 text-neutral-300'
                                                    }`}>
                                                    {repair.status}
                                                </span>
                                                <p className="text-sm mt-3">
                                                    <span className="text-neutral-400">Device:</span>{" "}
                                                    {repair.device}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-neutral-400">Issue:</span>{" "}
                                                    {repair.issue}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="text-neutral-400">Store:</span>{" "}
                                                    {repair.store}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* WHOLESALE TAB */}
                        {activeTab === "wholesale" && (
                            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Wholesale Status</h2>

                                {user.role === "wholesale" &&
                                    user.wholesale_status === "approved" ? (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs uppercase text-neutral-500">
                                                    Status
                                                </p>
                                                <p className="mt-1 text-sm capitalize">
                                                    {user.wholesale_status}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-neutral-500">
                                                    Tier
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {user.wholesale_tier ?? "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                            Go to Wholesale Portal
                                        </Button>
                                    </>
                                ) : user.wholesale_status === "pending" ? (
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            Application Pending
                                        </h3>
                                        <p className="text-sm text-neutral-400">
                                            Your wholesale application is being reviewed. We
                                            will notify you once it's processed.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-neutral-300">
                                            Get access to wholesale pricing and exclusive
                                            products for your business.
                                        </p>
                                        <Button
                                            onClick={applyWholesale}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                )}
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
