'use client'

import { FileText, ShieldCheck, CreditCard, RefreshCw, AlertTriangle, Scale, UserX, Info } from 'lucide-react'

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-12 w-12" />
                            <h1 className="text-4xl font-bold">Terms of Service</h1>
                        </div>
                        <p className="text-xl text-blue-100">Last Updated: December 8, 2024</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            <strong>IMPORTANT:</strong> Please read these Terms of Service ("Terms") carefully before using our website or services. By accessing or using maxfitit.com or our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our website or services.
                        </p>
                    </div>

                    <div className="space-y-12">

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">1. Agreement to Terms</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                These Terms of Service constitute a legally binding agreement between you and Max Fit IT (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) concerning your access to and use of the maxfitit.com website and any related services (collectively, the &quot;Services&quot;).

                                <p>
                                    You agree that by accessing the Services, you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the Services.
                                </p>

                                We reserve the right to change or modify these Terms at any time. We will notify you of any changes by updating the &quot;Last Updated&quot; date. Your continued use of the Services after such changes constitutes your acceptance of the new Terms.
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <UserX className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">2. User Eligibility & Responsibilities</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Eligibility</h3>
                                    <p>You must be at least 18 years old to use our Services. By using the Services, you represent and warrant that:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>You are at least 18 years of age</li>
                                        <li>You have the legal capacity to enter into these Terms</li>
                                        <li>You will comply with all applicable laws and regulations</li>
                                        <li>All information you provide is accurate and truthful</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Account Responsibilities</h3>
                                    <p>If you create an account with us, you are responsible for:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>Maintaining the security of your account and password</li>
                                        <li>All activities that occur under your account</li>
                                        <li>Immediately notifying us of any unauthorized use</li>
                                        <li>Ensuring your account information is accurate and up-to-date</li>
                                    </ul>
                                    <p className="mt-3 font-semibold">You may not share your account or allow others to access it.</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Prohibited Activities</h3>
                                    <p>You agree NOT to:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>Use the Services for any illegal purpose or in violation of any laws</li>
                                        <li>Impersonate any person or entity or falsely state affiliation</li>
                                        <li>Engage in any fraudulent activity or provide false information</li>
                                        <li>Interfere with or disrupt the Services or servers</li>
                                        <li>Attempt to gain unauthorized access to any part of the Services</li>
                                        <li>Use automated systems (bots, scrapers) without permission</li>
                                        <li>Upload viruses, malware, or any harmful code</li>
                                        <li>Harass, abuse, or harm other users</li>
                                        <li>Violate the intellectual property rights of others</li>
                                        <li>Resell or redistribute our products without authorization</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">3. Payment Terms</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Pricing</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>All prices are in United States Dollars (USD)</li>
                                        <li>Prices are subject to change without notice</li>
                                        <li>The price charged will be the price displayed at the time of purchase</li>
                                        <li>We reserve the right to correct pricing errors</li>
                                        <li>Wholesale pricing requires approved wholesale account</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Payment Methods</h3>
                                    <p>We accept the following payment methods:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>Credit Cards (Visa, Mastercard, American Express, Discover)</li>
                                        <li>Debit Cards</li>
                                        <li>PayPal</li>
                                        <li>Net 30 Terms (for approved wholesale accounts only)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Payment Processing</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Payment is due at the time of purchase unless otherwise arranged</li>
                                        <li>We use third-party payment processors (Stripe, PayPal)</li>
                                        <li>You authorize us to charge your payment method for all purchases</li>
                                        <li>We do not store your credit card information on our servers</li>
                                        <li>All payment information is encrypted and securely processed</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Taxes</h3>
                                    <p>
                                        You are responsible for all applicable taxes. Sales tax will be added to your order based on your shipping address and applicable state/local tax rates. Tax-exempt organizations must provide valid exemption certificates.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Failed Payments</h3>
                                    <p>
                                        If a payment fails or is declined, we reserve the right to cancel your order or suspend your account. You remain responsible for any amounts owed, plus any collection costs or fees.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <RefreshCw className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">4. Returns, Refunds & Cancellations</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Return Policy</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>30-Day Returns:</strong> Most products may be returned within 30 days of purchase</li>
                                        <li><strong>Condition:</strong> Items must be in new, unused condition with original packaging</li>
                                        <li><strong>Return Shipping:</strong> Customer pays return shipping unless the return is due to our error</li>
                                        <li><strong>Restocking Fee:</strong> A 15% restocking fee may apply to some items</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Non-Returnable Items</h3>
                                    <p>The following items CANNOT be returned:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>Opened software, licenses, or digital products</li>
                                        <li>Custom or special-order items</li>
                                        <li>Clearance or final sale items</li>
                                        <li>Items damaged by customer misuse</li>
                                        <li>Items purchased more than 30 days ago</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Refund Process</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Refunds are processed within 5-7 business days of receiving the return</li>
                                        <li>Refunds are issued to the original payment method</li>
                                        <li>Shipping costs are non-refundable (except for our errors)</li>
                                        <li>Original shipping charges are not refunded</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Repair Services</h3>
                                    <p>
                                        <strong>Non-Refundable:</strong> Completed repair services cannot be refunded. If you are unsatisfied with a repair, contact us within 7 days and we will re-inspect and remedy any issues at no additional charge under our warranty.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Order Cancellations</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Orders may be cancelled within 2 hours of placement</li>
                                        <li>After 2 hours, orders enter processing and cannot be cancelled</li>
                                        <li>Contact us immediately at support@maxfitit.com to request cancellation</li>
                                        <li>If order has already shipped, follow our return process</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">5. Warranties & Disclaimers</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Product Warranty</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>All parts and repairs include a 12-month warranty</li>
                                        <li>Warranty covers defects in materials and workmanship only</li>
                                        <li>Warranty does not cover physical damage, water damage, or misuse</li>
                                        <li>See our full Warranty Policy for complete terms</li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-3">DISCLAIMER OF WARRANTIES</h3>
                                    <p className="text-yellow-800 dark:text-yellow-300">
                                        THE SERVICES AND ALL PRODUCTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                                    </p>
                                    <p className="mt-3 text-yellow-800 dark:text-yellow-300">
                                        WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT DEFECTS WILL BE CORRECTED.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">6. Limitation of Liability</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                                    <p className="text-red-900 dark:text-red-200 font-bold mb-3">IMPORTANT LIABILITY LIMITATION:</p>

                                    <div className="space-y-3 text-red-800 dark:text-red-300">
                                        <p>
                                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MAX FIT IT OR ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                                        </p>

                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Loss of profits, revenue, or business</li>
                                            <li>Loss of data or information</li>
                                            <li>Business interruption</li>
                                            <li>Loss of goodwill or reputation</li>
                                            <li>Cost of substitute goods or services</li>
                                        </ul>

                                        <p className="mt-4">
                                            WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                                        </p>

                                        <p className="mt-4 font-bold">
                                            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Device Repair Liability</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>We are not liable for data loss. You must back up your device before repair</li>
                                        <li>We are not responsible for pre-existing damage not disclosed</li>
                                        <li>Maximum liability for repair services is limited to the cost of the repair</li>
                                        <li>We are not liable for any consequential damages from device malfunction</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="h-8 w-8 text-blue-600" />
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">7. Dispute Resolution</h2>
                            </div>

                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Informal Resolution</h3>
                                    <p>
                                        If you have any dispute with us, you agree to first contact us at legal@maxfitit.com and attempt to resolve the dispute informally. Most disputes can be resolved this way.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Binding Arbitration</h3>
                                    <p>
                                        If we cannot resolve a dispute informally, you agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Services will be settled by binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify.
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 mt-3">
                                        <li>Arbitration will be conducted by the American Arbitration Association (AAA)</li>
                                        <li>The arbitrator&apos;s decision is final and binding</li>
                                        <li>You waive your right to a jury trial</li>
                                        <li>You waive your right to participate in a class action</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Class Action Waiver</h3>
                                    <p className="font-semibold">
                                        YOU AGREE THAT ANY ARBITRATION OR CLAIM WILL BE LIMITED TO THE DISPUTE BETWEEN YOU AND US INDIVIDUALLY. YOU WAIVE ANY RIGHT TO BRING CLAIMS AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Governing Law</h3>
                                    <p>
                                        These Terms are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. The exclusive venue for any dispute will be Santa Barbara County, California.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">8. Intellectual Property</h2>

                                <p>
                                    All content on the Services, including but not limited to text, graphics, logos, images, software, and design, is the property of Max Fit IT or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                                </p>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Restrictions</h3>
                                    <p>You may not:</p>
                                    <ul className="list-disc pl-6 space-y-2 mt-2">
                                        <li>Copy, modify, or distribute any content without written permission</li>
                                        <li>Use our trademarks or logos without authorization</li>
                                        <li>Remove any copyright or proprietary notices</li>
                                        <li>Create derivative works based on our content</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">User Content</h3>
                                    <p>
                                        If you submit any content (reviews, comments, images), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute that content in connection with our Services.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">9. Termination</h2>

                                <p>
                                    We reserve the right to suspend or terminate your access to the Services at any time, with or without cause or notice, including if:
                                </p>

                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>You violate these Terms</li>
                                    <li>Your account shows suspicious or fraudulent activity</li>
                                    <li>You fail to pay amounts owed</li>
                                    <li>We are required to do so by law</li>
                                </ul>

                                <p className="mt-4">
                                    Upon termination, your right to use the Services immediately ceases. All provisions of these Terms which by their nature should survive termination shall survive, including warranties, limitations of liability, and dispute resolution.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">10. General Provisions</h2>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Entire Agreement</h3>
                                    <p>
                                        These Terms constitute the entire agreement between you and Max Fit IT regarding the Services and supersede all prior agreements.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Severability</h3>
                                    <p>
                                        If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Waiver</h3>
                                    <p>
                                        Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Assignment</h3>
                                    <p>
                                        You may not assign or transfer these Terms without our written consent. We may assign these Terms at any time without restriction.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Force Majeure</h3>
                                    <p>
                                        We are not liable for any failure to perform due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, riots, strikes, or technical failures.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4">Contact & Legal Information</h2>

                            <div className="space-y-4">
                                <p>
                                    If you have any questions about these Terms of Service, please contact us:
                                </p>

                                <div className="space-y-2">
                                    <p><strong>Legal Department</strong></p>
                                    <p>Email: legal@maxfitit.com</p>
                                    <p>Phone: (800) 555-REPAIR (7372)</p>
                                    <p>Address: Max Fit IT, 123 State Street, Santa Barbara, CA 93101</p>
                                </div>

                                <p className="text-sm text-blue-100 mt-6">
                                    Last Updated: December 8, 2024 | Version 1.0
                                </p>
                            </div>
                        </section>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8">
                            <p className="text-neutral-700 dark:text-neutral-300 text-center">
                                <strong>By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
