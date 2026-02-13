
import { Award, Shield, Clock, Users, Target, Heart, Star, Zap } from 'lucide-react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Utility to map icon string names to components
const iconMap: Record<string, any> = {
    Award, Shield, Clock, Users, Target, Heart, Star, Zap
}

export const dynamic = 'force-dynamic'

export default async function AboutUsPage() {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: 'site_about_us' }
    })

    if (!setting || !setting.value) {
        // Fallback or 404. Let's show a friendly "Under Maintenance" or basic info if data is missing.
        // But since we seeded, it should be there.
        return notFound()
    }

    const data = setting.value as any

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">{data.title}</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">{data.subtitle}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {data.stats.map((stat: any, i: number) => {
                        const Icon = iconMap[stat.icon] || Star
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
                        {data.content.map((paragraph: string, i: number) => (
                            <p key={i} className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">{paragraph}</p>
                        ))}
                    </div>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Our Mission & Values</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {data.values.map((value: any, i: number) => {
                            const Icon = iconMap[value.icon] || Star
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
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-8">{data.vision.title}</h2>
                    <p className="text-xl text-neutral-700 dark:text-neutral-300 text-center max-w-3xl mx-auto">{data.vision.text}</p>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">Certifications & Partnerships</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {data.certifications.map((cert: string, i: number) => (
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
                        {data.team.map((member: any, i: number) => (
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
