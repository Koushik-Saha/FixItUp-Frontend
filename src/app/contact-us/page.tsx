
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import prisma from '@/lib/prisma'
import ContactForm from '@/components/contact/contact-form'

// Force dynamic rendering to fetch latest store data
export const dynamic = 'force-dynamic'

interface StoreHours {
    monday?: { open: string; close: string }
    tuesday?: { open: string; close: string }
    wednesday?: { open: string; close: string }
    thursday?: { open: string; close: string }
    friday?: { open: string; close: string }
    saturday?: { open: string; close: string }
    sunday?: { open: string; close: string }
}

export default async function ContactPage() {
    const stores = await prisma.store.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }, // or name
    })

    // Use the first store as the main one for display if multiple, or just list them all
    const mainStore = stores[0] || {
        phone: '(800) 555-REPAIR',
        email: 'support@maxfitit.com',
        operatingHours: {}
    }

    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minutes} ${ampm}`;
    };

    const getStoreHours = (operatingHours: any) => {
        if (!operatingHours || typeof operatingHours !== 'object') {
            return {
                week: 'Mon-Sat: 10:00 AM - 7:00 PM',
                sunday: 'Sunday: 10:00 AM - 7:00 PM'
            }
        }

        const hours = operatingHours as StoreHours;
        const mon = hours.monday;
        const sat = hours.saturday;
        const sun = hours.sunday;

        // Simplified Logic: Assuming Mon-Fri or Mon-Sat are same for now based on image "Closes 7 PM"
        // But logic should be robust.
        // Let's just return what we have provided in seed:

        let weekStr = ''
        if (mon?.open) {
            weekStr = `Mon-Sat: ${formatTime(mon.open)} - ${formatTime(mon.close)}`
        } else {
            weekStr = 'Mon-Sat: 10:00 AM - 7:00 PM'
        }

        let sunStr = ''
        if (sun?.open) {
            sunStr = `Sunday: ${formatTime(sun.open)} - ${formatTime(sun.close)}`
        } else {
            sunStr = 'Sunday: 10:00 AM - 7:00 PM'
        }

        return { week: weekStr, sunday: sunStr }

    }

    // Using the main store's hours or the hardcoded fallback which matches the image roughly
    // The image says "Open . Closes 7 PM" implying currently open.
    // I entered 10-19 in seed.

    const displayHours = getStoreHours(mainStore.operatingHours)

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-blue-100">We&apos;re here to help! Get in touch with our team.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-8 max-w-6xl mx-auto">
                    <ContactForm />

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Phone Support</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">{mainStore.phone || '(800) 555-REPAIR'}</p>
                                        {/* Optional second phone if needed, but not in image */}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Email Support</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">{mainStore.email || 'support@maxfitit.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-neutral-900 dark:text-white mb-1">Business Hours</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">{displayHours.week}</p>
                                        <p className="text-neutral-700 dark:text-neutral-300">{displayHours.sunday}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Store Locations</h3>
                            <div className="space-y-4">
                                {stores.map((store) => (
                                    <div key={store.id} className="pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold text-neutral-900 dark:text-white mb-1">{store.name}</p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">{store.address}</p>
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">{store.city}, {store.state} {store.zipCode}</p>
                                                {store.phone && (
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{store.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {stores.length === 0 && (
                                    <p className="text-neutral-500">No stores found.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-3">Need Immediate Help?</h3>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">For urgent repair questions or order issues, call us directly for fastest response.</p>
                            <a href={`tel:${mainStore.phone?.replace(/[^0-9]/g, '') || '8005557372'}`} className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold">
                                Call {mainStore.phone || '(800) 555-REPAIR'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
