import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Normal User
    const userEmail = 'mnhque@gmail.com'
    const userPassword = 'UserPassword123!'
    const hashedUserPassword = await bcrypt.hash(userPassword, 10)

    const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {
            password: hashedUserPassword,
            role: 'CUSTOMER'
        },
        create: {
            email: userEmail,
            fullName: 'Mnhque User',
            password: hashedUserPassword,
            role: 'CUSTOMER'
        }
    })
    console.log('Customer user ready!')
    console.log('Email:', userEmail)
    console.log('Password:', userPassword)

    console.log('-------------------')

    // 2. Create Admin User
    const adminEmail = 'admin2@maxphonerepair.com'
    const adminPassword = 'AdminPassword456!'
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: 'ADMIN',
            password: hashedAdminPassword
        },
        create: {
            email: adminEmail,
            fullName: 'System Administrator 2',
            password: hashedAdminPassword,
            role: 'ADMIN'
        }
    })
    console.log('Admin user ready!')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
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
