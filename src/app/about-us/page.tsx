'use client'

import { Award, Shield, Clock, Users, Target, Heart, Star, Zap } from 'lucide-react'

export default function AboutUsPage() {
    const stats = [
        { icon: Users, value: '50,000+', label: 'Happy Customers' },
        { icon: Clock, value: '10+', label: 'Years Experience' },
        { icon: Award, value: '4.9/5', label: 'Customer Rating' },
        { icon: Zap, value: '100,000+', label: 'Repairs Completed' }
    ]

    const values = [
        { icon: Shield, title: 'Quality First', desc: 'We use only OEM-quality parts with comprehensive warranties' },
        { icon: Clock, title: 'Fast Service', desc: 'Most repairs completed same-day while you wait' },
        { icon: Heart, title: 'Customer Care', desc: 'Dedicated support team available 7 days a week' },
        { icon: Target, title: 'Fair Pricing', desc: 'Transparent pricing with no hidden fees' }
    ]

    const certifications = [
        'Apple Authorized Service Provider',
        'Samsung Certified Repair Center',
        'ISO 9001:2015 Certified',
        'Better Business Bureau A+ Rating',
        'Google Certified Partner',
        'Motorola Authorized Repair'
    ]

    const team = [
        { name: 'Michael Chen', role: 'Founder & CEO', bio: '15 years in electronics repair, former Apple technician' },
        { name: 'Sarah Johnson', role: 'Head Technician', bio: 'Certified in all major smartphone brands, 12 years experience' },
        { name: 'David Rodriguez', role: 'Operations Manager', bio: 'Logistics expert, ensures smooth operations across all stores' },
        { name: 'Emily Thompson', role: 'Customer Success', bio: 'Dedicated to ensuring every customer leaves satisfied' }
    ]

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">About Max Fit IT</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">Your trusted partner for professional phone repair and wholesale electronics solutions since 2014</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className="text-center">
                                <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                            </div>
                        )
                    })}
                </div>

                <div className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-8">Our Story</h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">Founded in 2014, Max Fit IT started as a small phone repair shop in Santa Barbara, California. Our founder, Michael Chen, saw the need for fast, reliable, and affordable phone repair services in the community.</p>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">What began as a one-person operation has grown into a trusted electronics repair and wholesale business serving thousands of customers across California. We've completed over 100,000 repairs and expanded to three locations, all while maintaining our commitment to quality and customer service.</p>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300">Today, Max Fit IT is known for our expertise in smartphone repair, our extensive wholesale program for repair shops, and our dedication to using only the highest-quality parts. We're proud to be an authorized service provider for major brands and continue to set the standard for electronics repair in California.</p>
                    </div>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Our Mission & Values</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {values.map((value, i) => {
                            const Icon = value.icon
                            return (
                                <div key={i} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
                                    <Icon className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{value.title}</h3>
                                    <p className="text-neutral-700 dark:text-neutral-300">{value.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-8">Our Vision</h2>
                    <p className="text-xl text-neutral-700 dark:text-neutral-300 text-center max-w-3xl mx-auto">To be the most trusted name in electronics repair and wholesale solutions, known for our expertise, integrity, and commitment to customer satisfaction.</p>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Certifications & Partnerships</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {certifications.map((cert, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                <Award className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                <span className="text-neutral-900 dark:text-white font-medium">{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Users className="h-16 w-16 text-white" />
                                </div>
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-1">{member.name}</h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{member.role}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
                    <p className="text-xl text-blue-100 mb-8">Experience the Max Fit IT difference today</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/shop" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold">Shop Products</a>
                        <a href="/repairs" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bold">Book a Repair</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
