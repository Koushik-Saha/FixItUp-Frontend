
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const aboutUsData = {
    title: 'About Max Fit IT',
    subtitle: 'Your trusted partner for professional phone repair and wholesale electronics solutions since 2014',
    content: [
        'Founded in 2014, Max Fit IT started as a small phone repair shop in Santa Barbara, California. Our founder, Michael Chen, saw the need for fast, reliable, and affordable phone repair services in the community.',
        'What began as a one-person operation has grown into a trusted electronics repair and wholesale business serving thousands of customers across California. We\'ve completed over 100,000 repairs and expanded to three locations, all while maintaining our commitment to quality and customer service.',
        'Today, Max Fit IT is known for our expertise in smartphone repair, our extensive wholesale program for repair shops, and our dedication to using only the highest-quality parts. We\'re proud to be an authorized service provider for major brands and continue to set the standard for electronics repair in California.'
    ],
    stats: [
        { icon: 'Users', value: '50,000+', label: 'Happy Customers' },
        { icon: 'Clock', value: '10+', label: 'Years Experience' },
        { icon: 'Award', value: '4.9/5', label: 'Customer Rating' },
        { icon: 'Zap', value: '100,000+', label: 'Repairs Completed' }
    ],
    values: [
        { icon: 'Shield', title: 'Quality First', desc: 'We use only OEM-quality parts with comprehensive warranties' },
        { icon: 'Clock', title: 'Fast Service', desc: 'Most repairs completed same-day while you wait' },
        { icon: 'Heart', title: 'Customer Care', desc: 'Dedicated support team available 7 days a week' },
        { icon: 'Target', title: 'Fair Pricing', desc: 'Transparent pricing with no hidden fees' }
    ],
    certifications: [
        'Apple Authorized Service Provider',
        'Samsung Certified Repair Center',
        'ISO 9001:2015 Certified',
        'Better Business Bureau A+ Rating',
        'Google Certified Partner',
        'Motorola Authorized Repair'
    ],
    team: [
        { name: 'Michael Chen', role: 'Founder & CEO', bio: '15 years in electronics repair, former Apple technician' },
        { name: 'Sarah Johnson', role: 'Head Technician', bio: 'Certified in all major smartphone brands, 12 years experience' },
        { name: 'David Rodriguez', role: 'Operations Manager', bio: 'Logistics expert, ensures smooth operations across all stores' },
        { name: 'Emily Thompson', role: 'Customer Success', bio: 'Dedicated to ensuring every customer leaves satisfied' }
    ],
    vision: {
        title: 'Our Vision',
        text: 'To be the most trusted name in electronics repair and wholesale solutions, known for our expertise, integrity, and commitment to customer satisfaction.'
    }
}

async function main() {
    console.log('Seeding About Us page data...')

    await prisma.systemSetting.upsert({
        where: { key: 'site_about_us' },
        update: { value: aboutUsData },
        create: {
            key: 'site_about_us',
            value: aboutUsData
        }
    })

    console.log('About Us page data seeded successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
