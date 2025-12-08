'use client'

import Link from 'next/link'

export function Payment() {

    return (
        <div className="bg-black text-white">
            {/* Payment Methods & Guarantee Section */}
            <div className="border-t border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-900">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Accepted Payment */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Accepted Payment</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Visa */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <path d="M18.5 9.5L15.8 22.5H13.2L11.8 14.3C11.7 13.9 11.6 13.7 11.3 13.5C10.8 13.2 10 12.9 9.2 12.7L9.3 12.5H13.5C14 12.5 14.4 12.8 14.5 13.3L15.3 18.2L17.3 12.5H19.9L18.5 9.5ZM20.5 22.5L22.5 12.5H25L23 22.5H20.5ZM31 15.5C31 15.1 31.3 14.9 31.9 14.8C32.8 14.7 34 14.9 35 15.5L35.5 13.2C34.7 12.9 33.8 12.5 32.6 12.5C30.1 12.5 28.3 13.8 28.3 15.7C28.3 17.1 29.6 17.9 30.6 18.4C31.6 18.9 32 19.2 32 19.7C32 20.4 31.1 20.7 30.3 20.7C29.2 20.7 28.6 20.5 27.7 20.1L27.2 22.4C28.1 22.8 29.6 23.1 31.1 23.1C33.8 23.1 35.5 21.8 35.6 19.8C35.6 17.4 31 17.2 31 15.5ZM42 22.5H39.8L39.6 21.5H36.4L35.9 22.5H33.3L37.2 13.3C37.5 12.6 38 12.5 38.6 12.5H40.5L42 22.5ZM37 19.5H39L38.4 15.5L37 19.5Z" fill="#1434CB"/>
                                    </svg>
                                </div>

                                {/* Mastercard */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                                        <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                                        <path d="M24 11.5C25.5 12.8 26.5 14.7 26.5 16.8C26.5 18.9 25.5 20.8 24 22.1C22.5 20.8 21.5 18.9 21.5 16.8C21.5 14.7 22.5 12.8 24 11.5Z" fill="#FF5F00"/>
                                    </svg>
                                </div>

                                {/* American Express */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#006FCF"/>
                                        <path d="M10 12H14L15 13.5L16 12H26V13.5L27 12H31L34 16L31 20H27L26 18.5V20H20L19.5 18.5H18.5L18 20H14L15.5 16L14 12ZM15 13L13.5 16L15 19H17L16 17H18L19 19H23V17.5L24 19H27L28.5 16L27 13H24L23 14.5V13H19L18.5 14.5H18L17.5 13H15Z" fill="white"/>
                                    </svg>
                                </div>

                                {/* PayPal */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <path d="M18.5 10C19.8 10 20.9 10.2 21.7 10.7C22.6 11.3 23 12.2 23 13.5C23 15.5 21.8 17 19.5 17.5H17.5L16.8 21H14.5L16.5 10H18.5ZM17.8 15.5H19C20.5 15.5 21.2 14.7 21.2 13.5C21.2 12.8 20.5 12.5 19.5 12.5H18.2L17.8 15.5Z" fill="#003087"/>
                                        <path d="M25.5 10C26.8 10 27.9 10.2 28.7 10.7C29.6 11.3 30 12.2 30 13.5C30 15.5 28.8 17 26.5 17.5H24.5L23.8 21H21.5L23.5 10H25.5ZM24.8 15.5H26C27.5 15.5 28.2 14.7 28.2 13.5C28.2 12.8 27.5 12.5 26.5 12.5H25.2L24.8 15.5Z" fill="#0070E0"/>
                                    </svg>
                                </div>

                                {/* Apple Pay */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <path d="M16.5 11.5C17 10.8 17.3 9.9 17.2 9C16.4 9 15.4 9.5 14.8 10.2C14.3 10.8 13.9 11.7 14 12.6C14.9 12.6 15.9 12.1 16.5 11.5ZM17.2 12.8C15.9 12.7 14.8 13.6 14.1 13.6C13.4 13.6 12.5 12.8 11.5 12.8C10.2 12.9 9 13.7 8.3 14.9C6.9 17.3 7.9 20.9 9.2 22.9C9.8 23.9 10.6 24.9 11.6 24.9C12.5 24.9 12.9 24.3 14 24.3C15.1 24.3 15.5 24.9 16.5 24.9C17.5 24.9 18.2 23.9 18.8 23C19.5 21.9 19.8 20.9 19.8 20.8C19.8 20.8 17.9 20 17.9 17.8C17.9 16 19.3 15.2 19.4 15.1C18.6 13.9 17.4 13.8 17.2 12.8Z" fill="black"/>
                                        <path d="M26 12.5H27.5C29 12.5 30 13.3 30 14.7C30 16.1 29 17 27.4 17H26.8V19H25.5V12.5H26ZM26.8 13.7V15.8H27.3C28.2 15.8 28.7 15.3 28.7 14.7C28.7 14.1 28.2 13.7 27.3 13.7H26.8Z" fill="black"/>
                                        <path d="M31 17.3C31 16.3 31.8 15.6 33.2 15.5L34.8 15.4V15C34.8 14.4 34.4 14.1 33.7 14.1C33.1 14.1 32.7 14.3 32.6 14.7H31.4C31.5 13.7 32.4 13 33.7 13C35.1 13 36 13.7 36 14.9V19H34.8V18.2C34.4 18.7 33.8 19 33.1 19C31.9 19 31 18.3 31 17.3ZM34.8 16.8V16.4L33.4 16.5C32.7 16.5 32.3 16.8 32.3 17.2C32.3 17.7 32.7 17.9 33.2 17.9C33.9 17.9 34.8 17.5 34.8 16.8Z" fill="black"/>
                                        <path d="M37 20.5V19.4C37.1 19.4 37.3 19.4 37.4 19.4C38 19.4 38.3 19.2 38.5 18.6L38.6 18.3L36.5 13H37.9L39.2 16.9L40.5 13H41.8L39.6 18.8C39.1 20.1 38.5 20.5 37.4 20.5C37.3 20.5 37.1 20.5 37 20.5Z" fill="black"/>
                                    </svg>
                                </div>

                                {/* Klarna */}
                                <div className="bg-pink-100 p-3 rounded-lg shadow-sm border border-pink-200">
                                    <svg className="h-8 w-16" viewBox="0 0 64 32" fill="none">
                                        <text x="8" y="22" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#000">Klarna.</text>
                                    </svg>
                                </div>

                                {/* Discover */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#FF6000"/>
                                        <circle cx="38" cy="16" r="6" fill="#FF6000"/>
                                        <circle cx="42" cy="16" r="6" fill="#FFB300"/>
                                    </svg>
                                </div>

                                {/* Diners Club */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <circle cx="19" cy="16" r="8" fill="#0079BE" fillOpacity="0.8"/>
                                        <circle cx="29" cy="16" r="8" fill="#0079BE" fillOpacity="0.8"/>
                                    </svg>
                                </div>

                                {/* JCB */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <rect x="8" y="10" width="10" height="12" rx="2" fill="#0E4C96"/>
                                        <rect x="19" y="10" width="10" height="12" rx="2" fill="#D62B1F"/>
                                        <rect x="30" y="10" width="10" height="12" rx="2" fill="#489F48"/>
                                    </svg>
                                </div>

                                {/* Google Pay */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white"/>
                                        <path d="M23 16V18.5H26.5C26.3 19.5 25.5 21 23 21C20.8 21 19 19.2 19 17C19 14.8 20.8 13 23 13C24.2 13 25 13.5 25.6 14.1L27.5 12.3C26.3 11.2 24.8 10.5 23 10.5C19.4 10.5 16.5 13.4 16.5 17C16.5 20.6 19.4 23.5 23 23.5C26.8 23.5 29 21 29 17.2C29 16.7 29 16.3 28.9 16H23Z" fill="#4285F4"/>
                                    </svg>
                                </div>

                                {/* Venmo */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#3D95CE"/>
                                        <path d="M18 10L16 22H19L23 14L21 10H18Z" fill="white"/>
                                        <path d="M25 10L26 14L30 22H33L31 10H28L26 16L25 10Z" fill="white"/>
                                    </svg>
                                </div>

                                {/* Cash App */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#00D54B"/>
                                        <path d="M24 11C26 11 27.5 12 28 13.5H30C29.5 10.8 27 9 24 9C20.5 9 17.5 11 17.5 14.5C17.5 17.5 19.5 18.8 22 19.5C23.5 20 25 20.2 25 21.5C25 22.5 24 23 23 23C21 23 19.5 22 19 20.5H17C17.5 23.2 20 25 23 25C26.5 25 28.5 23 28.5 20.5C28.5 17.5 26.5 16.2 24 15.5C22.5 15 21 14.8 21 13.5C21 12.5 22 12 23 12C23.5 11.5 24 11 24 11Z" fill="white"/>
                                    </svg>
                                </div>

                                {/* Zelle */}
                                <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-200">
                                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#6D1ED4"/>
                                        <path d="M16 12H32L24 20L32 22H16L24 14L16 12Z" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 100% Satisfaction Guaranteed */}
                        <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                <div className="bg-black dark:bg-white p-2 rounded-full">
                                    <svg className="h-8 w-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white">
                                    100% Satisfaction Guaranteed
                                </h3>
                            </div>
                            <div className="text-neutral-600 dark:text-neutral-400 space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold">Max Fix IT offers</span>
                                </p>
                                <p className="text-sm">
                                    "10-day No Questions Asked Return or Exchange"
                                </p>
                                <p className="text-sm">
                                    and "6-month Product Warranty" to selected product purchased.
                                </p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                                    <Link href="/contact" className="text-sm font-semibold underline hover:no-underline text-black dark:text-white">
                                        Contact us
                                    </Link>
                                    <span className="text-neutral-400">or</span>
                                    <Link href="/protection-plan" className="text-sm font-semibold underline hover:no-underline text-black dark:text-white">
                                        Learn more about our Protection Plan
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
