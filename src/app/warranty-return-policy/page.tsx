import { PolicyPage } from '@/components/layout/policy-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Warranty, Return and Exchange Policy | Max Phone Repair',
    description: 'Read about our lifetime warranty, return process, and exchange policies.'
}

export default function WarrantyPolicyPage() {
    return <PolicyPage policyKey="policy_warranty" titleFallback="Warranty, Return and Exchange Policy" />
}
