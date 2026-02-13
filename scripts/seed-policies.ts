import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding policy pages...")

    const policies = [
        {
            key: 'policy_privacy',
            value: {
                title: "Privacy Policy",
                updatedAt: new Date().toISOString(),
                content: `
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, such as to:</p>
                    <ul>
                        <li>Process payments and facilitate delivery.</li>
                        <li>Send receipts and internal updates.</li>
                        <li>Provide customer support.</li>
                        <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events of Max Phone Repair.</li>
                    </ul>

                    <h2>3. Sharing of Information</h2>
                    <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
                    <ul>
                        <li>With third party service providers to enable them to provide the Services you request.</li>
                        <li>With the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.</li>
                        <li>With third parties with whom you choose to let us share information, for example other apps or websites that integrate with our API or Services, or those with an API or Service with which we integrate.</li>
                    </ul>

                    <h2>4. Security</h2>
                    <p>Max Phone Repair takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

                    <h2>5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@maxphonerepair.com.</p>
                `
            }
        },
        {
            key: 'policy_terms',
            value: {
                title: "Terms and Conditions",
                updatedAt: new Date().toISOString(),
                content: `
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.</p>

                    <h2>2. Use of Site</h2>
                    <p>This site and its components are offered for informational purposes only; this site shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.</p>

                    <h2>3. Intellectual Property</h2>
                    <p>The Site and its original content, features, and functionality are owned by Max Phone Repair and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

                    <h2>4. Termination</h2>
                    <p>We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with you. All provisions of this Agreement that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>

                    <h2>5. Governing Law</h2>
                    <p>This Agreement (and any further rules, polices, or guidelines incorporated by reference) shall be governed and construed in accordance with the laws of the United States, without giving effect to any principles of conflicts of law.</p>
                `
            }
        },
        {
            key: 'policy_warranty',
            value: {
                title: "Warranty, Return and Exchange Policy",
                updatedAt: new Date().toISOString(),
                content: `
                    <h2>1. Lifetime Warranty</h2>
                    <p>We offer a Lifetime Warranty on all our screen replacements and specific parts. This warranty covers manufacturer defects and workmanship errors. It does not cover physical damage, liquid damage, or user error.</p>

                    <h2>2. Returns & Exchanges</h2>
                    <p>If you are not satisfied with your purchase, you may return it within 30 days of the purchase date for a full refund or exchange, provided the item is in its original condition and packaging.</p>
                    <ul>
                        <li><strong>Unopened Items:</strong> Full refund within 30 days.</li>
                        <li><strong>Defective Items:</strong> Exchange or refund within warranty period.</li>
                        <li><strong>Used/Damaged Items:</strong> May be subject to a restocking fee or rejection if damage is due to user error.</li>
                    </ul>

                    <h2>3. How to Process a Return</h2>
                    <p>To initiate a return, please contact our support team at support@maxphonerepair.com with your order number and details about the product you would like to return. We will respond quickly with instructions for how to return items from your order.</p>

                    <h2>4. Shipping</h2>
                    <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
                `
            }
        }
    ]

    for (const policy of policies) {
        await prisma.systemSetting.upsert({
            where: { key: policy.key },
            update: { value: policy.value },
            create: {
                key: policy.key,
                value: policy.value
            }
        })
        console.log(`Seeded ${policy.value.title}`)
    }

    console.log("Policy seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
