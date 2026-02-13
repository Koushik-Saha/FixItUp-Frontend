"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Address {
    id: string;
    fullName: string;
    company?: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    type: "SHIPPING" | "BILLING";
    isDefault: boolean;
}

const addressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    company: z.string().optional(),
    street1: z.string().min(1, "Street address is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().default("US"),
    phone: z.string().optional(),
    type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
    isDefault: z.boolean().default(false),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: "",
            street1: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US",
            type: "SHIPPING",
            isDefault: false,
        },
    });

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: AddressForm) => {
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to add address");

            toast.success("Address added successfully");
            setIsDialogOpen(false);
            form.reset();
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to add address");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete address");

            toast.success("Address deleted");
            setAddresses(addresses.filter((addr) => addr.id !== id));
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const MakeDefault = async (address: Address) => {
        try {
            const res = await fetch(`/api/user/addresses/${address.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDefault: true, type: address.type }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Default address updated");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to update default address");
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Addresses</h2>
                    <p className="text-slate-500 dark:text-neutral-400">
                        Manage your shipping and billing addresses.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input {...form.register("fullName")} placeholder="John Doe" />
                                    {form.formState.errors.fullName && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.fullName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Address Type</Label>
                                    <Select
                                        onValueChange={(val) => form.setValue("type", val as "SHIPPING" | "BILLING")}
                                        defaultValue={form.getValues("type")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SHIPPING">Shipping</SelectItem>
                                            <SelectItem value="BILLING">Billing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="street1">Address Line 1</Label>
                                <Input {...form.register("street1")} placeholder="123 Main St" />
                                {form.formState.errors.street1 && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.street1.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="street2">Address Line 2 (Optional)</Label>
                                <Input {...form.register("street2")} placeholder="Apt 4B" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input {...form.register("city")} placeholder="New York" />
                                    {form.formState.errors.city && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input {...form.register("state")} placeholder="NY" />
                                    {form.formState.errors.state && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.state.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">Zip Code</Label>
                                    <Input {...form.register("zipCode")} placeholder="10001" />
                                    {form.formState.errors.zipCode && (
                                        <p className="text-red-500 text-xs">{form.formState.errors.zipCode.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input {...form.register("phone")} placeholder="(555) 123-4567" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    {...form.register("isDefault")}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="isDefault"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Set as default address
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Address"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-neutral-400">
                                    <MapPin className="h-4 w-4" />
                                    {address.type}
                                </span>
                                {address.isDefault && (
                                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        Default
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold">{address.fullName}</h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-300">
                                {address.street1}
                                {address.street2 && <><br />{address.street2}</>}
                                <br />
                                {address.city}, {address.state} {address.zipCode}
                                <br />
                                {address.country}
                            </p>
                            {address.phone && (
                                <p className="text-xs text-slate-500 mt-2">{address.phone}</p>
                            )}
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4 dark:border-neutral-800">
                            {!address.isDefault && (
                                <Button variant="ghost" size="sm" onClick={() => MakeDefault(address)}>
                                    Set Default
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                onClick={() => handleDelete(address.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
