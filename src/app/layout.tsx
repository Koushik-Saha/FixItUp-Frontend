import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import {Footer} from "@/components/layout/footer";
import { Header } from '@/components/layout/header'
import {Payment} from "@/components/layout/payment";

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
  title: 'Max Phone Repair - Professional Phone Repair Parts',
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
  authors: [{ name: 'Max Phone Repair' }],
  creator: 'Max Phone Repair',
  publisher: 'Max Phone Repair',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maxphonerepair.com',
    siteName: 'Max Phone Repair',
    title: 'Max Phone Repair - Professional Phone Repair Parts',
    description:
      'Quality phone repair parts for every device. Screens, batteries, cameras, tools and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Max Phone Repair',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Phone Repair - Professional Phone Repair Parts',
    description:
      'Quality phone repair parts for every device. Screens, batteries, cameras, tools and more.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Providers>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </Providers>
      </body>
      </html>
  )
}
