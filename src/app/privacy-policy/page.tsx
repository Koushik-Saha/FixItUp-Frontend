/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Shield, Eye, Lock, Database, Cookie, Users, FileText, Mail } from 'lucide-react'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-12 w-12" />
                            <h1 className="text-4xl font-bold">Privacy Policy</h1>
                        </div>
                        <p className="text-xl text-blue-100">Last Updated: December 8, 2024</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            At Max Phone Repair (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website maxfitit.com (the &quot;Site&quot;) and use our services.
                        </p>
                    </div>

                    <div className="space-y-12">

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Information We Collect</h2>
                            </div>

                            <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Personal Information</h3>
                                    <p className="mb-4">We collect information that you voluntarily provide to us when you:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Create an account on our website</li>
                                        <li>Place an order for products or services</li>
                                        <li>Book a repair appointment</li>
                                        <li>Apply for a wholesale account</li>
                                        <li>Subscribe to our newsletter</li>
                                        <li>Contact customer support</li>
                                        <li>Participate in surveys or promotions</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Types of Personal Information</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>Identity Data:</strong> Name, username, date of birth</li>
                                        <li><strong>Contact Data:</strong> Email address, phone number, mailing address</li>
                                        <li><strong>Financial Data:</strong> Credit card numbers, billing address (processed securely through our payment processors)</li>
                                        <li><strong>Transaction Data:</strong> Purchase history, order details, repair history</li>
                                        <li><strong>Business Data:</strong> Business name, tax ID, business license (for wholesale accounts)</li>
                                        <li><strong>Device Data:</strong> Device model, IMEI, serial number (for repair services)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Automatically Collected Information</h3>
                                    <p className="mb-4">When you visit our website, we automatically collect:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>Log Data:</strong> IP address, browser type, operating system, pages visited, time spent</li>
                                        <li><strong>Device Information:</strong> Device type, unique device identifiers, mobile network information</li>
                                        <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
                                        <li><strong>Usage Data:</strong> How you interact with our website and services</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">How We Use Your Information</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <p>We use the information we collect for the following purposes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Order Processing:</strong> To process and fulfill your orders, including shipping, billing, and customer support</li>
                                    <li><strong>Repair Services:</strong> To provide repair diagnostics, schedule appointments, and complete repair work</li>
                                    <li><strong>Account Management:</strong> To create and manage your account, including wholesale accounts</li>
                                    <li><strong>Customer Service:</strong> To respond to your inquiries, provide support, and resolve issues</li>
                                    <li><strong>Marketing:</strong> To send promotional emails, newsletters, and special offers (you can opt out anytime)</li>
                                    <li><strong>Personalization:</strong> To personalize your experience and show relevant products</li>
                                    <li><strong>Analytics:</strong> To analyze website usage, improve our services, and optimize user experience</li>
                                    <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
                                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Cookie className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Cookies and Tracking</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <p>We use cookies and similar tracking technologies to track activity on our website and store certain information.</p>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Types of Cookies We Use</h3>
                                    <ul className="list-disc pl-6 space-y-3">
                                        <li>
                                            <strong>Essential Cookies:</strong> Required for the website to function properly (shopping cart, login sessions)
                                        </li>
                                        <li>
                                            <strong>Analytics Cookies:</strong> Help us understand how visitors use our website (Google Analytics)
                                        </li>
                                        <li>
                                            <strong>Marketing Cookies:</strong> Track your activity to show relevant advertisements
                                        </li>
                                        <li>
                                            <strong>Preference Cookies:</strong> Remember your settings and preferences (language, dark mode)
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Managing Cookies</h3>
                                    <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>See what cookies are stored on your device</li>
                                        <li>Delete existing cookies</li>
                                        <li>Block cookies from being set</li>
                                        <li>Block third-party cookies</li>
                                    </ul>
                                    <p className="mt-3 text-sm italic">Note: Disabling cookies may affect website functionality.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Information Sharing</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <p>We may share your information with third parties in the following situations:</p>

                                <ul className="list-disc pl-6 space-y-3">
                                    <li>
                                        <strong>Service Providers:</strong> We share information with trusted third-party vendors who perform services on our behalf (payment processing, shipping, email delivery, analytics)
                                    </li>
                                    <li>
                                        <strong>Payment Processors:</strong> Stripe, PayPal, and other payment gateways receive your payment information to process transactions
                                    </li>
                                    <li>
                                        <strong>Shipping Companies:</strong> USPS, FedEx, UPS receive shipping information to deliver your orders
                                    </li>
                                    <li>
                                        <strong>Marketing Partners:</strong> With your consent, we may share information with marketing partners for promotional purposes
                                    </li>
                                    <li>
                                        <strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government request
                                    </li>
                                    <li>
                                        <strong>Business Transfers:</strong> In the event of a merger, sale, or acquisition, your information may be transferred to the new owner
                                    </li>
                                    <li>
                                        <strong>Protection of Rights:</strong> We may share information to protect our rights, property, safety, or that of our customers
                                    </li>
                                </ul>

                                <p className="font-semibold mt-4">We do NOT sell your personal information to third parties.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Data Security</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <p>We implement appropriate technical and organizational security measures to protect your information:</p>

                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Encryption:</strong> All data transmitted to and from our website is encrypted using SSL/TLS</li>
                                    <li><strong>Secure Storage:</strong> Personal information is stored on secure servers with restricted access</li>
                                    <li><strong>Payment Security:</strong> We are PCI DSS compliant. Credit card information is never stored on our servers</li>
                                    <li><strong>Access Controls:</strong> Only authorized personnel have access to personal information</li>
                                    <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
                                    <li><strong>Employee Training:</strong> Our staff is trained on data protection and security best practices</li>
                                </ul>

                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-4">
                                    <p className="font-semibold text-orange-900 dark:text-orange-200">Important:</p>
                                    <p className="text-orange-800 dark:text-orange-300 mt-2">
                                        While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Rights</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <p>Depending on your location, you may have the following rights regarding your personal information:</p>

                                <ul className="list-disc pl-6 space-y-3">
                                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                                    <li><strong>Objection:</strong> Object to processing of your information for certain purposes</li>
                                    <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                                    <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
                                </ul>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                                    <p className="font-semibold text-neutral-900 dark:text-white mb-2">To Exercise Your Rights:</p>
                                    <p>Email us at privacy@maxfitit.com with your request. We will respond within 30 days.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Third-Party Services</h2>

                                <p>Our website uses the following third-party services that may collect information:</p>

                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
                                    <li><strong>Google Maps:</strong> Store location and directions</li>
                                    <li><strong>Stripe/PayPal:</strong> Payment processing</li>
                                    <li><strong>SendGrid/Mailgun:</strong> Email delivery services</li>
                                    <li><strong>AWS S3:</strong> File storage for attachments and images</li>
                                    <li><strong>Social Media Plugins:</strong> Facebook, Instagram, Twitter integration</li>
                                </ul>

                                <p className="mt-4">
                                    These third parties have their own privacy policies. We recommend reviewing their policies to understand how they handle your information.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Children's Privacy</h2>

                                <p>
                                    Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                                </p>

                                <p className="mt-4">
                                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@maxfitit.com.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Data Retention</h2>

                                <p>We retain your personal information for as long as necessary to:</p>

                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Provide our services to you</li>
                                    <li>Comply with legal obligations (tax records, warranty claims)</li>
                                    <li>Resolve disputes and enforce our agreements</li>
                                    <li>Prevent fraud and enhance security</li>
                                </ul>

                                <p className="mt-4">
                                    <strong>Typical Retention Periods:</strong>
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Account Information: Duration of account plus 3 years</li>
                                    <li>Order History: 7 years (for tax and warranty purposes)</li>
                                    <li>Repair Records: 5 years (for warranty purposes)</li>
                                    <li>Marketing Data: Until you unsubscribe</li>
                                    <li>Website Logs: 12 months</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">International Transfers</h2>

                                <p>
                                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from your country.
                                </p>

                                <p className="mt-4">
                                    When we transfer your information internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the European Commission.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Changes to This Policy</h2>

                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by:
                                </p>

                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Posting the new Privacy Policy on this page</li>
                                    <li>Updating the "Last Updated" date</li>
                                    <li>Sending an email notification (for material changes)</li>
                                </ul>

                                <p className="mt-4">
                                    We encourage you to review this Privacy Policy periodically. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
                                </p>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="h-8 w-8" />
                                <h2 className="text-3xl font-bold">Contact Us</h2>
                            </div>

                            <p className="mb-6 text-blue-100">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>

                            <div className="space-y-3">
                                <p><strong>Email:</strong> privacy@maxfitit.com</p>
                                <p><strong>Phone:</strong> (800) 555-REPAIR (7372)</p>
                                <p><strong>Mail:</strong> Max Fit IT, 123 State Street, Santa Barbara, CA 93101</p>
                                <p><strong>Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM PST</p>
                            </div>

                            <p className="mt-6 text-sm text-blue-100">
                                We aim to respond to all privacy inquiries within 30 days.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    )
}
