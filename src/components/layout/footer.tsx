'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Facebook,
    Twitter,
    Instagram,
    Star
} from 'lucide-react'

export type NavigationItem = {
    id: string
    title: string
    url: string
    children?: NavigationItem[]
}

interface FooterProps {
    sections?: NavigationItem[]
}

export function Footer({ sections = [] }: FooterProps) {
    const [email, setEmail] = useState('')


    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Newsletter signup:', email)
        setEmail('')
    }

    return (
        <footer className="bg-black text-white">

            {/*Top Banner - Klarna
            <div className="bg-neutral-900 py-3 text-center border-b border-neutral-800">
                <div className="container flex items-center justify-center gap-3">
          <span className="text-sm md:text-base">
            Shop now. Pay in 4 interest-free installments.
          </span>
                    <div className="bg-pink-200 px-3 py-1 rounded">
                        <span className="text-black font-bold text-sm">Klarna.</span>
                    </div>
                </div>
            </div>*/}

            {/* Main Footer Content */}
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Newsletter Column - Static for now as requested design specific */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-4 tracking-wide">NEWSLETTER</h3>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white text-black border-0 rounded-full px-4"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 rounded-full px-6"
                                >
                                    SIGN UP
                                </Button>
                            </div>
                            <p className="text-xs text-neutral-400">
                                By continuing, you agree to hear from Max Fix IT! For more details, please refer to our Privacy Policy.
                            </p>
                        </form>

                        {/* Social Media */}
                        <div className="mt-8">
                            <h4 className="text-sm font-bold mb-4 tracking-wide">LET&apos;S BE FRIENDS</h4>
                            <div className="flex gap-3">
                                <Link href="https://instagram.com" target="_blank" className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                                <Link href="https://facebook.com" target="_blank" className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="https://twitter.com" target="_blank" className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="https://pinterest.com" target="_blank" className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                    </svg>
                                </Link>
                                <Link href="https://tiktok.com" target="_blank" className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    {sections.map((section) => (
                        <div key={section.id}>
                            <h3 className="text-lg font-bold mb-4 tracking-wide">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.children?.map((item) => (
                                    <li key={item.id}>
                                        <Link href={item.url} className="text-sm text-neutral-300 hover:text-white transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>
            </div>

            {/* Trustpilot Reviews Section */}
            <div className="border-t border-neutral-800 py-6 bg-black">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <span className="text-sm">Average</span>
                        <div className="flex gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-sm">
                            <span className="underline">100+ reviews on</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-green-400 text-green-400" />
                            <span className="font-bold">Yelp/Google</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800 py-4">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span>© 2024 Max Fix IT</span>
                            <span>|</span>
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <span>|</span>
                            <Link href="/term-and-condition" className="hover:text-white transition-colors">
                                Terms and Conditions
                            </Link>
                            <span>|</span>
                            <Link href="/warranty-return-policy" className="hover:text-white transition-colors">
                                Warranty & Returns
                            </Link>
                        </div>
                        <button className="bg-white text-black p-3 rounded-full hover:bg-neutral-200 transition-colors">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


        </footer>
    )
}
