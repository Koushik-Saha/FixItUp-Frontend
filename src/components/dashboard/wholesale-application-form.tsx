'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const applicationSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessType: z.string().min(1, "Business type is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    website: z.string().optional(),
    businessPhone: z.string().min(1, "Business phone is required"),
    businessEmail: z.string().email("Invalid email"),
    businessAddress: z.object({
        street1: z.string().min(1, "Street address is required"),
        street2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        country: z.string().default("US"),
    }),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

export function WholesaleApplicationForm() {
    const { init } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [existingApplication, setExistingApplication] = useState<any>(null)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            businessName: '',
            businessType: '',
            taxId: '',
            website: '',
            businessPhone: '',
            businessEmail: '',
            businessAddress: {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US',
            }
        }
    })

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await fetch('/api/wholesale/apply')
                if (res.ok) {
                    const data = await res.json()
                    if (data) setExistingApplication(data)
                }
            } catch (error) {
                console.error("Failed to fetch application", error)
            } finally {
                setCheckingStatus(false)
            }
        }
        fetchApplication()
    }, [])

    const onSubmit = async (data: ApplicationFormValues) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/wholesale/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || "Failed to submit application")
            }

            toast.success("Application submitted successfully!")
            setExistingApplication(result)
            await init() // Refresh user to update status maybe?
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (checkingStatus) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        )
    }

    if (existingApplication) {
        const statusColors = {
            PENDING: "text-yellow-500 bg-yellow-500/10",
            APPROVED: "text-green-500 bg-green-500/10",
            REJECTED: "text-red-500 bg-red-500/10",
        }

        const statusIcons = {
            PENDING: Clock,
            APPROVED: CheckCircle,
            REJECTED: XCircle,
        }

        const StatusIcon = statusIcons[existingApplication.status as keyof typeof statusIcons] || Clock

        return (
            <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${statusColors[existingApplication.status as keyof typeof statusColors]}`}>
                    <StatusIcon className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Application {existingApplication.status}</h2>
                <p className="text-neutral-400 mb-6">
                    {existingApplication.status === 'PENDING' && "We have received your application and it is currently under review. You will be notified via email once a decision has been made."}
                    {existingApplication.status === 'APPROVED' && "Congratulations! Your wholesale account has been approved. You now have access to wholesale pricing."}
                    {existingApplication.status === 'REJECTED' && "Your application was not approved at this time. Please contact support for more information."}
                </p>

                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-left">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Application Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-neutral-500 block text-xs">Business Name</span>
                            {existingApplication.businessName}
                        </div>
                        <div>
                            <span className="text-neutral-500 block text-xs">Tax ID</span>
                            {existingApplication.taxId}
                        </div>
                        <div>
                            <span className="text-neutral-500 block text-xs">Submitted On</span>
                            {new Date(existingApplication.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="text-neutral-500 block text-xs">Reference ID</span>
                            <span className="font-mono text-xs">{existingApplication.id.slice(0, 8)}</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-6">
            <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl mb-6">
                <h3 className="text-blue-400 font-medium mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Become a Wholesale Partner
                </h3>
                <p className="text-sm text-blue-200/70">
                    Apply for a wholesale account to get access to exclusive bulk pricing, tax exemption, and priority support.
                </p>
            </div>

            <Card className="bg-neutral-900/60 border-neutral-800">
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Enter details about your repair shop or business.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Business Name</Label>
                                <Input {...form.register('businessName')} placeholder="Max Repairs LLC" />
                                {form.formState.errors.businessName && <p className="text-xs text-red-500">{form.formState.errors.businessName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Business Type</Label>
                                <Select onValueChange={(val) => form.setValue('businessType', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="repair_shop">Repair Shop</SelectItem>
                                        <SelectItem value="retailer">Retailer</SelectItem>
                                        <SelectItem value="distributor">Distributor</SelectItem>
                                        <SelectItem value="corporate">Corporate</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.businessType && <p className="text-xs text-red-500">{form.formState.errors.businessType.message}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tax ID / EIN</Label>
                                <Input {...form.register('taxId')} placeholder="XX-XXXXXXX" />
                                {form.formState.errors.taxId && <p className="text-xs text-red-500">{form.formState.errors.taxId.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Website (Optional)</Label>
                                <Input {...form.register('website')} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Business Email</Label>
                                <Input {...form.register('businessEmail')} type="email" placeholder="purchasing@company.com" />
                                {form.formState.errors.businessEmail && <p className="text-xs text-red-500">{form.formState.errors.businessEmail.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Business Phone</Label>
                                <Input {...form.register('businessPhone')} placeholder="+1 (555) 000-0000" />
                                {form.formState.errors.businessPhone && <p className="text-xs text-red-500">{form.formState.errors.businessPhone.message}</p>}
                            </div>
                        </div>

                        <div className="border-t border-neutral-800 pt-4">
                            <h4 className="font-medium mb-4">Business Location</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Street Address</Label>
                                    <Input {...form.register('businessAddress.street1')} placeholder="123 Commerce St" />
                                    {form.formState.errors.businessAddress?.street1 && <p className="text-xs text-red-500">{form.formState.errors.businessAddress.street1.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Street Address 2</Label>
                                    <Input {...form.register('businessAddress.street2')} placeholder="Suite 100" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input {...form.register('businessAddress.city')} placeholder="New York" />
                                        {form.formState.errors.businessAddress?.city && <p className="text-xs text-red-500">{form.formState.errors.businessAddress.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input {...form.register('businessAddress.state')} placeholder="NY" />
                                        {form.formState.errors.businessAddress?.state && <p className="text-xs text-red-500">{form.formState.errors.businessAddress.state.message}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Zip Code</Label>
                                        <Input {...form.register('businessAddress.zipCode')} placeholder="10001" />
                                        {form.formState.errors.businessAddress?.zipCode && <p className="text-xs text-red-500">{form.formState.errors.businessAddress.zipCode.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <Input {...form.register('businessAddress.country')} placeholder="US" disabled />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}
