import prisma from '@/lib/prisma'

export async function getFooterSections() {
    try {
        const sections = await prisma.navigationItem.findMany({
            where: {
                type: 'category', // We used 'category' in the seed script
                isActive: true,
                title: { in: ['Max Fix IT Club', 'ABOUT Max Fix IT', 'GET HELP'] } // Filter strictly to footer sections
            },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        })

        // Filter out sections that might not be footer related if the type is generic
        // In our seed, we only created these with type 'category'. 
        // Realistically, you'd probably want a specific tag or root item.
        // For now, this matches our seed.
        return sections;
    } catch (error) {
        console.error('Failed to fetch footer sections:', error)
        return []
    }
}
