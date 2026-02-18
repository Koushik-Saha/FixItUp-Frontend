'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Address, getAddresses, addAddress, deleteAddress, updateAddress } from '@/lib/api/addresses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Plus, MapPin, Trash2, Pencil } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const addressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    street1: z.string().min(1, "Address is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().default("US"),
    phone: z.string().optional(),
    isDefault: z.boolean().default(false),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function AddressManager() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const fetchAddresses = async () => {
        try {
            const data = await getAddresses()
            setAddresses(data)
        } catch (error) {
            toast.error("Failed to load addresses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return
        try {
            await deleteAddress(id)
            setAddresses(prev => prev.filter(a => a.id !== id))
            toast.success("Address deleted")
        } catch (error) {
            toast.error("Failed to delete address")
        }
    }

    return (
        <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Addresses</h2>
                    <p className="text-sm text-neutral-400">Manage your shipping locations.</p>
                </div>
                <Button onClick={() => { setEditingAddress(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Address
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                    <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p>No addresses saved yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <Card key={addr.id} className="bg-neutral-950/50 border-neutral-800">
                            <CardContent className="p-4 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-sm">{addr.fullName}</p>
                                        {addr.isDefault && (
                                            <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400"
                                            onClick={() => { setEditingAddress(addr); setIsDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400"
                                            onClick={() => handleDelete(addr.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-400 space-y-0.5">
                                    <p>{addr.street1}</p>
                                    {addr.street2 && <p>{addr.street2}</p>}
                                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p>{addr.country}</p>
                                    {addr.phone && <p className="pt-2 text-xs">{addr.phone}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AddressDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingAddress}
                onSuccess={() => {
                    setIsDialogOpen(false)
                    fetchAddresses()
                }} // Better to append/update locally but refetch is safer for defaults
            />
        </section>
    )
}

function AddressDialog({ open, onOpenChange, initialData, onSuccess }: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    initialData: Address | null,
    onSuccess: () => void
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
            phone: '',
            isDefault: false
        }
    })

    // Reset form when dialog opens/closes or data changes
    useEffect(() => {
        if (open) {
            form.reset(initialData ? {
                fullName: initialData.fullName,
                street1: initialData.street1,
                street2: initialData.street2 || '',
                city: initialData.city,
                state: initialData.state,
                zipCode: initialData.zipCode,
                country: initialData.country,
                phone: initialData.phone || '',
                isDefault: initialData.isDefault
            } : {
                fullName: '',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US',
                phone: '',
                isDefault: false
            })
        }
    }, [open, initialData, form])

    const onSubmit = async (data: AddressFormValues) => {
        setIsSubmitting(true)
        try {
            const payload = { ...data, type: 'SHIPPING' as const }
            if (initialData) {
                await updateAddress(initialData.id, payload)
                toast.success("Address updated")
            } else {
                await addAddress(payload)
                toast.success("Address added")
            }
            onSuccess()
        } catch (error: any) {
            toast.error(error.message || "Failed to save address")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input {...form.register('fullName')} placeholder="John Doe" />
                        {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input {...form.register('street1')} placeholder="123 Main St" />
                        {form.formState.errors.street1 && <p className="text-xs text-red-500">{form.formState.errors.street1.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Address Line 2 (Optional)</Label>
                        <Input {...form.register('street2')} placeholder="Apt 4B" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input {...form.register('city')} placeholder="New York" />
                            {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Input {...form.register('state')} placeholder="NY" />
                            {form.formState.errors.state && <p className="text-xs text-red-500">{form.formState.errors.state.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Zip Code</Label>
                            <Input {...form.register('zipCode')} placeholder="10001" />
                            {form.formState.errors.zipCode && <p className="text-xs text-red-500">{form.formState.errors.zipCode.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input {...form.register('country')} placeholder="US" disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Phone (Optional)</Label>
                        <Input {...form.register('phone')} placeholder="+1 234 567 8900" />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="isDefault"
                            checked={form.watch('isDefault')}
                            onCheckedChange={(checked) => form.setValue('isDefault', checked as boolean)}
                        />
                        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                            Set as default shipping address
                        </Label>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? 'Update' : 'Add Address'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
