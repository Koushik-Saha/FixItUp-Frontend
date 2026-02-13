'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Schema
const storeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'Zip Code is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    email: z.string().email().optional().or(z.literal('')),
    isActive: z.boolean().default(true),

    // Operating Hours (Simplified for now as string JSON)
    mondayFriday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
})

type StoreFormValues = z.infer<typeof storeSchema>
import { Store, Prisma } from '@prisma/client'

interface StoreFormProps {
    initialData?: Store | null
    onSubmit: (data: Prisma.StoreCreateInput | Prisma.StoreUpdateInput) => Promise<void>
    onCancel: () => void
}

export function StoreForm({ initialData, onSubmit, onCancel }: StoreFormProps) {
    const [loading, setLoading] = useState(false)

    // Parse initial hours
    const hours = (initialData?.operatingHours as Record<string, string>) || {}

    const defaultValues: Partial<StoreFormValues> = {
        name: initialData?.name || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zipCode || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        isActive: initialData?.isActive ?? true,
        mondayFriday: hours['Mon-Fri'] || '9AM-7PM',
        saturday: hours['Sat'] || '10AM-6PM',
        sunday: hours['Sun'] || 'Closed',
    }

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues
    })

    const handleSubmit = async (data: StoreFormValues) => {
        try {
            setLoading(true)

            // Transform back to API structure
            const apiData = {
                ...data,
                operatingHours: {
                    "Mon-Fri": data.mondayFriday,
                    "Sat": data.saturday,
                    "Sun": data.sunday
                }
            }

            await onSubmit(apiData)
            toast.success(initialData ? 'Store updated' : 'Store created')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Max Phone Repair - Downtown" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="store@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(555) 123-4567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-2">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="NY" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="border p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <h3 className="font-semibold mb-4">Operating Hours</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="mondayFriday"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mon-Fri</FormLabel>
                                    <FormControl>
                                        <Input placeholder="9AM - 7PM" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="saturday"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Saturday</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10AM - 6PM" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sunday"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sunday</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Closed" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Active Status</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Update Store' : 'Create Store'}
                    </Button>
                </div>

            </form>
        </Form>
    )
}
