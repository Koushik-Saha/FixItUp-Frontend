const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to drop constraint fk_wholesale_applications_user_id...");
        await prisma.$executeRawUnsafe(`ALTER TABLE "wholesale_applications" DROP CONSTRAINT IF EXISTS "fk_wholesale_applications_user_id";`);
        console.log("Successfully dropped constraint (if it existed).");
    } catch (e) {
        console.error("Error dropping constraint:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
