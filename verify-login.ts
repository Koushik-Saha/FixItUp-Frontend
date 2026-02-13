
import prisma from './src/lib/prisma'
import { verifyPassword } from './src/lib/auth'

async function main() {
    const email = 'admin@fixitup.com'
    const password = 'password123'

    console.log(`Checking user: ${email}`)

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.error('User not found in database.')
        return
    }

    console.log('User found:', user.id, user.role, user.email)
    console.log('Password hash:', user.password)

    if (!user.password) {
        console.error('User has no password set.')
        return
    }

    const isValid = await verifyPassword(password, user.password)
    console.log(`Password '${password}' is valid: ${isValid}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
