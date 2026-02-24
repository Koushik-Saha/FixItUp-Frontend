import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@maxphonerepair.com'
    const password = 'AdminPassword123!'
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            password: hashedPassword
        },
        create: {
            email,
            fullName: 'System Administrator',
            password: hashedPassword,
            role: 'ADMIN'
        }
    })
    console.log('Admin user ready!')
    console.log('Email:', email)
    console.log('Password:', password)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
