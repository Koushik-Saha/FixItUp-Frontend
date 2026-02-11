'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ChevronRight, ChevronLeft, Loader2, Smartphone, AlertCircle, Calendar, MapPin, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Schema
const repairSchema = z.object({
    // Step 1: Device
    deviceBrand: z.string().min(1, "Brand is required"),
    deviceModel: z.string().min(1, "Model is required"),
    imeiSerial: z.string().optional(),

    // Step 2: Issue
    issueCategory: z.string().min(1, "Issue category is required"),
    issueDescription: z.string().min(10, "Please describe the issue in more detail"),

    // Step 3: Service & Contact
    serviceType: z.enum(["MAIL_IN", "DROP_OFF"]),
    storeId: z.string().optional(), // Required if drop-off
    appointmentDate: z.string().optional(), // For drop-off

    customerName: z.string().min(2, "Name is required"),
    customerEmail: z.string().email("Invalid email"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
})

type RepairFormValues = z.infer<typeof repairSchema>

const ISSUE_CATEGORIES = [
    { id: 'screen', label: 'Screen Damage', icon: '📱' },
    { id: 'battery', label: 'Battery Issue', icon: '🔋' },
    { id: 'charging', label: 'Charging Port', icon: '⚡' },
    { id: 'camera', label: 'Camera Issue', icon: '📷' },
    { id: 'water', label: 'Water Damage', icon: '💧' },
    { id: 'software', label: 'Software/OS', icon: '⚙️' },
    { id: 'other', label: 'Other Issue', icon: '🔧' }
]

const STEPS = [
    { id: 1, title: 'Device' },
    { id: 2, title: 'Issue' },
    { id: 3, title: 'Service' },
    { id: 4, title: 'Review' }
]

// Data Types
interface NavItem {
    name: string
    url: string
    image?: string
}

interface NavColumn {
    title?: string
    items: NavItem[]
}

interface SubCategory {
    title: string
    columns: NavColumn[]
}

interface BrandData {
    name: string
    id?: string
    icon?: string
    bySubcategory?: Record<string, SubCategory>
}

export default function RepairWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data States
    const [brands, setBrands] = useState<BrandData[]>([])
    const [models, setModels] = useState<NavItem[]>([])
    const [loadingBrands, setLoadingBrands] = useState(true)
    const [loadingModels, setLoadingModels] = useState(false)

    const form = useForm<RepairFormValues>({
        resolver: zodResolver(repairSchema),
        defaultValues: {
            serviceType: 'MAIL_IN',
            deviceBrand: '',
            deviceModel: '',
            issueCategory: '',
        },
        mode: 'onChange'
    })

    const { watch, setValue, trigger, control, formState: { errors } } = form
    const formValues = watch()

    // Load Brands
    useEffect(() => {
        const loadBrands = async () => {
            try {
                const res = await fetch('/api/nav/phone-models')
                const json = await res.json()
                if (json.success && json.data) {
                    const brandList = Object.keys(json.data).map(key => ({
                        name: key,
                        ...json.data[key]
                    }))
                    setBrands(brandList)
                }
            } catch (err) {
                console.error("Failed to load brands", err)
                toast.error("Failed to load device data")
            } finally {
                setLoadingBrands(false)
            }
        }
        loadBrands()
    }, [])

    // Load Models when Brand Changes
    useEffect(() => {
        if (!formValues.deviceBrand) {
            setModels([])
            return
        }

        const brandData = brands.find(b => b.name === formValues.deviceBrand)
        if (!brandData) return;

        // Flatten models from subcategories
        const allModels: NavItem[] = []
        if (brandData.bySubcategory) {
            Object.values(brandData.bySubcategory).forEach((subcat) => {
                subcat.columns.forEach((col) => {
                    col.items.forEach((item) => {
                        allModels.push(item)
                    })
                })
            })
        }
        // Remove duplicates
        const uniqueModels = Array.from(new Set(allModels.map(m => m.name)))
            .map(name => allModels.find(m => m.name === name)!) // ! is safe because we iterate from existing names
            .sort((a, b) => a.name.localeCompare(b.name))

        setModels(uniqueModels)
    }, [formValues.deviceBrand, brands])

    const nextStep = async () => {
        let fieldsToValidate: (keyof RepairFormValues)[] = []
        if (currentStep === 1) fieldsToValidate = ['deviceBrand', 'deviceModel', 'imeiSerial']
        if (currentStep === 2) fieldsToValidate = ['issueCategory', 'issueDescription']
        if (currentStep === 3) fieldsToValidate = ['serviceType', 'customerName', 'customerEmail', 'customerPhone', 'storeId']

        const isStepValid = await trigger(fieldsToValidate)
        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, 4))
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const onSubmit = async (data: RepairFormValues) => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/repairs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const json = await res.json()

            if (!res.ok) throw new Error(json.error || 'Failed to submit ticket')

            toast.success("Repair ticket created successfully!")
            // Redirect to success page or ticket view
            router.push(`/repairs/confirmation?ticket=${json.data.ticketNumber}`)

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Failed to submit ticket')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative z-0">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center flex-1 relative">
                            {/* Connector Line */}
                            {index !== 0 && (
                                <div className={`absolute top-4 -left-[50%] right-[50%] h-0.5 -z-10 
                                    ${step.id <= currentStep ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-800'}`}
                                />
                            )}

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors
                                ${step.id < currentStep ? 'bg-green-500 text-white' :
                                    step.id === currentStep ? 'bg-blue-600 text-white' :
                                        'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`text-xs font-medium ${step.id === currentStep ? 'text-blue-600' : 'text-neutral-500'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">

                            {/* STEP 1: DEVICE */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Select Your Device</h2>
                                        <p className="text-neutral-500">What device needs repair?</p>
                                    </div>

                                    <div className="grid gap-6">
                                        {/* Brand Selection */}
                                        <div className="space-y-3">
                                            <Label>Brand</Label>
                                            {loadingBrands ? (
                                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading brands...
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {brands.map((brand) => (
                                                        <div
                                                            key={brand.id}
                                                            onClick={() => {
                                                                setValue('deviceBrand', brand.name)
                                                                setValue('deviceModel', '') // Reset model
                                                            }}
                                                            className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                                                                ${formValues.deviceBrand === brand.name
                                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600'
                                                                    : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-400'}`}
                                                        >
                                                            {brand.icon && <img src={brand.icon} alt={brand.name} className="w-8 h-8 object-contain" />}
                                                            <span className="text-sm font-medium">{brand.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {errors.deviceBrand && <p className="text-red-500 text-sm">{errors.deviceBrand.message}</p>}
                                        </div>

                                        {/* Model Selection */}
                                        {formValues.deviceBrand && (
                                            <div className="space-y-3">
                                                <Label>Model</Label>
                                                <Select
                                                    onValueChange={(val) => setValue('deviceModel', val)}
                                                    value={formValues.deviceModel}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Model" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {models.map((model, idx) => (
                                                            <SelectItem key={`${model.name}-${idx}`} value={model.name}>
                                                                {model.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.deviceModel && <p className="text-red-500 text-sm">{errors.deviceModel.message}</p>}
                                            </div>
                                        )}

                                        {/* IMEI/Serial (Optional) */}
                                        <div className="space-y-3">
                                            <Label>IMEI or Serial Number (Optional)</Label>
                                            <Input {...form.register('imeiSerial')} placeholder="e.g. 352..." />
                                            <p className="text-xs text-neutral-500">Helps us identify your specific device, but not required yet.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: ISSUE */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">What&apos;s the issue?</h2>
                                        <p className="text-neutral-500">Tell us what needs fixing.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {ISSUE_CATEGORIES.map((cat) => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => setValue('issueCategory', cat.id)}
                                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all
                                                        ${formValues.issueCategory === cat.id
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600'
                                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-400'}`}
                                                >
                                                    <span className="text-2xl">{cat.icon}</span>
                                                    <span className="text-sm font-medium">{cat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.issueCategory && <p className="text-red-500 text-sm">{errors.issueCategory.message}</p>}

                                        <div className="space-y-2">
                                            <Label>Detailed Description</Label>
                                            <Textarea
                                                {...form.register('issueDescription')}
                                                placeholder="Please describe the problem in detail (e.g. screen cracked, touch not working, battery drains fast...)"
                                                className="min-h-[120px]"
                                            />
                                            {errors.issueDescription && <p className="text-red-500 text-sm">{errors.issueDescription.message}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: SERVICE & CONTACT */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Service Preferences</h2>
                                        <p className="text-neutral-500">How would you like to get your device repaired?</p>
                                    </div>

                                    <div className="space-y-6">
                                        <Controller
                                            control={control}
                                            name="serviceType"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    <div className={`border rounded-xl p-4 cursor-pointer flex items-start gap-3 transition-all
                                                        ${field.value === 'MAIL_IN' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
                                                        <RadioGroupItem value="MAIL_IN" id="mail-in" className="mt-1" />
                                                        <Label htmlFor="mail-in" className="cursor-pointer">
                                                            <div className="font-semibold flex items-center gap-2">
                                                                <Truck className="w-4 h-4" /> Mail-In Repair
                                                            </div>
                                                            <p className="text-sm text-neutral-500 mt-1">
                                                                Ship your device to our repair center. We&apos;ll fix it and ship it back.
                                                            </p>
                                                        </Label>
                                                    </div>

                                                    <div className={`border rounded-xl p-4 cursor-pointer flex items-start gap-3 transition-all
                                                        ${field.value === 'DROP_OFF' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
                                                        <RadioGroupItem value="DROP_OFF" id="drop-off" className="mt-1" />
                                                        <Label htmlFor="drop-off" className="cursor-pointer">
                                                            <div className="font-semibold flex items-center gap-2">
                                                                <MapPin className="w-4 h-4" /> In-Store Drop Off
                                                            </div>
                                                            <p className="text-sm text-neutral-500 mt-1">
                                                                Bring your device to one of our locations for a quick repair.
                                                            </p>
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />

                                        <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                            <h3 className="font-semibold">Contact Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Full Name</Label>
                                                    <Input {...form.register('customerName')} placeholder="John Doe" />
                                                    {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input {...form.register('customerEmail')} placeholder="john@example.com" type="email" />
                                                    {errors.customerEmail && <p className="text-red-500 text-sm">{errors.customerEmail.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone Number</Label>
                                                    <Input {...form.register('customerPhone')} placeholder="(555) 123-4567" />
                                                    {errors.customerPhone && <p className="text-red-500 text-sm">{errors.customerPhone.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: REVIEW */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">Review & Submit</h2>
                                        <p className="text-neutral-500">Please verify your details before submitting.</p>
                                    </div>

                                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 space-y-6 text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">Device</span>
                                                <p className="font-medium">{formValues.deviceBrand} {formValues.deviceModel}</p>
                                            </div>
                                            <div>
                                                <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">Service Type</span>
                                                <p className="font-medium">{formValues.serviceType === 'MAIL_IN' ? 'Mail-In Repair' : 'In-Store Drop Off'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">Issue</span>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{ISSUE_CATEGORIES.find(c => c.id === formValues.issueCategory)?.icon}</span>
                                                <p className="font-medium">{ISSUE_CATEGORIES.find(c => c.id === formValues.issueCategory)?.label}</p>
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                                &quot;{formValues.issueDescription}&quot;
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                            <div>
                                                <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">Contact</span>
                                                <p className="font-medium">{formValues.customerName}</p>
                                                <p className="text-neutral-500">{formValues.customerEmail}</p>
                                                <p className="text-neutral-500">{formValues.customerPhone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm">
                                            By submitting this ticket, you agree to our terms of service.
                                            Our technicians will review your request and contact you with a cost estimate
                                            and further instructions.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1 || isSubmitting}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            {currentStep < 4 ? (
                                <Button type="button" onClick={nextStep}>
                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                    Submit Ticket
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
