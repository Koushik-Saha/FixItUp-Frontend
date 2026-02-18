import { PolicyPage } from '@/components/layout/policy-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Max Phone Repair',
    description: 'Learn how we collect, use, and protect your personal information.'
}

export default function PrivacyPolicyPage() {
    return <PolicyPage policyKey="policy_privacy" titleFallback="Privacy Policy" />
}
