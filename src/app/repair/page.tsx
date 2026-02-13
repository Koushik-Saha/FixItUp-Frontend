import { Metadata } from 'next'
import RepairWizard from '@/components/repair-wizard'

export const metadata: Metadata = {
    title: 'Book a Repair | Max Phone Repair',
    description: 'Schedule a repair for your device. Fast, reliable service for iPhone, Samsung, and more.',
}

export default function RepairPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
                    Start Your Repair
                </h1>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                    Tell us about your device and issue, and we&apos;ll get it fixed in no time.
                </p>
            </div>

            <RepairWizard />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                        🚀
                    </div>
                    <h3 className="font-bold text-lg mb-2">Fast Turnaround</h3>
                    <p className="text-sm text-neutral-500">Most repairs are completed within 24 hours of receiving your device.</p>
                </div>
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                        🛡️
                    </div>
                    <h3 className="font-bold text-lg mb-2">90-Day Warranty</h3>
                    <p className="text-sm text-neutral-500">All parts and labor are backed by our comprehensive warranty.</p>
                </div>
                <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                        💎
                    </div>
                    <h3 className="font-bold text-lg mb-2">Premium Parts</h3>
                    <p className="text-sm text-neutral-500">We use only high-quality replacement parts for all repairs.</p>
                </div>
            </div>
        </div>
    )
}
