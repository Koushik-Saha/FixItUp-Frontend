"use client";

import { useEffect, useState } from "react";
import {
    User,
    MapPin,
    Package,
    Wrench,
    Shield,
    Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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

type Order = {
    id: string;
    date: string;
    items: number;
    total: number;
    status: string;
};

type Repair = {
    id: string;
    date: string;
    device: string;
    issue: string;
    status: string;
    store: string;
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

const INITIAL_ORDERS: Order[] = [
    {
        id: "ORD-123456",
        date: "2024-12-05",
        items: 2,
        total: 139.98,
        status: "Delivered",
    },
    {
        id: "ORD-789012",
        date: "2024-11-28",
        items: 1,
        total: 89.99,
        status: "Shipped",
    },
    {
        id: "ORD-345678",
        date: "2024-11-15",
        items: 3,
        total: 249.97,
        status: "Delivered",
    },
];

const INITIAL_REPAIRS: Repair[] = [
    {
        id: "RT-123456",
        date: "2024-12-01",
        device: "iPhone 15 Pro Max",
        issue: "Screen Repair",
        status: "Completed",
        store: "Santa Barbara",
    },
    {
        id: "RT-789012",
        date: "2024-11-20",
        device: "Samsung S24 Ultra",
        issue: "Battery Replacement",
        status: "In Progress",
        store: "Campbell",
    },
];

export default function CustomerDashboard() {
    const router = useRouter();
    const { user, isLoading, init, applyWholesale, logout } = useAuth();

    // ✅ all hooks at the top
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [addresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [orders] = useState<Order[]>(INITIAL_ORDERS);
    const [repairs] = useState<Repair[]>(INITIAL_REPAIRS);

    useEffect(() => {
        // Only hit Supabase if we DON'T already have a user in the store
        if (!user) {
            init();
        }
    }, [user, init]);

    console.log("user", user)

    // useEffect(() => {
    //     if (!isLoading && !user) {
    //         // router.push("/auth/login");
    //     }
    // }, [isLoading, user, router]);

    // ✅ safe early return; hooks above have already run
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <p className="text-lg text-neutral-200">Loading dashboard...</p>
            </div>
        );
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
                    <button
                        onClick={() =>
                            logout().then(() => router.push("/auth/login"))
                        }
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
                    {/* Sidebar tabs */}
                    <aside className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Signed in as</p>
                                <p className="font-medium text-sm">{user.email}</p>
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
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            isActive
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
                                        <p className="mt-1 text-sm">{user.role}</p>
                                    </div>
                                </div>

                                {user.role === "wholesale" && (
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800 mt-2">
                                        <div>
                                            <p className="text-xs uppercase text-neutral-500">
                                                Wholesale Status
                                            </p>
                                            <p className="mt-1 text-sm">
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
                                            <p className="text-sm">
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

                                <div className="overflow-x-auto">
                                    <button
                                        onClick={() => router.push('/orders')}
                                        className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm"
                                    >
                                        View all orders
                                    </button>
                                </div>
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

                                <div className="grid md:grid-cols-2 gap-4">
                                    {repairs.map((repair) => (
                                        <div
                                            key={repair.id}
                                            className="border border-neutral-800 rounded-xl p-4 space-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-sm">
                                                    {repair.id}
                                                </h3>
                                                <span className="text-xs text-neutral-400">
                          {repair.date}
                        </span>
                                            </div>
                                            <p className="text-xs uppercase text-neutral-500">
                                                {repair.status}
                                            </p>
                                            <p className="text-sm mt-2">
                        <span className="text-neutral-400">
                          Device:
                        </span>{" "}
                                                {repair.device}
                                            </p>
                                            <p className="text-sm">
                        <span className="text-neutral-400">
                          Issue:
                        </span>{" "}
                                                {repair.issue}
                                            </p>
                                            <p className="text-sm">
                        <span className="text-neutral-400">
                          Store:
                        </span>{" "}
                                                {repair.store}
                                            </p>
                                        </div>
                                    ))}
                                </div>
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
                                                <p className="mt-1 text-sm">
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
                                        <button className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium">
                                            Go to Wholesale Portal
                                        </button>
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
                                        <button
                                            onClick={applyWholesale}
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
                                        >
                                            Apply Now
                                        </button>
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
