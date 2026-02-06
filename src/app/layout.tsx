import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { Footer } from "@/components/layout/footer";
import { Header } from '@/components/layout/header'
import { Payment } from "@/components/layout/payment";
import NextTopLoader from 'nextjs-toploader'
import { getFooterSections } from '@/lib/data/navigation'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL("https://fix-it-up-frontend.vercel.app/"),
    title: 'Max Fix IT - Professional Phone Repair Parts',
    description:
        'Quality phone repair parts for every device. Screens, batteries, cameras, tools and more. Wholesale pricing for businesses.',
    keywords: [
        'phone repair parts',
        'cell phone parts',
        'screen replacement',
        'phone battery',
        'wholesale phone parts',
        'repair tools',
    ],
    authors: [{ name: 'Max Fix IT' }],
    creator: 'Max Fix IT',
    publisher: 'Max Fix IT',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://maxphonerepair.com',
        siteName: 'Max Fix IT',
        title: 'Max Fix IT - Professional Phone Repair Parts',
        description:
            'Quality phone repair parts for every device. Screens, batteries, cameras, tools and more.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Max Fix IT',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Max Fix IT - Professional Phone Repair Parts',
        description:
            'Quality phone repair parts for every device. Screens, batteries, cameras, tools and more.',
        images: ['/og-image.jpg'],
    },
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const footerSections: any = await getFooterSections();

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-50`}
            >
                <NextTopLoader
                    color="#3b82f6"          // Tailwind blue-500
                    height={3}
                    showSpinner={false}
                    crawlSpeed={200}
                    speed={300}
                    easing="ease"
                    shadow="0 0 10px #3b82f6, 0 0 5px #3b82f6"
                />
                <Providers>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: 'Max Fix IT',
                                url: 'https://maxphonerepair.com',
                                logo: 'https://maxphonerepair.com/logo.png',
                                sameAs: [
                                    'https://facebook.com/maxfixit',
                                    'https://twitter.com/maxfixit',
                                    'https://instagram.com/maxfixit'
                                ],
                                contactPoint: {
                                    '@type': 'ContactPoint',
                                    telephone: '+1-800-123-4567',
                                    contactType: 'customer service'
                                }
                            }),
                        }}
                    />
                    <Header />
                    {children}
                    <Payment />
                    <Footer sections={footerSections} />
                    <Toaster richColors />
                </Providers>
            </body>
        </html>
    )
}
